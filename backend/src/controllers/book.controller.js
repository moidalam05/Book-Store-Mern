import Book from "../models/book.model.js";
import Category from "../models/category.model.js";
import {
  uploadFileToCloudinary,
  deleteFileFromCloudinary,
} from "../config/fileUpload.js";
import { createBookSlug } from "../utils/slug.utils.js";
import { parseArrayField } from "../utils/parseArray.js";
import { parsePrice } from "../utils/parsePrice.js";
import { main } from "../config/gemini.js";

export const createBook = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      publisher,
      language,
      isbn,
      trending,
      featured,
      stock,
    } = req.body;

    let authors = [];
    let tags = [];

    try {
      authors = parseArrayField(req.body.authors);
      tags = parseArrayField(req.body.tags);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid authors or tags format",
        error: error.message,
      });
    }

    if (!authors.length) {
      return res.status(400).json({
        success: false,
        message: "At least one author is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Cover image is required",
      });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid category",
      });
    }

    let baseSlug = createBookSlug(title);
    let slug = baseSlug;
    let counter = 1;

    while (await Book.exists({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    let price;
    try {
      price = parsePrice(req.body);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid price format",
        error: error.message,
      });
    }

    if (price.discounted > price.original) {
      return res.status(400).json({
        success: false,
        message: "Discounted price cannot exceed original price",
      });
    }

    let existingBook = null;

    if (isbn) {
      existingBook = await Book.findOne({ isbn });
    } else {
      existingBook = await Book.findOne({ title });
    }

    if (existingBook) {
      existingBook.stock += Number(stock) || 0;

      if (price) {
        existingBook.price = {
          original: price.original,
          discounted: price.discounted,
        };
      }

      if (trending !== undefined) {
        existingBook.trending = trending === "true";
      }

      if (featured !== undefined) {
        existingBook.featured = featured === "true";
      }

      await existingBook.save();

      return res.status(200).json({
        success: true,
        message: "Book already exists. Stock updated successfully",
        data: existingBook,
      });
    }

    const uploadResult = await uploadFileToCloudinary(req.file.path, "books");

    const book = await Book.create({
      title,
      slug,
      description,
      category,
      authors,
      publisher,
      language,
      isbn,
      tags,
      trending: trending === "true",
      featured: featured === "true",
      stock: Number(stock) || 0,
      price,
      coverImage: {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error) {
    console.error("Create book error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create book",
      error: error.message,
    });
  }
};

export const getAllBooks = async (req, res) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      trending,
      featured,
      newRelease,
      topRated,
      sortBy = "newest",
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // ================= CATEGORY =================
    if (category) {
      query.category = category;
    }

    // ================= SEARCH =================
    if (search) {
      const searchRegex = new RegExp(search, "i");

      query.$or = [
        { title: searchRegex },
        { isbn: searchRegex },
        { author: searchRegex },
      ];
    }

    // ================= PRICE FILTER =================
    if (minPrice || maxPrice) {
      query["price.discounted"] = {};
      if (minPrice) query["price.discounted"].$gte = Number(minPrice);
      if (maxPrice) query["price.discounted"].$lte = Number(maxPrice);
    }

    // ================= DISCOUNT FILTER (PERCENT) =================
    if (req.query.discount) {
      const discountPercent = Number(req.query.discount);

      query.$expr = {
        $and: [
          { $gt: ["$price.original", 0] },
          {
            $gte: [
              {
                $multiply: [
                  {
                    $divide: [
                      { $subtract: ["$price.original", "$price.discounted"] },
                      "$price.original",
                    ],
                  },
                  100,
                ],
              },
              discountPercent,
            ],
          },
        ],
      };
    }

    // ================= TRENDING =================
    if (trending === "true" || sortBy === "trending") {
      query.trending = true;
    }

    // ================= FEATURED =================
    if (featured === "true" || sortBy === "featured") {
      query.featured = true;
    }

    // ================= LANGUAGE FILTER (SAFE) =================
    if (req.query.language) {
      const languages = Array.isArray(req.query.language)
        ? req.query.language
        : [req.query.language];

      query.language = {
        $in: languages.map((l) => new RegExp(`^${l}$`, "i")),
      };
    }

    // ================= NEW RELEASES (30 DAYS) =================
    if (newRelease === "true" || sortBy === "newest") {
      const last30Days = new Date();
      last30Days.setDate(last30Days.getDate() - 30);
      query.createdAt = { $gte: last30Days };
    }

    // ================= RATING FILTER =================
    if (req.query.rating || sortBy === "topRated" || topRated === "true") {
      query["ratings.average"] = { $gte: Number(req.query.rating) };
    }

    // ================= SORT LOGIC =================
    let sort = { createdAt: -1 };

    switch (sortBy) {
      case "featured":
        sort = { featured: -1, createdAt: -1 };
        break;

      case "trending":
        sort = { trending: -1, soldCount: -1 };
        break;

      case "recommended":
        sort = { soldCount: -1 };
        break;

      case "rating":
        sort = { "ratings.average": -1 };
        break;

      case "price_low":
        sort = { "price.discounted": 1 };
        break;

      case "price_high":
        sort = { "price.discounted": -1 };
        break;

      case "oldest":
        sort = { createdAt: 1 };
        break;

      default:
        sort = { createdAt: -1 };
    }

    // ================= PAGINATION =================
    const skip = (page - 1) * limit;

    const books = await Book.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate("category", "name slug");

    const totalBooks = await Book.countDocuments({ status: true });
    const filteredtotal = await Book.countDocuments(query);

    const lowStock = await Book.countDocuments({
      status: true,
      stock: { $lte: 5 },
    });

    const averageRatingAgg = await Book.aggregate([
      { $match: query },
      { $group: { _id: null, avgRating: { $avg: "$ratings.average" } } },
    ]);

    const averageRating =
      averageRatingAgg.length > 0 ? averageRatingAgg[0].avgRating : 0;

    const maxDiscountPercent = await Book.aggregate([
      { $match: query },
      {
        $project: {
          discount: {
            $cond: [
              { $gt: ["$price.original", 0] },
              {
                $multiply: [
                  {
                    $divide: [
                      { $subtract: ["$price.original", "$price.discounted"] },
                      "$price.original",
                    ],
                  },
                  100,
                ],
              },
              0,
            ],
          },
        },
      },

      { $group: { _id: null, maxDiscount: { $max: "$discount" } } },
    ]);

    const maxDiscount = Math.ceil(
      maxDiscountPercent.length > 0 ? maxDiscountPercent[0].maxDiscount : 0,
    );

    return res.status(200).json({
      success: true,
      message: "Books fetched successfully",
      meta: {
        totalBooks,
        filteredtotal,
        lowStock,
        page: Number(page),
        pages: Math.ceil(filteredtotal / limit),
        averageRating,
        totalBooks,
        maxDiscount,
      },
      data: books,
    });
  } catch (error) {
    console.error("Error while fetching books:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch books",
      error: error.message,
    });
  }
};

export const getBookById = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId).populate("category", "name slug");
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Book fetched successfully",
      data: book,
    });
  } catch (error) {
    console.error("Error while fetching book by id:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch book by id",
      error: error.message || "Internal Server Error",
    });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    let isUpdated = false;

    const allowedFields = [
      "title",
      "description",
      "publisher",
      "language",
      "category",
      "trending",
      "featured",
      "stock",
      "isbn",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        book[field] = req.body[field];
        isUpdated = true;
      }
    });

    if (req.body.authors) {
      try {
        book.authors = parseArrayField(req.body.authors);
        isUpdated = true;
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid authors format",
        });
      }
    }

    if (req.body.tags) {
      try {
        book.tags = parseArrayField(req.body.tags);
        isUpdated = true;
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid tags format",
        });
      }
    }

    if (
      req.body.price ||
      req.body.original !== undefined ||
      req.body.discounted !== undefined
    ) {
      try {
        book.price = parsePrice(req.body);
        isUpdated = true;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
    }

    if (req.file) {
      const uploadResult = await uploadFileToCloudinary(req.file.path, "books");

      if (book.coverImage?.publicId) {
        await deleteFileFromCloudinary(book.coverImage.publicId);
      }

      book.coverImage = {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
      };

      isUpdated = true;
    }

    if (!isUpdated) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    await book.save();

    return res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: book,
    });
  } catch (error) {
    console.error("Update book error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update book",
      error: error.message,
    });
  }
};

export const updateBookStatus = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    book.status = !book.status;
    await book.save();

    return res.status(200).json({
      success: true,
      message: `Book status updated to ${book.status ? "active" : "inactive"}`,
      data: book,
    });
  } catch (error) {
    console.error("Error while updating book status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update book status",
      error: error.message,
    });
  }
};

export const cleanupInactiveBooks = async () => {
  const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  const books = await Book.find({
    status: "inactive",
    updatedAt: { $lte: cutoff },
  });

  for (const book of books) {
    const hasOrders = await Order.exists({
      productIds: book._id,
    });

    if (!hasOrders) {
      await deleteFileFromCloudinary(book.coverImage.publicId);
      book.ratings = { average: 0, count: 0 };
      await book.deleteOne();
    }
  }
};

export const generateDescriptionByAI = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const response = await main(
      `Generate ${title} book description in 200 to 400 characters in simple text format.`,
    );
    return res.status(200).json({
      success: true,
      message: "Description generated successfully",
      data: response,
    });
  } catch (error) {
    console.log("Error while generating description by ai", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate description by AI",
      error: error.message,
    });
  }
};


