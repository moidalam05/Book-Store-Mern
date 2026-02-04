import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiTrash2,
  FiPlus,
  FiMinus,
  FiShoppingBag,
  FiArrowLeft,
  FiCheckCircle,
  FiTruck,
  FiShield,
  FiChevronRight,
  FiX,
} from "react-icons/fi";
import {
  useClearCartMutation,
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartMutation,
} from "../../app/features/cart/cartApi.js";
import ApplyCoupon from "./ApplyCoupon.jsx";
import { toast } from "react-hot-toast";
import Loading from "../../components/Loading.jsx";

const CartPage = () => {
  const { data: cartData, isLoading } = useGetCartQuery();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [clearCart] = useClearCartMutation();
  const [updateCart] = useUpdateCartMutation();
  const [isCouponOpen, setIsCouponOpen] = useState(false);

  const cart = cartData?.data || {};
  const cartItems = cart?.items || [];

  const handleUpdateQuantity = async (bookId, quantity) => {
    if (!bookId) {
      console.error("❌ bookId is undefined");
      return;
    }

    const updatePromise = updateCart({ bookId, quantity }).unwrap();

    toast.promise(updatePromise, {
      loading: "Updating cart...",
      success: (res) => res?.message || "Cart updated successfully",
      error: (err) => err?.data?.message || "Failed to update cart",
    });

    await updatePromise;
  };

  const handleRemoveItem = async (bookId) => {
    const removePromise = removeFromCart(bookId).unwrap();

    toast.promise(removePromise, {
      loading: "Removing item...",
      success: (res) => res?.message || "Item removed successfully",
      error: (err) => err?.data?.message || "Failed to remove item",
    });

    await removePromise;
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      const clearPromise = clearCart().unwrap();
      toast.promise(clearPromise, {
        loading: "Clearing cart...",
        success: (res) => res?.message || "Cart cleared successfully",
        error: (err) => err?.data?.message || "Failed to clear cart",
      });

      await clearPromise;
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen py-8 ">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Shopping Cart
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your
              cart
            </p>
          </div>

          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-red-500 to-rose-500 text-white font-medium rounded-xl hover:from-red-600 hover:to-rose-600 transition-all shadow-md cursor-pointer text-sm sm:text-base w-full sm:w-auto"
            >
              <FiTrash2 />
              Clear Cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-12 text-center">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-linear-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
              <FiShoppingBag className="text-blue-600" size={24} />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base max-w-md mx-auto">
              Looks like you haven't added any books to your cart yet. Start
              exploring our collection!
            </p>
            <Link
              to="/books"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg text-sm md:text-base w-full md:w-auto"
            >
              <FiShoppingBag />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column - Cart Items */}
            <div className="lg:flex-1">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Desktop Table Header (Hidden on mobile) */}
                <div className="hidden md:block p-6 border-b border-gray-200">
                  <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
                    <div className="col-span-6">Product</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-center">Total</div>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div
                      key={item?.book}
                      className="p-4 md:p-6 hover:bg-gray-50 transition-colors"
                    >
                      {/* Mobile View */}
                      <div className="md:hidden">
                        <div className="flex gap-4">
                          <div className="relative shrink-0">
                            <img
                              src={item.coverImage?.url}
                              alt={item.title}
                              className="w-16 h-20 object-cover rounded-lg shadow-sm"
                            />
                            {item.featured && (
                              <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-linear-to-r from-orange-500 to-amber-500 text-white text-xs rounded-full">
                                Hot
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link to={`/books/${item?.book}`}>
                              <h3 className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors text-sm line-clamp-2">
                                {item.title}
                              </h3>
                            </Link>
                            <p className="text-xs text-gray-500 mt-1">
                              by {item.authors?.join(", ")}
                            </p>
                            <div className="flex items-center justify-between mt-3">
                              <div className="space-y-1">
                                <div className="font-bold text-gray-900 text-sm">
                                  ₹{item.price?.discounted.toLocaleString()}
                                </div>
                                {item.price?.original &&
                                  item.price.original >
                                    item.price.discounted && (
                                    <div className="text-xs text-gray-400 line-through">
                                      ₹{item.price.original.toLocaleString()}
                                    </div>
                                  )}
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() =>
                                      handleUpdateQuantity(item?.book, -1)
                                    }
                                    className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                    disabled={item.quantity <= 1}
                                  >
                                    <FiMinus className="w-3 h-3" />
                                  </button>
                                  <span className="w-8 text-center font-medium text-sm">
                                    {item?.quantity || 1}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleUpdateQuantity(item?.book, 1)
                                    }
                                    className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                  >
                                    <FiPlus className="w-3 h-3" />
                                  </button>
                                </div>
                                <button
                                  onClick={() => handleRemoveItem(item?.book)}
                                  className="text-red-600 hover:text-red-800 cursor-pointer p-1"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <div className="mt-3 flex justify-between items-center">
                              <span className="text-xs text-gray-500">
                                Total:{" "}
                                <span className="font-bold text-gray-900">
                                  ₹
                                  {(
                                    (item.price?.discounted || 0) *
                                    (item.quantity || 1)
                                  ).toLocaleString()}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Desktop View */}
                      <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                        {/* Product Info */}
                        <div className="col-span-6">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <img
                                src={item.coverImage?.url}
                                alt={item.title}
                                className="w-20 h-24 object-cover rounded-lg shadow-sm"
                              />
                              {item.featured && (
                                <span className="absolute -top-2 -right-2 px-2 py-1 bg-linear-to-r from-orange-500 to-amber-500 text-white text-xs rounded-full">
                                  Hot
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <Link to={`/books/${item?.book}`}>
                                <h3 className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2">
                                  {item.title}
                                </h3>
                              </Link>
                              <p className="text-sm text-gray-500 mt-1 truncate">
                                by {item.authors?.join(", ")}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                Category: {item.category?.name}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="col-span-2 text-center">
                          <div className="space-y-1">
                            <div className="font-bold text-gray-900">
                              ₹{item.price?.discounted.toLocaleString()}
                            </div>
                            {item.price?.original &&
                              item.price.original > item.price.discounted && (
                                <div className="text-sm text-gray-400 line-through">
                                  ₹{item.price.original.toLocaleString()}
                                </div>
                              )}
                          </div>
                        </div>

                        {/* Quantity */}
                        <div className="col-span-2">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item?.book, -1)
                              }
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                              disabled={item.quantity <= 1}
                            >
                              <FiMinus className="w-3 h-3" />
                            </button>
                            <span className="w-12 text-center font-medium">
                              {item?.quantity || 1}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item?.book, 1)
                              }
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                              <FiPlus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Total */}
                        <div className="col-span-2">
                          <div className="text-center">
                            <div className="font-bold text-gray-900">
                              ₹
                              {(
                                (item.price?.discounted || 0) *
                                (item.quantity || 1)
                              ).toLocaleString()}
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item?.book)}
                              className="mt-2 text-sm text-red-600 hover:text-red-800 flex items-center gap-1 justify-center cursor-pointer"
                            >
                              <FiTrash2 className="w-3 h-3" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping */}
                <div className="p-4 md:p-6 border-t border-gray-200">
                  <Link
                    to="/books"
                    className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium text-sm md:text-base"
                  >
                    <FiArrowLeft />
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm text-center">
                  <FiShield className="text-green-600 mx-auto mb-2" size={18} />
                  <div className="text-xs sm:text-sm font-medium text-gray-900">
                    Secure Payment
                  </div>
                  <div className="text-xs text-gray-500">SSL Encrypted</div>
                </div>
                <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm text-center">
                  <FiTruck className="text-blue-600 mx-auto mb-2" size={18} />
                  <div className="text-xs sm:text-sm font-medium text-gray-900">
                    Free Shipping
                  </div>
                  <div className="text-xs text-gray-500">Above ₹499</div>
                </div>
                <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm text-center">
                  <FiCheckCircle
                    className="text-purple-600 mx-auto mb-2"
                    size={18}
                  />
                  <div className="text-xs sm:text-sm font-medium text-gray-900">
                    Easy Returns
                  </div>
                  <div className="text-xs text-gray-500">10 Days Return</div>
                </div>
                <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm text-center">
                  <FiShoppingBag
                    className="text-orange-600 mx-auto mb-2"
                    size={18}
                  />
                  <div className="text-xs sm:text-sm font-medium text-gray-900">
                    Best Prices
                  </div>
                  <div className="text-xs text-gray-500">Price Match</div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:w-96 space-y-6">
              {/* Coupon Section - Mobile Drawer */}
              <div className="block lg:hidden">
                <button
                  onClick={() => setIsCouponOpen(true)}
                  className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-r from-green-100 to-emerald-100 flex items-center justify-center">
                      <FiCheckCircle className="text-green-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">
                        Apply Coupon
                      </div>
                      <div className="text-sm text-gray-500">
                        Save more on your order
                      </div>
                    </div>
                  </div>
                  <FiChevronRight className="text-gray-400" />
                </button>

                {/* Mobile Coupon Drawer */}
                {isCouponOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
                    <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl animate-slide-up">
                      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">
                          Apply Coupon
                        </h3>
                        <button
                          onClick={() => setIsCouponOpen(false)}
                          className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                        >
                          <FiX className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="p-4">
                        <ApplyCoupon onClose={() => setIsCouponOpen(false)} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop Coupon Section */}
              <div className="hidden lg:block">
                <ApplyCoupon />
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 sticky top-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 md:mb-6">
                  Order Summary
                </h3>

                <div className="space-y-3 md:space-y-4">
                  <div className="flex justify-between text-gray-600 text-sm md:text-base">
                    <span>Total</span>
                    <span className="font-medium">
                      ₹{cartData?.data?.originalPriceTotal?.toLocaleString()}
                    </span>
                  </div>

                  {/* Product Discount */}
                  {cart.productDiscountTotal > 0 && (
                    <>
                      <div className="flex justify-between text-gray-600 text-sm md:text-base">
                        <span>Discount</span>
                        <span className="font-medium text-green-600">
                          ({cart.productDiscountPercent}%)
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-600 text-sm md:text-base">
                        <span>You saved</span>
                        <span className="font-medium text-green-600">
                          -₹{cart.productDiscountTotal?.toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}

                  {/* Coupon Discount */}
                  {cart.appliedCoupon && (
                    <div className="flex justify-between text-gray-600 text-sm md:text-base">
                      <span>Coupon</span>
                      <span className="font-medium text-green-600">
                        -₹{cart.appliedCoupon.discountAmount?.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-3 md:pt-4">
                    <div className="flex justify-between text-base md:text-lg font-bold text-gray-900">
                      <span>Total Payable</span>
                      <span>
                        ₹{cartData?.data?.finalPayableAmount?.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs md:text-sm text-gray-500 mt-1">
                      Inclusive of all taxes
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Link
                    to="/checkout"
                    className="block w-full py-3 md:py-3.5 bg-linear-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all text-center shadow-lg text-sm md:text-base"
                  >
                    Proceed to Checkout
                  </Link>

                  <div className="text-center">
                    <img
                      src="https://badges.razorpay.com/badge-light.png"
                      alt="Payment Methods"
                      className="h-6 md:h-8 mx-auto opacity-70"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Secure payment with SSL encryption
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        @media (min-width: 640px) {
          .animate-slide-up {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};

export default CartPage;
