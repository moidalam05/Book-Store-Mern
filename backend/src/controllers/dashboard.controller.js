import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Review from "../models/review.model.js";
import Book from "../models/book.model.js";

export const getDashboardOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });

    const paidOrders = await Order.find({ "payment.status": "paid" });

    const totalOrders = paidOrders.length;

    const totalRevenue = paidOrders.reduce(
      (sum, order) => sum + (order.pricing?.finalAmount || 0),
      0,
    );

    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const conversionRate =
      totalUsers > 0 ? (totalOrders / totalUsers) * 100 : 0;

    const reviews = await Review.find({ status: "active" });

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
        : 0;

    const startOfThisMonth = new Date();
    startOfThisMonth.setDate(1);
    startOfThisMonth.setHours(0, 0, 0, 0);

    const startOfLastMonth = new Date(startOfThisMonth);
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);

    const thisMonthOrders = await Order.find({
      "payment.status": "paid",
      createdAt: { $gte: startOfThisMonth },
    });

    const lastMonthOrders = await Order.find({
      "payment.status": "paid",
      createdAt: {
        $gte: startOfLastMonth,
        $lt: startOfThisMonth,
      },
    });

    const thisMonthRevenue = thisMonthOrders.reduce(
      (sum, order) => sum + (order.pricing?.finalAmount || 0),
      0,
    );

    const lastMonthRevenue = lastMonthOrders.reduce(
      (sum, order) => sum + (order.pricing?.finalAmount || 0),
      0,
    );

    const growthRate =
      lastMonthRevenue > 0
        ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : 0;

    // ================= RESPONSE =================
    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        totalOrders,
        totalRevenue,
        avgOrderValue: Number(avgOrderValue.toFixed(2)),
        conversionRate: Number(conversionRate.toFixed(2)),
        customerSatisfaction: Number(avgRating.toFixed(1)),
        growthRate: Number(growthRate.toFixed(2)),
      },
    });
  } catch (error) {
    console.error("Get dashboard overview error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard overview",
      error: error.message,
    });
  }
};

export const getDashboardCharts = async (req, res) => {
  try {
    const now = new Date();

    const last7Days = new Date();
    last7Days.setDate(now.getDate() - 6);

    const revenueOrders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days },
          orderStatus: { $in: ["completed", "delivered"] },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          totalRevenue: { $sum: "$pricing.finalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = totalUsers - activeUsers;

    const premiumUsers = await User.countDocuments({ role: "admin" });
    const newUsers = await User.countDocuments({
      createdAt: {
        $gte: new Date(now.setDate(now.getDate() - 30)),
      },
    });

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          orderStatus: "delivered",
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$pricing.finalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return res.status(200).json({
      success: true,
      data: {
        revenueOrders,
        userDistribution: {
          newUsers,
          activeUsers,
          inactiveUsers,
          premiumUsers,
        },
        monthlyRevenue,
      },
    });
  } catch (error) {
    console.error("Dashboard Charts Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard charts",
    });
  }
};

export const getDashboardQuickStats = async (req, res) => {
  try {
    const weeklySales = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
          orderStatus: "delivered",
        },
      },
      {
        $group: {
          _id: {
            $dayOfWeek: {
              date: "$createdAt",
              timezone: "Asia/Kolkata",
            },
          },
          sales: { $sum: "$pricing.finalAmount" },
        },
      },
    ]);

    const salesByDay = {};
    weeklySales.forEach((d) => {
      salesByDay[d._id] = d.sales;
    });

    const fullWeek = Array.from({ length: 7 }, (_, i) => {
      return salesByDay[i + 1] || 0;
    });

    const todayMongoDay = new Date().getDay() + 1;
    const yesterdayMongoDay = todayMongoDay === 1 ? 7 : todayMongoDay - 1;

    const todayRevenue = salesByDay[todayMongoDay] || 0;
    const yesterdayRevenue = salesByDay[yesterdayMongoDay] || 0;

    const weeklyRevenue = fullWeek.reduce((a, b) => a + b, 0);
    const avgDailySales = Math.round(weeklyRevenue / 7);

    const trend =
      yesterdayRevenue === 0
        ? 0
        : Number(
            (
              ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) *
              100
            ).toFixed(1),
          );

    res.status(200).json({
      success: true,
      data: {
        todayRevenue,
        weeklyRevenue,
        avgDailySales,
        trend,
        activeSalesDays: fullWeek.filter((v) => v > 0).length,
      },
    });
  } catch (err) {
    console.error("Error while fetching dashboard quick stats", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard quick stats",
      error: err.message,
    });
  }
};

export const getDashboardRecentData = async (req, res) => {
  try {
    // 1️⃣ Recent Orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("customer.name pricing.finalAmount orderStatus createdAt")
      .lean();

    const formattedOrders = recentOrders.map((order) => ({
      id: `#ORD-${order._id.toString().slice(-8).toUpperCase()}`,
      customer: order.customer.name,
      amount: `₹${order.pricing.finalAmount.toLocaleString("en-IN")}`,
      status: order.orderStatus,
      date: order.createdAt,
    }));

    const recentActivities = recentOrders.map((order) => ({
      user: order.customer.name,
      action:
        order.orderStatus === "delivered"
          ? "Completed an order"
          : "Placed a new order",
      time: order.createdAt,
      type: "order",
    }));

    // 2️⃣ This Month Total Sales
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    const monthlySalesAgg = await Order.aggregate([
      {
        $match: {
          orderStatus: "delivered",
          createdAt: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$pricing.finalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    const monthlyStats = monthlySalesAgg[0] || {
      totalRevenue: 0,
      totalOrders: 0,
    };

    // 3️⃣ Response
    return res.status(200).json({
      success: true,
      data: {
        recentOrders: formattedOrders,
        recentActivities,
        monthlySales: {
          totalRevenue: monthlyStats.totalRevenue,
          totalOrders: monthlyStats.totalOrders,
        },
      },
    });
  } catch (error) {
    console.log("Error while fetching dashboard recent data", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard recent data",
      error: error.message,
    });
  }
};

export const getTopProducts = async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      {
        $match: {
          orderStatus: "delivered",
        },
      },

      {
        $unwind: "$items",
      },

      {
        $group: {
          _id: "$items.product",
          totalSales: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: {
              $multiply: [
                "$items.quantity",
                "$items.discountedPrice",
              ],
            },
          },
        },
      },

      {
        $sort: { totalRevenue: -1 },
      },

      {
        $limit: 5,
      },

      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "book",
        },
      },

      {
        $unwind: "$book",
      },
      {
        $project: {
          _id: 0,
          productId: "$book._id",
          name: "$book.title",
          sales: "$totalSales",
          revenue: "$totalRevenue",
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: topProducts,
    });
  } catch (error) {
    console.log("Error while fetching top products", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch top products",
      error: error.message,
    });
  }
};
