import { useState } from "react";
import BookCard from "../books/BookCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import {
  BsCalendar,
  BsFilter,
  BsSortDown,
  BsArrowRight,
  BsBook,
  BsBookmarkStar,
} from "react-icons/bs";
import { useFetchAllBooksQuery } from "../../app/features/books/booksApi";
import { useFetchAllCategoriesQuery } from "../../app/features/category/categoryApi";

const NewReleasesPage = ({ scrollToSubscribe }) => {
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: bookData } = useFetchAllBooksQuery({
    category: selectedCategory === "all" ? undefined : selectedCategory,
    sortBy: sortBy,
  });
  const books = bookData?.data || [];

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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <BsCalendar className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                  Fresh Releases
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                New <span className="text-cyan-300">Book</span> Releases
              </h1>
              <p className="text-lg text-white/90 mb-8">
                Discover the latest and greatest books hitting the shelves this
                month. Be the first to read tomorrow's bestsellers today.
              </p>
            </div>
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <BsBook className="w-24 h-24 mb-4 opacity-20" />
                  <div className="text-3xl font-bold">
                    {bookData?.meta?.total}
                  </div>
                  <div className="text-sm opacity-90">New Releases</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats & Filters */}
      <div className="py-12">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-4">
              {/* Category Filter */}
              <div className="relative">
                <BsFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-white"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category?._id} value={category?._id}>
                      {category?.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-3">
                <BsSortDown className="w-5 h-5 text-gray-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 focus:outline-none font-medium"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Showing <span className="font-bold">{bookData?.meta?.total}</span>{" "}
              new releases
            </div>
          </div>
        </div>

        {/* New Releases Grid */}
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
              No new releases found
            </h3>
            <p className="text-gray-600">
              No books match the selected category. Try another category.
            </p>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-16 text-center">
          <div className="bg-linear-to-r from-blue-500 to-indigo-500 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Never Miss a New Release
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter and be the first to know about
              upcoming book releases, author events, and exclusive pre-order
              offers.
            </p>
            <button
              onClick={scrollToSubscribe}
              className="px-8 py-3 cursor-pointer bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all flex items-center gap-2 mx-auto"
            >
              Subscribe to Newsletter
              <BsArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewReleasesPage;
