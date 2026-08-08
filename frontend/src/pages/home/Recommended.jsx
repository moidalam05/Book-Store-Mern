import { useState } from "react";
import BookCard from "../books/BookCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useFetchAllBooksQuery } from "../../app/features/books/booksApi";
import {
  BsStars,
  BsArrowRight,
  BsBookmarkCheck,
  BsLightbulb,
  BsPersonCheck,
  BsStarFill,
} from "react-icons/bs";
import { Link } from "react-router-dom";

const Recommended = () => {
  const [activeFilter, setActiveFilter] = useState("trending");

  const { data: bookData } = useFetchAllBooksQuery({
  });
  const books = bookData?.data || [];

  const filters = [
    { id: "trending", label: "Trending Now", icon: <BsStars /> },
    { id: "new", label: "New Arrivals", icon: <BsBookmarkCheck /> },
    { id: "topRated", label: "Top Rated", icon: <BsLightbulb /> },
    { id: "featured", label: "Featured", icon: <BsStarFill /> },
  ];

  return (
    <div className="py-16">
      <div>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-linear-to-r from-purple-100 to-pink-100 rounded-lg">
                <BsStars className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-purple-600 uppercase tracking-wider">
                Curated For You
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Recommended{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-600">
                Just For You
              </span>
            </h2>
            <p className="text-gray-600 mt-2">
              Handpicked books based on your interests and reading history
            </p>
          </div>

          {/* View All Button */}
          <Link
            to="/books"
            className="inline-flex cursor-pointer items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl group"
          >
            View All Recommendations
            <BsArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-10">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                activeFilter === filter.id
                  ? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-purple-200"
              }`}
            >
              <span className="text-lg">{filter.icon}</span>
              {filter.label}
            </button>
          ))}
        </div>

        {/* Recommended Books Slider */}
        {books.length > 0 ? (
          <div className="relative">
            {/* Custom Navigation Buttons */}
            <div className="hidden lg:flex absolute top-1/2 -left-16 -translate-y-1/2 z-20"></div>

            <div className="hidden lg:flex absolute top-1/2 -right-16 -translate-y-1/2 z-20"></div>

            <Swiper
              slidesPerView={1}
              spaceBetween={24}
              navigation={{
                nextEl: ".recommended-next",
                prevEl: ".recommended-prev",
              }}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
              }}
              breakpoints={{
                480: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
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
              className="recommendedSwiper pb-12"
            >
              {books.map((book) => (
                <SwiperSlide key={book._id}>
                  <div className="h-full transform transition-transform duration-300 hover:-translate-y-2">
                    <BookCard book={book} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="text-center py-16 bg-linear-to-br from-gray-50 to-white rounded-2xl border border-gray-200">
            <BsStars className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No recommendations yet
            </h3>
            <p className="text-gray-600 mb-6">
              Complete your profile to get personalized book recommendations
            </p>
            <button className="px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all">
              Update Reading Preferences
            </button>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .recommendedSwiper .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: #d1d5db;
          opacity: 1;
        }
        .recommendedSwiper .swiper-pagination-bullet-active {
          background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
          width: 30px;
          border-radius: 5px;
        }
        .recommendedSwiper .swiper-slide {
          height: auto;
        }
      `}</style>
    </div>
  );
};

export default Recommended;
