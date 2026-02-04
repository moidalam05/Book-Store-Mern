import Address from "../models/address.model.js";
import User from "../models/user.model.js";

export const createAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      addressType,
      isDefault,
    } = req.body;

    console.log("addressType", addressType);

    if (isDefault === true) {
      await Address.updateMany(
        { user: userId },
        { $set: { isDefault: false } }
      );
    }

    const address = await Address.create({
      user: userId,
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      addressType,
      isDefault: Boolean(isDefault),
    });

    const userUpdate = {
      $push: { addresses: address._id },
    };

    if (address.isDefault) {
      userUpdate.$set = { defaultAddress: address._id };
    }

    await User.findByIdAndUpdate(userId, userUpdate);

    return res.status(201).json({
      success: true,
      message: "Address created successfully",
      data: address,
    });
  } catch (error) {
    console.error("Create address error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create address",
    });
  }
};

export const getAllAddresses = async (req, res) => {
  try {
    const userId = req.user._id;

    const addresses = await Address.find({ user: userId }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "Addresses fetched successfully",
      data: addresses,
    });
  } catch (error) {
    console.error("Get addresses error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch addresses",
    });
  }
};

export const getAddressById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.params;

    const address = await Address.findOne({
      _id: addressId,
      user: userId,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Address fetched successfully",
      data: address,
    });
  } catch (error) {
    console.error("Get address error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch address",
    });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.params;
    ``;

    const address = await Address.findOne({
      _id: addressId,
      user: userId,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      addressType,
      isDefault,
    } = req.body;

    if (fullName !== undefined) address.fullName = fullName;
    if (phone !== undefined) address.phone = phone;
    if (addressLine1 !== undefined) address.addressLine1 = addressLine1;
    if (addressLine2 !== undefined) address.addressLine2 = addressLine2;
    if (city !== undefined) address.city = city;
    if (state !== undefined) address.state = state;
    if (postalCode !== undefined) address.postalCode = postalCode;
    if (country !== undefined) address.country = country;
    if (addressType !== undefined) address.addressType = addressType;

    if (isDefault === true) {
      await Address.updateMany(
        { user: userId },
        { $set: { isDefault: false } }
      );

      address.isDefault = true;
    }

    if (isDefault === false) {
      address.isDefault = false;
    }

    const updatedAddress = await address.save();

    const userUpdate = {};

    if (updatedAddress.isDefault) {
      userUpdate.defaultAddress = updatedAddress._id;
    }

    if (Object.keys(userUpdate).length > 0) {
      await User.findByIdAndUpdate(userId, {
        $set: userUpdate,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: updatedAddress,
    });
  } catch (error) {
    console.error("Update address error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update address",
      error: error.message,
    });
  }
};

export const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.params;

    const address = await Address.findOne({
      _id: addressId,
      user: userId,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    await Address.updateMany({ user: userId }, { $set: { isDefault: false } });

    address.isDefault = true;
    const updatedAddress = await address.save();

    await User.findByIdAndUpdate(userId, {
      $set: { defaultAddress: updatedAddress._id },
    });

    return res.status(200).json({
      success: true,
      message: "Default address updated successfully",
      data: updatedAddress,
    });
  } catch (error) {
    console.error("Set default address error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to set default address",
      error: error.message,
    });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.params;

    const address = await Address.findOneAndDelete({
      _id: addressId,
      user: userId,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    const updateQuery = {
      $pull: { addresses: address._id },
    };

    if (address.isDefault) {
      updateQuery.$set = { defaultAddress: null };
    }

    await User.findByIdAndUpdate(userId, updateQuery);

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Delete address error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete address",
    });
  }
};
