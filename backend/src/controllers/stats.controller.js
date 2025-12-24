import Book from "../models/book.model.js";
import Order from "../models/order.model.js";

export const getAdminStats = async (req, res) => {
  try {
    // ================== TOTAL ORDERS ==================
    const totalOrders = await Order.countDocuments();

    // ================== TOTAL SALES ==================
    const totalSalesAgg = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);
    const totalSales = totalSalesAgg[0]?.totalSales || 0;

    // ================== TRENDING BOOKS ==================
    const trendingBooksAgg = await Book.aggregate([
      { $match: { trending: true } },
      { $count: "count" },
    ]);
    const trendingBooks = trendingBooksAgg[0]?.count || 0;

    // ================== TOTAL BOOKS ==================
    const totalBooks = await Book.countDocuments();

    // ================== MONTHLY SALES ==================
    const monthlySales = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          totalSales: { $sum: "$totalPrice" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // ================== RESPONSE ==================
    return res.status(200).json({
      success: true,
      message: "Admin stats fetched successfully",
      data: {
        totalOrders,
        totalSales,
        trendingBooks,
        totalBooks,
        monthlySales,
      },
    });
  } catch (error) {
    console.error("Error while fetching admin stats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin stats",
      error: error.message || "Internal Server Error",
    });
  }
};
