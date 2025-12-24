import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    const userAlreadyExists = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (userAlreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Email/username already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      username,
      password,
      role: "user",
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error while creating user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message || "Internal Server Error",
    });
  }
};

export const createAdmin = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    const adminAlreadyExists = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (adminAlreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Email/username already exists",
      });
    }

    const admin = await User.create({
      name,
      email,
      username,
      password,
      role: "admin",
    });

    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: admin,
    });
  } catch (error) {
    console.error("Error while creating admin user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create admin user",
      error: error.message || "Internal Server Error",
    });
  }
};

export const getAllUsers = async (req, res) => {};

export const getUserById = async (req, res) => {};

export const updateUser = async (req, res) => {};

export const deleteUser = async (req, res) => {};

export const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await User.findOne({
      $or: [{ email }, { username }],
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email/username and password do not match",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Email/username and password do not match",
      });
    }

    // generate token
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    user.password = undefined;

    return res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
      })
      .status(200)
      .json({
        success: true,
        message:
          user.role === "admin"
            ? "Admin logged in successfully"
            : "User logged in successfully",
        data: { user, token },
      });
  } catch (error) {
    console.error("Error while login user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to login user",
      error: error.message || "Internal Server Error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const { role } = req.user;

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message:
        role === "admin"
          ? "Admin logged out successfully"
          : "User logged out successfully",
    });
  } catch (error) {
    console.error("Error while logout user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to logout user",
      error: error.message || "Internal Server Error",
    });
  }
};
