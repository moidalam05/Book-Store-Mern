import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "Full name must be at least 3 characters"],
      maxLength: [50, "Full name must be less than 50 characters"],
    },

    phone: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Phone number must be exactly 10 digits"],
    },

    addressLine1: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "Address must be at least 3 characters"],
      maxLength: [100, "Address must be less than 100 characters"],
    },

    addressLine2: {
      type: String,
      trim: true,
      minLength: [3, "Address must be at least 3 characters"],
      maxLength: [100, "Address must be less than 100 characters"],
    },

    city: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "City must be at least 3 characters"],
      maxLength: [50, "City must be less than 50 characters"],
    },

    state: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "State must be at least 3 characters"],
      maxLength: [50, "State must be less than 50 characters"],
    },

    postalCode: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{6}$/, "Postal code must be exactly 6 digits"],
    },

    country: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "Country must be at least 3 characters"],
      maxLength: [50, "Country must be less than 50 characters"],
    },

    addressType: {
      type: String,
      enum: ["home", "work", "other"],
      required: true,
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

const Address = mongoose.model("Address", addressSchema);
export default Address;
