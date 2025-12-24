import { Router } from "express";
import { getAdminStats } from "../controllers/stats.controller.js";
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", isAuthenticated, isAdmin, getAdminStats);

export default router;
