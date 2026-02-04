import { body, param } from "express-validator";

export const createCouponValidation = [
  body("code")
    .trim()
    .notEmpty()
    .withMessage("Coupon code is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Coupon code length must be 3–20")
    .toUpperCase(),

  body("discountType")
    .notEmpty()
    .withMessage("Discount type is required")
    .isIn(["percentage", "flat"])
    .withMessage("Discount type must be percentage or flat"),

  body("discountValue")
    .notEmpty()
    .withMessage("Discount value is required")
    .isFloat({ gt: 0 })
    .withMessage("Discount value must be greater than 0"),

  body("maxDiscountAmount")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Max discount must be greater than 0"),

  body("minimumCartValue")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum cart value must be >= 0"),

  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Invalid start date"),

  body("endDate")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("Invalid end date"),

  body("usageLimit")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Usage limit must be >= 0"),

  body("perUserLimit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Per user limit must be >= 1"),

  body("isActive").optional().isBoolean(),

  body("isPublic").optional().isBoolean(),
  
  body("applicableCategories")
    .optional()
    .isArray()
    .withMessage("Applicable categories must be an array"),

  body("applicableBooks")
    .optional()
    .isArray()
    .withMessage("Applicable books must be an array"),

  body("appliesTo")
    .optional()
    .isIn(["all", "categories", "books"])
    .withMessage("Applies to must be all, category, or book"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must be less than 500 characters"),

  body("applicableCategories.*").isMongoId().withMessage("Invalid category ID"),

  body("applicableBooks.*").isMongoId().withMessage("Invalid book ID"),
];

export const updateCouponValidation = [
  body("code")
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Coupon code length must be 3–20")
    .toUpperCase(),

  body("discountType")
    .optional()
    .isIn(["percentage", "flat"])
    .withMessage("Discount type must be percentage or flat"),

  body("discountValue")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Discount value must be greater than 0"),

  body("maxDiscountAmount")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Max discount must be greater than 0"),

  body("minimumCartValue")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum cart value must be >= 0"),

  body("startDate").optional().isISO8601().withMessage("Invalid start date"),

  body("endDate").optional().isISO8601().withMessage("Invalid end date"),

  body("usageLimit")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Usage limit must be >= 0"),

  body("perUserLimit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Per user limit must be >= 1"),

  body("isActive").optional().isBoolean(),

  body("isPublic").optional().isBoolean(),

  body("applicableCategories")
    .optional()
    .isArray()
    .withMessage("Applicable categories must be an array"),

  body("applicableBooks")
    .optional()
    .isArray()
    .withMessage("Applicable books must be an array"),

  body("appliesTo")
    .optional()
    .isIn(["all", "categories", "books"])
    .withMessage("Applies to must be all, category, or book"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must be less than 500 characters"),

  body("applicableCategories.*").isMongoId().withMessage("Invalid category ID"),

  body("applicableBooks.*").isMongoId().withMessage("Invalid book ID"),
];

export const couponIdParamValidation = [
  param("couponId").isMongoId().withMessage("Invalid coupon ID"),
];

export const applyCouponValidation = [
  body("code").trim().notEmpty().withMessage("Coupon code is required"),
];
