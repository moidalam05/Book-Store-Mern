import { useEffect } from "react";
import InputField from "../addBook/InputField";
import SelectField from "../addBook/SelectField";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import {
  useFetchBookByIdQuery,
  useUpdateBookMutation,
} from "../../../app/features/books/booksApi.js";
import Loading from "../../../components/Loading";
import Swal from "sweetalert2";

const EditBook = () => {
  const { id } = useParams();
  const { data, isLoading, isError, refetch } = useFetchBookByIdQuery(id);

  const bookData = data?.data;

  console.log(bookData);

  const [updateBook] = useUpdateBookMutation();
  const { register, handleSubmit, setValue, reset } = useForm();

  useEffect(() => {
    if (bookData) {
      setValue("title", bookData.title);
      setValue("description", bookData.description);
      setValue("category", bookData.category);
      setValue("trending", bookData.trending);
      setValue("oldPrice", bookData.oldPrice);
      setValue("newPrice", bookData.newPrice);
      setValue("coverImage", bookData.coverImage);
    }
  }, [bookData, setValue]);

  const onSubmit = async (data) => {
    const updateBookData = {
      title: data.title,
      description: data.description,
      category: data.category,
      trending: data.trending,
      oldPrice: Number(data.oldPrice),
      newPrice: Number(data.newPrice),
      coverImage: data.coverImage || bookData.coverImage,
    };

    try {
      await updateBook({ id, ...updateBookData }).unwrap();

      Swal.fire({
        title: "Book Updated",
        text: "Book updated successfully!",
        icon: "success",
        confirmButtonColor: "#3b82f6",
      });

      refetch();
    } catch (error) {
      alert("Failed to update book.");
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <div>Error fetching book data...</div>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Edit Book
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <InputField
          label="Title"
          name="title"
          placeholder="Enter book title"
          register={register}
        />

        {/* Modern Textarea */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Description
          </label>
          <textarea
            {...register("description")}
            rows="5"
            placeholder="Enter book description..."
            className="p-2 border w-full rounded-md focus:outline-none focus:ring focus:border-blue-300"
          ></textarea>
        </div>

        <SelectField
          label="Category"
          name="category"
          options={[
            { value: "", label: "Choose A Category" },
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

        <InputField
          label="Cover Image URL"
          name="coverImage"
          type="text"
          placeholder="Enter image filename or URL"
          register={register}
        />

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg 
                     font-semibold rounded-lg transition shadow-md"
        >
          Update Book
        </button>
      </form>
    </div>
  );
};

export default EditBook;
