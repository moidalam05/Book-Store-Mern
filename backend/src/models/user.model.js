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
      index: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "Username must be at least 3 characters"],
      maxLength: [20, "Username must be less than 100 characters"],
      index: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
      minLength: [8, "Password must be at least 8 characters"],
      maxLength: [20, "Password must be less than 100 characters"],
    },

    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model("User", userSchema);
export default User;
