import { Router } from "express";
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  getDashboardCharts,
  getDashboardOverview,
  getDashboardQuickStats,
  getDashboardRecentData,
  getTopProducts,
} from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/overview", isAuthenticated, isAdmin, getDashboardOverview);
router.get("/charts", isAuthenticated, isAdmin, getDashboardCharts);
router.get("/quick-stats", isAuthenticated, isAdmin, getDashboardQuickStats);
router.get("/top-products", isAuthenticated, isAdmin, getTopProducts);
router.get("/recent-data", isAuthenticated, isAdmin, getDashboardRecentData);

export default router;
