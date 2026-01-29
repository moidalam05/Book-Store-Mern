import { useCreateCategoryMutation } from "../../../app/features/category/categoryApi";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import {
  FiPlus,
  FiArrowLeft,
  FiTag,
  FiFileText,
  FiTrendingUp,
  FiStar,
  FiHash,
  FiX,
  FiInfo,
  FiFilter,
  FiSave,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const [createCategory, { isLoading }] = useCreateCategoryMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      icon: "",
      isTrending: false,
      isFeatured: false,
      sortOrder: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const createPromise = createCategory(data).unwrap();

      toast.promise(createPromise, {
        loading: "Creating category...",
        success: (res) => {
          reset();
          setTimeout(() => navigate("/categories"), 1500);
          return res?.message || "Category created successfully!";
        },
        error: (err) => err?.data?.message || "Something went wrong",
      });

      await createPromise;
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

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
                  Create New Category
                </h1>
                <p className="text-gray-500 text-sm sm:text-base mt-1">
                  Add a new category to organize your content
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => reset()}
                className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Clear Form
              </button>
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={!isDirty || isLoading}
                className="px-5 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
              >
                <FiPlus className="w-5 h-5" />
                {isLoading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">
                  Creating New Category
                </span>
              </div>

              <div className="hidden sm:block w-px h-4 bg-gray-200"></div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Status:</span>
                <span
                  className={`text-sm font-medium ${
                    isDirty ? "text-amber-600" : "text-gray-600"
                  }`}
                >
                  {isDirty ? "Unsaved Changes" : "Start Typing"}
                </span>
              </div>

              <div className="ml-auto">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isDirty
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : "bg-gray-100 text-gray-800 border border-gray-200"
                  }`}
                >
                  {isDirty ? "Ready to Create" : "Fill Form"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Primary Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section 1: Category Details */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="border-b border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FiInfo className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Category Details
                  </h2>
                </div>
                <p className="text-gray-500 text-sm">
                  Enter basic information about the category
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
                      {...register("name", {
                        required: "Category name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters",
                        },
                        maxLength: {
                          value: 50,
                          message: "Name cannot exceed 50 characters",
                        },
                      })}
                      className={`w-full px-4 py-3 pl-11 rounded-lg border ${
                        errors.name
                          ? "border-red-300 focus:ring-2 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      } transition-all duration-200 outline-none`}
                      placeholder="e.g., Electronics, Fashion, Home & Kitchen"
                    />
                    <FiTag className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex justify-between items-center">
                    {errors.name && (
                      <p className="text-sm text-red-500 flex items-center gap-2">
                        <FiX className="w-3 h-3" />
                        {errors.name.message}
                      </p>
                    )}
                    <span
                      className={`text-xs ml-auto ${
                        (watch("name")?.length || 0) > 40
                          ? "text-amber-500"
                          : "text-gray-400"
                      }`}
                    >
                      {watch("name")?.length || 0}/50 characters
                    </span>
                  </div>
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FiFileText className="w-4 h-4 text-gray-400" />
                    Description *
                  </label>
                  <textarea
                    {...register("description", {
                      required: "Description is required",
                      minLength: {
                        value: 10,
                        message: "Description must be at least 10 characters",
                      },
                      maxLength: {
                        value: 500,
                        message: "Description cannot exceed 500 characters",
                      },
                    })}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.description
                        ? "border-red-300 focus:ring-2 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    } transition-all duration-200 outline-none resize-none`}
                    placeholder="Describe what this category includes, its purpose, and any important details..."
                  />
                  <div className="flex justify-between items-center">
                    {errors.description && (
                      <p className="text-sm text-red-500 flex items-center gap-2">
                        <FiX className="w-3 h-3" />
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

                {/* Icon Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <div className="p-1.5 bg-gray-100 rounded">
                      <FiTag className="w-3.5 h-3.5 text-gray-600" />
                    </div>
                    Icon Selection *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...register("icon", {
                        required: "Icon is required",
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
                  {errors.icon && (
                    <p className="text-sm text-red-500 flex items-center gap-2">
                      <FiX className="w-3 h-3" />
                      {errors.icon.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Use Feather Icons naming convention (e.g., FiShoppingBag)
                  </p>
                </div>

                {/* Sort Order */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FiHash className="w-4 h-4 text-gray-400" />
                    Display Order *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      {...register("sortOrder", {
                        required: "Sort order is required",
                        min: { value: 0, message: "Must be 0 or greater" },
                        max: {
                          value: 999,
                          message: "Must be less than 1000",
                        },
                        valueAsNumber: true,
                      })}
                      className={`w-full px-4 py-3 pl-11 rounded-lg border ${
                        errors.sortOrder
                          ? "border-red-300 focus:ring-2 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      } transition-all duration-200 outline-none appearance-none`}
                      min="0"
                      max="999"
                      placeholder="0"
                    />
                    <FiHash className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  {errors.sortOrder && (
                    <p className="text-sm text-red-500 flex items-center gap-2">
                      <FiX className="w-3 h-3" />
                      {errors.sortOrder.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Lower numbers display first (0 = highest priority)
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Section 3: Visibility Settings */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="border-b border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900">
                  Visibility Settings
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Control category visibility
                </p>
              </div>

              <div className="p-6 space-y-4">
                {/* Trending Toggle */}
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

                {/* Featured Toggle */}
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
                <h3 className="font-semibold text-gray-900">Create Category</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Finalize and create
                </p>
              </div>

              <div className="p-6 space-y-4">
                <button
                  onClick={handleSubmit(onSubmit)}
                  disabled={!isDirty || isLoading}
                  className="w-full px-4 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow flex items-center justify-center gap-3 cursor-pointer"
                >
                  <FiPlus className="w-5 h-5" />
                  {isLoading ? "Creating Category..." : "Create Category"}
                </button>

                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => reset()}
                    className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Clear Form
                  </button>
                  <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
