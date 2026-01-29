import { Link } from "react-router-dom";
import { FiChevronRight, FiCalendar } from "react-icons/fi";

const OrderSummary = ({
  total,
  original,
  discount,
  coupon,
  isLoading,
  register,
  errors,
  paymentMethod,
}) => {
  if (!total || total <= 0) {
    return null;
  }

  return (
    <div className="sticky top-20">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">Order Summary</h3>
        </div>

        <div className="p-6">
          {/* Price Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Total</span>
              <span>₹{original}</span>
            </div>

            {/* Product Discount */}
            {discount > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Discount</span>
                <span className="font-medium text-green-600">
                  ({discount}%)
                </span>
              </div>
            )}

            {discount > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>You saved</span>
                <span className="font-medium text-green-600">-₹{discount}</span>
              </div>
            )}

            {/* Coupon Discount */}
            {coupon && (
              <div className="flex justify-between text-gray-600">
                <span>Coupon</span>
                <span className="font-medium text-green-600">
                  -₹
                  {coupon?.discountAmount}
                </span>
              </div>
            )}

            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total Amount</span>
                <span>₹{total}</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Inclusive of all taxes
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                {...register("terms", {
                  required: "You must accept the terms and conditions",
                })}
                className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.terms && (
              <p className="mt-2 text-sm text-red-600">
                {errors.terms.message}
              </p>
            )}
          </div>

          {/* Order Button */}
          <button
            type="submit"
            disabled={isLoading || !paymentMethod}
            className="w-full mt-6 py-4 bg-linear-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <span>
                  {paymentMethod === "cod"
                    ? "Place Order"
                    : "Proceed to Payment"}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-lg text-sm">
                  ₹{total}
                </span>
              </>
            )}
          </button>

          {/* Payment Security */}
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <img
                src="https://badges.razorpay.com/badge-light.png"
                alt="Razorpay"
                className="h-10 opacity-80"
              />
            </div>
            <p className="text-xs text-gray-500">
              100% Secure Payments | Powered by Razorpay
            </p>
          </div>

          {/* Continue Shopping */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <Link
              to="/books"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              <FiChevronRight className="rotate-180" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Delivery Estimate */}
      <div className="mt-4 bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <FiCalendar className="text-blue-600" size={18} />
          <div>
            <div className="text-sm font-semibold text-gray-900">
              Estimated Delivery
            </div>
            <div className="text-sm text-gray-600">3-5 business days</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
