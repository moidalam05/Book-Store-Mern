import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    coverImage: {
      url: {
        type: String,
        required: true,
      },
    },

    price: {
      original: {
        type: Number,
        required: true,
        min: 0,
      },
      discounted: {
        type: Number,
        required: true,
        min: 0,
      },
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    authors: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    items: [cartItemSchema],

    totalQuantity: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["active", "checked_out"],
      default: "active",
    },

    appliedCoupon: {
      coupon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon",
      },
      code: String,
      discountAmount: Number,
      discountType: String,
      discountValue: Number,
      maxDiscountAmount: Number,
      minimumCartValue: Number,
      lockedAt: Date,
      lockedUntil: Date,
      expiresAt: Date,
    },

    productDiscountTotal: {
      type: Number,
      default: 0,
    },

    productDiscountPercent: {
      type: Number,
      default: 0,
    },

    originalPriceTotal: {
      type: Number,
      default: 0,
    },

    discountedPriceTotal: {
      type: Number,
      default: 0,
    },

    finalPayableAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
