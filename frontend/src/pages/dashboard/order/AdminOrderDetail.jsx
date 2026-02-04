import { Link, useParams } from "react-router-dom";
import {
  FiPackage,
  FiShoppingBag,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiPhone,
  FiMail,
  FiChevronLeft,
  FiTag,
  FiCreditCard,
  FiXCircle,
  FiUser,
  FiCalendar,
  FiDownload,
  FiMessageSquare,
  FiAlertCircle,
} from "react-icons/fi";
import {
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
} from "../../../app/features/orders/ordersApi";
import { toast } from "react-hot-toast";

const STATUS_STEPS = [
  {
    key: "confirmed",
    label: "Order Confirmed",
    icon: FiShoppingBag,
    color: "blue",
  },
  { key: "processing", label: "Processing", icon: FiPackage, color: "amber" },
  { key: "shipped", label: "Shipped", icon: FiTruck, color: "purple" },
  {
    key: "delivered",
    label: "Delivered",
    icon: FiCheckCircle,
    color: "emerald",
  },
  { key: "cancelled", label: "Cancelled", icon: FiXCircle, color: "red" },
];

const AdminOrderDetail = () => {
  const { id: orderId } = useParams();
  const { data, isLoading } = useGetOrderByIdQuery(orderId);
  const order = data?.data;
  const totalItems = order?.items?.reduce((s, i) => s + i.quantity, 0);

  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const handleStatusChange = async (orderId, newStatus) => {
    const promise = updateOrderStatus({
      orderId,
      orderStatus: newStatus,
    }).unwrap();

    toast.promise(promise, {
      loading: "Updating status...",
      success: (res) => res.message,
      error: (err) => err?.data?.message || "Something went wrong",
    });

    await promise;
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "confirmed":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
          icon: FiClock,
          color: "blue",
        };
      case "processing":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
          icon: FiPackage,
          color: "amber",
        };
      case "shipped":
        return {
          bg: "bg-purple-50",
          text: "text-purple-700",
          border: "border-purple-200",
          icon: FiTruck,
          color: "purple",
        };
      case "delivered":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
          icon: FiCheckCircle,
          color: "emerald",
        };
      case "cancelled":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
          icon: FiXCircle,
          color: "red",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          icon: FiClock,
          color: "gray",
        };
    }
  };

  const getPaymentStatusConfig = (status) => {
    switch (status) {
      case "paid":
        return {
          bg: "bg-emerald-100",
          text: "text-emerald-800",
          icon: FiCheckCircle,
        };
      case "failed":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          icon: FiXCircle,
        };
      case "pending":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          icon: FiClock,
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          icon: FiAlertCircle,
        };
    }
  };

  const statusOptions = [
    {
      value: "pending",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "processing",
      label: "Processing",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "shipped",
      label: "Shipped",
      color: "bg-purple-100 text-purple-800",
    },
    {
      value: "delivered",
      label: "Delivered",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "cancelled",
      label: "Cancelled",
      color: "bg-red-100 text-red-800",
    },
  ];

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

  const statusConfig = getStatusConfig(order.orderStatus);
  const StatusIcon = statusConfig.icon;
  const paymentStatusConfig = getPaymentStatusConfig(order.payment.status);
  const PaymentStatusIcon = paymentStatusConfig.icon;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header with Admin Actions */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <Link
              to="/dashboard/orders"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm w-fit"
            >
              <FiChevronLeft className="mr-1" />
              Back to Orders
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-indigo-600">
                    #ORD-{order._id.slice(-8).toUpperCase()}
                  </h1>
                  <div
                    className={`px-3 py-1.5 rounded-full ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} flex items-center gap-2 font-medium text-sm`}
                  >
                    <StatusIcon size={14} />
                    {order.orderStatus.charAt(0).toUpperCase() +
                      order.orderStatus.slice(1)}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <FiCalendar size={12} />
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {order.orderStatus === "cancelled" && order?.cancelledAt && (
                    <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-medium">
                      <FiXCircle size={12} />
                      Cancelled on{" "}
                      {new Date(order.cancelledAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  )}

                  {order.orderStatus === "delivered" && order?.deliveredAt && (
                    <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium">
                      <FiCheckCircle size={12} />
                      Delivered on{" "}
                      {new Date(order.deliveredAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  ₹{order.pricing.finalAmount}
                </div>
                <p className="text-sm text-gray-600">
                  {totalItems} item{totalItems !== 1 ? "s" : ""} •{" "}
                  {order.payment.method}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FiUser />
                  Customer Information
                </h3>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Customer Details
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium">{order?.customer?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium flex items-center gap-2">
                          <FiMail size={14} className="text-gray-400" />
                          {order?.customer?.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium flex items-center gap-2">
                          <FiPhone size={14} className="text-gray-400" />
                          {order?.customer?.phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Shipping Address
                    </h4>
                    <div className="space-y-1.5 text-sm text-gray-700">
                      <p className="font-semibold text-gray-900">
                        {order?.customer?.name}
                      </p>

                      <p>{order?.shippingAddress?.addressLine1}</p>

                      {order?.shippingAddress?.addressLine2 && (
                        <p>{order.shippingAddress.addressLine2}</p>
                      )}

                      <p>
                        {order?.shippingAddress?.city},{" "}
                        {order?.shippingAddress?.state} –{" "}
                        {order?.shippingAddress?.pincode}
                      </p>

                      <p className="text-gray-600">
                        {order?.shippingAddress?.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Order Items
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {order?.items?.map((item) => {
                      return (
                        <tr key={item?.product} className="hover:bg-gray-50">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                <img
                                  src={item?.coverImage?.url}
                                  alt={item?.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {item?.title}
                                </p>
                                {
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mt-1">
                                    % OFF
                                  </span>
                                }
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {item?.category?.name}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-700 font-medium">
                            {item?.quantity}
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-gray-900 font-medium">
                              ₹{item?.discountedPrice}
                            </div>
                            {
                              <div className="text-sm text-gray-400 line-through">
                                ₹{item?.originalPrice}
                              </div>
                            }
                          </td>
                          <td className="py-4 px-6 text-gray-900 font-bold">
                            ₹{item?.subtotal}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Status & Actions */}
          <div className="space-y-6">
            {/* Order Status & Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Order Status & Timeline
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Status</span>
                  <div
                    className={`px-3 py-1.5 rounded-full ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} text-sm font-medium`}
                  >
                    {order.orderStatus.toUpperCase()}
                  </div>
                </div>

                <div className="space-y-3">
                  {STATUS_STEPS.map((step) => {
                    const StepIcon = step.icon;
                    const isActive = step.key === order.orderStatus;
                    const isCompleted =
                      STATUS_STEPS.findIndex(
                        (s) => s.key === order.orderStatus,
                      ) >= STATUS_STEPS.findIndex((s) => s.key === step.key);

                    return (
                      <div key={step.key} className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isActive
                              ? `bg-${step.color}-100 text-${step.color}-600`
                              : isCompleted
                                ? `bg-${step.color}-50 text-${step.color}-500`
                                : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          <StepIcon size={14} />
                        </div>
                        <div className="flex-1">
                          <p
                            className={`text-sm font-medium ${isActive ? "text-gray-900" : "text-gray-600"}`}
                          >
                            {step.label}
                          </p>
                          {isActive && (
                            <p className="text-xs text-gray-500 mt-1">
                              {order.orderStatus === "cancelled" &&
                              order.cancelledAt
                                ? `Cancelled on ${new Date(order.cancelledAt).toLocaleDateString()}`
                                : order.orderStatus === "delivered"
                                  ? "Order delivered successfully"
                                  : "Currently at this stage"}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Order Status
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Update the current status
                    </p>
                  </div>

                  <div className="relative w-48">
                    <select
                      value={order?.orderStatus}
                      onChange={(e) =>
                        handleStatusChange(
                          order?._id,
                          e.target.value.toLowerCase(),
                        )
                      }
                      className="w-full appearance-none bg-white border border-gray-300 rounded-lg py-2.5 pl-3 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                <FiCreditCard className="inline mr-2" />
                Payment Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {order.payment.method}
                    </p>
                    <p className="text-sm text-gray-600">Payment Method</p>
                  </div>
                  <div
                    className={`px-3 py-1.5 rounded-full ${paymentStatusConfig.bg} ${paymentStatusConfig.text} text-sm font-medium flex items-center gap-1.5`}
                  >
                    <PaymentStatusIcon size={12} />
                    {order.payment.status.toUpperCase()}
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment ID</span>
                    <span className="font-mono font-medium text-gray-900">
                      {order.payment.razorpay?.paymentId || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Order ID</span>
                    <span className="font-mono font-medium text-gray-900">
                      {order.payment.razorpay?.orderId || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-4 mb-6">
                Order Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Subtotal</span>
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

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total Amount</span>
                    <span>₹{order.pricing.finalAmount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
