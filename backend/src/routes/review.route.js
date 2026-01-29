import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  bookIdParamValidation,
  createReviewValidation,
  reviewIdParamValidation,
} from "../validation/review.validator.js";
import runValidation from "../validation/validate.js";
import {
  createReview,
  deleteReview,
  getReviews,
  updateReview,
} from "../controllers/review.controller.js";

const router = Router();

router.post(
  "/create-review/:bookId",
  isAuthenticated,
  createReviewValidation,
  bookIdParamValidation,
  runValidation,
  createReview
);

router.get("/:bookId", bookIdParamValidation, runValidation, getReviews);

router.put(
  "/:reviewId",
  isAuthenticated,
  reviewIdParamValidation,
  runValidation,
  updateReview
);

router.delete(
  "/:reviewId",
  isAuthenticated,
  reviewIdParamValidation,
  runValidation,
  deleteReview
);

export default router;
