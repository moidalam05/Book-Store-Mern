import { useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCopy,
  FiCheckCircle,
  FiXCircle,
  FiCalendar,
  FiPercent,
  FiDollarSign,
  FiUsers,
  FiChevronRight,
  FiChevronLeft,
  FiEye,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import {
  useDeleteCouponMutation,
  useGetAllCouponsQuery,
  useToggleCouponStatusMutation,
} from "../../../app/features/coupon/couponApi";
import { toast } from "react-hot-toast";
import Loading from "../../../components/Loading";

const Coupon = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const buildQueryParams = () => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
    };

    // status based filters
    if (filterStatus === "active") params.isActive = true;
    if (filterStatus === "inactive") params.isActive = false;
    if (filterStatus === "public") params.isPublic = true;

    // discount type filters
    if (filterStatus === "percentage") params.discountType = "percentage";
    if (filterStatus === "flat") params.discountType = "flat";

    return params;
  };

  // Fetch coupons
  const { data: couponsData, isLoading } =
    useGetAllCouponsQuery(buildQueryParams());
  const coupons = couponsData?.data || [];

  // toggle coupon status
  const [toggleCouponStatus] = useToggleCouponStatusMutation();
  // delete coupon
  const [deleteCoupon] = useDeleteCouponMutation();

  // Pagination calculations
  const totalPages = Math.ceil(coupons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCoupons = coupons.slice(startIndex, startIndex + itemsPerPage);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied coupon code: ${code} to clipboard`);
  };

  const handleDelete = async (id) => {
    const deletePromise = deleteCoupon(id).unwrap();

    toast.promise(deletePromise, {
      loading: "Deleting coupon...",
      success: (res) => res?.message,
      error: (err) => err?.data?.message || "Something went wrong",
    });

    await deletePromise;
  };

  const handleToggleStatus = async (id) => {
    const togglePromise = toggleCouponStatus(id).unwrap();

    toast.promise(togglePromise, {
      loading: "Changing status...",
      success: (res) => res?.message,
      error: (err) => err?.data?.message || "Something went wrong",
    });

    await togglePromise;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Coupon Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and track all discount coupons
              </p>
            </div>
            <button
              onClick={() => navigate("/dashboard/coupon/add")}
              className="px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <FiPlus className="w-5 h-5" />
              <span>Create New Coupon</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Coupons
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {couponsData?.meta?.totalCoupons}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiPercent className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Coupons
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {couponsData?.meta?.activeCoupons}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FiCheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Expired Coupons
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {couponsData?.meta?.expiredCoupons}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <FiXCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Usage Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {couponsData?.meta?.usagePercentage}%
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiUsers className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer ${
                  filterStatus === "all"
                    ? "bg-blue-100 text-blue-700 border border-blue-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                }`}
              >
                <FiEye className="w-4 h-4" />
                All
              </button>

              <button
                onClick={() => setFilterStatus("active")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer ${
                  filterStatus === "active"
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                }`}
              >
                <FiCheckCircle className="w-4 h-4" />
                Active
              </button>

              <button
                onClick={() => setFilterStatus("inactive")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer ${
                  filterStatus === "inactive"
                    ? "bg-red-100 text-red-700 border border-red-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                }`}
              >
                <FiXCircle className="w-4 h-4" />
                Inactive
              </button>

              <button
                onClick={() => setFilterStatus("public")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer ${
                  filterStatus === "public"
                    ? "bg-cyan-100 text-cyan-700 border border-cyan-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                }`}
              >
                <FiUsers className="w-4 h-4" />
                Public
              </button>

              <button
                onClick={() => setFilterStatus("percentage")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer ${
                  filterStatus === "percentage"
                    ? "bg-purple-100 text-purple-700 border border-purple-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                }`}
              >
                <FiPercent className="w-4 h-4" />
                Percentage
              </button>

              <button
                onClick={() => setFilterStatus("flat")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer ${
                  filterStatus === "flat"
                    ? "bg-orange-100 text-orange-700 border border-orange-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                }`}
              >
                <FiDollarSign className="w-4 h-4" />
                Flat
              </button>
            </div>
          </div>
        </div>

        {/* Coupons Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Validity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedCoupons.map((coupon) => (
                  <tr
                    key={coupon?._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded">
                          {coupon.code}
                        </span>
                        <button
                          onClick={() => handleCopyCode(coupon?.code)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors cursor-pointer"
                          title="Copy code"
                        >
                          <FiCopy className="w-4 h-4 text-gray-500 " />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {coupon.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Min order: ₹{coupon.minimumCartValue} Max discount: ₹
                          {coupon.maxDiscountAmount
                            ? coupon.maxDiscountAmount
                            : coupon.discountValue}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {coupon.discountType === "percentage" ? (
                          <>
                            <span className="font-semibold text-green-700">
                              {coupon.discountValue}%
                            </span>
                            {coupon.maxDiscount && (
                              <span className="text-xs text-gray-500">
                                (Max ₹{coupon.maxDiscount})
                              </span>
                            )}
                          </>
                        ) : (
                          <>
                            <span className="font-semibold text-blue-700">
                              ₹{coupon.discountValue}
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-900">
                            {formatDate(coupon.endDate)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-900">
                            {coupon.usedCount}
                          </span>
                          <span className="text-gray-500">
                            of {coupon.usageLimit || "∞"}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${Math.min(100, (coupon.usedCount / (coupon.usageLimit || coupon.usedCount + 1)) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          coupon.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {coupon.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/dashboard/coupon/edit/${coupon?._id}`}
                          className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors "
                          title="Edit"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleToggleStatus(coupon?._id)}
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${
                            coupon.isActive
                              ? "hover:bg-orange-100 text-orange-600"
                              : "hover:bg-green-100 text-green-600"
                          }`}
                          title={coupon.isActive ? "Deactivate" : "Activate"}
                        >
                          {coupon.isActive ? (
                            <FiXCircle className="w-4 h-4" />
                          ) : (
                            <FiCheckCircle className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(coupon?._id)}
                          className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {paginatedCoupons.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FiPercent className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No coupons found
              </h3>
              <p className="text-gray-500 mb-6">
                {filterStatus !== "all"
                  ? "Try changing your search or filter criteria"
                  : "Get started by creating your first coupon"}
              </p>
              {filterStatus === "all" && (
                <button
                  onClick={() => navigate("/dashboard/coupon/add")}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create First Coupon
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {paginatedCoupons.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(startIndex + itemsPerPage, coupons.length)}
                  </span>{" "}
                  of <span className="font-medium">{coupons.length}</span>{" "}
                  results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FiChevronLeft className="w-5 h-5" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1.5 rounded-lg transition-colors ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Coupon;
