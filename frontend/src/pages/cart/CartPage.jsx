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
} from "react-icons/fi";
import {
  useClearCartMutation,
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartMutation,
} from "../../app/features/cart/cartApi.js";
import ApplyCoupon from "./ApplyCoupon.jsx";
import { toast } from "react-hot-toast";

const CartPage = () => {
  const { data: cartData, isLoading } = useGetCartQuery();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [clearCart] = useClearCartMutation();
  const [updateCart] = useUpdateCartMutation();

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
    const clearPromise = clearCart().unwrap();
    toast.promise(clearPromise, {
      loading: "Clearing cart...",
      success: (res) => res?.message || "Cart cleared successfully",
      error: (err) => err?.data?.message || "Failed to clear cart",
    });

    await clearPromise;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="h-8 w-48 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
            <div className="h-64 bg-gray-100 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-1">
              {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your
              cart
            </p>
          </div>

          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-red-500 to-rose-500 text-white font-medium rounded-xl hover:from-red-600 hover:to-rose-600 transition-all shadow-md cursor-pointer"
            >
              <FiTrash2 />
              Clear Cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-linear-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiShoppingBag className="text-blue-600" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any books to your cart yet. Start
              exploring our collection!
            </p>
            <Link
              to="/books"
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
            >
              <FiShoppingBag />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
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
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Product Info */}
                        <div className="col-span-6">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <img
                                src={item.coverImage?.url}
                                alt={item.title}
                                className="w-20 h-24 shadow-sm"
                              />
                              {item.featured && (
                                <span className="absolute -top-2 -right-2 px-2 py-1 bg-linear-to-r from-orange-500 to-amber-500 text-white text-xs rounded-full">
                                  Hot
                                </span>
                              )}
                            </div>
                            <div className="flex-1">
                              <Link to={`/books/${item?.book}`}>
                                <h3 className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
                                  {item.title}
                                </h3>
                              </Link>
                              <p className="text-sm text-gray-500 mt-1">
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
                <div className="p-6 border-t border-gray-200">
                  <Link
                    to="/books"
                    className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    <FiArrowLeft />
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                  <FiShield className="text-green-600 mx-auto mb-2" size={20} />
                  <div className="text-sm font-medium text-gray-900">
                    Secure Payment
                  </div>
                  <div className="text-xs text-gray-500">SSL Encrypted</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                  <FiTruck className="text-blue-600 mx-auto mb-2" size={20} />
                  <div className="text-sm font-medium text-gray-900">
                    Free Shipping
                  </div>
                  <div className="text-xs text-gray-500">Above ₹499</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                  <FiCheckCircle
                    className="text-purple-600 mx-auto mb-2"
                    size={20}
                  />
                  <div className="text-sm font-medium text-gray-900">
                    Easy Returns
                  </div>
                  <div className="text-xs text-gray-500">10 Days Return</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                  <FiShoppingBag
                    className="text-orange-600 mx-auto mb-2"
                    size={20}
                  />
                  <div className="text-sm font-medium text-gray-900">
                    Best Prices
                  </div>
                  <div className="text-xs text-gray-500">Price Match</div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              {/* Coupon Section */}
              <ApplyCoupon />
              {/* Order Summary */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">
                  Order Summary
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Total</span>
                    <span className="font-medium">
                      ₹{cartData?.data?.originalPriceTotal}
                    </span>
                  </div>

                  {/* Product Discount */}
                  {cart.productDiscountTotal > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Discount</span>
                      <span className="font-medium text-green-600">
                        ({cart.productDiscountPercent}%)
                      </span>
                    </div>
                  )}

                  {cart.productDiscountTotal > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>You saved</span>
                      <span className="font-medium text-green-600">
                        -₹{cart.productDiscountTotal}
                      </span>
                    </div>
                  )}

                  {/* Coupon Discount */}
                  {cart.appliedCoupon && (
                    <div className="flex justify-between text-gray-600">
                      <span>Coupon</span>
                      <span className="font-medium text-green-600">
                        -₹
                        {cart.appliedCoupon.discountAmount}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total Payable</span>
                      <span>₹{cartData?.data?.finalPayableAmount}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Inclusive of all taxes
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Link
                    to="/checkout"
                    className="block w-full py-3.5 bg-linear-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all text-center shadow-lg"
                  >
                    Proceed to Checkout
                  </Link>

                  <div className="text-center">
                    <img
                      src="https://badges.razorpay.com/badge-light.png"
                      alt="Payment Methods"
                      className="h-8 mx-auto opacity-70"
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
    </div>
  );
};

export default CartPage;
