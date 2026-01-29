import { Router } from "express";
import {
  cancelOrder,
  createOrder,
  getAllOrders,
  getMyOrderById,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  verifyOrder,
  verifyRazorpayAndCreateOrder,
} from "../controllers/order.controller.js";
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  createOrderValidator,
  orderIdParamValidator,
  updateOrderStatusValidator,
  verifyRazorpayValidator,
} from "../validation/order.validator.js";
import runValidation from "../validation/validate.js";

const router = Router();

router.post(
  "/create-order",
  isAuthenticated,
  createOrderValidator,
  runValidation,
  createOrder,
);

router.post(
  "/verify-payment",
  isAuthenticated,
  verifyRazorpayValidator,
  runValidation,
  verifyRazorpayAndCreateOrder,
);

router.post(
  "/verify/:orderId",
  isAuthenticated,
  orderIdParamValidator,
  runValidation,
  verifyOrder,
);

router.get("/my-orders", isAuthenticated, getMyOrders);

router.get(
  "/my-orders/:orderId",
  isAuthenticated,
  orderIdParamValidator,
  runValidation,
  getMyOrderById,
);

router.patch(
  "/cancel/:orderId",
  isAuthenticated,
  orderIdParamValidator,
  runValidation,
  cancelOrder,
);

// Admin Routes
router.get("/", isAuthenticated, isAdmin, getAllOrders);

router.get(
  "/:orderId",
  isAuthenticated,
  isAdmin,
  orderIdParamValidator,
  runValidation,
  getOrderById,
);

router.patch(
  "/:orderId",
  isAuthenticated,
  isAdmin,
  updateOrderStatusValidator,
  orderIdParamValidator,
  runValidation,
  updateOrderStatus,
);

export default router;
