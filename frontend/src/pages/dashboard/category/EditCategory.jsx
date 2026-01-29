import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useFetchCategoryByIdQuery,
  useUpdateCategoryMutation,
} from "../../../app/features/category/categoryApi";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Loading from "../../../components/Loading";
import {
  FiArrowLeft,
  FiSave,
  FiTrendingUp,
  FiStar,
  FiFilter,
  FiTag,
  FiType,
  FiInfo,
  FiRefreshCw,
} from "react-icons/fi";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useFetchCategoryByIdQuery(id);
  const category = data?.data;

  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm();

  useEffect(() => {
    if (category) {
      setValue("name", category.name);
      setValue("description", category.description);
      setValue("icon", category.icon);
      setValue("sortOrder", category.sortOrder);
      setValue("isTrending", category.isTrending);
      setValue("isFeatured", category.isFeatured);
    }
  }, [category, setValue]);

  const onSubmit = async (formData) => {
    const updatePromise = updateCategory({
      categoryId: id,
      data: {
        name: formData.name,
        description: formData.description,
        icon: formData.icon,
        sortOrder: Number(formData.sortOrder),
        isTrending: Boolean(formData.isTrending),
        isFeatured: Boolean(formData.isFeatured),
      },
    }).unwrap();

    toast.promise(updatePromise, {
      loading: "Updating category...",
      success: (res) => {
        setTimeout(() => navigate(-1), 800);
        return res?.message || "Category updated successfully";
      },
      error: (err) => err?.data?.message || "Failed to update category",
    });

    try {
      await updatePromise;
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 hover:shadow-sm transition-all duration-200 group cursor-pointer"
                aria-label="Go back"
              >
                <FiArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Edit Category
                </h1>
                <p className="text-gray-500 text-sm sm:text-base mt-1">
                  Update and manage category details
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={!isDirty || isUpdating}
                className="px-5 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
              >
                <FiSave className="w-5 h-5" />
                {isUpdating ? "Saving..." : "Save"}
              </button>
            </div>
          </div>

          {/* Status & Info Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-gray-700">
                  Active
                </span>
              </div>

              <div className="hidden sm:block w-px h-4 bg-gray-200"></div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Category ID:</span>
                <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-800">
                  {id}
                </code>
              </div>

              <div className="hidden sm:block w-px h-4 bg-gray-200"></div>

              <div className="text-sm text-gray-500">
                Last updated:{" "}
                <span className="font-medium text-gray-700">
                  {new Date().toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isDirty
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : "bg-green-100 text-green-800 border border-green-200"
                  }`}
                >
                  {isDirty ? "Unsaved Changes" : "All Saved"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Primary Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section 1: Basic Information */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="border-b border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FiInfo className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Basic Information
                  </h2>
                </div>
                <p className="text-gray-500 text-sm">
                  Core details about the category
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FiTag className="w-4 h-4 text-gray-400" />
                    Category Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...register("name", { required: "Name is required" })}
                      className={`w-full px-4 py-3 pl-11 rounded-lg border ${
                        errors.name
                          ? "border-red-300 focus:ring-2 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      } transition-all duration-200 outline-none`}
                      placeholder="e.g., Electronics, Fashion, Home & Kitchen"
                    />
                    <FiType className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-red-500 flex items-center gap-2 mt-1">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FiInfo className="w-4 h-4 text-gray-400" />
                    Description *
                  </label>
                  <textarea
                    rows={4}
                    {...register("description", {
                      required: "Description is required",
                      maxLength: {
                        value: 500,
                        message: "Description cannot exceed 500 characters",
                      },
                    })}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.description
                        ? "border-red-300 focus:ring-2 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    } transition-all duration-200 outline-none resize-none`}
                    placeholder="Provide a clear description of what this category includes..."
                  />
                  <div className="flex justify-between items-center">
                    {errors.description && (
                      <p className="text-sm text-red-500 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                        {errors.description.message}
                      </p>
                    )}
                    <span
                      className={`text-xs ml-auto ${
                        (watch("description")?.length || 0) > 450
                          ? "text-amber-500"
                          : "text-gray-400"
                      }`}
                    >
                      {watch("description")?.length || 0}/500 characters
                    </span>
                  </div>
                </div>

                {/* Icon Settings */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <div className="p-1.5 bg-gray-100 rounded">
                      <FiTag className="w-3.5 h-3.5 text-gray-600" />
                    </div>
                    Icon Configuration *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...register("icon", {
                        required: "Icon name is required",
                        pattern: {
                          value: /^Fi[A-Z][a-zA-Z]*$/,
                          message:
                            "Must follow Feather Icons pattern (e.g., FiShoppingBag)",
                        },
                      })}
                      className={`w-full px-4 py-3 pl-11 rounded-lg border ${
                        errors.icon
                          ? "border-red-300 focus:ring-2 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      } transition-all duration-200 outline-none`}
                      placeholder="FiShoppingBag, FiHome, FiMusic"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-linear-to-r from-blue-400 to-indigo-500 rounded"></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Use Feather Icons naming convention (e.g., FiShoppingBag)
                  </p>
                </div>

                {/* Sort Order Settings */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FiFilter className="w-4 h-4 text-gray-400" />
                    Display Order *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      {...register("sortOrder", {
                        required: "Sort order is required",
                        valueAsNumber: true,
                        min: { value: 0, message: "Must be 0 or greater" },
                      })}
                      className={`w-full px-4 py-3 pl-11 rounded-lg border ${
                        errors.sortOrder
                          ? "border-red-300 focus:ring-2 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      } transition-all duration-200 outline-none appearance-none`}
                      min="0"
                    />
                    <FiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Lower numbers display first (0 = highest priority)
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Section 3: Visibility & Status */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="border-b border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900">
                  Visibility & Status
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Control category visibility
                </p>
              </div>

              <div className="p-6 space-y-4">
                {/* Trending Status */}
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-50 rounded-lg">
                        <FiTrendingUp className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <span className="block font-medium text-gray-900">
                          Trending
                        </span>
                        <span className="text-xs text-gray-500">
                          Show in trending section
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        {...register("isTrending")}
                        className="sr-only"
                      />
                      <div
                        className={`w-10 h-6 rounded-full transition-colors ${
                          watch("isTrending") ? "bg-orange-500" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            watch("isTrending")
                              ? "transform translate-x-5"
                              : "transform translate-x-1"
                          }`}
                        ></div>
                      </div>
                    </div>
                  </label>

                  <div className="text-xs text-gray-500 ml-12">
                    Trending categories appear in promotional sections
                  </div>
                </div>

                {/* Featured Status */}
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-50 rounded-lg">
                        <FiStar className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div>
                        <span className="block font-medium text-gray-900">
                          Featured
                        </span>
                        <span className="text-xs text-gray-500">
                          Highlight on homepage
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        {...register("isFeatured")}
                        className="sr-only"
                      />
                      <div
                        className={`w-10 h-6 rounded-full transition-colors ${
                          watch("isFeatured") ? "bg-yellow-500" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            watch("isFeatured")
                              ? "transform translate-x-5"
                              : "transform translate-x-1"
                          }`}
                        ></div>
                      </div>
                    </div>
                  </label>

                  <div className="text-xs text-gray-500 ml-12">
                    Featured categories get priority placement
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Actions */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="border-b border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900">Actions</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Manage category changes
                </p>
              </div>

              <div className="p-6 space-y-4">
                <button
                  onClick={handleSubmit(onSubmit)}
                  disabled={!isDirty || isUpdating}
                  className="w-full px-4 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow flex items-center justify-center gap-3 cursor-pointer"
                >
                  <FiSave className="w-5 h-5" />
                  {isUpdating ? "Saving Changes..." : "Save Changes"}
                </button>

                <button
                  onClick={() => navigate(-1)}
                  className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors w-full cursor-pointer"
                >
                  Discard
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategory;
