import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/database/connectDB.js";
import bookRoute from "./src/routes/book.route.js";
import orderRoute from "./src/routes/order.route.js";
import userRoute from "./src/routes/user.route.js";
import adminRoute from "./src/routes/stats.route.js";

dotenv.config();
const app = express();

// Cors middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5174",
    credentials: true,
  })
);

// Middleware configuration
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));
app.use(cookieParser());

// routes
app.use("/api/v1/auth", userRoute);
app.use("/api/v1/books", bookRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/admin", adminRoute);

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
