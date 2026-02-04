import { useState, useEffect } from "react";
import {
  BsFire,
  BsClock,
  BsCalendar,
  BsExclamationTriangle,
  BsChevronRight,
  BsGiftFill,
} from "react-icons/bs";
import { useGetAllCouponsQuery } from "../../app/features/coupon/couponApi";
import { Link } from "react-router-dom";

const SpecialOffersPage = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 15,
    minutes: 30,
    seconds: 45,
  });

  const { data: couponsData } = useGetAllCouponsQuery({ page: 1, limit: 4 });
  const flashDeals = couponsData?.data || [];

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;

        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            if (hours > 0) hours--;
            else {
              hours = 23;
              if (days > 0) days--;
            }
          }
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const upcomingOffers = [
    {
      title: "Black Friday Mega Sale",
      date: "Nov 24",
      discount: "Up to 70% OFF",
    },
    {
      title: "Cyber Monday Deals",
      date: "Nov 27",
      discount: "60% OFF Tech Books",
    },
    {
      title: "Christmas Special",
      date: "Dec 15",
      discount: "Buy 3, Pay for 2",
    },
    {
      title: "New Year Clearance",
      date: "Dec 30",
      discount: "Everything 50% OFF",
    },
  ];

  return (
    <div className="min-h-screen ">
      {/* Hero Countdown Section */}
      <div className="bg-linear-to-r from-orange-600 via-red-500 to-pink-600 text-white py-10">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                <BsFire className="w-8 h-8" />
              </div>
              <span className="text-lg font-semibold uppercase tracking-wider bg-white/20 px-4 py-2 rounded-full">
                Flash Sale Active
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8">
              MEGA <span className="text-yellow-300">DISCOUNT</span> SALE
            </h1>

            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
              Limited time offers! Don't miss your chance to save big on
              bestselling books.
            </p>

            {/* Main Countdown Timer */}
            <div className="px-2">
              <p className="text-base sm:text-lg mb-3 sm:mb-6 font-medium text-center ">
                Sale ends in:
              </p>

              {/* Mobile Horizontal Layout */}
              <div className="sm:hidden">
                <div className="flex items-center justify-center gap-3">
                  {Object.entries(timeLeft).map(([unit, value]) => (
                    <div key={unit} className="text-center flex-1">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center mb-1 mx-auto">
                        <span className="text-2xl font-bold">
                          {value.toString().padStart(2, "0")}
                        </span>
                        <span className="text-xs uppercase tracking-wider mt-1">
                          {unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop/Tabler Layout */}
              <div className="hidden sm:flex justify-center gap-3 md:gap-4 lg:gap-8">
                {Object.entries(timeLeft).map(([unit, value]) => (
                  <div key={unit} className="text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl flex flex-col items-center justify-center mb-2">
                      <span className="text-2xl sm:text-3xl md:text-4xl font-bold">
                        {value.toString().padStart(2, "0")}
                      </span>
                      <span className="text-xs sm:text-sm uppercase tracking-wider mt-1">
                        {unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flash Deals Section */}
      <div className="py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Flash <span className="text-orange-600">Deals</span>
            </h2>
            <p className="text-gray-600">Limited time offers ending soon</p>
          </div>
          <BsClock className="w-8 h-8 text-orange-600 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {flashDeals?.map((deal) => (
            <div
              key={deal._id}
              className="group bg-white rounded-2xl p-6 border-2 border-orange-200 hover:border-orange-400 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-xl text-orange-600">
                  <BsGiftFill />
                </div>
                <span className="px-3 py-1 bg-linear-to-r from-red-600 to-pink-600 text-white text-sm font-bold rounded-full">
                  {deal.discountType === "percentage"
                    ? `${deal.discountValue}% off`
                    : `FLAT ₹${deal.discountValue} off`}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {deal.title}
              </h3>
              <p className="text-gray-600 mb-4">{deal.description}</p>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <BsClock className="w-4 h-4" />
                  <span>
                    {new Date(deal.endDate).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="px-3 py-1 bg-gray-100 rounded-lg font-mono font-semibold">
                    {deal.code}
                  </div>
                  <Link
                    to="/books"
                    className="flex items-center gap-1 text-orange-600 hover:text-orange-700 font-semibold"
                  >
                    Shop Now
                    <BsChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Offers */}
        <div className="bg-linear-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-3 mb-8">
            <BsCalendar className="w-8 h-8 text-orange-400" />
            <h3 className="text-2xl font-bold">Upcoming Special Events</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingOffers.map((offer, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-orange-500 text-white text-sm font-bold rounded-full">
                    {offer.date}
                  </span>
                  <BsExclamationTriangle className="w-5 h-5 text-yellow-400" />
                </div>
                <h4 className="text-lg font-semibold mb-2">{offer.title}</h4>
                <p className="text-orange-300 font-bold">{offer.discount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialOffersPage;
