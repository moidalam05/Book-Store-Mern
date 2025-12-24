import Order from "../models/order.model.js";
import Book from "../models/book.model.js";
import mongoose from "mongoose";

export const createOrder = async (req, res) => {
  try {
    const { name, email, address, phone, productIds } = req.body;

    const books = await Book.find({ _id: { $in: productIds } });

    if (books.length !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more products are invalid",
      });
    }

    let totalPrice = 0;

    books.forEach((book) => {
      totalPrice += book.newPrice;
    });

    const order = await Order.create({
      name,
      email,
      address,
      phone,
      productIds,
      totalPrice,
    });

    if (!order) {
      return res.status(400).json({
        success: false,
        message: "Failed to create order",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error while creating order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message || "Internal Server Error",
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("productIds")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Error while fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message || "Internal Server Error",
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(orderId).populate("productIds");

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
    console.error("Error while fetching order by id:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order by id",
      error: error.message || "Internal Server Error",
    });
  }
};

export const getAllOrdersByUserEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const orders = await Order.find({ email })
      .populate("productIds")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Error while fetching orders by user email:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders by user email",
      error: error.message || "Internal Server Error",
    });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const { orderStatus } = req.body;
    orderStatus.toLowerCase();

    const allowedStatuses = [
      "pending",
      "ordered",
      "packed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed statuses: ${allowedStatuses.join(
          ", "
        )}`,
      });
    }
    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error while updating order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: error.message || "Internal Server Error",
    });
  }
};
