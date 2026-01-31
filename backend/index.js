import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/database/connectDB.js";

// Cron jobs
import "./src/cron/book.cron.js";
import "./src/cron/user.cron.js";
import "./src/cron/coupon.cron.js";

// Routes
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

// Webhook
import { razorpayWebhookHandler } from "./src/controllers/order.controller.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.post(
  "/api/webhooks/razorpay",
  express.raw({ type: "application/json" }),
  razorpayWebhookHandler
);

app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));
app.use(cookieParser());


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

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
