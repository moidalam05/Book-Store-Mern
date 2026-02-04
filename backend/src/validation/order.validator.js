import { body, param } from "express-validator";

const shippingAddressRules = [
  body("shippingAddress.name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("shippingAddress.email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("shippingAddress.phone")
    .matches(/^\d{10}$/)
    .withMessage("Phone must be 10 digits"),

  body("shippingAddress.addressLine1")
    .notEmpty()
    .withMessage("Address line 1 is required"),

  body("shippingAddress.city")
    .notEmpty()
    .withMessage("City is required"),

  body("shippingAddress.state")
    .notEmpty()
    .withMessage("State is required"),

  body("shippingAddress.zipcode")
    .optional()
    .isLength({ min: 4 })
    .withMessage("Zipcode is invalid"),

  body("shippingAddress.pincode")
    .optional()
    .isLength({ min: 4 })
    .withMessage("Pincode is invalid"),
];

export const createOrderValidator = [
  body("payment.method")
    .notEmpty()
    .withMessage("Payment method is required")
    .isIn(["COD", "RAZORPAY"])
    .withMessage("Payment method must be COD or RAZORPAY"),

  ...shippingAddressRules,
];

export const verifyRazorpayValidator = [
  body("orderId")
    .notEmpty()
    .withMessage("Razorpay orderId is required"),

  body("paymentId")
    .notEmpty()
    .withMessage("Razorpay paymentId is required"),

  body("signature")
    .notEmpty()
    .withMessage("Razorpay signature is required"),

  ...shippingAddressRules,
];

export const orderIdParamValidator = [
  param("orderId").isMongoId().withMessage("Invalid order id"),
];


export const updateOrderStatusValidator = [
  param("orderId").isMongoId().withMessage("Invalid order id"),

  body("orderStatus")
    .isIn([
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
    ])
    .withMessage("Invalid order status"),
];
