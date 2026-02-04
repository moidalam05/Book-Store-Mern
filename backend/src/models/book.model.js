import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    // ================= BASIC INFO =================
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [150, "Title must be less than 150 characters"],
      index: true,
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
      required: true,
      trim: true,
      minlength: [30, "Description must be at least 30 characters"],
      maxlength: [2000, "Description must be less than 2000 characters"],
    },

    // ================= AUTHOR & META =================
    authors: [
      {
        type: String,
        trim: true,
      },
    ],

    publisher: {
      type: String,
      trim: true,
    },

    language: {
      type: String,
      default: "English",
    },

    isbn: {
      type: String,
      unique: true,
      sparse: true,
    },

    // ================= CATEGORY =================
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],

    // ================= PRICING =================
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

    // ================= INVENTORY =================
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    // ================= MEDIA =================
    coverImage: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
      },
    },

    // ================= FLAGS =================
    trending: {
      type: Boolean,
      default: false,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    status: {
      type: Boolean,
      default: true,
    },

    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },

    soldCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

bookSchema.index({
  title: "text",
  authors: "text",
  isbn: "text",
  tags: "text",
  slug: "text",
});

bookSchema.pre("save", function () {
  this.isAvailable = this.stock > 0;
});

const Book = mongoose.model("Book", bookSchema);
export default Book;
