import fs from "fs";
import { cloudinary } from "./cloudinary.js";

/**
 * Upload file to Cloudinary
 * @param {string} localFilePath - multer temp file path
 * @param {string} folder - cloudinary folder name
 * @returns {Object} uploaded file data
 */
export const uploadFileToCloudinary = async (
  localFilePath,
  folder = "uploads"
) => {
  try {
    if (!localFilePath) {
      throw new Error("File path is required");
    }

    const result = await cloudinary.uploader.upload(localFilePath, {
      folder,
      resource_type: "auto",
    });

    // ✅ safely delete local file
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return {
      publicId: result.public_id,
      url: result.secure_url,
      format: result.format,
      resourceType: result.resource_type,
    };
  } catch (error) {
    // ⚠️ cleanup even if upload fails
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    throw error;
  }
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - cloudinary public_id
 * @param {string} resourceType - image | video | raw
 */
export const deleteFileFromCloudinary = async (
  publicId,
  resourceType = "image"
) => {
  try {
    if (!publicId) return;

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    return result;
  } catch (error) {
    throw new Error(`Failed to delete file from Cloudinary: ${error.message}`);
  }
};
