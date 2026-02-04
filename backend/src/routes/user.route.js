import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  profileStats,
  updateProfile,
  updateUserStatus,
} from "../controllers/user.controller.js";
import { userIdParamsValidator } from "../validation/user.validator.js";
import runValidation from "../validation/validate.js";
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.js";

const router = Router();

router.get("/all-users", isAuthenticated, isAdmin, getAllUsers);

router.get("/profile-stats", isAuthenticated, profileStats);

router.get(
  "/:userId",
  isAuthenticated,
  userIdParamsValidator,
  runValidation,
  getUserById,
);

router.put(
  "/update-profile/:userId",
  isAuthenticated,
  upload.single("avatar"),
  updateProfile,
);

router.patch(
  "/status/:userId",
  isAuthenticated,
  userIdParamsValidator,
  runValidation,
  updateUserStatus,
);

export default router;
