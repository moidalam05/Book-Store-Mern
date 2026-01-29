import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
    },

    discountType: {
      type: String,
      enum: ["percentage", "flat"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },

    maxDiscountAmount: {
      type: Number,
      min: 0,
      default: null,
    },

    minimumCartValue: {
      type: Number,
      default: 0,
    },

    appliesTo: {
      type: String,
      enum: ["all", "categories", "books"],
      default: "all",
    },

    applicableCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

    applicableBooks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],

    usageLimit: {
      type: Number,
      default: 0,
    },

    usedCount: {
      type: Number,
      default: 0,
    },

    perUserLimit: {
      type: Number,
      default: 1,
    },

    usedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        usedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

couponSchema.index({ code: 1, isActive: 1 });
couponSchema.index({ startDate: 1, endDate: 1 });

couponSchema.pre("save", function () {
  this.code = this.code.toUpperCase().trim();
  
  // auto expire coupons based on endDate and current date
  if (this.endDate && new Date() > this.endDate) {
    this.isActive = false;
  }
});

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
