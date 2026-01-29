import { useState } from "react";
import {
  BsFilter,
  BsPlus,
  BsCheckCircle,
  BsXCircle,
  BsStar,
  BsFire,
  BsPencil,
  BsTrash,
} from "react-icons/bs";
import Loading from "../../../components/Loading";
import {
  FiCpu,
  FiActivity,
  FiBookOpen,
  FiFileText,
  FiTrendingUp,
  FiBriefcase,
  FiDollarSign,
  FiCode,
  FiClock,
  FiUser,
  FiBook,
  FiHeart,
  FiSmile,
  FiSun,
  FiImage,
  FiStar,
  FiEye,
  FiFeather,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  useDeleteCategoryMutation,
  useFetchAllCategoriesQuery,
  useUpdateCategoryStatusMutation,
} from "../../../app/features/category/categoryApi";

// Icon mapping for category icons
const iconComponents = {
  FiCpu: FiCpu,
  FiActivity: FiActivity,
  FiBookOpen: FiBookOpen,
  FiFileText: FiFileText,
  FiTrendingUp: FiTrendingUp,
  FiBriefcase: FiBriefcase,
  FiDollarSign: FiDollarSign,
  FiCode: FiCode,
  FiClock: FiClock,
  FiUser: FiUser,
  FiBook: FiBook,
  FiHeart: FiHeart,
  FiSmile: FiSmile,
  FiSun: FiSun,
  FiImage: FiImage,
  FiStar: FiStar,
  FiEye: FiEye,
  FiFeather: FiFeather,
};

const Category = () => {
  const [filters, setFilters] = useState({
    isActive: "",
    isFeatured: "",
    isTrending: "",
    sortBy: "sortOrder",
  });

  const [showFilters, setShowFilters] = useState(false);

  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(
      ([_, value]) => value !== "" && value !== undefined,
    ),
  );

  const { data, isLoading, refetch } = useFetchAllCategoriesQuery(cleanFilters);
  const categories = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 20 };

  const [deleteCategory] = useDeleteCategoryMutation();
  const [updateCategoryStatus] = useUpdateCategoryStatusMutation();

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const resetFilters = () => {
    setFilters({
      isActive: "",
      isFeatured: "",
      isTrending: "",
      sortBy: "sortOrder",
    });
    setShowFilters(false);
  };

  // Delete category handler
  const handleDeleteCategory = async (categoryId) => {
    const deletePromise = deleteCategory(categoryId).unwrap();

    toast.promise(deletePromise, {
      loading: "Deleting category...",
      success: (res) => res?.message,
      error: (err) => err?.data?.message || "Something went wrong",
    });

    await deletePromise;
  };

  // Toggle category status
  const toggleStatus = async (categoryId) => {
    const togglePromise = updateCategoryStatus(categoryId).unwrap();

    toast.promise(togglePromise, {
      loading: "Updating status...",
      success: (res) => res?.message,
      error: (err) => err?.data?.message || "Something went wrong",
    });

    await togglePromise;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Manage Categories
          </h2>
          <p className="text-gray-600 mt-1">
            Total {meta.total} categories • Page {meta.page} of{" "}
            {Math.ceil(meta.total / meta.limit)}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <BsFilter className="w-4 h-4 mr-2" />
            Filters
          </button>
          <Link
            to="/dashboard/category/add"
            className="inline-flex items-center px-4 py-2.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors shadow-md"
          >
            <BsPlus className="w-5 h-5 mr-2" />
            Add Category
          </Link>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Filter Categories
            </h3>
            <button
              onClick={resetFilters}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.isActive}
                onChange={(e) => handleFilterChange("isActive", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            {/* Featured Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured
              </label>
              <select
                value={filters.isFeatured}
                onChange={(e) =>
                  handleFilterChange("isFeatured", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="">All</option>
                <option value="true">Featured</option>
                <option value="false">Not Featured</option>
              </select>
            </div>

            {/* Trending Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trending
              </label>
              <select
                value={filters.isTrending}
                onChange={(e) =>
                  handleFilterChange("isTrending", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="">All</option>
                <option value="true">Trending</option>
                <option value="false">Not Trending</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="sortOrder">Sort Order</option>
                <option value="name">Name</option>
                <option value="createdAt">Date Created</option>
                <option value="updatedAt">Last Updated</option>
              </select>
            </div>

            {/* Apply Filters Button */}
            <div className="md:col-span-4 pt-2">
              <button className="w-full px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories Grid/Table */}
      {categories.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <FiBook className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No categories found
          </h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your filters or add a new category
          </p>
          <Link
            to="/dashboard/category/add"
            className="inline-flex items-center px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <BsPlus className="w-5 h-5 mr-2" />
            Add Your First Category
          </Link>
        </div>
      ) : (
        <>
          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const IconComponent = iconComponents[category.icon] || FiBook;
              return (
                <div
                  key={category._id}
                  className="bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  {/* Category Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-linear-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Sort Order: {category.sortOrder}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {category.description}
                    </p>

                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          category.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {category.isActive ? (
                          <>
                            <BsCheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <BsXCircle className="w-3 h-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </span>
                      {category.isFeatured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          <BsStar className="w-3 h-3 mr-1" />
                          Featured
                        </span>
                      )}
                      {category.isTrending && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          <BsFire className="w-3 h-3 mr-1" />
                          Trending
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-xs text-gray-500">
                        Created:{" "}
                        {new Date(category.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleStatus(category?._id)}
                          className={`p-1.5 rounded-lg cursor-pointer ${
                            category.isActive
                              ? "text-green-600 hover:bg-green-50"
                              : "text-gray-500 hover:bg-gray-100"
                          }`}
                          title={category.isActive ? "Deactivate" : "Activate"}
                        >
                          {category.isActive ? (
                            <BsCheckCircle />
                          ) : (
                            <BsXCircle />
                          )}
                        </button>

                        <Link
                          to={`/dashboard/category/edit/${category._id}`}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Edit"
                        >
                          <BsPencil />
                        </Link>
                        <button
                          onClick={() => handleDeleteCategory(category._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                          title="Delete"
                        >
                          <BsTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {meta.total > filters.limit && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {(filters.page - 1) * filters.limit + 1} to{" "}
                  {Math.min(filters.page * filters.limit, meta.total)} of{" "}
                  {meta.total} categories
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePreviousPage}
                    disabled={filters.page === 1}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      filters.page === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Previous
                  </button>
                  <div className="flex items-center space-x-1">
                    {Array.from(
                      { length: Math.ceil(meta.total / meta.limit) },
                      (_, i) => i + 1,
                    )
                      .slice(
                        Math.max(0, filters.page - 3),
                        Math.min(
                          Math.ceil(meta.total / meta.limit),
                          filters.page + 2,
                        ),
                      )
                      .map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => handleFilterChange("page", pageNum)}
                          className={`w-10 h-10 rounded-lg font-medium ${
                            filters.page === pageNum
                              ? "bg-indigo-600 text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}
                  </div>
                  <button
                    onClick={handleNextPage}
                    disabled={
                      filters.page === Math.ceil(meta.total / meta.limit)
                    }
                    className={`px-4 py-2 rounded-lg font-medium ${
                      filters.page === Math.ceil(meta.total / meta.limit)
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Category;
