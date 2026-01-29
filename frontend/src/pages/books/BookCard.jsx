import { useState } from "react";
import {
  BsCartPlus,
  BsHeart,
  BsEye,
  BsShare,
  BsStarFill,
  BsStar,
  BsFire,
} from "react-icons/bs";
import { Link } from "react-router-dom";
import { useAddToCartMutation } from "../../app/features/cart/cartApi";
import { toast } from "react-hot-toast";

const BookCard = ({ book }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addToCart] = useAddToCartMutation();

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = (bookId, quantity = 1) => {
    const addToCartPromise = addToCart({
      bookId,
      quantity,
    }).unwrap();

    toast.promise(addToCartPromise, {
      loading: "Adding to cart...",
      success: (res) => res?.message || "Added to cart!",
      error: (err) => err?.data?.message || "Something went wrong!",
    });
  };

  // Calculate discount percentage
  const calculateDiscount = () => {
    if (book?.price?.original && book?.price?.discounted) {
      return Math.round(
        ((book.price.original - book.price.discounted) / book.price.original) *
          100
      );
    }
    return 0;
  };

  // Generate star rating
  const renderStars = (rating = 4.5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        i < fullStars ? (
          <BsStarFill key={i} className="w-4 h-4 text-yellow-500" />
        ) : (
          <BsStar key={i} className="w-4 h-4 text-gray-300" />
        )
      );
    }
    return stars;
  };

  const discount = calculateDiscount();

  return (
    <div className="relative group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-indigo-300 hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 bg-linear-to-r from-red-600 to-pink-600 text-white text-xs font-bold rounded-full shadow-lg">
            -{discount}% OFF
          </span>
        </div>
      )}

      {/* Trending Badge */}
      {book?.trending ? (
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1 bg-linear-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
            <BsFire className="w-3 h-3" />
            Trending
          </span>
        </div>
      ) : (
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1 bg-linear-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
            <BsStarFill className="w-3 h-3" />
            Featured
          </span>
        </div>
      )}

      {/* Book Image */}
      <div
        className="relative h-64 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/books/${book?._id}`}>
          <img
            src={book?.coverImage?.url}
            alt={book?.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Quick Actions Overlay */}
        <div
          className={`absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 flex items-end justify-center p-4 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex gap-2">
            <button
              onClick={toggleWishlist}
              className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-lg transform hover:-translate-y-1"
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <BsHeart
                className={`w-5 h-5 ${
                  isWishlisted ? "text-red-500 fill-red-500" : "text-gray-700"
                }`}
              />
            </button>
            <Link to={`/books/${book?._id}`}>
              <button
                className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-lg transform hover:-translate-y-1"
                title="Quick View"
              >
                <BsEye className="w-5 h-5 text-gray-700" />
              </button>
            </Link>
            <button
              className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-lg transform hover:-translate-y-1"
              title="Share"
            >
              <BsShare className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Book Info */}
      <div className="p-3 flex-1 flex flex-col">
        {/* Title */}
        <Link to={`/books/${book?._id}`}>
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 h-14">
            {book?.title}
          </h3>
        </Link>

        {/* Author */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-1">
          by {book?.authors?.join(", ") || "Unknown Author"}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {renderStars(book?.ratings?.average)}
          </div>
          <span className="text-sm font-semibold text-gray-700">
            {book?.ratings?.average}
          </span>
          <span className="text-sm text-gray-500">
            ({book?.ratings?.count})
          </span>
        </div>

        {/* Price & Add to Cart */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              {discount > 0 ? (
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-900">
                      ₹{book?.price?.discounted?.toLocaleString() || "0"}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ₹{book?.price?.original?.toLocaleString() || "0"}
                    </span>
                  </div>
                  <p className="text-xs text-green-600 font-medium mt-1">
                    Save ₹
                    {(
                      book.price.original - book.price.discounted
                    ).toLocaleString()}
                  </p>
                </div>
              ) : (
                <span className="text-xl font-bold text-gray-900">
                  ₹{book?.price?.original?.toLocaleString() || "0"}
                </span>
              )}
            </div>

            <button
              onClick={() => handleAddToCart(book?._id, 1)}
              className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow hover:shadow-md cursor-pointer"
            >
              <BsCartPlus className="w-4 h-4" />
              <span className="text-sm">Add to cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
