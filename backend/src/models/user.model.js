import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "Name must be at least 3 characters"],
      maxLength: [50, "Name must be less than 50 characters"],
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
      unique: true,
    },

    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      minLength: [3, "Username must be at least 3 characters"],
      maxLength: [20, "Username must be less than 20 characters"],
      index: true,
      unique: true,
    },

    password: {
      type: String,
      required: function () {
        return !this.isGoogleUser;
      },
      select: false,
      minLength: [8, "Password must be at least 8 characters"],
      maxLength: [20, "Password must be less than 20 characters"],
    },

    avatar: {
      url: {
        type: String,
        default:
          "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
      },
      publicId: String,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },

    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
    ],

    defaultAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },

    isGoogleUser: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false },
);

userSchema.pre("save", async function () {
  if (!this.password || !this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model("User", userSchema);
export default User;
