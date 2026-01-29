import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxLength: [500, "Comment must be less than 500 characters"],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true, versionKey: false },
);

reviewSchema.index({ book: 1, user: 1 }, { unique: true });

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);

export default Review;
