import { body, param } from "express-validator";

/* ================= CREATE ADDRESS ================= */

export const createAddressValidation = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Full name must be between 3 and 50 characters"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Invalid Indian phone number"),

  body("addressLine1")
    .trim()
    .notEmpty()
    .withMessage("Address line 1 is required")
    .isLength({ min: 5, max: 100 })
    .withMessage("Address line 1 must be between 5 and 100 characters"),

  body("addressLine2")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Address line 2 must be less than 100 characters"),

  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("City must be between 2 and 50 characters"),

  body("state")
    .trim()
    .notEmpty()
    .withMessage("State is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("State must be between 2 and 50 characters"),

  body("postalCode")
    .trim()
    .notEmpty()
    .withMessage("Postal code is required")
    .matches(/^\d{6}$/)
    .withMessage("Invalid postal code"),

  body("country")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Country must be between 2 and 50 characters"),

  body("addressType")
    .trim()
    .notEmpty()
    .withMessage("Address type is required")
    .toLowerCase()
    .isIn(["home", "work", "other"])
    .withMessage("Invalid address type"),

  body("isDefault")
    .optional()
    .isBoolean()
    .withMessage("isDefault must be boolean"),
];

/* ================= UPDATE ADDRESS ================= */

export const updateAddressValidation = [
  body("fullName")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Full name must be between 3 and 50 characters"),

  body("phone")
    .optional()
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Invalid phone number"),

  body("addressLine1")
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage("Address line 1 must be between 5 and 100 characters"),

  body("addressLine2")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Address line 2 must be less than 100 characters"),

  body("city")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("City must be between 2 and 50 characters"),

  body("state")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("State must be between 2 and 50 characters"),

  body("postalCode")
    .optional()
    .trim()
    .matches(/^\d{6}$/)
    .withMessage("Invalid postal code"),

  body("country")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Country must be between 2 and 50 characters"),

  body("addressType")
    .optional()
    .trim()
    .toLowerCase()
    .isIn(["home", "work", "other"])
    .withMessage("Invalid address type"),

  body("isDefault")
    .optional()
    .isBoolean()
    .withMessage("isDefault must be boolean"),
];

/* ================= PARAM VALIDATION ================= */

export const addressIdParamValidation = [
  param("addressId").isMongoId().withMessage("Invalid address ID"),
];
