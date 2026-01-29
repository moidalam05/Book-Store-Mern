import { Router } from "express";
import {
  createAdmin,
  createUser,
  getMe,
  googleAuth,
  login,
  logout,
} from "../controllers/auth.controller.js";
import { createUserValidator } from "../validation/user.validator.js";
import runValidation from "../validation/validate.js";
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.js";

const router = Router();

router.post(
  "/create-admin",
  isAuthenticated,
  isAdmin,
  upload.single("avatar"),
  createUserValidator,
  runValidation,
  createAdmin
);

router.get("/me", isAuthenticated, getMe);

router.post("/register", createUserValidator, runValidation, createUser);

router.post("/login", login);

router.post("/google", googleAuth);

router.post("/logout", isAuthenticated, logout);

export default router;
