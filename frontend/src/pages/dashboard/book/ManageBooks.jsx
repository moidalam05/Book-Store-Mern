import { useState } from "react";
import {
  useDeleteBookMutation,
  useFetchAllBooksQuery,
  useUpdateBookStatusMutation,
} from "../../../app/features/books/booksApi.js";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  BsSearch,
  BsFilter,
  BsSortDown,
  BsPencil,
  BsTrash,
  BsBook,
  BsCurrencyDollar,
  BsTag,
  BsPeople,
  BsBox,
  BsStar,
  BsGraphUp,
  BsClock,
  BsCheckCircle,
  BsXCircle,
  BsUnlock,
  BsLock,
} from "react-icons/bs";
import { useFetchAllCategoriesQuery } from "../../../app/features/category/categoryApi.js";
import Loading from "../../../components/Loading.jsx";

const ManageBooks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const {
    data: booksData,
    refetch,
    isLoading,
  } = useFetchAllBooksQuery({
    category: selectedCategory === "all" ? undefined : selectedCategory,
    sortBy: sortBy,
    search: searchTerm,
  });
  const books = booksData?.data || [];

  const { data: categoryData } = useFetchAllCategoriesQuery({ active: true });
  const categories = categoryData?.data || [];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
    { value: "recommended", label: "Recommended" },
    { value: "trending", label: "Trending" },
    { value: "featured", label: "Featured" },
  ];

  const [updateBookStatus] = useUpdateBookStatusMutation();
  const [deleteBook] = useDeleteBookMutation();

  const handleBookStatus = async (id) => {
    const statusPromise = updateBookStatus(id).unwrap();

    toast.promise(statusPromise, {
      loading: "Updating status...",
      success: (res) => res?.message || "Status updated successfully",
      error: (err) => err?.data?.message || "Failed to update status",
    });

    await statusPromise;
    refetch();
  };

  const handleDeleteBook = async (id) => {
    const deletePromise = deleteBook(id).unwrap();
    toast.promise(deletePromise, {
      loading: "Deleting book...",
      success: (res) => res?.message || "Book deleted successfully",
      error: (err) => err?.data?.message || "Failed to delete book",
    });

    await deletePromise;
    refetch();
  };

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return `₹${price.original} → ₹${price.discounted}`;
  };

  const formatAuthors = (authors) => {
    if (!authors) return "N/A";
    return authors.length > 2
      ? `${authors.slice(0, 2).join(", ")}...`
      : authors.join(", ");
  };

  const StatusBadge = ({ status, isAvailable }) => {
    if (status && isAvailable) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <BsCheckCircle className="w-3 h-3 mr-1" />
          Active
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <BsXCircle className="w-3 h-3 mr-1" />
        Inactive
      </span>
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
                <BsBook className="w-10 h-10 text-indigo-600" />
                Manage Books
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your bookstore inventory ({booksData?.meta?.totalBooks}{" "}
                books total)
              </p>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Search */}
            <div className="relative">
              <BsSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title, author, ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <BsFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none bg-white"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category?._id} value={category?._id}>
                    {category?.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <BsSortDown className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none bg-white"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Books</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {booksData?.meta?.totalBooks}
                  </p>
                </div>
                <BsBook className="w-10 h-10 text-indigo-500" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Featured Books</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {books.filter((b) => b.featured).length}
                  </p>
                </div>
                <BsStar className="w-10 h-10 text-yellow-500" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Trending Books</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {books.filter((b) => b.trending).length}
                  </p>
                </div>
                <BsGraphUp className="w-10 h-10 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Low Stock</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {booksData?.meta?.lowStock || 0}
                  </p>
                </div>
                <BsBox className="w-10 h-10 text-red-500" />
              </div>
            </div>
          </div>

          {/* Books Table */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-linear-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Book Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <BsPeople className="w-4 h-4" />
                        Authors
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <BsTag className="w-4 h-4" />
                        Category
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <BsCurrencyDollar className="w-4 h-4" />
                        Price
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <BsBox className="w-4 h-4" />
                        Stock
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {books?.map((book) => (
                    <tr
                      key={book._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Book Details */}
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-4">
                          <div className="shrink-0 w-16 h-20 rounded-lg overflow-hidden border border-gray-200">
                            {book.coverImage?.url ? (
                              <img
                                src={book.coverImage.url}
                                alt={book.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <BsBook className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {book.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              ISBN: {book.isbn || "N/A"}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              {book.featured && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                  <BsStar className="w-3 h-3 mr-1" />
                                  Featured
                                </span>
                              )}
                              {book.trending && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  <BsGraphUp className="w-3 h-3 mr-1" />
                                  Trending
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Authors */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {formatAuthors(book.authors)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {book.publisher}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                          {book?.category?.name || "Uncategorized"}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {book.language}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatPrice(book.price)}
                        </div>
                        {book.price?.discounted < book.price?.original && (
                          <div className="text-xs text-green-600 font-medium mt-1">
                            Save ₹
                            {(
                              book.price.original - book.price.discounted
                            ).toFixed(2)}
                          </div>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="px-6 py-4">
                        <div
                          className={`text-lg font-bold ${
                            book.stock > 10
                              ? "text-green-600"
                              : book.stock > 0
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {book.stock || 0}
                        </div>
                        <div
                          className={`text-xs font-medium ${
                            book.stock > 10
                              ? "text-green-700"
                              : book.stock > 0
                                ? "text-yellow-700"
                                : "text-red-700"
                          }`}
                        >
                          {book.stock > 10
                            ? "In Stock"
                            : book.stock > 0
                              ? "Low Stock"
                              : "Out of Stock"}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <StatusBadge
                          status={book.status}
                          isAvailable={book.isAvailable}
                        />
                        <div className="text-xs text-gray-500 mt-1 flex items-center">
                          <BsClock className="w-3 h-3 inline mr-1" />
                          {new Date(book.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleBookStatus(book?._id)}
                            className={`p-2 rounded-lg transition-colors cursor-pointer ${
                              book?.status
                                ? "text-green-500 hover:text-green-600 hover:bg-green-50"
                                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                            }`}
                            title={
                              book?.status
                                ? "Available - Click to lock"
                                : "Locked - Click to unlock"
                            }
                          >
                            {book?.status ? (
                              <BsUnlock className="w-4 h-4" />
                            ) : (
                              <BsLock className="w-4 h-4" />
                            )}
                          </button>
                          <Link
                            to={`/dashboard/manage-books/edit/${book._id}`}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <BsPencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() =>
                              handleDeleteBook(book._id, book.title)
                            }
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <BsTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* Empty State */}
                  {books.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-6 py-24 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <BsBook className="w-16 h-16 text-gray-400 mb-4" />
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            No books found
                          </h3>
                          <p className="text-gray-600 mb-6">
                            {searchTerm
                              ? `No books match "${searchTerm}"`
                              : "No books in this category"}
                          </p>
                          <Link
                            to="/dashboard/add-book"
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                          >
                            Add Your First Book
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Info */}
          <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
            <div>
              Showing <span className="font-semibold">{books.length}</span> of{" "}
              <span className="font-semibold">{books.length}</span> books
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs px-3 py-1 bg-gray-100 rounded-full">
                Total: {books.length}
              </span>
              <span className="text-xs px-3 py-1 bg-green-100 text-green-800 rounded-full">
                Featured: {books.filter((b) => b.featured).length}
              </span>
              <span className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                Trending: {books.filter((b) => b.trending).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBooks;
