import  { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiTag,
  FiFileText,
  FiShoppingCart,
  FiBook,
  FiFolder,
  FiUsers,
  FiUser,
  FiCalendar,
  FiClock,
  FiGlobe,
  FiLock,
  FiSave,
  FiSearch,
  FiCheck,
  FiX,
  FiEdit2,
  FiRefreshCw,
} from "react-icons/fi";
import {
  useGetCouponByIdQuery,
  useUpdateCouponMutation,
} from "../../../app/features/coupon/couponApi";
import { useFetchAllBooksQuery } from "../../../app/features/books/booksApi";
import { useFetchAllCategoriesQuery } from "../../../app/features/category/categoryApi";
import Loading from "../../../components/Loading";

// Book Selection Component (same as AddCoupon)
const BookSelection = ({
  selectedBooks,
  toggleBookSelection,
  setSelectedBooks,
  books,
}) => {
  return (
    <div>
      <div className="mb-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search books by title, author, or category..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Select Books ({selectedBooks.length} selected)
        </label>
        {selectedBooks.length > 0 && (
          <button
            type="button"
            onClick={() => setSelectedBooks([])}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2">
        {books.map((book) => {
          const isSelected = selectedBooks.includes(book._id);

          return (
            <div
              key={book?._id}
              onClick={() => toggleBookSelection(book)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                isSelected
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{book.title}</h4>
                  <p className="text-sm text-gray-600">{book.author}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {book.category?.name}
                    </span>
                    <span className="text-sm font-medium text-green-700">
                      ₹{book.price?.discounted}
                    </span>
                  </div>
                </div>
                {isSelected ? (
                  <FiCheck className="w-5 h-5 text-green-600 mt-1 shrink-0" />
                ) : (
                  <div className="w-5 h-5 border-2 border-gray-300 rounded mt-1 shrink-0"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedBooks.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-800 mb-2">
            Selected Books ({selectedBooks.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedBooks.map((bookId) => {
              const book = books.find((b) => b._id === bookId);
              if (!book) return null;

              return (
                <span
                  key={bookId}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-blue-200 text-blue-700 rounded-full text-sm"
                >
                  {book.title}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookSelection(book);
                    }}
                    className="ml-1 hover:text-red-600"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Category Selection Component (same as AddCoupon)
const CategorySelection = ({
  selectedCategories,
  toggleCategorySelection,
  categories,
  setSelectedCategories,
}) => {
  return (
    <div>
      <div className="mb-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Select Categories ({selectedCategories.length} selected)
        </label>
        {selectedCategories.length > 0 && (
          <button
            type="button"
            onClick={() => setSelectedCategories([])}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2">
        {categories?.map((category) => {
          const isSelected = selectedCategories.includes(category._id);

          return (
            <div
              key={category?._id}
              onClick={() => toggleCategorySelection(category._id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                isSelected
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{category.name}</h4>
                </div>
                {isSelected ? (
                  <FiCheck className="w-5 h-5 text-purple-600 mt-1 shrink-0" />
                ) : (
                  <div className="w-5 h-5 border-2 border-gray-300 rounded mt-1 shrink-0"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedCategories.length > 0 && (
        <div className="mt-4 p-3 bg-purple-50 rounded-lg">
          <p className="text-sm font-medium text-purple-800 mb-2">
            Selected Categories ({selectedCategories.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((categoryId) => {
              const category = categories.find((c) => c._id === categoryId);
              if (!category) return null;

              return (
                <span
                  key={categoryId}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-purple-200 text-purple-700 rounded-full text-sm"
                >
                  {category.name}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCategorySelection(categoryId);
                    }}
                    className="ml-1 hover:text-red-600"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Applicable Products Component
const ApplicableProducts = ({
  appliesTo,
  setAppliesTo,
  selectedBooks,
  toggleBookSelection,
  selectedCategories,
  toggleCategorySelection,
  books,
  categories,
  setSelectedBooks,
  setSelectedCategories,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <FiBook className="w-5 h-5 text-green-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">
          Applicable Products
        </h2>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label
            className={`cursor-pointer ${appliesTo === "all" ? "opacity-100" : "opacity-80"}`}
          >
            <input
              type="radio"
              name="appliesTo"
              checked={appliesTo === "all"}
              onChange={() => setAppliesTo("all")}
              className="sr-only peer"
            />
            <div
              className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center gap-2 transition-all ${
                appliesTo === "all"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700"
              }`}
            >
              <FiGlobe className="w-5 h-5" />
              <span className="font-medium">All Products</span>
            </div>
          </label>

          <label
            className={`cursor-pointer ${appliesTo === "books" ? "opacity-100" : "opacity-80"}`}
          >
            <input
              type="radio"
              name="appliesTo"
              checked={appliesTo === "books"}
              onChange={() => setAppliesTo("books")}
              className="sr-only peer"
            />
            <div
              className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center gap-2 transition-all ${
                appliesTo === "books"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700"
              }`}
            >
              <FiBook className="w-5 h-5" />
              <span className="font-medium">Specific Books</span>
            </div>
          </label>

          <label
            className={`cursor-pointer ${appliesTo === "categories" ? "opacity-100" : "opacity-80"}`}
          >
            <input
              type="radio"
              name="appliesTo"
              checked={appliesTo === "categories"}
              onChange={() => setAppliesTo("categories")}
              className="sr-only peer"
            />
            <div
              className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center gap-2 transition-all ${
                appliesTo === "categories"
                  ? "border-purple-500 bg-purple-50 text-purple-700"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700"
              }`}
            >
              <FiFolder className="w-5 h-5" />
              <span className="font-medium">Specific Categories</span>
            </div>
          </label>
        </div>

        {appliesTo === "books" && (
          <BookSelection
            selectedBooks={selectedBooks}
            toggleBookSelection={toggleBookSelection}
            setSelectedBooks={setSelectedBooks}
            books={books}
          />
        )}

        {appliesTo === "categories" && (
          <CategorySelection
            selectedCategories={selectedCategories}
            toggleCategorySelection={toggleCategorySelection}
            setSelectedCategories={setSelectedCategories}
            categories={categories}
          />
        )}
      </div>
    </div>
  );
};

// Main Component
const EditCoupon = () => {
  const { id: couponId } = useParams();
  const navigate = useNavigate();

  const [appliesTo, setAppliesTo] = useState("all");
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [initialSnapshot, setInitialSnapshot] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    unregister,
  } = useForm({
    defaultValues: {
      code: "",
      description: "",
      discountType: "flat",
      discountValue: "",
      minimumCartValue: "",
      maxDiscountAmount: "",
      usageLimit: "",
      perUserLimit: "",
      startDate: "",
      endDate: "",
      isPublic: true,
    },
  });

  const currentFormValues = watch();

  const isFormChanged =
    !initialSnapshot ||
    JSON.stringify(initialSnapshot.form) !==
      JSON.stringify({
        ...currentFormValues,
        discountValue: Number(currentFormValues.discountValue) || "",
        minimumCartValue: Number(currentFormValues.minimumCartValue) || "",
      }) ||
    initialSnapshot.appliesTo !== appliesTo ||
    JSON.stringify(initialSnapshot.books) !== JSON.stringify(selectedBooks) ||
    JSON.stringify(initialSnapshot.categories) !==
      JSON.stringify(selectedCategories);

  const discountType = watch("discountType");
  const startDate = watch("startDate");

  // Books
  const { data: bookData } = useFetchAllBooksQuery();
  const books = bookData?.data || [];

  // Categories
  const { data: categoryData } = useFetchAllCategoriesQuery();
  const categories = categoryData?.data || [];

  // Coupon Data
  const { data: couponData } = useGetCouponByIdQuery(couponId);
  const coupon = couponData?.data;

  // update coupon
  const [updateCoupon, { isLoading }] = useUpdateCouponMutation();

  const formatDateForInput = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };
  useEffect(() => {
    if (!coupon) return;

    const snapshot = {
      form: {
        code: coupon.code || "",
        description: coupon.description || "",
        discountType: coupon.discountType || "flat",
        discountValue: Number(coupon.discountValue) || "",
        minimumCartValue: Number(coupon.minimumCartValue) || "",
        maxDiscountAmount: coupon.maxDiscountAmount || "",
        usageLimit: coupon.usageLimit || "",
        perUserLimit: coupon.perUserLimit || "",
        startDate: formatDateForInput(coupon.startDate),
        endDate: formatDateForInput(coupon.endDate),
        isPublic: coupon.isPublic,
      },
      appliesTo: coupon.appliesTo || "all",
      books: coupon.applicableBooks || [],
      categories: coupon.applicableCategories || [],
    };

    setInitialSnapshot(snapshot);

    reset(snapshot.form);
    setAppliesTo(snapshot.appliesTo);
    setSelectedBooks(snapshot.books);
    setSelectedCategories(snapshot.categories);
  }, [coupon, reset]);

  const toggleBookSelection = (book) => {
    setSelectedBooks((prev) =>
      prev.includes(book._id)
        ? prev.filter((id) => id !== book._id)
        : [...prev, book._id],
    );
  };

  const toggleCategorySelection = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  useEffect(() => {
    if (discountType !== "percentage") {
      unregister("maxDiscountAmount");
    }
  }, [discountType, unregister]);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      discountValue: Number(data.discountValue),
      minimumCartValue: Number(data.minimumCartValue),

      usageLimit: Number(data.usageLimit),
      perUserLimit: Number(data.perUserLimit),
      appliesTo,
      applicableBooks: appliesTo === "books" ? selectedBooks : [],
      applicableCategories:
        appliesTo === "categories" ? selectedCategories : [],
    };

    if (data.discountType === "percentage") {
      payload.maxDiscountAmount = Number(data.maxDiscountAmount);
    }

    console.log(payload);
    const updatePromise = updateCoupon({ couponId, data: payload }).unwrap();

    toast.promise(updatePromise, {
      loading: "Updating coupon...",
      success: (res) => res?.message,
      error: (err) => err?.data?.message || "Something went wrong",
    });

    await updatePromise;
    navigate("/dashboard/coupon");
  };

  const handleReset = () => {
    if (coupon) {
      reset({
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minimumCartValue: coupon.minimumCartValue,
        maxDiscountAmount: coupon.maxDiscountAmount || "",
        usageLimit: coupon.usageLimit,
        perUserLimit: coupon.perUserLimit,
        startDate: formatDateForInput(coupon.startDate),
        endDate: formatDateForInput(coupon.endDate),
        isPublic: coupon.isPublic,
      });

      setAppliesTo(coupon.appliesTo || "all");
      setSelectedBooks(coupon.applicableBooks || []);
      setSelectedCategories(coupon.applicableCategories || []);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-md rounded-lg px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              to="/dashboard/coupon"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  Edit Coupon
                </h1>
              </div>
              <p className="text-sm text-gray-600">
                Update coupon details and settings
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleReset}
              disabled={!isFormChanged}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 cursor-pointer"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span>Reset</span>
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={!isFormChanged}
              className="px-6 py-2 bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 cursor-pointer"
            >
              <FiSave className="w-5 h-5" />
              <span>{isLoading ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <div className="mx-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Coupon Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Coupon Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FiEdit2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Coupon Information
                      </h2>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          coupon?.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {coupon?.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Coupon Code */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Coupon Code *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          {...register("code", {
                            required: "Coupon code is required",
                            pattern: {
                              value: /^[A-Z0-9]+$/,
                              message:
                                "Only uppercase letters and numbers allowed",
                            },
                            minLength: {
                              value: 4,
                              message: "Code must be at least 4 characters",
                            },
                            maxLength: {
                              value: 20,
                              message: "Code must be less than 20 characters",
                            },
                          })}
                          className={`w-full px-4 py-3 pl-11 rounded-lg border ${
                            errors.code
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          } focus:outline-none focus:ring-2 transition-colors uppercase`}
                          placeholder="e.g., WELCOME20"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <FiTag className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                      {errors.code && (
                        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                          <FiX className="w-4 h-4" />
                          <span>{errors.code.message}</span>
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <div className="relative">
                        <textarea
                          {...register("description", {
                            required: "Description is required",
                            minLength: {
                              value: 10,
                              message:
                                "Description must be at least 10 characters",
                            },
                            maxLength: {
                              value: 200,
                              message:
                                "Description must be less than 200 characters",
                            },
                          })}
                          rows={3}
                          className={`w-full px-4 py-3 pl-11 rounded-lg border ${
                            errors.description
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          } focus:outline-none focus:ring-2 transition-colors resize-none`}
                          placeholder="Describe the coupon offer..."
                        />
                        <div className="absolute left-3 top-4">
                          <FiFileText className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                      {errors.description && (
                        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                          <FiX className="w-4 h-4" />
                          <span>{errors.description.message}</span>
                        </p>
                      )}
                    </div>

                    {/* Discount Type & Value */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Discount Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Discount Type *
                        </label>
                        <div className="relative">
                          <select
                            {...register("discountType", {
                              required: "Discount type is required",
                            })}
                            className={`w-full px-4 py-3 rounded-lg border appearance-none ${
                              errors.discountType
                                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            } focus:outline-none focus:ring-2 transition-colors bg-white cursor-pointer`}
                          >
                            <option value="">Select Discount Type</option>
                            <option value="percentage">
                              Percentage Discount
                            </option>
                            <option value="flat">Flat Amount Discount</option>
                          </select>
                        </div>
                        {errors.discountType && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.discountType.message}
                          </p>
                        )}
                      </div>

                      {/* Discount Value */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Discount Value *
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            {...register("discountValue", {
                              required: "Discount value is required",
                              min:
                                discountType === "percentage"
                                  ? { value: 1, message: "Minimum 1%" }
                                  : { value: 1, message: "Minimum ₹1" },
                              max:
                                discountType === "percentage"
                                  ? { value: 100, message: "Maximum 100%" }
                                  : undefined,
                              valueAsNumber: true,
                            })}
                            className={`w-full px-4 py-3 rounded-lg border ${
                              errors.discountValue
                                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            } focus:outline-none focus:ring-2 transition-colors`}
                            placeholder={
                              discountType === "percentage"
                                ? "e.g., 20"
                                : "e.g., 50"
                            }
                          />
                        </div>
                        {errors.discountValue && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.discountValue.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Minimum Cart Value & Max Discount */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Minimum Cart Value */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Cart Value *
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            {...register("minimumCartValue", {
                              required: "Minimum cart value is required",
                              min: { value: 0, message: "Minimum value is 0" },
                              valueAsNumber: true,
                            })}
                            className={`w-full px-4 py-3 pl-11 rounded-lg border ${
                              errors.minimumCartValue
                                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            } focus:outline-none focus:ring-2 transition-colors`}
                            placeholder="e.g., 299"
                          />
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            <FiShoppingCart className="w-5 h-5 text-gray-400" />
                          </div>
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            ₹
                          </div>
                        </div>
                        {errors.minimumCartValue && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.minimumCartValue.message}
                          </p>
                        )}
                        <p className="mt-2 text-xs text-gray-500">
                          Coupon will be applicable only when cart value is
                          equal or above this amount
                        </p>
                      </div>

                      {/* Maximum Discount Amount (conditional) */}
                      {discountType === "percentage" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Maximum Discount
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              {...register("maxDiscountAmount", {
                                min: { value: 1, message: "Minimum ₹1" },
                                valueAsNumber: true,
                              })}
                              className={`w-full px-4 py-3 pl-11 rounded-lg border ${
                                errors.maxDiscountAmount
                                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                              } focus:outline-none focus:ring-2 transition-colors`}
                              placeholder="e.g., 500"
                            />
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                              <FiTag className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                              ₹
                            </div>
                          </div>
                          {errors.maxDiscountAmount && (
                            <p className="mt-2 text-sm text-red-600">
                              {errors.maxDiscountAmount.message}
                            </p>
                          )}
                          <p className="mt-2 text-xs text-gray-500">
                            Maximum discount amount for percentage coupons
                            (leave empty for no limit)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Validity Period */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FiCalendar className="w-5 h-5 text-purple-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Validity Period
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Start Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date *
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          {...register("startDate", {
                            required: "Start date is required",
                          })}
                          className={`w-full px-4 py-3 pl-11 rounded-lg border ${
                            errors.startDate
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          } focus:outline-none focus:ring-2 transition-colors`}
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <FiCalendar className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                      {errors.startDate && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.startDate.message}
                        </p>
                      )}
                    </div>

                    {/* End Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date *
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          {...register("endDate", {
                            required: "End date is required",
                            validate: (value) => {
                              if (
                                startDate &&
                                new Date(value) <= new Date(startDate)
                              ) {
                                return "End date must be after start date";
                              }
                              return true;
                            },
                          })}
                          className={`w-full px-4 py-3 pl-11 rounded-lg border ${
                            errors.endDate
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          } focus:outline-none focus:ring-2 transition-colors`}
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <FiClock className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                      {errors.endDate && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.endDate.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Applicable Products */}
                <ApplicableProducts
                  appliesTo={appliesTo}
                  setAppliesTo={setAppliesTo}
                  selectedBooks={selectedBooks}
                  toggleBookSelection={toggleBookSelection}
                  selectedCategories={selectedCategories}
                  toggleCategorySelection={toggleCategorySelection}
                  books={books}
                  categories={categories}
                  setSelectedBooks={setSelectedBooks}
                  setSelectedCategories={setSelectedCategories}
                />
              </div>

              {/* Right Column - Settings & Actions */}
              <div className="space-y-6">
                {/* Usage Limits */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <FiUsers className="w-5 h-5 text-orange-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Usage Limits
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {/* Usage Limit */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Usage Limit
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          {...register("usageLimit", {
                            min: { value: 1, message: "Minimum 1" },
                            valueAsNumber: true,
                          })}
                          className={`w-full px-4 py-3 pl-11 rounded-lg border ${
                            errors.usageLimit
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          } focus:outline-none focus:ring-2 transition-colors`}
                          placeholder="e.g., 100 (leave empty for unlimited)"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <FiUsers className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                      {errors.usageLimit && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.usageLimit.message}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-gray-500">
                        Total number of times this coupon can be used
                      </p>
                    </div>

                    {/* Per User Limit */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Per User Limit
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          {...register("perUserLimit", {
                            min: { value: 1, message: "Minimum 1" },
                            valueAsNumber: true,
                          })}
                          className={`w-full px-4 py-3 pl-11 rounded-lg border ${
                            errors.perUserLimit
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          } focus:outline-none focus:ring-2 transition-colors`}
                          placeholder="e.g., 1 (leave empty for unlimited)"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <FiUser className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                      {errors.perUserLimit && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.perUserLimit.message}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-gray-500">
                        Number of times a single user can use this coupon
                      </p>
                    </div>
                  </div>
                </div>

                {/* Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">
                    Settings
                  </h2>

                  <div className="space-y-4">
                    {/* Public Status */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-lg ${
                            watch("isPublic") ? "bg-cyan-100" : "bg-gray-100"
                          }`}
                        >
                          {watch("isPublic") ? (
                            <FiGlobe className="w-5 h-5 text-cyan-600" />
                          ) : (
                            <FiLock className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Public Coupon
                          </h3>
                          <p className="text-sm text-gray-600">
                            Visible to all users
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          {...register("isPublic")}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Actions
                  </h2>
                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={!isFormChanged}
                      className="w-full px-4 py-3 bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <FiSave className="w-5 h-5" />
                      <span>
                        {isLoading ? "Saving Changes..." : "Save Changes"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleReset}
                      disabled={!isFormChanged}
                      className="w-full px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <FiRefreshCw className="w-4 h-4" />
                      <span>Reset Changes</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/dashboard/coupon")}
                      className="w-full px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <FiArrowLeft className="w-4 h-4" />
                      <span>Back to Coupons</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCoupon;
