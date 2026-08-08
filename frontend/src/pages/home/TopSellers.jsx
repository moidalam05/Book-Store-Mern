import { useState } from "react";
import BookCard from "../books/BookCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useFetchAllBooksQuery } from "../../app/features/books/booksApi";
import { useFetchAllCategoriesQuery } from "../../app/features/category/categoryApi";
import { BsFire, BsFilter, BsArrowRight, BsBookmarkStar } from "react-icons/bs";
import { Link } from "react-router-dom";

const TopSellers = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: bookData } = useFetchAllBooksQuery({
    category: selectedCategory === "all" ? undefined : selectedCategory
  });
  const books = bookData?.data || [];

  const { data: categoryData } = useFetchAllCategoriesQuery({ active: true });
  const categories = categoryData?.data || [];

  return (
    <div className="pt-16 pb-10">
      <div>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-linear-to-r from-orange-100 to-red-100 rounded-lg">
                <BsFire className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-orange-600 uppercase tracking-wider">
                Bestsellers
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Top{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-600 to-red-600">
                Selling
              </span>{" "}
              Books
            </h2>
            <p className="text-gray-600 mt-2">
              Discover our most popular books loved by thousands of readers
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <BsFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all appearance-none bg-white shadow-sm"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category?._id} value={category?._id}>
                    {category?.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Top Sellers Slider */}
        {books.length > 0 ? (
          <div className="relative">
            {/* Custom Navigation Buttons */}
            <div className="hidden lg:flex absolute top-1/2 -left-16 -translate-y-1/2 z-20"></div>

            <div className="hidden lg:flex absolute top-1/2 -right-16 -translate-y-1/2 z-20"></div>

            <Swiper
              slidesPerView={1}
              spaceBetween={24}
              navigation={{
                nextEl: ".top-sellers-next",
                prevEl: ".top-sellers-prev",
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 24,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 28,
                },
                1280: {
                  slidesPerView: 4,
                  spaceBetween: 32,
                },
              }}
              modules={[Pagination, Navigation, Autoplay]}
              className="topSellersSwiper pb-12"
            >
              {books.map((book) => (
                <SwiperSlide key={book._id}>
                  <div className="h-full">
                    <BookCard book={book} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="text-center py-12">
            <BsBookmarkStar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No top sellers found
            </h3>
            <p className="text-gray-600">
              No books match the selected category. Try another category.
            </p>
          </div>
        )}

        {/* Stats & Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-linear-to-r from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white rounded-lg">
                <BsFire className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Currently Trending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {books.filter((b) => b.trending).length} Books
                </p>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-r from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white rounded-lg">
                <span className="text-lg font-bold text-gray-900">⭐</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Number(bookData?.meta?.averageRating || 0).toFixed(1)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white rounded-lg">
                <span className="text-lg font-bold text-gray-900">📚</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total in Category</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookData?.meta?.total} Books
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* View All Button */}
        {books.length > 0 && (
          <div className="mt-10 text-center">
            <Link
              to="/books"
              className="inline-flex cursor-pointer items-center gap-2 px-8 py-4 bg-linear-to-r from-orange-600 to-red-600 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              View All Top Sellers
              <BsArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .topSellersSwiper .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: #d1d5db;
          opacity: 1;
        }
        .topSellersSwiper .swiper-pagination-bullet-active {
          background: linear-gradient(135deg, #f97316 0%, #ef4444 100%);
          width: 30px;
          border-radius: 5px;
        }
        .topSellersSwiper .swiper-slide {
          height: auto;
        }
      `}</style>
    </div>
  );
};

export default TopSellers;
