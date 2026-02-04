import { Router } from "express";
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  categoryIdParamValidation,
  createCategoryValidation,
  updateCategoryValidation,
} from "../validation/category.validator.js";
import runValidation from "../validation/validate.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  updateCategoryStatus,
} from "../controllers/category.controller.js";

const router = Router();

router.post(
  "/create-category",
  isAuthenticated,
  isAdmin,
  createCategoryValidation,
  runValidation,
  createCategory,
);

router.get("/", isAuthenticated, getAllCategories);

router.get(
  "/:categoryId",
  isAuthenticated,
  categoryIdParamValidation,
  runValidation,
  getCategoryById,
);

router.put(
  "/:categoryId",
  isAuthenticated,
  isAdmin,
  updateCategoryValidation,
  categoryIdParamValidation,
  runValidation,
  updateCategory,
);

router.patch(
  "/:categoryId",
  isAuthenticated,
  isAdmin,
  categoryIdParamValidation,
  runValidation,
  updateCategoryStatus,
);

router.delete(
  "/:categoryId",
  isAuthenticated,
  isAdmin,
  categoryIdParamValidation,
  runValidation,
  deleteCategory,
);

export default router;
