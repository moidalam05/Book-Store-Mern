import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Review from "../models/review.model.js";
import {
  uploadFileToCloudinary,
  deleteFileFromCloudinary,
} from "../config/fileUpload.js";

export const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { name, username } = req.body;

    if (name) user.name = name;

    if (username && username !== user.username) {
      const usernameExists = await User.findOne({
        username,
        _id: { $ne: userId },
      });

      if (usernameExists) {
        return res.status(400).json({
          success: false,
          message: "Username already exists",
        });
      }

      user.username = username;
    }

    if (req.file) {
      if (user.avatar?.publicId) {
        await deleteFileFromCloudinary(user.avatar.publicId);
      }

      const uploadResult = await uploadFileToCloudinary(
        req.file.path,
        "avatars",
      );

      user.avatar = {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
      };
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error while updating profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { sort = "newest", role, status, accountType, search } = req.query;

    const filter = {};

    if (role) filter.role = role;
    if (status) filter.isActive = status === "active";
    if (accountType === "google") {
      filter.isGoogleUser = true;
    }

    if (accountType === "regular") {
      filter.isGoogleUser = false;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    let sortOption = { createdAt: -1 };

    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "name_az") sortOption = { name: 1 };
    if (sort === "email_az") sortOption = { email: 1 };

    const users = await User.find(filter)
      .select("-password -avatar.publicId")
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    const filteredUsersCount = await User.countDocuments(filter);

    const [
      totalUsers,
      adminCount,
      userCount,
      googleUsersCount,
      regularUsersCount,
      activeUsersCount,
      inactiveUsersCount,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "user" }),
      User.countDocuments({ isGoogleUser: true }),
      User.countDocuments({ isGoogleUser: false }),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: false }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      meta: {
        page,
        limit,
        totalPages: Math.ceil(filteredUsersCount / limit),
        filteredUsersCount,
      },
      analytics: {
        totalUsers,
        admins: adminCount,
        users: userCount,
        googleUsers: googleUsersCount,
        regularUsers: regularUsersCount,
        activeUsers: activeUsersCount,
        inactiveUsers: inactiveUsersCount,
      },
      data: users,
    });
  } catch (error) {
    console.error("Error while fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message || "Internal Server Error",
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select(
      "-password -avatar.publicId",
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error while fetching user by id:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user by id",
      error: error.message || "Internal Server Error",
    });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isActive = !user.isActive;
    await user.save();
    return res.status(200).json({
      success: true,
      message: `User status ${user.isActive ? "active" : "inactive"} successfully`,
      data: user,
    });
  } catch (error) {
    console.error("Error while updating user status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user status",
      error: error.message || "Internal Server Error",
    });
  }
};

export const cleanupInactiveUsers = async (req, res) => {
  try {
    const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const inactiveUsers = await User.find({
      isActive: false,
      updatedAt: { $lte: cutoffDate },
    });

    if (inactiveUsers.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No inactive users to delete",
      });
    }

    for (const user of inactiveUsers) {
      await user.deleteOne();
    }
    return res.status(200).json({
      success: true,
      message: `Deleted ${inactiveUsers.length} inactive users successfully`,
    });
  } catch (error) {
    console.log(`Failed while trying to delete user`, error);
    return res.status(500).json({
      success: false,
      message: `Failed to delete user`,
      error: error.message,
    });
  }
};

import mongoose from "mongoose";


export const profileStats = async (req, res) => {
  try {
    /* ================= USER ID ================= */
    const userId = new mongoose.Types.ObjectId(req.user._id);

    /* ================= MEMBER SINCE ================= */
    const user = await User.findById(userId).select("createdAt");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    /* ================= BOOKS BOUGHT + PREFERRED CATEGORY ================= */
    const ordersAgg = await Order.aggregate([
      {
        $match: {
          user: userId,
          orderStatus: { $ne: "cancelled" },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.category",
          booksBought: { $sum: "$items.quantity" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $project: {
          _id: 0,
          categoryName: "$category.name",
          booksBought: 1,
        },
      },
      { $sort: { booksBought: -1 } },
    ]);

    const booksBought = ordersAgg.reduce(
      (sum, item) => sum + item.booksBought,
      0
    );

    const preferredCategory =
      ordersAgg.length > 0
        ? ordersAgg[0].categoryName
        : "Not decided yet";

    /* ================= PENDING ORDERS ================= */
    const pendingOrders = await Order.countDocuments({
      user: userId,
      orderStatus: {
        $in: ["pending", "confirmed", "processing", "shipped"],
      },
    });

    /* ================= REVIEWS ================= */
    const totalReviews = await Review.countDocuments({
      user: userId,
    });

    /* ================= POINTS ================= */
    const points =
      booksBought * 20 +
      totalReviews * 10;

    /* ================= READING STREAK ================= */
    const lastDeliveredOrder = await Order.findOne({
      user: userId,
      orderStatus: "delivered",
    }).sort({ deliveredAt: -1 });

    let readingStreak = 0;

    if (lastDeliveredOrder) {
      const lastDate = new Date(
        lastDeliveredOrder.deliveredAt ||
          lastDeliveredOrder.createdAt
      );
      const today = new Date();

      const diffDays = Math.floor(
        (today - lastDate) / (1000 * 60 * 60 * 24)
      );

      readingStreak = diffDays <= 1 ? diffDays + 1 : 0;
    }

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      data: {
        booksBought,
        pendingOrders,
        totalReviews,
        points,
        readingStreak,
        preferredCategory,
        memberSince: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in profileStats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile stats",
    });
  }
};

