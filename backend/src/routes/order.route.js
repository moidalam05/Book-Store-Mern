import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getAllOrdersByUserEmail,
  getOrderById,
  updateOrder,
} from "../controllers/order.controller.js";

const router = Router();

router.post("/create-order", createOrder);
router.get("/", getAllOrders);
router.get("/:orderId", getOrderById);
router.get("/email/:email", getAllOrdersByUserEmail);
router.patch("/:orderId", updateOrder);

export default router;
