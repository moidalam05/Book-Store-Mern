import React, { useState } from "react";
import InputField from "./InputField";
import SelectField from "./SelectField";
import { useForm } from "react-hook-form";
import { useCreateBookMutation } from "../../../app/features/books/booksApi.js";
import Swal from "sweetalert2";

const AddBook = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [imageFile, setimageFile] = useState(null);
  const [imageFileName, setimageFileName] = useState("");

  const [createBook, { isLoading }] = useCreateBookMutation();

  const onSubmit = async (data) => {
    const newBookData = {
      ...data,
      coverImage: imageFileName,
    };

    try {
      await createBook(newBookData).unwrap();
      Swal.fire({
        title: "Added Successfully!",
        text: "Your book has been uploaded.",
        icon: "success",
        confirmButtonColor: "#4F46E5",
      });
      reset();
      setimageFileName("");
      setimageFile(null);
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: "Failed to add book. Please try again.",
        icon: "error",
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setimageFile(file);
      setimageFileName(file.name);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl p-8 border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Add New Book</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <InputField
          label="Book Title"
          name="title"
          placeholder="Enter book title"
          register={register}
        />

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Description
          </label>

          <textarea
            {...register("description")}
            rows="5"
            placeholder="Enter a detailed book description..."
            className="p-2 border w-full rounded-md focus:outline-none focus:ring focus:border-blue-300"
          ></textarea>

          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* Category */}
        <SelectField
          label="Select Category"
          name="category"
          options={[
            { value: "", label: "Choose Category" },
            { value: "business", label: "Business" },
            { value: "technology", label: "Technology" },
            { value: "fiction", label: "Fiction" },
            { value: "horror", label: "Horror" },
            { value: "adventure", label: "Adventure" },
          ]}
          register={register}
        />

        {/* Trending */}
        <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
          <input
            type="checkbox"
            {...register("trending")}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label className="text-gray-700 font-medium">Mark as Trending</label>
        </div>

        {/* Prices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Old Price"
            name="oldPrice"
            type="number"
            placeholder="Enter old price"
            register={register}
          />

          <InputField
            label="New Price"
            name="newPrice"
            type="number"
            placeholder="Enter new price"
            register={register}
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Cover Image
          </label>

          <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-xl py-10 hover:bg-gray-50 cursor-pointer transition">
            <svg
              className="w-10 h-10 text-indigo-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 5v14m7-7H5"
              />
            </svg>
            <span className="mt-2 text-gray-600 font-medium">
              {imageFileName || "Click to upload image"}
            </span>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-md transition"
        >
          {isLoading ? "Adding..." : "Add Book"}
        </button>
      </form>
    </div>
  );
};

export default AddBook;
