import { body, param } from "express-validator";
import mongoose from "mongoose";

export const addToCartValidation = [
  body("bookId")
    .notEmpty()
    .withMessage("Book ID is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Book ID"),

  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
];

export const updateCartItemValidation = [
  param("bookId")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Book ID"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt()
    .withMessage("Quantity must be an integer")
    .custom((value) => {
      if (![1, -1].includes(value)) {
        throw new Error("Quantity must be +1 or -1");
      }
      return true;
    }),
];

export const removeCartItemValidation = [
  param("bookId")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Book ID"),
];
