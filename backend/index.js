import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/database/connectDB.js";

// Cron
import "./src/cron/book.cron.js";
import "./src/cron/user.cron.js";
import "./src/cron/coupon.cron.js";

// imports routes
import bookRoute from "./src/routes/book.route.js";
import orderRoute from "./src/routes/order.route.js";
import userRoute from "./src/routes/user.route.js";
import authRoute from "./src/routes/auth.route.js";
import categoryRoute from "./src/routes/category.route.js";
import reviewRoute from "./src/routes/review.route.js";
import addressRoute from "./src/routes/address.route.js";
import cartRoute from "./src/routes/cart.route.js";
import couponRoute from "./src/routes/coupon.route.js";
import dashboardRoute from "./src/routes/dashboard.route.js";

// webhook
import { razorpayWebhookHandler } from "./src/controllers/order.controller.js";

dotenv.config();
const app = express();

// Cors middleware
app.use(
  cors({
    origin: [process.env.FRONTEND_URL || "http://localhost:5174"],
    credentials: true,
  }),
);

// Webhook
app.post(
  "/api/webhooks/razorpay",
  express.raw({ type: "application/json" }),
  razorpayWebhookHandler,
);

// Middleware configuration
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));
app.use(cookieParser());

// routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/api/v1/books", bookRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/addresses", addressRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/coupons", couponRoute);

// Start the server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
