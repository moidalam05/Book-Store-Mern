import { body } from "express-validator";

export const createOrderValidator = [
  // Name
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Name must be between 3 and 100 characters"),

  // Email
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),

  // Phone
  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^\d{10}$/)
    .withMessage("Phone number must be exactly 10 digits"),

  // Address object must exist
  body("address").notEmpty().withMessage("Address is required"),

  // Address fields
  body("address.city").notEmpty().withMessage("City is required"),

  body("address.state").notEmpty().withMessage("State is required"),

  body("address.zipcode").notEmpty().withMessage("Zip code is required"),

  body("address.country").notEmpty().withMessage("Country is required"),

  // Product IDs
  body("productIds")
    .isArray({ min: 1 })
    .withMessage("productIds must be a non-empty array"),

  body("productIds.*")
    .isMongoId()
    .withMessage("Each productId must be a valid MongoDB ObjectId"),

  // Total price
  body("totalPrice")
    .notEmpty()
    .withMessage("Total price is required")
    .isNumeric()
    .withMessage("Total price must be a number")
    .custom((value) => value > 0)
    .withMessage("Total price must be greater than 0"),
];
