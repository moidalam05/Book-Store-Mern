import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Category name must be at least 3 characters"],
      maxlength: [50, "Category name must be less than 50 characters"],
      unique: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    icon: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isTrending: {
      type: Boolean,
      default: false,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    // SEO & sorting
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
