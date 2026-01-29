import { Link, useParams } from "react-router-dom";
import { useFetchBookByIdQuery } from "../../app/features/books/booksApi";
import {
  FiStar,
  FiShoppingCart,
  FiTrendingUp,
  FiGlobe,
  FiTag,
  FiBook,
  FiPackage,
  FiCalendar,
  FiCheckCircle,
  FiChevronRight,
  FiShare2,
  FiHeart,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiClock,
} from "react-icons/fi";
import { useState } from "react";
import { toast } from "react-hot-toast";
import ReletedBooks from "./ReletedBooks";
import Review from "../review/Review";
import { useAddToCartMutation } from "../../app/features/cart/cartApi";

const BookDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { data, isLoading } = useFetchBookByIdQuery(id);
  const book = data?.data;

  const [addToCart] = useAddToCartMutation();

  const handleAddToCart = async (bookId) => {
    const addToCartPromise = addToCart({ bookId }).unwrap();

    toast.promise(addToCartPromise, {
      loading: "Adding to cart...",
      success: (res) => res?.message,
      error: (err) => err?.data?.message || "Something went wrong!",
    });

    await addToCartPromise;
  };

  const discount =
    book?.price?.original &&
    Math.round(
      ((book.price.original - book.price.discounted) / book.price.original) *
        100,
    );

  const features = [
    { icon: <FiTruck />, text: "Free delivery", subtext: "Above ₹499" },
    {
      icon: <FiShield />,
      text: "Secure transaction",
      subtext: "SSL protected",
    },
    { icon: <FiRefreshCw />, text: "10-day returns", subtext: "Easy returns" },
    { icon: <FiClock />, text: "Fast delivery", subtext: "2-3 business days" },
  ];
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-8">
        {/* Mobile View */}
        <div className="lg:hidden">
          {/* Title for Mobile */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              {book.title}
            </h1>
            <p className="text-gray-600 mt-1">
              by{" "}
              <span className="font-semibold text-gray-900">
                {book.authors.join(", ")}
              </span>
            </p>
          </div>

          {/* Image for Mobile */}
          <div className="p-4 mb-6">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={book?.coverImage?.url}
                alt={book.title}
                className="w-full h-auto max-h-[400px] object-contain mx-auto"
              />
            </div>
          </div>

          {/* Rating for Mobile */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FiStar
                    key={i}
                    size={16}
                    className={
                      i < Math.floor(book.ratings.average)
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="font-bold text-gray-900">
                {Number(book.ratings.average || 0).toFixed(1)}
              </span>
            </div>
            <span className="text-sm text-gray-600">
              {book.ratings.count} ratings
            </span>
          </div>

          {/* Price Section for Mobile */}
          <div className="bg-linear-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-1">Price</div>
              <div className="flex items-end gap-3">
                <span className="text-4xl lg:text-5xl font-bold text-gray-900">
                  ₹{book.price.discounted.toLocaleString()}
                </span>
                {book.price.original && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">
                      ₹{book.price.original.toLocaleString()}
                    </span>
                    <span className="px-3 py-1 bg-linear-to-r from-green-500 to-emerald-500 text-white font-bold rounded-full text-sm">
                      Save {discount}%
                    </span>
                  </>
                )}
              </div>
              {discount > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  You save: ₹
                  {(
                    book.price.original - book.price.discounted
                  ).toLocaleString()}
                </div>
              )}
            </div>

            {/* In Stock Status */}
            <div className="flex items-center gap-2 mb-6">
              {book.stock > 0 ? (
                <>
                  <FiCheckCircle className="text-green-600" />
                  <span className="text-green-700 font-medium">
                    In stock ({book.stock} available)
                  </span>
                </>
              ) : (
                <>
                  <FiPackage className="text-red-600" />
                  <span className="text-red-700 font-medium">Out of stock</span>
                </>
              )}
            </div>

            {/* Quantity & Action Buttons */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  Only {book.stock} items left!
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleAddToCart(book._id)}
                  className="flex-1 px-6 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <FiShoppingCart size={20} />
                  Add to Cart
                </button>
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors w-full flex items-center justify-center gap-2"
                  >
                    <FiHeart
                      size={20}
                      className={
                        isWishlisted
                          ? "text-red-500 fill-red-500"
                          : "text-gray-600"
                      }
                    />
                    Wishlist
                  </button>
                  <button className="p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors w-full flex items-center justify-center gap-2">
                    <FiShare2 size={20} className="text-gray-600" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Features for Mobile */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-3 rounded-xl shadow-sm text-center"
              >
                <div className="text-indigo-600 flex justify-center mb-1">
                  {feature.icon}
                </div>
                <div className="text-xs font-medium text-gray-900">
                  {feature.text}
                </div>
                <div className="text-xs text-gray-500">{feature.subtext}</div>
              </div>
            ))}
          </div>

          {/* Book Details Grid for Mobile */}
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <FiBook size={14} />
                  <span className="text-xs">Category</span>
                </div>
                <div className="font-medium text-sm">
                  {book.category?.name || "Category"}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <FiGlobe size={14} />
                  <span className="text-xs">Language</span>
                </div>
                <div className="font-medium text-sm">{book.language}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <FiCalendar size={14} />
                  <span className="text-xs">Published</span>
                </div>
                <div className="font-medium text-sm">
                  {new Date(book.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <FiPackage size={14} />
                  <span className="text-xs">Publisher</span>
                </div>
                <div className="font-medium text-sm">{book.publisher}</div>
              </div>
            </div>
          </div>

          {/* Tags for Mobile */}
          {book.tags?.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                <FiTag /> Related Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {book.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Book Details Info for Mobile */}
          <div className="p-4">
            <h3 className="font-bold text-2xl text-gray-900 mb-4">
              Book Details
            </h3>
            <div className="flex flex-col gap-2 text-sm">
              <div>
                <span className="text-gray-600">ISBN:</span>
                <span className="font-medium ml-2">{book?.isbn}</span>
              </div>
              <div>
                <span className="text-gray-600">Format:</span>
                <span className="font-medium ml-2">Paperback</span>
              </div>
              <div>
                <span className="text-gray-600">Pages:</span>
                <span className="font-medium ml-2">450</span>
              </div>
              <div>
                <span className="text-gray-600">Dimensions:</span>
                <span className="font-medium ml-2">9.2 x 6.1 x 1.5 inches</span>
              </div>
              <div>
                <span className="text-gray-600">Weight:</span>
                <span className="font-medium ml-2">{1.2} kg</span>
              </div>
              <div>
                <span className="text-gray-600">Publisher:</span>
                <span className="font-medium ml-2">{book?.publisher}</span>
              </div>
              <div>
                <span className="text-gray-600">Language:</span>
                <span className="font-medium ml-2">{book?.language}</span>
              </div>
              <div>
                <span className="text-gray-600">Category:</span>
                <span className="font-medium ml-2">
                  {book?.category?.name || "Category"}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Publish Date:</span>
                <span className="font-medium ml-2">
                  {new Date(book?.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Author:</span>
                <span className="font-medium ml-2">
                  {book?.authors.join(", ")}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Stock:</span>
                <span className="font-medium ml-2">
                  {book?.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Rating:</span>
                <span className="font-medium ml-2">
                  {book?.ratings.average} / 5 {"⭐"} ({book?.ratings.count}{" "}
                  reviews)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Images */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="">
                <div className="relative overflow-hidden">
                  <div className="flex gap-4">
                    <img
                      src={book?.coverImage?.url}
                      alt={book.title}
                      className="md:max-w-[50%] w-full object-contain  duration-500"
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-2xl text-gray-900 mb-4">
                        Book Details
                      </h3>
                      <div className="flex flex-col gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">ISBN:</span>
                          <span className="font-medium ml-2">{book?.isbn}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Format:</span>
                          <span className="font-medium ml-2">Paperback</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Pages:</span>
                          <span className="font-medium ml-2">450</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Dimensions:</span>
                          <span className="font-medium ml-2">
                            9.2 x 6.1 x 1.5 inches
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Weight:</span>
                          <span className="font-medium ml-2">{1.2} kg</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Publisher:</span>
                          <span className="font-medium ml-2">
                            {book?.publisher}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Language:</span>
                          <span className="font-medium ml-2">
                            {book?.language}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Category:</span>
                          <span className="font-medium ml-2">
                            {book?.category?.name || "Category"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Publish Date:</span>
                          <span className="font-medium ml-2">
                            {new Date(book?.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Author:</span>
                          <span className="font-medium ml-2">
                            {book?.authors.join(", ")}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Stock:</span>
                          <span className="font-medium ml-2">
                            {book?.stock > 0 ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Rating:</span>
                          <span className="font-medium ml-2">
                            {book?.ratings.average} / 5 {"⭐"} (
                            {book?.ratings.count} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-xl shadow-sm text-center"
                  >
                    <div className="text-indigo-600 flex justify-center mb-2">
                      {feature.icon}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {feature.text}
                    </div>
                    <div className="text-xs text-gray-500">
                      {feature.subtext}
                    </div>
                  </div>
                ))}
              </div>
              {/* Tags */}
              {book.tags?.length > 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-sm mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FiTag /> Related Topics
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {book.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Title and Author */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  {book.title}
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                  by{" "}
                  <span className="font-semibold text-gray-900">
                    {book.authors.join(", ")}
                  </span>
                </p>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar
                        key={i}
                        size={18}
                        className={
                          i < Math.floor(book.ratings.average)
                            ? "text-amber-400 fill-amber-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="font-bold text-gray-900">
                    {book.ratings.average}
                  </span>
                </div>
                <span className="text-gray-600">
                  {book.ratings.count} ratings
                </span>
                <span className="text-gray-400">|</span>
                <span className="text-green-600 font-medium">
                  <FiCheckCircle className="inline mr-1" />
                  {book.soldCount || 124}+ bought
                </span>
              </div>

              {/* Price Section */}
              <div className="bg-linear-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-1">Price</div>
                  <div className="flex items-end gap-3">
                    <span className="text-4xl lg:text-5xl font-bold text-gray-900">
                      ₹{book.price.discounted.toLocaleString()}
                    </span>
                    {book.price.original && (
                      <>
                        <span className="text-2xl text-gray-400 line-through">
                          ₹{book.price.original.toLocaleString()}
                        </span>
                        <span className="px-3 py-1 bg-linear-to-r from-green-500 to-emerald-500 text-white font-bold rounded-full text-sm">
                          Save {discount}%
                        </span>
                      </>
                    )}
                  </div>
                  {discount > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      You save: ₹
                      {(
                        book.price.original - book.price.discounted
                      ).toLocaleString()}
                    </div>
                  )}
                </div>

                {/* In Stock Status */}
                <div className="flex items-center gap-2 mb-6">
                  {book.stock > 0 ? (
                    <>
                      <FiCheckCircle className="text-green-600" />
                      <span className="text-green-700 font-medium">
                        In stock ({book.stock} available)
                      </span>
                    </>
                  ) : (
                    <>
                      <FiPackage className="text-red-600" />
                      <span className="text-red-700 font-medium">
                        Out of stock
                      </span>
                    </>
                  )}
                </div>

                {/* Quantity & Action Buttons */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() =>
                          setQuantity((prev) => Math.max(1, prev - 1))
                        }
                        className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center font-medium">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((prev) => prev + 1)}
                        className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-sm text-gray-600">
                      Only {book.stock} items left!
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleAddToCart(book._id)}
                      className="flex-1 px-6 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FiShoppingCart size={20} />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className="p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <FiHeart
                        size={20}
                        className={
                          isWishlisted
                            ? "text-red-500 fill-red-500"
                            : "text-gray-600"
                        }
                      />
                    </button>
                    <button className="p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                      <FiShare2 size={20} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Book Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <FiBook />
                    <span className="text-sm">Category</span>
                  </div>
                  <div className="font-medium">
                    {book.category?.name || "Category"}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <FiGlobe />
                    <span className="text-sm">Language</span>
                  </div>
                  <div className="font-medium">{book.language}</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <FiCalendar />
                    <span className="text-sm">Published</span>
                  </div>
                  <div className="font-medium">
                    {new Date(book.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <FiPackage />
                    <span className="text-sm">Publisher</span>
                  </div>
                  <div className="font-medium">{book.publisher}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section - Common for both */}
        <div className="border-b pt-12 pb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Description</h2>
          <div className="prose max-w-none text-gray-700 leading-relaxed space-y-4">
            <p className="md:text-md">{book.description}</p>
          </div>
        </div>

        {/* Review Section */}
        <div className="mt-12">
          <Review bookId={book._id} />
        </div>

        {/* Related Books Section */}
        <div className="mt-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Frequently Bought Together
              </h2>
              <p className="text-gray-600 mt-1 text-sm md:text-base">
                Customers who bought this item also bought
              </p>
            </div>
            <Link
              to="/books"
              className="text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1 text-sm md:text-base"
            >
              View all <FiChevronRight />
            </Link>
          </div>
          <ReletedBooks
            categoryId={book?.category?._id}
            currentBookId={book._id}
          />
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
