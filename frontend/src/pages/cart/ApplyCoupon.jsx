import { useState } from "react";
import { FiTag, FiCheckCircle, FiChevronDown } from "react-icons/fi";
import {
  useApplyCouponMutation,
  useGetAllCouponsQuery,
  useRemoveCouponMutation,
} from "../../app/features/coupon/couponApi";
import toast from "react-hot-toast";
import { useGetCartQuery } from "../../app/features/cart/cartApi";

const ApplyCoupon = () => {
  const [couponCode, setCouponCode] = useState("");
  const [showCoupons, setShowCoupons] = useState(false);

  const { data: cartData, refetch } = useGetCartQuery();
  const cart = cartData?.data;

  const { data: couponsData } = useGetAllCouponsQuery();
  const availableCoupons = couponsData?.data || [];

  const [applyCoupon, { isLoading }] = useApplyCouponMutation();
  const [removeCoupon] = useRemoveCouponMutation();

  const handleApplyCoupon = async () => {
    const promise = applyCoupon({ code: couponCode }).unwrap();

    toast.promise(promise, {
      loading: "Applying coupon...",
      success: (res) => res?.message || "Coupon applied successfully",
      error: (err) => err?.data?.message || "Failed to apply coupon",
    });

    await promise;
    setCouponCode("");
    refetch();
  };

  const handleRemoveCoupon = async () => {
    const promise = removeCoupon().unwrap();

    toast.promise(promise, {
      loading: "Removing coupon...",
      success: (res) => res?.message || "Coupon removed successfully",
      error: (err) => err?.data?.message || "Failed to remove coupon",
    });

    await promise;
    refetch();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <FiTag className="text-purple-600" size={20} />
        <h3 className="text-lg font-bold text-gray-900">Apply Coupon</h3>
      </div>

      {/* Applied Coupon */}
      {cart?.appliedCoupon ? (
        <div className="bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiCheckCircle className="text-green-600" size={20} />
              <div>
                <div className="font-medium text-gray-900">
                  {cart.appliedCoupon.code} Applied
                </div>
                <div className="text-sm text-gray-600">
                  {cart.appliedCoupon.discountType === "percentage"
                    ? `${cart.appliedCoupon.discountValue}% discount`
                    : `₹${cart.appliedCoupon.discountAmount} off`}
                </div>
              </div>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-red-600 hover:text-red-800 text-sm font-medium cursor-pointer"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Input */}
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
            />
            <button
              onClick={handleApplyCoupon}
              disabled={isLoading || !couponCode.trim()}
              className="px-6 py-3 bg-linear-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-xl disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? "Applying..." : "Apply"}
            </button>
          </div>

          {/* See Coupons Button */}
          <button
            onClick={() => setShowCoupons(!showCoupons)}
            className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-800 cursor-pointer"
          >
            See available coupons
            <FiChevronDown
              className={`transition-transform ${
                showCoupons ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Coupons List */}
          {showCoupons && (
            <div className="mt-4 space-y-2">
              {availableCoupons.map((coupon) => (
                <div
                  key={coupon._id}
                  onClick={() => setCouponCode(coupon.code)}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-purple-50 cursor-pointer transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FiTag className="text-purple-600" size={16} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {coupon.code}
                      </div>
                      <div className="text-xs text-gray-500">
                        {coupon.description}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-purple-600 font-medium">
                    Apply
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ApplyCoupon;
