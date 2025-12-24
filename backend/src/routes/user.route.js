import { Router } from "express";
import {
  createAdmin,
  createUser,
  login,
  logout,
} from "../controllers/user.controller.js";
import { createUserValidator } from "../validation/user.validator.js";
import runValidation from "../validation/validate.js";
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/admin/register",
  isAuthenticated,
  isAdmin,
  createUserValidator,
  runValidation,
  createAdmin
);

router.post("/register", createUserValidator, runValidation, createUser);

router.post("/login", login);

router.post("/logout", isAuthenticated, logout);

export default router;
