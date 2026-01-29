import { Router } from "express";
import {
  createCouponValidation,
  couponIdParamValidation,
  applyCouponValidation,
  updateCouponValidation,
} from "../validation/coupon.validator.js";
import runValidation from "../validation/validate.js";
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  applyCoupon,
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getCouponById,
  removeCoupon,
  toggleCouponStatus,
  updateCoupon,
} from "../controllers/coupon.controller.js";

const router = Router();

router.post(
  "/create-coupon",
  isAuthenticated,
  isAdmin,
  createCouponValidation,
  runValidation,
  createCoupon,
);

router.get("/", isAuthenticated, getAllCoupons);

router.get(
  "/:couponId",
  isAuthenticated,
  couponIdParamValidation,
  runValidation,
  getCouponById,
);

router.put(
  "/:couponId",
  isAuthenticated,
  isAdmin,
  couponIdParamValidation,
  updateCouponValidation,
  runValidation,
  updateCoupon,
);

router.patch(
  "/:couponId",
  isAuthenticated,
  isAdmin,
  couponIdParamValidation,
  runValidation,
  toggleCouponStatus,
);

router.delete(
  "/coupon/:couponId",
  isAuthenticated,
  isAdmin,
  couponIdParamValidation,
  runValidation,
  deleteCoupon,
);

// Apply coupon to cart
router.post(
  "/apply-coupon",
  isAuthenticated,
  applyCouponValidation,
  runValidation,
  applyCoupon,
);

// Remove coupon from cart
router.delete("/remove-coupon", isAuthenticated, removeCoupon);

export default router;
