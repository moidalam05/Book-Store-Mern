import { body } from "express-validator";

export const createBookValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .bail()
    .isLength({ min: 30, max: 1000 })
    .withMessage("Description must be between 30 and 1000 characters"),
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage("Category must be between 3 and 100 characters"),
  body("coverImage").notEmpty().withMessage("Cover image is required"),
  body("oldPrice").notEmpty().withMessage("Old price is required"),
  body("newPrice").notEmpty().withMessage("New price is required"),
];

export const updateBookValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 30, max: 1000 })
    .withMessage("Description must be between 30 and 1000 characters"),

  body("category")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Category must be between 3 and 100 characters"),

  body("coverImage")
    .optional()
    .isURL()
    .withMessage("Cover image must be a valid URL"),

  body("oldPrice")
    .optional()
    .isNumeric()
    .withMessage("Old price must be a number"),

  body("newPrice")
    .optional()
    .isNumeric()
    .withMessage("New price must be a number"),
];
