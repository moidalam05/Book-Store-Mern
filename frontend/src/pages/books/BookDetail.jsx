import { useParams } from "react-router-dom";
import { useFetchBookByIdQuery } from "../../app/features/books/booksApi";
import { FiShoppingCart } from "react-icons/fi";
import { getImageUrl } from "../../utils/getImageUrl";
import { useDispatch } from "react-redux";
import { addToCart } from "../../app/features/cart/cartSlice";

const BookDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data, isLoading, isError } = useFetchBookByIdQuery(id);

  const book = data?.data;

  if (isLoading) return <p className="text-center py-10">Loading book...</p>;
  if (isError)
    return (
      <p className="text-center py-10 text-red-500">Failed to load book.</p>
    );

  const handleAddToCart = () => {
    dispatch(addToCart(book));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Image */}
        <div className="flex justify-center">
          <img
            src={getImageUrl(book.coverImage)}
            alt={book.title}
            className="w-auto object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Right: Book Details */}
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold mb-4">
            {book.title}
          </h1>

          {/* Category */}
          <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm capitalize mb-4">
            {book.category}
          </span>

          {/* Trending */}
          {book.trending && (
            <span className="ml-3 inline-block bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm">
              🔥 Trending
            </span>
          )}

          {/* Published Date */}
          <p className="text-gray-500 text-sm mb-3">
            Published on:{" "}
            <span className="font-medium text-gray-700">
              {new Date(book.createdAt).toLocaleDateString()}
            </span>
          </p>

          {/* Price */}
          <div className="flex items-center gap-4 my-5">
            <p className="text-2xl font-bold text-green-600">
              ${book.newPrice}
            </p>
            <p className="line-through text-gray-500 text-lg">
              ${book.oldPrice}
            </p>
          </div>

          {/* Description */}
          <p className="text-gray-700 leading-relaxed mb-8">
            {book.description}
          </p>

          {/* Add to Cart - Yellow Button */}
          <button
            onClick={handleAddToCart}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg flex items-center gap-2 text-lg font-semibold shadow-md cursor-pointer"
          >
            <FiShoppingCart size={20} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
