import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "Title must be at least 3 characters"],
      maxLength: [100, "Title must be less than 100 characters"],
      index: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minLength: [30, "Description must be at least 30 characters"],
      maxLength: [1000, "Description must be less than 1000 characters"],
    },
    category: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "Category must be at least 3 characters"],
      maxLength: [100, "Category must be less than 100 characters"],
    },
    trending: {
      type: Boolean,
      default: false,
    },
    coverImage: {
      type: String,
      required: true,
      default: "",
    },
    oldPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    newPrice: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false }
);

const Book = mongoose.model("Book", bookSchema);
export default Book;
