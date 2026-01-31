import { Router } from "express";
import {
  createBook,
  generateDescriptionByAI,
  getAllBooks,
  getBookById,
  updateBook,
  updateBookStatus,
} from "../controllers/book.controller.js";
import runValidation from "../validation/validate.js";
import {
  bookIdParamValidator,
  createBookValidator,
  updateBookValidator,
} from "../validation/book.validator.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.js";

const router = Router();

// route for post a book
router.post(
  "/create-book",
  isAuthenticated,
  isAdmin,
  upload.single("coverImage"),
  createBookValidator,
  runValidation,
  createBook,
);

router.get("/", getAllBooks);

router.post("/generate-description", isAuthenticated, generateDescriptionByAI);

router.get("/:bookId", bookIdParamValidator, runValidation, getBookById);

router.put(
  "/edit/:bookId",
  isAuthenticated,
  isAdmin,
  updateBookValidator,
  bookIdParamValidator,
  runValidation,
  updateBook,
);

router.patch(
  "/:bookId",
  isAuthenticated,
  isAdmin,
  bookIdParamValidator,
  runValidation,
  updateBookStatus,
);

export default router;
