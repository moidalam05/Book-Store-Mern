import { Router } from "express";
import {
  createAddressValidation,
  updateAddressValidation,
  addressIdParamValidation,
} from "../validation/address.validator.js";
import runValidation from "../validation/validate.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  createAddress,
  deleteAddress,
  getAddressById,
  getAllAddresses,
  setDefaultAddress,
  updateAddress,
} from "../controllers/address.controller.js";

const router = Router();

router.post(
  "/create-address",
  isAuthenticated,
  createAddressValidation,
  runValidation,
  createAddress
);

router.get(
  "/:addressId",
  isAuthenticated,
  addressIdParamValidation,
  runValidation,
  getAddressById
);

router.get("/", isAuthenticated, getAllAddresses);

router.put(
  "/:addressId",
  isAuthenticated,
  updateAddressValidation,
  addressIdParamValidation,
  runValidation,
  updateAddress
);

router.patch(
  "/:addressId",
  isAuthenticated,
  addressIdParamValidation,
  runValidation,
  setDefaultAddress
);

router.delete(
  "/:addressId",
  isAuthenticated,
  addressIdParamValidation,
  runValidation,
  deleteAddress
);

export default router;
