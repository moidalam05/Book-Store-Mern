import { Router } from "express";
import {
  addToCartValidation,
  updateCartItemValidation,
  removeCartItemValidation,
} from "../validation/cart.validator.js";
import runValidation from "../validation/validate.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  addToCart,
  clearCart,
  deleteCartItem,
  getCart,
  updateCart,
} from "../controllers/cart.controller.js";

const router = Router();

router.post(
  "/add-to-cart",
  isAuthenticated,
  addToCartValidation,
  runValidation,
  addToCart
);

router.get("/", isAuthenticated, getCart);

router.put(
  "/update-cart/:bookId",
  isAuthenticated,
  updateCartItemValidation,
  runValidation,
  updateCart
);

router.delete(
  "/remove-item/:bookId",
  isAuthenticated,
  removeCartItemValidation,
  runValidation,
  deleteCartItem
);

router.delete("/", isAuthenticated, clearCart);

export default router;
