import { Link } from "react-router-dom";
import bannerImg from "../../assets/banner.png";
import {
  BsArrowRight,
  BsStarFill,
  BsCalendar,
  BsArrowUpRight,
} from "react-icons/bs";

const Banner = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="relative container pb-10">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Text Content */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-indigo-100 to-purple-100 rounded-full">
                <BsCalendar className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-700">
                  New Release This Week
                </span>
              </div>
              <div className="px-4 py-2 bg-linear-to-r from-yellow-100 to-orange-100 rounded-full">
                <span className="text-sm font-medium text-orange-700">
                  🔥 Trending
                </span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Discover Your Next
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">
                Favorite Read
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Explore this week's most anticipated releases! From heart-pounding
              thrillers to captivating memoirs, we've curated the perfect
              collection to update your reading list and transport you to new
              worlds.
            </p>

            <Link
              to="/books"
              className="px-6 py-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl mb-8 max-w-fit"
            >
              Shop Now
              <BsArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-sm text-gray-500 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Join 10,000+ readers receiving weekly book recommendations
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mt-10">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">250+</div>
                <div className="text-sm text-gray-600">New Releases</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">4.8</div>
                <div className="text-sm text-gray-600">Avg. Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">50K+</div>
                <div className="text-sm text-gray-600">Happy Readers</div>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative">
            <div className="relative lg:ml-8">
              {/* Main Book Image */}
              <div className="relative">
                <img
                  src={bannerImg}
                  alt="Featured Book Collection"
                  className="w-full max-w-2xl mx-auto  transform lg:rotate-3 transition-transform duration-700 hover:rotate-0"
                />

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 md:-top-6 md:right-0 bg-white p-4 rounded-2xl border border-gray-200 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <BsArrowUpRight className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        45% OFF
                      </div>
                      <div className="text-sm text-gray-600">Best Sellers</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-white p-4 rounded-2xl border border-gray-200 animate-float animation-delay-1000">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <BsStarFill className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        4.9/5
                      </div>
                      <div className="text-sm text-gray-600">
                        Reader Reviews
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button for Mobile */}
            <div className="mt-8 lg:hidden">
              <button className="w-full py-4 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                Explore New Releases
                <BsArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Banner;
