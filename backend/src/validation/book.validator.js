import { body, param } from "express-validator";

export const createBookValidator = [
  // ===== BASIC INFO =====
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 150 })
    .withMessage("Title must be between 3 and 150 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 30, max: 2000 })
    .withMessage("Description must be between 30 and 2000 characters"),

  // ===== AUTHOR & META =====
  body("authors.*")
    .trim()
    .notEmpty()
    .withMessage("Author name cannot be empty"),

  body("publisher").optional().trim(),

  body("language").optional().trim(),

  body("isbn").optional().isISBN().withMessage("Invalid ISBN number"),

  // ===== CATEGORY =====
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Invalid category ID"),

  body("tags.*").optional().trim().toLowerCase(),

  // ===== PRICING =====
  body("price.original")
    .notEmpty()
    .withMessage("Original price is required")
    .isFloat({ min: 0 })
    .withMessage("Original price must be >= 0"),

  body("price.discounted")
    .notEmpty()
    .withMessage("Discounted price is required")
    .isFloat({ min: 0 })
    .withMessage("Discounted price must be >= 0")
    .custom((value, { req }) => {
      if (value > req.body.price.original) {
        throw new Error(
          "Discounted price cannot be greater than original price"
        );
      }
      return true;
    }),

  // ===== INVENTORY =====
  body("stock").optional().isInt({ min: 0 }).withMessage("Stock must be >= 0"),

  // ===== FLAGS =====
  body("trending")
    .optional()
    .isBoolean()
    .withMessage("Trending must be boolean"),

  body("featured")
    .optional()
    .isBoolean()
    .withMessage("Featured must be boolean"),
];

export const updateBookValidator = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage("Title must be between 3 and 150 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 30, max: 2000 })
    .withMessage("Description must be between 30 and 2000 characters"),

  body("authors.*").optional().trim().notEmpty(),

  body("category").optional().isMongoId().withMessage("Invalid category ID"),

  body("price.original")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Original price must be >= 0"),

  body("price.discounted")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Discounted price must be >= 0")
    .custom((value, { req }) => {
      if (
        req.body.price?.original !== undefined &&
        value > req.body.price.original
      ) {
        throw new Error(
          "Discounted price cannot be greater than original price"
        );
      }
      return true;
    }),

  body("stock").optional().isInt({ min: 0 }).withMessage("Stock must be >= 0"),

  body("trending").optional().isBoolean(),

  body("featured").optional().isBoolean(),

  body("isbn").optional().isISBN().withMessage("Invalid ISBN number"),

  body("tags.*").optional().trim().toLowerCase(),

  body("publisher").optional().trim(),

  body("language").optional().trim(),
];

export const bookIdParamValidator = [
  param("bookId").isMongoId().withMessage("Invalid book ID"),
];
