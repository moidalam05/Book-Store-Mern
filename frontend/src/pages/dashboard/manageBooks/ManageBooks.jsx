import {
  useDeleteBookMutation,
  useFetchAllBooksQuery,
} from "../../../app/features/books/booksApi.js";
import { Link } from "react-router-dom";

const ManageBooks = () => {
  const { data, refetch } = useFetchAllBooksQuery();
  const books = data?.data;

  const [deleteBook] = useDeleteBookMutation();

  const handleDeleteBook = async (id) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    try {
      await deleteBook(id).unwrap();
      alert("Book deleted successfully.");
      refetch();
    } catch (error) {
      console.error("Failed to delete book:", error.message);
      alert("Failed to delete book. Please try again.");
    }
  };

  return (
    <section className="py-10 bg-gray-100 min-h-screen">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">
              Manage Books
            </h1>
            <p className="text-gray-500">View, edit and delete books easily</p>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase">
                  #
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase">
                  Book Title
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase">
                  Category
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase">
                  Price
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {books &&
                books.map((book, index) => (
                  <tr
                    key={book._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-4 px-6 text-sm text-gray-700">
                      {index + 1}
                    </td>

                    <td className="py-4 px-6 text-sm font-medium text-gray-800">
                      {book.title}
                    </td>

                    <td className="py-4 px-6 capitalize text-sm text-gray-600">
                      {book.category}
                    </td>

                    <td className="py-4 px-6 text-sm font-semibold text-gray-800">
                      ${book.newPrice}
                    </td>

                    <td className="py-4 px-6 flex items-center gap-4">
                      <Link
                        to={`/dashboard/edit-book/${book._id}`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium transition"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDeleteBook(book._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

              {/* No Books */}
              {books?.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="py-10 text-center text-gray-500 text-sm"
                  >
                    No books available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ManageBooks;
