import mongoose from "mongoose";
import Book from "../models/book.model.js";

export const createBook = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      trending,
      coverImage,
      oldPrice,
      newPrice,
    } = req.body;

    const book = await Book.findOne({ title });
    if (book) {
      return res.status(400).json({
        success: false,
        message: "Book already exists",
      });
    }

    const newBook = await Book.create({
      title,
      description,
      category,
      trending,
      coverImage,
      oldPrice,
      newPrice,
    });

    return res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: newBook,
    });
  } catch (error) {
    console.error("Error while creating book:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create book",
      error: error.message || "Internal Server Error",
    });
  }
};

export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "Books fetched successfully",
      data: books,
    });
  } catch (error) {
    console.error("Error while fetching books:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch books",
      error: error.message || "Internal Server Error",
    });
  }
};

export const getBookById = async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID format",
      });
    }

    const book = await Book.findById(bookId);
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

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID format",
      });
    }

    const bookUpdateData = { ...req.body };

    Object.keys(bookUpdateData).forEach(
      (key) => bookUpdateData[key] === undefined && delete bookUpdateData[key]
    );

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { $set: bookUpdateData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (error) {
    console.error("Error while updating book:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update book",
      error: error.message || "Internal Server Error",
    });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID format",
      });
    }
    const book = await Book.findByIdAndDelete(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: book,
    });
  } catch (error) {
    console.error("Error while deleting book:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete book",
      error: error.message || "Internal Server Error",
    });
  }
};
