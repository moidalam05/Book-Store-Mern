import { Link, useParams } from "react-router-dom";
import {
  useCancelOrderMutation,
  useGetMyOrderByIdQuery,
} from "../../app/features/orders/ordersApi";
import { toast } from "react-hot-toast";
import {
  FiPackage,
  FiShoppingBag,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiPhone,
  FiMail,
  FiChevronLeft,
  FiTag,
  FiCreditCard,
  FiXCircle,
  FiPercent,
} from "react-icons/fi";

const STATUS_STEPS = [
  { key: "confirmed", label: "Order Confirmed", icon: FiShoppingBag },
  { key: "processing", label: "Processing", icon: FiPackage },
  { key: "shipped", label: "Shipped", icon: FiTruck },
  { key: "delivered", label: "Delivered", icon: FiCheckCircle },
];

const OrderDetail = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetMyOrderByIdQuery(id);
  const order = data?.data;

  const [cancelOrder] = useCancelOrderMutation();
  const totalItems = order?.items?.reduce((s, i) => s + i.quantity, 0);

  const cancelOrderHandler = async () => {
    const cancelOrderPromise = cancelOrder(id);

    toast.promise(cancelOrderPromise, {
      loading: "Cancelling order...",
      success: (res) => res?.message,
      error: (err) => err?.data?.message || "Something went wrong",
    });
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "confirmed":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
          icon: FiClock,
        };
      case "processing":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
          icon: FiPackage,
        };
      case "shipped":
        return {
          bg: "bg-purple-50",
          text: "text-purple-700",
          border: "border-purple-200",
          icon: FiTruck,
        };
      case "delivered":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
          icon: FiCheckCircle,
        };
      case "cancelled":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
          icon: FiXCircle,
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          icon: FiClock,
        };
    }
  };

  const getPaymentStatusConfig = (status) => {
    switch (status) {
      case "paid":
        return {
          bg: "bg-emerald-100",
          text: "text-emerald-800",
        };
      case "failed":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
        };
      default:
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
        };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <FiXCircle className="text-red-600 text-2xl" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Order Not Found
        </h2>
        <p className="text-gray-600 text-center max-w-sm mb-6">
          The order you're looking for doesn't exist or you don't have
          permission to view it.
        </p>
        <Link
          to="/orders"
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiChevronLeft />
          Back to Orders
        </Link>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.orderStatus);
  const StatusIcon = statusConfig.icon;
  const currentStepIndex = STATUS_STEPS.findIndex(
    (step) => step.key === order.orderStatus,
  );
  const paymentStatusConfig = getPaymentStatusConfig(order.payment.status);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/orders"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-4 text-sm"
          >
            <FiChevronLeft className="mr-1" />
            Back to Orders
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Order Details
              </h1>
              <p className="text-gray-600 mt-1 text-sm">
                Order ID:{" "}
                <span className="font-mono font-medium">{order._id}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              {order.orderStatus !== "cancelled" ? (
                <>
                  <div
                    className={`px-4 py-2 rounded-full ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} flex items-center gap-2 font-medium text-sm`}
                  >
                    <StatusIcon size={14} />
                    {order.orderStatus.toUpperCase()}
                  </div>
                  <div className="text-sm text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <div
                    className={`px-4 py-2 rounded-full ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} flex items-center gap-2 font-medium text-sm`}
                  >
                    <StatusIcon size={14} />
                    CANCELLED
                  </div>
                  {order.cancelledAt && (
                    <div className="text-sm text-gray-500">
                      Cancelled on{" "}
                      {new Date(order.cancelledAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Tracker */}
        {order.orderStatus !== "cancelled" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Track Your Order
            </h3>

            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-0 right-0 top-4 h-0.5 bg-gray-200 -translate-y-1/2 z-0">
                <div
                  className="h-full bg-blue-600 transition-all duration-500"
                  style={{
                    width: `${((currentStepIndex + 1) / STATUS_STEPS.length) * 100}%`,
                  }}
                />
              </div>

              {/* Steps */}
              <div className="relative flex justify-between z-10">
                {STATUS_STEPS.map((step, index) => {
                  const StepIcon = step.icon;
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;

                  return (
                    <div key={step.key} className="flex flex-col items-center">
                      <div
                        className={`
                        w-8 h-8 rounded-full flex items-center justify-center mb-2
                        ${isCompleted ? "bg-blue-600 text-white" : "bg-white border-2 border-gray-300 text-gray-400"}
                        ${isCurrent ? "ring-4 ring-blue-100" : ""}
                      `}
                      >
                        <StepIcon size={14} />
                      </div>
                      <div className="text-center max-w-20">
                        <p
                          className={`text-xs font-medium ${isCompleted ? "text-blue-600" : "text-gray-500"}`}
                        >
                          {step.label}
                        </p>
                        {index <= currentStepIndex && (
                          <div className="mt-1">
                            <div className="w-1 h-1 bg-blue-600 rounded-full mx-auto" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Items & Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Order Items ({totalItems})
                </h3>
              </div>

              <div className="divide-y divide-gray-100">
                {order.items.map((item, index) => {
                  const discountPercentage =
                    item.originalPrice !== item.discountedPrice
                      ? Math.round(
                          ((item.originalPrice - item.discountedPrice) /
                            item.originalPrice) *
                            100,
                        )
                      : 0;

                  return (
                    <div key={index} className="p-6">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="shrink-0">
                          <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                            <img
                              src={item.coverImage?.url}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 text-lg mb-1">
                                {item.title}
                              </h4>
                              <p className="text-sm text-gray-600 mb-2">
                                Category:{" "}
                                <span className="font-medium">
                                  {item.category?.name}
                                </span>
                              </p>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="text-gray-700">
                                  Quantity:{" "}
                                  <span className="font-medium">
                                    {item.quantity}
                                  </span>
                                </span>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              {discountPercentage > 0 && (
                                <div className="flex items-center justify-end gap-2 mb-1">
                                  <span className="text-gray-400 line-through text-sm">
                                    ₹{item.originalPrice}
                                  </span>
                                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                                    <FiPercent
                                      className="inline mr-1"
                                      size={10}
                                    />
                                    {discountPercentage}% OFF
                                  </span>
                                </div>
                              )}
                              <div className="text-lg font-bold text-gray-900">
                                ₹{item.discountedPrice}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {item.quantity} × ₹{item.discountedPrice}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery & Payment Info */}
              <div className="border-t border-gray-200">
                {/* Delivery Address */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                      <FiMapPin className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Delivery Address
                      </h4>
                      <div className="text-gray-700 space-y-1">
                        <p className="font-medium">{order.customer.name}</p>
                        <p>{order.shippingAddress.addressLine1}</p>
                        {order.shippingAddress.addressLine2 && (
                          <p>{order.shippingAddress.addressLine2}</p>
                        )}
                        <p>
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state} -{" "}
                          {order.shippingAddress.pincode}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="flex items-center gap-1 text-gray-600">
                            <FiPhone size={12} />
                            {order.customer.phone}
                          </span>
                          <span className="flex items-center gap-1 text-gray-600">
                            <FiMail size={12} />
                            {order.customer.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                      <FiCreditCard className="text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">
                            Payment Information
                          </h4>
                          <p className="text-gray-600">
                            {order.payment.method} •{" "}
                            <span className="capitalize">
                              {order.payment.status}
                            </span>
                          </p>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full ${paymentStatusConfig.bg} ${paymentStatusConfig.text} text-sm font-medium`}
                        >
                          {order.payment.status.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Price Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-4 mb-6">
                Price Details
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-700">
                  <span>Price ({totalItems} items)</span>
                  <span className="font-medium">₹{order.pricing.total}</span>
                </div>

                {order.coupon?.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <FiTag size={12} />
                      Coupon Discount
                    </span>
                    <span className="font-medium">
                      -₹{order.coupon.discountAmount}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-green-600">
                  <span>Total Discount</span>
                  <span className="font-medium">
                    -₹{order.pricing.discount}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total Amount</span>
                    <span>₹{order.pricing.finalAmount}</span>
                  </div>
                </div>
              </div>

              {order.orderStatus !== "cancelled" && (
                <button
                  onClick={cancelOrderHandler}
                  className="mt-6 w-full px-4 py-3 border border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                >
                  Cancel Order
                </button>
              )}
            </div>

            {/* Order Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Information
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date</span>
                  <span className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {order.cancelledAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cancelled Date</span>
                    <span className="font-medium text-red-600">
                      {new Date(order.cancelledAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Help Links */}
              <div className="mt-6 space-y-3">
                <button className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-left text-sm">
                  Need Help?
                </button>
                <button className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-left text-sm">
                  Return/Replace
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
