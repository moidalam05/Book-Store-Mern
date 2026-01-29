import { body, param } from "express-validator";

export const createReviewValidation = [
  // 🔹 Rating
  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .bail()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  // 🔹 Comment
  body("comment")
    .trim()
    .notEmpty()
    .withMessage("Comment is required")
    .bail()
    .isLength({ max: 500 })
    .withMessage("Comment must be less than 500 characters"),
];

export const updateReviewValidation = [
  // 🔹 Rating (optional)
  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  // 🔹 Comment (optional)
  body("comment")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Comment must be less than 100 characters"),

  // 🔹 Status (optional)
  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be active or inactive"),
];

export const reviewIdParamValidation = [
  param("reviewId").isMongoId().withMessage("Invalid review ID"),
];

export const bookIdParamValidation = [
  param("bookId").isMongoId().withMessage("Invalid book ID"),
];
