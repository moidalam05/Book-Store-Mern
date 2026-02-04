import Coupon from "../models/coupon.model.js";
import Cart from "../models/cart.model.js";
import {
  calculateDiscount,
  getApplicableAmount,
} from "../utils/coupon.util.js";
import { recalculateCart } from "../utils/recalculateCart.js";

// Admin Controllers
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      maxDiscountAmount,
      minimumCartValue,
      startDate,
      endDate,
      usageLimit,
      perUserLimit,
      isActive,
      isPublic,
      description,
      applicableCategories = [],
      applicableBooks = [],
      appliesTo = "all",
    } = req.body;

    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: "Coupon code already exists",
      });
    }

    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    if (appliesTo === "category") {
      if (!applicableCategories.length) {
        return res.status(400).json({
          success: false,
          message: "Applicable categories are required",
        });
      }
    }

    if (appliesTo === "book") {
      if (!applicableBooks.length) {
        return res.status(400).json({
          success: false,
          message: "Applicable books are required",
        });
      }
    }

    const coupon = await Coupon.create({
      code,
      discountType,
      discountValue,
      maxDiscountAmount,
      minimumCartValue,
      startDate,
      endDate,
      usageLimit,
      perUserLimit,
      description,
      isActive: isActive ?? true,
      isPublic: isPublic ?? true,
      appliesTo,
      applicableCategories,
      applicableBooks,
    });

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: coupon,
    });
  } catch (error) {
    console.error("Create coupon error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create coupon",
      error: error.message,
    });
  }
};

export const getAllCoupons = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      isActive,
      isPublic,
      discountType,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const query = {};

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    if (isPublic !== undefined) {
      query.isPublic = isPublic === "true";
    }

    if (discountType) {
      query.discountType = discountType;
    }

    const pageNumber = Math.max(parseInt(page, 10), 1);
    const pageLimit = Math.min(parseInt(limit, 10), 100);
    const skip = (pageNumber - 1) * pageLimit;

    const sortOrder = order === "asc" ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    const [coupons, filteredCount] = await Promise.all([
      Coupon.find(query).sort(sortOptions).skip(skip).limit(pageLimit),
      Coupon.countDocuments(query),
    ]);

    const [totalCoupons, activeCoupons, expiredCoupons, usageStats] =
      await Promise.all([
        Coupon.countDocuments({}),
        Coupon.countDocuments({ isActive: true }),
        Coupon.countDocuments({ endDate: { $lt: new Date() } }),
        Coupon.aggregate([
          {
            $group: {
              _id: null,
              totalUsed: { $sum: "$usedCount" },
              totalLimit: { $sum: "$usageLimit" },
            },
          },
        ]),
      ]);

    const totalUsed = usageStats?.[0]?.totalUsed ?? 0;
    const totalLimit = usageStats?.[0]?.totalLimit ?? 0;

    const usagePercentage =
      totalLimit > 0 ? Number(((totalUsed / totalLimit) * 100).toFixed(2)) : 0;

    return res.status(200).json({
      success: true,
      message: "Coupons fetched successfully",

      meta: {
        totalCoupons,
        activeCoupons,
        expiredCoupons,
        usagePercentage,

        filteredCount,
        totalPages: Math.ceil(filteredCount / pageLimit),
        currentPage: pageNumber,
        pageLimit: pageLimit,
      },

      data: coupons,
    });
  } catch (error) {
    console.error("Get all coupons error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get all coupons",
      error: error.message,
    });
  }
};

export const getCouponById = async (req, res) => {
  try {
    const { couponId } = req.params;

    const coupon = await Coupon.findOne({
      _id: couponId,
      isActive: true,
    }).lean();

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found or inactive",
      });
    }

    if (
      coupon.endDate &&
      new Date(coupon.endDate) < new Date(coupon.startDate)
    ) {
      return res.status(400).json({
        success: false,
        message: "Coupon has expired",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Coupon fetched successfully",
      data: coupon,
    });
  } catch (error) {
    console.error("Get coupon by ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get coupon",
      error: error.message,
    });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;

    const updateData = { ...req.body };

    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase().trim();

      const existingCoupon = await Coupon.findOne({
        code: updateData.code,
        _id: { $ne: couponId },
      });

      if (existingCoupon) {
        return res.status(400).json({
          success: false,
          message: "Coupon code already exists",
        });
      }
    }

    if (updateData.startDate && updateData.endDate) {
      if (new Date(updateData.startDate) >= new Date(updateData.endDate)) {
        return res.status(400).json({
          success: false,
          message: "End date must be after start date",
        });
      }
    }

    if (updateData.appliesTo === "category") {
      if (
        !Array.isArray(updateData.applicableCategories) ||
        updateData.applicableCategories.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Applicable categories are required",
        });
      }
    }

    if (updateData.appliesTo === "book") {
      if (
        !Array.isArray(updateData.applicableBooks) ||
        updateData.applicableBooks.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Applicable books are required",
        });
      }
    }

    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key],
    );

    const coupon = await Coupon.findByIdAndUpdate(
      couponId,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      data: coupon,
    });
  } catch (error) {
    console.error("Update coupon error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update coupon",
      error: error.message,
    });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;
    const coupon = await Coupon.findByIdAndDelete(couponId);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
      data: coupon,
    });
  } catch (error) {
    console.error("Delete coupon error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete coupon",
      error: error.message,
    });
  }
};

export const toggleCouponStatus = async (req, res) => {
  try {
    const { couponId } = req.params;

    const coupon = await Coupon.findById(couponId);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    return res.status(200).json({
      success: true,
      message: `Coupon ${
        coupon.isActive ? "activated" : "deactivated"
      } successfully`,
      data: {
        _id: coupon._id,
        code: coupon.code,
        isActive: coupon.isActive,
      },
    });
  } catch (error) {
    console.error("Toggle coupon status error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to toggle coupon status",
      error: error.message,
    });
  }
};

// User Controllers
export const applyCoupon = async (req, res) => {
  try {
    const userId = req.user._id;
    const { code } = req.body;

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

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired coupon",
      });
    }

    const applicableAmount = getApplicableAmount({ cart, coupon });

    if (coupon.minimumCartValue && applicableAmount < coupon.minimumCartValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum cart value ₹${coupon.minimumCartValue} required`,
      });
    }

    if (coupon.usageLimit > 0 && coupon.usedCount > coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: "This coupon has already been fully used",
      });
    }

    const userUsageCount = coupon.usedBy.filter(
      (usage) => usage.user.toString() === userId,
    ).length;

    if (userUsageCount >= coupon.perUserLimit) {
      return res.status(400).json({
        success: false,
        message: "Per-user coupon limit exceeded",
      });
    }

    const discountAmount = calculateDiscount({
      coupon,
      applicableAmount,
    });

    cart.appliedCoupon = {
      coupon: coupon._id,
      code: coupon.code,
      discountAmount,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxDiscountAmount: coupon.maxDiscountAmount,
      lockedAt: new Date(),
      lockedUntil: new Date(Date.now() + 5 * 60 * 1000),
      minimumCartValue: coupon.minimumCartValue,
    };

    recalculateCart(cart);
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Apply coupon error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to apply coupon",
      error: error.message,
    });
  }
};

export const removeCoupon = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({
      user: userId,
      status: "active",
    });

    if (!cart || !cart.appliedCoupon || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No coupon applied to remove or cart is empty",
      });
    }

    cart.finalPayableAmount += cart.appliedCoupon.discountAmount;
    cart.appliedCoupon = null;

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Coupon removed successfully",
      finalAmount: cart.totalPrice,
    });
  } catch (error) {
    console.error("Remove coupon error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove coupon",
      error: error.message,
    });
  }
};
