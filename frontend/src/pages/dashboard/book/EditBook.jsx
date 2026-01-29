import { useEffect, useState } from "react";
import InputField from "./InputField.jsx";
import SelectField from "./SelectField.jsx";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import {
  useFetchBookByIdQuery,
  useUpdateBookMutation,
} from "../../../app/features/books/booksApi.js";
import Loading from "../../../components/Loading.jsx";
import {
  BsBook,
  BsCurrencyDollar,
  BsTag,
  BsPeople,
  BsGlobe,
  BsHash,
  BsBox,
  BsGraphUp,
  BsStar,
  BsUpload,
  BsCheckCircle,
  BsBuilding,
  BsSave,
  BsFillCloudArrowUpFill,
  BsCardText,
} from "react-icons/bs";
import { useFetchAllCategoriesQuery } from "../../../app/features/category/categoryApi.js";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useFetchBookByIdQuery(id);
  const bookData = data?.data;
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
  const { data: categoryData } = useFetchAllCategoriesQuery();
  const categories = categoryData?.data || [];

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm();

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFileName, setImageFileName] = useState("");

  // Watch form values
  const trendingWatch = watch("trending");
  const featuredWatch = watch("featured");

  const handleGenerateDescription = async () => {
    try {
      toast.loading("Generating description...", { id: "ai-desc" });
      // API CALL HERE
      setValue("description", data.description, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: false,
      });
      toast.success("Description generated ✨", { id: "ai-desc" });
    } catch (error) {
      toast.error(err.message || "Failed to generate description", {
        id: "ai-desc",
      });
    }
  };

  useEffect(() => {
    if (bookData) {
      // Set all form values
      setValue("title", bookData.title);
      setValue("description", bookData.description);
      setValue(
        "category",
        typeof bookData.category === "object"
          ? bookData.category._id
          : bookData.category,
      );
      setValue("trending", bookData.trending);
      setValue("featured", bookData.featured);
      setValue("language", bookData.language);
      setValue("isbn", bookData.isbn);
      setValue("stock", bookData.stock);

      // Handle authors array
      setValue(
        "authors",
        Array.isArray(bookData.authors)
          ? bookData.authors.join(", ")
          : bookData.authors || "",
      );

      // Handle tags array
      setValue(
        "tags",
        Array.isArray(bookData.tags)
          ? bookData.tags.join(", ")
          : bookData.tags || "",
      );

      // Handle price object
      setValue("price.original", bookData.price?.original || 0);
      setValue("price.discounted", bookData.price?.discounted || 0);

      // Handle publisher
      setValue("publisher", bookData.publisher || "");

      // Handle cover image
      if (bookData.coverImage?.url) {
        setImagePreview(bookData.coverImage.url);
        setImageFileName(bookData.coverImage.url.split("/").pop());
      }
    }
  }, [bookData, setValue]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileName(file.name);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImageFileName("");
    setImagePreview(null);
  };

  const onSubmit = async (formData) => {
    const updateBookData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      trending: formData.trending === true || formData.trending === "true",
      featured: formData.featured === true || formData.featured === "true",
      language: formData.language,
      isbn: formData.isbn,
      stock: parseInt(formData.stock) || 0,
      authors: formData.authors
        ? formData.authors.split(",").map((a) => a.trim())
        : [],
      tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : [],
      publisher: formData.publisher,
      price: {
        original: parseFloat(formData.price?.original) || 0,
        discounted: parseFloat(formData.price?.discounted) || 0,
      },
    };

    if (imageFile) {
      updateBookData.coverImage = imageFile;
    }

    const promise = updateBook({ id, ...updateBookData }).unwrap();

    toast.promise(promise, {
      loading: "Updating book details...",
      success: (res) => {
        setTimeout(() => {
          navigate(-1);
        }, 800);

        return res?.message || "Book updated successfully 📘";
      },
      error: (err) => err?.data?.message || "Failed to update book",
    });

    try {
      await promise;
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Edit Book
              </h1>
              <p className="text-gray-600 mt-2 max-w-2xl">
                Update the details of "{bookData?.title}". Changes will be
                reflected immediately on the store.
              </p>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span>Live Preview</span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <button
                onClick={() => reset()}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Reset Form
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Book Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Book Information Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-6 bg-linear-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      <BsBook className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Book Information
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Update book details and metadata
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div className="md:col-span-2">
                      <InputField
                        label={
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-900">
                              Book Title *
                            </span>
                            <span className="text-xs font-normal text-gray-500">
                              {watch("title")?.length || 0}/200 characters
                            </span>
                          </div>
                        }
                        name="title"
                        placeholder="Enter book title"
                        register={register}
                        required={true}
                        maxLength={200}
                        icon={<BsBook className="w-5 h-5 text-gray-400" />}
                        error={errors.title}
                        className="text-lg font-medium"
                      />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <BsCardText className="w-4 h-4 text-indigo-500" />
                        <span>Description *</span>
                        <span className="text-xs font-normal text-gray-500 ml-auto">
                          {watch("description")?.length || 0}/2000 characters
                        </span>
                      </label>
                      <div className="relative group">
                        <textarea
                          {...register("description", {
                            required: "Description is required",
                            maxLength: {
                              value: 2000,
                              message:
                                "Description cannot exceed 2000 characters",
                            },
                          })}
                          rows="6"
                          placeholder="Enter a comprehensive description of the book..."
                          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none group-hover:border-gray-400 text-gray-700"
                        />
                        {errors.description && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                            <BsCheckCircle className="w-4 h-4" />
                            {errors.description.message}
                          </p>
                        )}
                      </div>
                      <button
                        className="ml-auto px-4 py-2 bg-linear-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-md hover:shadow-md transition-shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={isLoading}
                        onClick={handleGenerateDescription}
                        type="button"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-3.5 h-3.5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Generate with AI
                          </>
                        )}
                      </button>
                    </div>

                    {/* Category & Language */}
                    <div className="space-y-1">
                      <label className="block text-sm font-semibold text-gray-900">
                        Category *
                      </label>
                      <SelectField
                        name="category"
                        options={categories}
                        register={register}
                        required={true}
                        icon={<BsTag className="w-5 h-5 text-gray-400" />}
                        placeholder="Select a category"
                        error={errors.category}
                      />
                    </div>

                    <InputField
                      label="Language"
                      name="language"
                      placeholder="English, Spanish, French, etc."
                      register={register}
                      icon={<BsGlobe className="w-5 h-5 text-gray-400" />}
                    />

                    {/* Authors & Publisher */}
                    <div className="space-y-1">
                      <label className="block text-sm font-semibold text-gray-900">
                        Author(s) *
                      </label>
                      <InputField
                        name="authors"
                        placeholder='["Robert C. Martin"] or Robert C. Martin, John Doe'
                        register={register}
                        required={true}
                        helperText="Enter as JSON array or comma-separated names"
                        icon={<BsPeople className="w-5 h-5 text-gray-400" />}
                        error={errors.authors}
                      />
                    </div>

                    <InputField
                      label="Publisher"
                      name="publisher"
                      placeholder="Prentice Hall, O'Reilly Media, etc."
                      register={register}
                      icon={<BsBuilding className="w-5 h-5 text-gray-400" />}
                    />

                    {/* ISBN */}
                    <div className="md:col-span-2">
                      <InputField
                        label="ISBN"
                        name="isbn"
                        placeholder="9780132350884"
                        register={register}
                        icon={<BsHash className="w-5 h-5 text-gray-400" />}
                        helperText="International Standard Book Number"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing & Inventory Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-6 bg-linear-to-r from-emerald-50 to-green-50 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      <BsCurrencyDollar className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Pricing & Inventory
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Update pricing and stock management
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Price Section */}
                    <div className="lg:col-span-2 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-linear-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                          <InputField
                            label="Original Price *"
                            name="price.original"
                            type="number"
                            placeholder="699"
                            register={register}
                            prefix="$"
                            required={true}
                            min="0"
                            step="0.01"
                            className="text-2xl font-bold"
                          />
                        </div>

                        <div className="bg-linear-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                          <InputField
                            label="Discounted Price"
                            name="price.discounted"
                            type="number"
                            placeholder="599"
                            register={register}
                            prefix="$"
                            min="0"
                            step="0.01"
                            className="text-2xl font-bold"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Stock Section */}
                    <div className="bg-linear-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
                      <div className="space-y-4">
                        <div>
                          <InputField
                            label="Stock Quantity *"
                            name="stock"
                            type="number"
                            placeholder="50"
                            register={register}
                            icon={<BsBox className="w-6 h-6 text-purple-600" />}
                            required={true}
                            min="0"
                            className="text-2xl font-bold text-center"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mt-8">
                    <InputField
                      label="Tags"
                      name="tags"
                      placeholder='["software","clean-code","best-practices"] or software, clean-code, best-practices'
                      register={register}
                      helperText="Enter as JSON array or comma-separated tags. Helps in search and categorization."
                      icon={<BsTag className="w-5 h-5 text-gray-400" />}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Media & Actions */}
            <div className="space-y-8">
              {/* Cover Image Upload */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-6 bg-linear-to-r from-purple-50 to-pink-50 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      <BsFillCloudArrowUpFill className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Cover Image
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Recommended: 600×800px
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-6">
                    {/* Image Preview */}
                    {imagePreview ? (
                      <div className="relative group">
                        <div className="aspect-3/4 overflow-hidden rounded-xl border-2 border-dashed border-purple-200 bg-gray-50">
                          <img
                            src={imagePreview}
                            alt="Book cover preview"
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={removeImage}
                            className="px-4 py-2 bg-white text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors shadow-lg"
                          >
                            Remove Image
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="block group cursor-pointer">
                        <div className="aspect-3/4 flex flex-col items-center justify-center border-3 border-dashed border-gray-300 rounded-2xl bg-linear-to-b from-gray-50 to-white hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-300">
                          <div className="text-center p-6">
                            <BsUpload className="w-16 h-16 text-gray-300 group-hover:text-purple-400 mb-4 transition-colors mx-auto" />
                            <p className="mb-2 text-sm font-medium text-gray-500 group-hover:text-purple-600">
                              Click to upload new cover
                            </p>
                            <p className="text-xs text-gray-400 group-hover:text-purple-500">
                              or drag and drop
                            </p>
                            <p className="mt-4 text-xs text-gray-400">
                              PNG, JPG, WEBP up to 5MB
                            </p>
                          </div>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    )}

                    {/* Current Image Info */}
                    {bookData?.coverImage?.url && !imageFile && (
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Current Image
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {bookData.coverImage.url.split("/").pop()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Book Options */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-6 bg-linear-to-r from-amber-50 to-orange-50 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      <BsStar className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Visibility Options
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Control book visibility and features
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Trending Toggle */}
                  <div
                    className={`flex items-center justify-between p-5 rounded-xl border transition-all ${
                      trendingWatch
                        ? "bg-linear-to-r from-orange-50/50 to-amber-50/50 border-amber-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-xl ${
                          trendingWatch ? "bg-orange-100" : "bg-gray-100"
                        }`}
                      >
                        <BsGraphUp
                          className={`w-5 h-5 ${
                            trendingWatch ? "text-orange-600" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Trending</p>
                        <p className="text-sm text-gray-600">
                          Feature in trending section
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        {...register("trending")}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-linear-to-r from-orange-500 to-amber-500 shadow-inner"></div>
                    </label>
                  </div>

                  {/* Featured Toggle */}
                  <div
                    className={`flex items-center justify-between p-5 rounded-xl border transition-all ${
                      featuredWatch
                        ? "bg-linear-to-r from-purple-50/50 to-pink-50/50 border-purple-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-xl ${
                          featuredWatch ? "bg-purple-100" : "bg-gray-100"
                        }`}
                      >
                        <BsStar
                          className={`w-5 h-5 ${
                            featuredWatch ? "text-purple-600" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Featured</p>
                        <p className="text-sm text-gray-600">
                          Show in featured section
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        {...register("featured")}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-linear-to-r from-purple-500 to-pink-500 shadow-inner"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={isUpdating || !isDirty}
                  className="w-full p-4 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <BsSave className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>

              {/* Edit Stats */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div className="p-4">
                    <div
                      className={`text-2xl font-bold ${isDirty ? "text-amber-600" : "text-emerald-600"}`}
                    >
                      {isDirty ? "Unsaved" : "Saved"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Status</div>
                  </div>
                  <div className="p-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {
                        Object.keys(watch()).filter((key) => watch()[key])
                          .length
                      }
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Fields filled
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBook;
