import { useState } from "react";
import {
  BsCart,
  BsSearch,
  BsFilter,
  BsCalendar,
  BsEye,
  BsCheckCircle,
  BsXCircle,
} from "react-icons/bs";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../../app/features/orders/ordersApi";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const Order = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // fetching orders data
  const { data: ordersData } = useGetAllOrdersQuery({
    status: statusFilter,
    date: dateFilter,
    search: searchTerm,
  });
  const orders = ordersData?.data || [];

  // Mutation for updating order status
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  // Status options
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

  // Calculate stats
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.orderStatus === "pending").length,
    processing: orders.filter((o) => o.orderStatus === "processing").length,
    shipped: orders.filter((o) => o.orderStatus === "shipped").length,
    delivered: orders.filter((o) => o.orderStatus === "delivered").length,
    cancelled: orders.filter((o) => o.orderStatus === "cancelled").length,
  };

  const StatusBadge = ({ status }) => {
    const statusConfig = statusOptions.find((s) => s.value === status);
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          statusConfig?.color || "bg-gray-100 text-gray-800"
        }`}
      >
        {statusConfig?.label || status}
      </span>
    );
  };

  const PaymentStatusBadge = ({ status }) => {
    const colors = {
      paid: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      refunded: "bg-red-100 text-red-800",
      failed: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          colors[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

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

  return (
    <div className="min-h-screen">
      <div>
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
                <BsCart className="w-10 h-10 text-indigo-600" />
                Order Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and track customer orders
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-2xl font-bold text-gray-800">
                {ordersData?.meta?.totalOrders}
              </p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-2xl font-bold text-blue-600">
                {stats.processing}
              </p>
              <p className="text-sm text-gray-600">Processing</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-2xl font-bold text-purple-600">
                {stats.shipped}
              </p>
              <p className="text-sm text-gray-600">Shipped</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-2xl font-bold text-green-600">
                {stats.delivered}
              </p>
              <p className="text-sm text-gray-600">Delivered</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-2xl font-bold text-red-600">
                {stats.cancelled}
              </p>
              <p className="text-sm text-gray-600">Cancelled</p>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="relative">
              <BsSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by order #, customer, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>

            <div className="relative">
              <BsFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none bg-white"
              >
                <option value="all">All Status</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <BsCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none bg-white"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-linear-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Order #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders?.map((order) => (
                  <tr
                    key={order?._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-indigo-600">
                        #ORD-{order?._id.slice(-8).toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {order?.payment?.method}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">
                        {order?.customer?.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order?.customer?.email}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-800">
                        {order.items.length} item
                        {order.items.length > 1 ? "s" : ""}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">
                        {order?.items?.map((item) => item.title).join(", ")}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">
                        ₹{Number(order?.pricing?.finalAmount || 0).toFixed(2)}
                      </div>
                      <div className="text-xs">
                        <PaymentStatusBadge status={order?.payment?.status} />
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={order?.orderStatus} />
                      <div className="mt-2">
                        <select
                          value={order?.orderStatus}
                          onChange={(e) =>
                            handleStatusChange(
                              order?._id,
                              e.target.value.toLowerCase(),
                            )
                          }
                          className="text-xs border border-gray-300 rounded-lg px-2 py-1 w-full focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-800">
                        {new Date(order.createdAt).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/dashboard/orders/${order?._id}`}
                          className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <BsEye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() =>
                            handleStatusChange(order?._id, "processing")
                          }
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                          title="Mark as Processing"
                        >
                          <BsCheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(order?._id, "cancelled")
                          }
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Cancel Order"
                        >
                          <BsXCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Empty State */}
                {orders?.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <BsCart className="w-16 h-16 text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          No orders found
                        </h3>
                        <p className="text-gray-600">
                          {searchTerm
                            ? `No orders match "${searchTerm}"`
                            : "No orders in this status"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between text-sm text-gray-600">
          <div>
            Showing <span className="font-semibold">{orders?.length}</span> of{" "}
            <span className="font-semibold">{orders.length}</span> orders
          </div>
          <div className="flex items-center gap-4 mt-2 md:mt-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span>Pending: {stats.pending}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Completed: {stats.delivered}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
