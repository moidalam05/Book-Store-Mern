import { useState } from "react";
import { useGetMyOrdersQuery } from "../../app/features/orders/ordersApi";
import { Link } from "react-router-dom";
import {
  FiPackage,
  FiCalendar,
  FiDollarSign,
  FiChevronRight,
  FiTruck,
  FiClock,
  FiCheckCircle,
  FiFilter,
  FiSearch,
  FiChevronDown,
} from "react-icons/fi";

const OrderPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("latest");

  const { data: allOrders, isLoading } = useGetMyOrdersQuery({
    status: statusFilter,
    range: dateFilter,
    sort: sortBy,
    year: 2026,
  });

  const orders = allOrders?.data || [];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "confirmed", label: "Confirmed" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const dateOptions = [
    { value: "all", label: "All Time" },
    { value: "30d", label: "Last 30 Days" },
    { value: "6m", label: "Last 90 Days" },
  ];

  const sortOptions = [
    { value: "latest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "priceHigh", label: "Price: High to Low" },
    { value: "priceLow", label: "Price: Low to High" },
  ];

  const getStatusColor = (status) => {
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
          icon: FiClock,
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <h3 className="mt-6 text-lg font-semibold text-gray-900">
              Loading Orders
            </h3>
            <p className="mt-2 text-gray-600">Fetching your order history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">
            Track, return, or buy things again
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders by ID or product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiFilter className="mr-2" />
              Filters
              <FiChevronDown
                className={`ml-2 transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none w-full lg:w-auto px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white pr-10"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setStatusFilter(option.value)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        statusFilter === option.value
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Date
                </label>
                <div className="flex flex-wrap gap-2">
                  {dateOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setDateFilter(option.value)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        dateFilter === option.value
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{orders.length}</span> of{" "}
            <span className="font-semibold">{orders.length}</span> orders
          </p>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => {
            const statusConfig = getStatusColor(order.orderStatus);
            const StatusIcon = statusConfig.icon;
            const totalItems = order.items.reduce(
              (sum, item) => sum + item.quantity,
              0,
            );

            return (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <div
                          className={`px-3 py-1 rounded-full ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} flex items-center gap-1.5 text-sm font-medium`}
                        >
                          <StatusIcon size={14} />
                          {order.orderStatus.charAt(0).toUpperCase() +
                            order.orderStatus.slice(1)}
                        </div>
                        <span className="text-sm text-gray-500">
                          <FiCalendar className="inline mr-1" />
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Order ID:{" "}
                        <span className="font-mono font-medium">
                          {order._id.slice(-8).toUpperCase()}
                        </span>
                      </p>
                    </div>

                    <Link
                      to={`/orders/${order._id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      View Order Details
                      <FiChevronRight className="ml-1" />
                    </Link>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={item.product}
                        className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                      >
                        {/* Product Image */}
                        <div className="shrink-0">
                          <div className="w-20 h-20 bg-gray-100 overflow-hidden border border-gray-200">
                            <img
                              src={item.coverImage.url}
                              alt={item.title}
                              className="w-full h-full"
                            />
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            Category:{" "}
                            <span className="font-medium">
                              {item.category.name}
                            </span>
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-700">
                              Quantity:{" "}
                              <span className="font-medium">
                                {item.quantity}
                              </span>
                            </span>
                            <div className="flex items-center gap-2">
                              {item.originalPrice !== item.discountedPrice && (
                                <span className="text-gray-400 line-through">
                                  <FiDollarSign className="inline" size={12} />
                                  {item.originalPrice}
                                </span>
                              )}
                              <span className="text-gray-900 font-semibold">
                                <FiDollarSign className="inline" size={12} />
                                {item.discountedPrice}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Payment Info */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center gap-4">
                          <span>
                            Payment Method:{" "}
                            <span className="font-medium">
                              {order.payment.method}
                            </span>
                          </span>
                          <span className="flex items-center">
                            <div
                              className={`w-2 h-2 rounded-full mr-2 ${
                                order.payment.status === "paid"
                                  ? "bg-green-500"
                                  : order.payment.status === "failed"
                                    ? "bg-red-500"
                                    : "bg-yellow-500"
                              }`}
                            ></div>
                            {order.payment.status.charAt(0).toUpperCase() +
                              order.payment.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600">
                        Total Items:{" "}
                        <span className="font-medium">{totalItems}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results Message */}
        {orders.length === 0 && (
          <div className="text-center py-12">
            <FiSearch size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter to find what you're looking
              for.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setDateFilter("all");
              }}
              className="mt-4 px-6 py-2.5 text-blue-600 font-medium hover:text-blue-800 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
