import { Router } from "express";
import {
  createBook,
  deleteBook,
  getAllBooks,
  getBookById,
  updateBook,
} from "../controllers/book.controller.js";
import runValidation from "../validation/validate.js";
import {
  createBookValidation,
  updateBookValidation,
} from "../validation/book.validator.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// route for post a book
router.post(
  "/create-book",
  isAuthenticated,
  isAdmin,
  createBookValidation,
  runValidation,
  createBook
);
router.get("/", getAllBooks);
router.get("/:bookId", getBookById);
router.delete("/:bookId", isAuthenticated, isAdmin, deleteBook);
router.patch(
  "/edit/:bookId",
  isAuthenticated,
  isAdmin,
  updateBookValidation,
  runValidation,
  updateBook
);

export default router;
