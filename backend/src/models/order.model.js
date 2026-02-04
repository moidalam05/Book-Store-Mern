import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // 🔐 USER
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 👤 CUSTOMER SNAPSHOT
    customer: {
      name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
        match: [/^\d{10}$/, "Phone must be 10 digits"],
      },
    },

    // 📦 SHIPPING ADDRESS
    shippingAddress: {
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: {
        type: String,
        default: "India",
      },
    },

    // 🛒 ORDER ITEMS
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
          required: true,
        },
        coverImage: {
          url: {
            type: String,
            required: true,
          },
        },
        category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
          required: true,
        },

        title: {
          type: String,
          required: true,
        },
        originalPrice: {
          type: Number,
          required: true,
        },
        discountedPrice: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        subtotal: {
          type: Number,
          required: true,
        },
      },
    ],

    // 💰 PRICE (NO TAX, NO SHIPPING)
    pricing: {
      total: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        default: 0,
      },
      finalAmount: {
        type: Number,
        required: true,
      },
    },

    // 🎟️ COUPON SNAPSHOT
    coupon: {
      code: String,
      couponId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon",
      },
      discountAmount: {
        type: Number,
        default: 0,
      },
    },

    // 💳 PAYMENT
    payment: {
      method: {
        type: String,
        enum: ["COD", "RAZORPAY"],
        required: true,
      },

      status: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending",
      },

      // Razorpay specific (only if online)
      razorpay: {
        orderId: String,
        paymentId: String,
        signature: String,
        amount: Number,
        currency: String,
      },

      paidAt: Date,
    },

    // 🚚 ORDER STATUS
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      default: "pending",
      index: true,
    },

    // ⏱️ TIMESTAMPS
    cancelledAt: Date,
    deliveredAt: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
