import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { uploadFileToCloudinary } from "../config/fileUpload.js";

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false });
    }

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    const userAlreadyExists = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (userAlreadyExists) {
      return res.status(409).json({
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
        message: "Email or username already exists",
      });
    }

    let avatarData = undefined;

    if (req.file) {
      const uploadResult = await uploadFileToCloudinary(
        req.file.path,
        "avatars/admins"
      );

      avatarData = {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
      };
    }

    const admin = await User.create({
      name,
      email,
      username,
      password,
      role: "admin",
      avatar: avatarData,
    });

    admin.password = undefined;

    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: admin,
    });
  } catch (error) {
    console.error("Error while creating admin:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create admin user",
      error: error.message || "Internal Server Error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
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
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
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

export const googleAuth = async (req, res) => {
  try {
    const { email, name, avatar } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    let user = await User.findOne({ email });

    // 🔹 Create user if not exists
    if (!user) {
      user = await User.create({
        name: name || email.split("@")[0],
        email,
        username: email.split("@")[0],
        avatar: avatar || null,
        password: "GOOGLE_AUTH",
        role: "user",
        isGoogleUser: true,
      });
    }
    // 🔹 Update missing fields for old users
    else {
      let shouldUpdate = false;

      if (!user.name && name) {
        user.name = name;
        shouldUpdate = true;
      }

      if (!user.avatar && avatar) {
        user.avatar = avatar;
        shouldUpdate = true;
      }

      if (shouldUpdate) await user.save();
    }

    // 🔹 Generate JWT
    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    user.password = undefined;

    return res.status(200).json({
      success: true,
      message: "Google login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({
      success: false,
      message: "Google authentication failed",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const role = req.user.role;

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      path: "/",
      maxAge: 0,
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
