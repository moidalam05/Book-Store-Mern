import Review from "../models/review.model.js";
import mongoose from "mongoose";
import Book from "../models/book.model.js";

export const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { bookId } = req.params;
    const userId = req.user._id;

    const book = await Book.findById(bookId);
    if (!book || book.status !== true) {
      return res.status(404).json({
        success: false,
        message: "Book not found or inactive",
      });
    }

    const existingReview = await Review.findOne({
      book: bookId,
      user: userId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this book",
      });
    }

    const review = await Review.create({
      rating,
      comment,
      book: bookId,
      user: userId,
    });

    const ratingStats = await Review.aggregate([
      {
        $match: {
          book: new mongoose.Types.ObjectId(bookId),
          status: "active",
        },
      },
      {
        $group: {
          _id: "$book",
          avgRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    if (ratingStats.length > 0) {
      await Book.findByIdAndUpdate(bookId, {
        "ratings.average": Number(ratingStats[0].avgRating.toFixed(1)),
        "ratings.count": ratingStats[0].totalRatings,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    console.error("Create review error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this book",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create review",
      error: error.message,
    });
  }
};

export const getReviews = async (req, res) => {
  try {
    const { bookId } = req.params;

    const {
      mostHelpful,
      negative,
      sort = "latest",
      page = 1,
      limit = 20,
    } = req.query;

    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: "Book ID is required",
      });
    }

    const filter = {
      book: bookId,
      status: "active",
    };

    if (negative || mostHelpful) {
      filter.rating = {};
      if (negative) filter.rating.$gte = Number(negative);
      if (mostHelpful) filter.rating.$lte = Number(mostHelpful);
    }

    let sortOption = { createdAt: -1 };

    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "mostHelpful") sortOption = { rating: -1 };
    if (sort === "negative") sortOption = { rating: 1 };

    const skip = (Number(page) - 1) * Number(limit);

    const reviews = await Review.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .populate("user", "name avatar")
      .lean();

    const totalReviews = await Review.countDocuments(filter);

    // Aggregate average rating and total ratings
    const averageRating = await Review.aggregate([
      {
        $match: { book: new mongoose.Types.ObjectId(bookId), status: "active" },
      },
      {
        $group: {
          _id: "$book",
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      meta: {
        total: totalReviews,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalReviews / limit),
        averageRating:
          Math.round(
            averageRating.length > 0 ? averageRating[0].averageRating * 10 : 0
          ) / 10,
        totalRatings:
          averageRating.length > 0 ? averageRating[0].totalRatings : 0,
      },
      data: reviews,
    });
  } catch (error) {
    console.error("Get all reviews error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch all reviews",
      error: error.message,
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment, status } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    if (status !== undefined) review.status = status;

    await review.save();

    const ratingStats = await Review.aggregate([
      {
        $match: {
          book: new mongoose.Types.ObjectId(review.book),
          status: "active",
        },
      },
      {
        $group: {
          _id: "$book",
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    if (ratingStats.length > 0) {
      await Book.findByIdAndUpdate(review.book, {
        ratings: {
          average: Number(ratingStats[0].averageRating.toFixed(1)),
          count: ratingStats[0].totalRatings,
        },
      });
    } else {
      await Book.findByIdAndUpdate(review.book, {
        ratings: {
          average: 0,
          count: 0,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  } catch (error) {
    console.error("Update review error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update review",
      error: error.message,
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const bookId = review.book;

    await Review.findByIdAndDelete(reviewId);

    const ratingStats = await Review.aggregate([
      {
        $match: {
          book: new mongoose.Types.ObjectId(bookId),
        },
      },
      {
        $group: {
          _id: "$book",
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    if (ratingStats.length > 0) {
      await Book.findByIdAndUpdate(bookId, {
        ratings: {
          average: Number(ratingStats[0].averageRating.toFixed(1)),
          count: ratingStats[0].totalRatings,
        },
      });
    } else {
      await Book.findByIdAndUpdate(bookId, {
        ratings: {
          average: 0,
          count: 0,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted permanently",
      data: review,
    });
  } catch (error) {
    console.error("Delete review error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete review",
      error: error.message,
    });
  }
};
