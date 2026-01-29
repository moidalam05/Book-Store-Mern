import { useState } from "react";
import InputField from "./InputField";
import SelectField from "./SelectField";
import { useForm } from "react-hook-form";
import { useCreateBookMutation } from "../../../app/features/books/booksApi.js";
import { toast } from "react-hot-toast";
import {
  BsUpload,
  BsBook,
  BsCurrencyDollar,
  BsTag,
  BsPeople,
  BsGlobe,
  BsHash,
  BsGraphUp,
  BsStar,
  BsBox,
  BsBookHalf,
  BsGear,
  BsPencilSquare,
  BsCardText,
  BsBuilding,
  BsFillCloudArrowUpFill,
  BsCheckCircle,
  BsPlusCircle,
} from "react-icons/bs";
import { useFetchAllCategoriesQuery } from "../../../app/features/category/categoryApi.js";

const AddBook = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm();

  const [imageFile, setImageFile] = useState(null);
  const [imageFileName, setImageFileName] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const [createBook, { isLoading }] = useCreateBookMutation();
  const { data: categoryData } = useFetchAllCategoriesQuery();
  const categories = categoryData?.data || [];

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

  const parseList = (value) => {
    if (!value || typeof value !== "string") return [];

    return value.includes("[")
      ? JSON.parse(value)
      : value
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean);
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("language", data.language || "");
      formData.append("publisher", data.publisher || "");
      formData.append("isbn", data.isbn || "");

      formData.append("authors", JSON.stringify(parseList(data.authors)));
      formData.append("tags", JSON.stringify(parseList(data.tags)));

      formData.append("trending", data.trending ? "true" : "false");
      formData.append("featured", data.featured ? "true" : "false");

      formData.append("stock", Number(data.stock));
      formData.append("price[original]", Number(data.price?.original || 0));
      formData.append("price[discounted]", Number(data.price?.discounted || 0));

      if (imageFile) {
        formData.append("coverImage", imageFile);
      }

      const promise = createBook(formData).unwrap();

      toast.promise(promise, {
        loading: "Uploading book details...",
        success: (res) => {
          return res.message || "Book added successfully 📚";
        },
        error: (err) => {
          setUploadProgress(0);
          return err?.data?.message || "Failed to add book";
        },
      });

      await promise;

      reset();
      setImageFile(null);
      setImagePreview(null);
      setImageFileName("");
    } catch (error) {
      console.error(error);
    }
  };

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

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Add New Book
              </h1>
              <p className="text-gray-600 mt-2 max-w-2xl">
                Fill in the details below to add a new book to your bookstore
                inventory. All fields marked with * are required.
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Basic Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Book Information Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-6 bg-linear-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      <BsPencilSquare className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Book Information
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Basic details about the book
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
                            <span>Book Title *</span>
                            <span className="text-xs font-normal text-gray-500">
                              {watch("title")?.length || 0}/200 characters
                            </span>
                          </div>
                        }
                        name="title"
                        placeholder="Clean Code: A Handbook of Agile Software Craftsmanship"
                        register={register}
                        required={true}
                        maxLength={200}
                        icon={<BsBookHalf className="w-5 h-5 text-gray-400" />}
                        error={errors.title}
                        className="text-lg font-medium"
                      />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <BsCardText className="w-4 h-4 text-gray-400" />
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
                          placeholder="Enter a comprehensive description of the book. Include key features, target audience, and unique selling points..."
                          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none group-hover:border-gray-400"
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
                    <SelectField
                      label="Category *"
                      name="category"
                      options={categories}
                      register={register}
                      required={true}
                      icon={<BsTag className="w-5 h-5 text-gray-400" />}
                      placeholder="Select a category"
                      error={errors.category}
                    />

                    <InputField
                      label="Language"
                      name="language"
                      placeholder="English, Spanish, French, etc."
                      register={register}
                      icon={<BsGlobe className="w-5 h-5 text-gray-400" />}
                    />

                    {/* Authors & Publisher */}
                    <div>
                      <InputField
                        label="Author(s) *"
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
                        Set pricing and stock management
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Price Section */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-linear-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
                          <InputField
                            label="Original Price *"
                            name="price[original]"
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

                        <div className="bg-linear-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100">
                          <InputField
                            label="Discounted Price"
                            name="price[discounted]"
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
                    <div className="bg-linear-to-br from-purple-50 to-pink-50 p-5 rounded-xl border border-purple-100">
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

                  {/* Tags */}
                  <div className="mt-6">
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
            <div className="space-y-6">
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
                        Upload book cover (Recommended: 600×800px)
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
                            alt="Preview"
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={removeImage}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                            title="Remove image"
                          >
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
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="block group cursor-pointer">
                        <div className="aspect-3/4 flex flex-col items-center justify-center border-3 border-dashed border-gray-300 rounded-2xl bg-linear-to-b from-gray-50 to-white hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-300">
                          <div className="text-center p-6">
                            <BsUpload className="w-16 h-16 text-gray-300 group-hover:text-purple-400 mb-4 transition-colors mx-auto" />
                            <p className="mb-2 text-sm font-medium text-gray-500 group-hover:text-purple-600">
                              Click to upload
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

                    {/* File Info & Progress */}
                    {imageFileName && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">
                              {imageFileName}
                            </p>
                            <p className="text-xs text-gray-500">
                              Ready to upload
                            </p>
                          </div>
                        </div>
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
                      <BsGear className="w-6 h-6 text-amber-600" />
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

                <div className="p-6 space-y-4">
                  {/* Trending Toggle */}
                  <div className="flex items-center justify-between p-4 bg-linear-to-r from-orange-50/50 to-amber-50/50 rounded-xl border border-amber-200/50 hover:border-amber-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <BsGraphUp className="w-5 h-5 text-orange-600" />
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
                  <div className="flex items-center justify-between p-4 bg-linear-to-r from-purple-50/50 to-pink-50/50 rounded-xl border border-purple-200/50 hover:border-purple-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <BsStar className="w-5 h-5 text-purple-600" />
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full p-4 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Adding Book...</span>
                  </>
                ) : (
                  <>
                    <BsPlusCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span>Publish Book</span>
                  </>
                )}
              </button>

              {/* Form Stats */}
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3">
                    <div className="text-2xl font-bold text-gray-900">
                      {
                        Object.keys(watch()).filter((key) => watch()[key])
                          .length
                      }
                    </div>
                    <div className="text-xs text-gray-500">Fields filled</div>
                  </div>
                  <div className="p-3">
                    <div className="text-2xl font-bold text-gray-900">
                      {imagePreview ? 1 : 0}
                    </div>
                    <div className="text-xs text-gray-500">Images</div>
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

export default AddBook;
