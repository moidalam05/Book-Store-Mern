import { useEffect, useState } from "react";
import { useVerifyOrderMutation } from "../../app/features/orders/ordersApi";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiCheckCircle,
  FiXCircle,
  FiShoppingBag,
  FiClock,
  FiChevronRight,
  FiHome,
  FiCalendar,
  FiCreditCard,
  FiPackage,
} from "react-icons/fi";
import Confetti from "react-confetti";

const OrderConfirmation = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [verifyOrder, { isLoading }] = useVerifyOrderMutation(orderId, {
    skip: !orderId,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!orderId) {
      navigate("/");
      return;
    }

    const verifyOrderHandler = async () => {
      try {
        const res = await verifyOrder(orderId);
        if (res?.data) {
          setOrder(res.data);
          if (res.data.data.orderStatus === "confirmed") {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
          }
        }
      } catch (error) {
        console.error("Error verifying order:", error.message);
      }
    };

    verifyOrderHandler();
  }, [orderId, verifyOrder, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-16 h-16 border-3 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            <FiShoppingBag
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600"
              size={20}
            />
          </div>
          <h3 className="mt-6 text-lg font-semibold text-gray-900">
            Verifying Order
          </h3>
          <p className="mt-2 text-sm text-gray-600">Please wait...</p>
        </div>
      </div>
    );
  }

  const orderStatus = order?.data?.orderStatus;
  const isConfirmed = orderStatus === "confirmed";
  const isCancelled = orderStatus === "cancelled";

  return (
    <div className="min-h-screen">
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={150}
          gravity={0.15}
        />
      )}

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className={`relative ${isConfirmed ? "animate-bounce" : ""}`}>
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center border-8 ${
                  isConfirmed
                    ? "border-green-100 bg-green-50"
                    : isCancelled
                      ? "border-red-100 bg-red-50"
                      : "border-blue-100 bg-blue-50"
                }`}
              >
                {isConfirmed ? (
                  <FiCheckCircle className="w-16 h-16 text-green-600" />
                ) : isCancelled ? (
                  <FiXCircle className="w-16 h-16 text-red-600" />
                ) : (
                  <FiClock className="w-16 h-16 text-blue-600" />
                )}
              </div>
            </div>
          </div>

          <h1
            className={`text-2xl font-bold mb-3 ${
              isConfirmed
                ? "text-green-700"
                : isCancelled
                  ? "text-red-700"
                  : "text-blue-700"
            }`}
          >
            {isConfirmed
              ? "Order Confirmed"
              : isCancelled
                ? "Order Cancelled"
                : "Order Processing"}
          </h1>

          <p className="text-gray-600 mb-4">
            {isConfirmed
              ? "Thank you for your purchase. Your order has been confirmed."
              : isCancelled
                ? "Your order has been cancelled. Contact support if needed."
                : "Your order is being processed. We'll notify you soon."}
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200">
            <FiShoppingBag className="text-gray-500" size={16} />
            <span className="text-sm font-medium text-gray-900">
              Order #{orderId?.slice(-8).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Order Details
            </h2>

            <div className="space-y-5">
              {/* Status */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isConfirmed
                        ? "bg-green-50"
                        : isCancelled
                          ? "bg-red-50"
                          : "bg-blue-50"
                    }`}
                  >
                    <FiPackage
                      className={
                        isConfirmed
                          ? "text-green-600"
                          : isCancelled
                            ? "text-red-600"
                            : "text-blue-600"
                      }
                      size={18}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p
                      className={`font-medium ${
                        isConfirmed
                          ? "text-green-700"
                          : isCancelled
                            ? "text-red-700"
                            : "text-blue-700"
                      }`}
                    >
                      {orderStatus?.charAt(0).toUpperCase() +
                        orderStatus?.slice(1)}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isConfirmed
                      ? "bg-green-100 text-green-700"
                      : isCancelled
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {orderStatus?.toUpperCase()}
                </span>
              </div>

              {/* Payment */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      order?.data?.payment?.status === "paid"
                        ? "bg-green-50"
                        : "bg-red-50"
                    }`}
                  >
                    <FiCreditCard
                      className={
                        order?.data?.payment?.status === "paid"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                      size={18}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment</p>
                    <p
                      className={`font-medium ${
                        order?.data?.payment?.status === "paid"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {order?.data?.payment?.status?.charAt(0).toUpperCase() +
                        order?.data?.payment?.status?.slice(1)}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order?.data?.payment?.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order?.data?.payment?.status?.toUpperCase()}
                </span>
              </div>

              {/* Date */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <FiCalendar className="text-gray-600" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(order?.data?.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Price</span>
                  <span className="text-lg font-semibold text-gray-900">
                    ₹
                    {order?.data?.pricing?.finalAmount?.toLocaleString() || "0"}
                  </span>
                </div>
                {order?.data?.pricing?.total && (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">Total Price</span>
                    <span className="text-sm text-gray-600">
                      ₹{order?.data?.pricing?.total?.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/orders"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiShoppingBag size={16} />
            View Orders
            <FiChevronRight size={16} />
          </Link>

          <Link
            to="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FiHome size={16} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
