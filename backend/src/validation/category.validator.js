import { body, param } from "express-validator";

export const createCategoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .bail()
    .isLength({ min: 3, max: 50 })
    .withMessage("Category name must be between 3 and 50 characters"),

  body("description")
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must be less than 500 characters"),

  body("icon")
    .trim()
    .isString()
    .withMessage("Icon must be a string"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be boolean"),

  body("sortOrder")
    .isInt({ min: 0 })
    .withMessage("Order must be a positive number"),

  body("isTrending")
    .isBoolean()
    .withMessage("isTrending must be boolean"),

  body("isFeatured")
    .isBoolean()
    .withMessage("isFeatured must be boolean"),
];

export const updateCategoryValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Category name must be between 3 and 50 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must be less than 500 characters"),

  body("icon")
    .optional()
    .trim()
    .isString()
    .withMessage("Icon must be a string"),

  body("sortOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Order must be a positive number"),

  body("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured must be boolean"),

  body("isTrending")
    .optional()
    .isBoolean()
    .withMessage("isTrending must be boolean"),
];

export const categoryIdParamValidation = [
  param("categoryId").isMongoId().withMessage("Invalid category ID"),
];
