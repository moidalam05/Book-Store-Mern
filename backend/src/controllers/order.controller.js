import crypto from "crypto";
import Order from "../models/order.model.js";
import Book from "../models/book.model.js";
import Cart from "../models/cart.model.js";
import Coupon from "../models/coupon.model.js";
import { razorpay } from "../config/razorpay.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { payment, shippingAddress } = req.body;

    if (!payment?.method || !["COD", "RAZORPAY"].includes(payment.method)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    const cart = await Cart.findOne({
      user: userId,
      status: "active",
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart not found or empty",
      });
    }

    const productIds = cart.items.map((item) => item.book);

    const products = await Book.find({
      _id: { $in: productIds },
      status: true,
    }).select("_id");

    if (products.length !== cart.items.length) {
      return res.status(400).json({
        success: false,
        message: "Some products are not available",
      });
    }

    if (payment.method === "COD") {
      const order = await Order.create({
        user: userId,
        customer: {
          name: shippingAddress.name,
          email: shippingAddress.email,
          phone: shippingAddress.phone,
        },
        shippingAddress: {
          addressLine1: shippingAddress.addressLine1,
          addressLine2: shippingAddress.addressLine2,
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.zipcode || shippingAddress.pincode,
          country: shippingAddress.country || "India",
        },
        items: cart.items.map((item) => ({
          product: item.book,
          title: item.title,
          discountedPrice: item.price.discounted,
          originalPrice: item.price.original,
          category: item.category,
          quantity: item.quantity,
          subtotal: item.subtotal,
          coverImage: {
            url: item.coverImage.url,
          },
        })),
        pricing: {
          total: cart.originalPriceTotal,
          discount: cart.productDiscountTotal,
          finalAmount: cart.finalPayableAmount,
        },
        payment: {
          method: "COD",
          status: "pending",
        },
        orderStatus: "confirmed",
      });

      const bulkOps = cart.items.map((item) => ({
        updateOne: {
          filter: {
            _id: item.book,
            stock: { $gte: item.quantity },
          },
          update: {
            $inc: {
              soldCount: item.quantity,
              stock: -item.quantity,
            },
          },
        },
      }));

      const result = await Book.bulkWrite(bulkOps);

      if (result.modifiedCount !== cart.items.length) {
        return res.status(400).json({
          success: false,
          message: "Insufficient stock for one or more items",
        });
      }

      cart.items = [];
      cart.totalItems = 0;
      cart.totalPrice = 0;
      cart.totalQuantity = 0;
      await cart.save();

      return res.status(201).json({
        success: true,
        message: "Order placed successfully",
        data: order,
      });
    }

    if (payment.method === "RAZORPAY") {
      const razorpayOrder = await razorpay.orders.create({
        amount: cart.finalPayableAmount * 100,
        currency: "INR",
        receipt: `order_${Date.now()}`,
      });

      const order = await Order.create({
        user: userId,
        customer: {
          name: shippingAddress.name,
          email: shippingAddress.email,
          phone: shippingAddress.phone,
        },
        shippingAddress: {
          addressLine1: shippingAddress.addressLine1,
          addressLine2: shippingAddress.addressLine2,
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.zipcode || shippingAddress.pincode,
          country: shippingAddress.country || "India",
        },
        items: cart.items.map((item) => ({
          product: item.book,
          title: item.title,
          category: item.category,
          discountedPrice: item.price.discounted,
          originalPrice: item.price.original,
          quantity: item.quantity,
          subtotal: item.subtotal,
          coverImage: {
            url: item.coverImage.url,
          },
        })),
        pricing: {
          total: cart.originalPriceTotal,
          discount: cart.productDiscountTotal,
          finalAmount: cart.finalPayableAmount,
        },
        coupon: cart.appliedCoupon
          ? {
              code: cart.appliedCoupon.code,
              couponId: cart.appliedCoupon.coupon,
              discountAmount: cart.appliedCoupon.discountAmount,
            }
          : undefined,
        payment: {
          method: "RAZORPAY",
          status: "pending",
          razorpay: {
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: "INR",
          },
        },
        orderStatus: "cancelled",
      });

      return res.status(200).json({
        success: true,
        message: "Payment initiated successfully",
        orderId: order._id,
        razorpay: {
          orderId: razorpayOrder.id,
          currency: razorpayOrder.currency,
          amount: razorpayOrder.amount,
          key: process.env.RAZORPAY_KEY_ID,
        },
      });
    }

    return res.status(400).json({
      success: false,
      message: "Unsupported payment method",
    });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

export const verifyRazorpayAndCreateOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId, paymentId, signature, shippingAddress } = req.body;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment details",
      });
    }

    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed",
      });
    }

    const cart = await Cart.findOne({
      user: userId,
      status: "active",
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart not found or empty",
      });
    }

    const order = await Order.findOne({
      "payment.razorpay.orderId": orderId,
      user: userId,
    });

    if (!order) {
      return res.status(400).json({
        success: false,
        message: "Order not found",
      });
    }

    order.payment.status = "paid";
    order.orderStatus = "confirmed";
    order.payment.paidAt = new Date();
    order.payment.razorpay.paymentId = paymentId;
    order.payment.razorpay.signature = signature;
    await order.save();

    const bulkOps = cart.items.map((item) => ({
      updateOne: {
        filter: {
          _id: item.book,
          stock: { $gte: item.quantity },
        },
        update: {
          $inc: {
            soldCount: item.quantity,
            stock: -item.quantity,
          },
        },
      },
    }));

    const result = await Book.bulkWrite(bulkOps);

    if (result.modifiedCount !== cart.items.length) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock for one or more items",
      });
    }

    if (cart.appliedCoupon) {
      await Coupon.findByIdAndUpdate(cart.appliedCoupon.coupon, {
        $inc: { usedCount: 1 },
        $push: {
          usedBy: {
            user: userId,
            usedAt: new Date(),
          },
        },
      });
    }

    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;
    cart.totalQuantity = 0;
    await cart.save();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};

export const razorpayWebhookHandler = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(req.body)
      .digest("hex");

    if (
      !signature ||
      signature.length !== expectedSignature.length ||
      !crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(signature),
      )
    ) {
      console.warn("Invalid Razorpay webhook signature");
      return res.status(200).json({ received: true });
    }

    const { event, payload } = req.body;

    /* ================= PAYMENT SUCCESS ================= */
    if (event === "payment.captured") {
      const payment = payload.payment.entity;

      const order = await Order.findOne({
        "payment.razorpay.orderId": payment.order_id,
      });

      if (order && order.payment.status !== "paid") {
        order.payment.status = "paid";
        order.payment.paidAt = new Date(payment.created_at * 1000);
        await order.save();
      }
    }

    /* ================= PAYMENT FAILED ================= */
    if (event === "payment.failed") {
      const payment = payload.payment.entity;

      const order = await Order.findOne({
        "payment.razorpay.orderId": payment.order_id,
      });

      if (order && order.payment.status !== "paid") {
        order.payment.status = "failed";
        order.orderStatus = "cancelled";
        await order.save();
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return res.status(200).json({ received: true });
  }
};

export const verifyOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this order",
      });
    }

    if (
      order.payment.method === "RAZORPAY" &&
      order.payment.status !== "paid"
    ) {
      order.payment.status = "failed";
      order.orderStatus = "cancelled";
      order.cancelledAt = new Date();
      await order.save();
    }

    return res.status(200).json({
      success: true,
      message: "Order verified successfully",
      data: order,
    });
  } catch (error) {
    console.error("Verify order error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify order",
      error: error.message,
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const { sort = "latest", range, year, status } = req.query;

    const filter = { user: userId };

    if (status && status !== "all") {
      filter.orderStatus = status;
    }

    if (range) {
      const now = new Date();
      let fromDate;

      if (range === "30d") {
        fromDate = new Date(now.setDate(now.getDate() - 30));
      }

      if (range === "6m") {
        fromDate = new Date(now.setMonth(now.getMonth() - 6));
      }

      if (fromDate) {
        filter.createdAt = { $gte: fromDate };
      }
    }

    // ---------- YEAR FILTER ----------
    if (year) {
      const start = new Date(`${year}-01-01`);
      const end = new Date(`${year}-12-31`);

      filter.createdAt = {
        ...(filter.createdAt || {}),
        $gte: start,
        $lte: end,
      };
    }

    let sortOption = { createdAt: -1 };

    if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    }

    if (sort === "priceLow") {
      sortOption = { "pricing.finalAmount": 1 };
    }

    if (sort === "priceHigh") {
      sortOption = { "pricing.finalAmount": -1 };
    }

    const orders = await Order.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate("items.category", "name")
      .lean();

    const totalOrders = await Order.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: orders,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        hasNextPage: page * limit < totalOrders,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get my orders error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user orders",
    });
  }
};

export const getMyOrderById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("items.category", "name")
      .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this order",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    console.error("Get my order error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this order",
      });
    }

    if (["shipped", "delivered"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage",
      });
    }

    order.orderStatus = "cancelled";
    order.cancelledAt = new Date();
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel order",
    });
  }
};

// ADMIN
export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const { date, status, search } = req.query;

    const query = {};

    if (date && date !== "all") {
      const now = new Date();

      if (date === "today") {
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        query.createdAt = { $gte: startOfDay };
      }

      if (date === "week") {
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        query.createdAt = { $gte: lastWeek };
      }

      if (date === "month") {
        const startOfMonth = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1,
        );
        query.createdAt = { $gte: startOfMonth };
      }

      if (date === "year") {
        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        query.createdAt = { $gte: startOfYear };
      }
    }

    if (status && status !== "all") {
      query.orderStatus = status;
    }

    if (search) {
      query.$or = [
        { _id: search.match(/^[0-9a-fA-F]{24}$/) ? search : undefined },

        { "customer.name": { $regex: search, $options: "i" } },

        { "items.title": { $regex: search, $options: "i" } },
      ].filter(Boolean);
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .populate("items.category", "name");

    const totalOrders = await Order.countDocuments();
    const filteredOrders = await Order.countDocuments(query);

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        filteredOrders,
        hasNextPage: page * limit < totalOrders,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .lean()
      .populate("items.category", "name");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    console.error("Get order by id error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
    ];

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.orderStatus === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled orders cannot be updated",
      });
    }

    if (order.orderStatus === "refunded") {
      return res.status(400).json({
        success: false,
        message: "Refunded orders cannot be updated",
      });
    }

    order.orderStatus = orderStatus;

    if (orderStatus === "delivered") {
      order.deliveredAt = new Date();
    }

    if (orderStatus === "cancelled") {
      order.cancelledAt = new Date();
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

export const refundOrderAmount = async (req, res) => {};
