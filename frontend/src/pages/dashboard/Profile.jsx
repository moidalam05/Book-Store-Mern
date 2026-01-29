import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiEdit,
  FiMail,
  FiUser,
  FiCalendar,
  FiPhone,
  FiMapPin,
  FiGlobe,
  FiPlus,
  FiChevronRight,
  FiSettings,
  FiHeart,
  FiShoppingBag,
} from "react-icons/fi";
import { BsStarFill, BsShieldCheck } from "react-icons/bs";
import { useGetProfileStatsQuery } from "../../app/features/users/userApi";
import Loading from "../../components/Loading";

const Profile = () => {
  const { currentUser } = useAuth();

  const { data: profileStats, isLoading } = useGetProfileStatsQuery();
  const userStats = profileStats?.data;

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Profile
              </h1>
              <p className="text-gray-600">
                Manage your account, preferences, and reading history
              </p>
            </div>
            <Link
              to={`${currentUser?.role === "admin" ? "/dashboard" : "/"}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FiChevronRight className="rotate-180" size={16} />
              Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-1 gap-8">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">
                    Profile Overview
                  </h2>
                  <span className="text-blue-100 text-sm font-medium">
                    Member since{" "}
                    {new Date(userStats?.memberSince).getFullYear()}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <img
                        src={currentUser?.avatar?.url || "/avatar.png"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-linear-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white shadow-lg">
                      <span className="text-sm font-bold">
                        {currentUser?.role?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {currentUser?.name || "Guest User"}
                        </h3>
                        <div className="flex items-center gap-3 mt-2">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                              currentUser?.role === "admin"
                                ? "bg-red-100 text-red-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {currentUser?.role?.toUpperCase() || "READER"}
                          </span>
                          <span className="flex items-center gap-1.5 text-sm text-gray-600">
                            <BsStarFill className="w-4 h-4 text-yellow-500" />
                            <span className="font-medium">4.8</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500">Rating</span>
                          </span>
                        </div>
                      </div>
                      <Link
                        to={`${
                          currentUser?.role === "admin"
                            ? `/dashboard/edit-profile/${currentUser?._id}`
                            : `/edit-profile/${currentUser?._id}`
                        }`}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors group"
                      >
                        <FiEdit
                          size={16}
                          className="group-hover:rotate-12 transition-transform"
                        />
                        Edit Profile
                      </Link>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FiMail className="w-4 h-4 text-gray-400" />
                        <span>{currentUser?.email || "user@example.com"}</span>
                      </div>
                      {currentUser?.phone && (
                        <>
                          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                          <div className="flex items-center gap-2">
                            <FiPhone className="w-4 h-4 text-gray-400" />
                            <span>{currentUser.phone}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-linear-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <div className="text-2xl font-bold text-blue-700 mb-1">
                      {userStats?.booksBought}
                    </div>
                    <div className="text-sm text-blue-600 font-medium">
                      Books Bought
                    </div>
                  </div>
                  <div className="p-4 bg-linear-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                    <div className="text-2xl font-bold text-purple-700 mb-1">
                      {userStats?.pendingOrders}
                    </div>
                    <div className="text-sm text-purple-600 font-medium">
                      Pending Orders
                    </div>
                  </div>
                  <div className="p-4 bg-linear-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                    <div className="text-2xl font-bold text-emerald-700 mb-1">
                      {userStats?.totalReviews}
                    </div>
                    <div className="text-sm text-emerald-600 font-medium">
                      Total Review
                    </div>
                  </div>
                  <div className="p-4 bg-linear-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200">
                    <div className="text-2xl font-bold text-amber-700 mb-1">
                      {userStats.points}
                    </div>
                    <div className="text-sm text-amber-600 font-medium">
                      Points
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information & Address Section */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Information Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-blue-50 rounded-lg">
                    <FiUser className="text-blue-600" size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Personal Information
                  </h3>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl">
                      <FiUser className="text-gray-400" size={18} />
                      <span className="font-medium text-gray-900">
                        {currentUser?.name || "—"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl">
                      <FiMail className="text-gray-400" size={18} />
                      <span className="font-medium text-gray-900">
                        {currentUser?.email || "—"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Account Status
                    </label>
                    <div className="flex items-center gap-3 p-3.5 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <BsShieldCheck className="text-green-600" size={20} />
                      <div>
                        <span className="font-medium text-green-700 block">
                          Verified Account
                        </span>
                        <span className="text-xs text-green-600">
                          Fully authenticated
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Management Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg">
                    <FiMapPin className="text-indigo-600" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Address Management
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Manage your delivery addresses
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-5 bg-linear-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 text-center">
                    <div className="w-16 h-16 bg-linear-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiMapPin className="text-blue-600" size={24} />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Manage Your Addresses
                    </h4>
                    <p className="text-gray-600 mb-6 text-sm">
                      Add, edit, or remove delivery addresses for faster
                      checkout
                    </p>
                    <Link
                      to="/addresses"
                      className="inline-flex items-center justify-center gap-2 w-full py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg group"
                    >
                      <FiPlus
                        size={18}
                        className="group-hover:rotate-90 transition-transform"
                      />
                      Manage Addresses
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/orders"
                      className="p-4 bg-linear-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                          <FiShoppingBag
                            className="text-gray-600 group-hover:text-blue-600"
                            size={18}
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 group-hover:text-blue-700">
                            Orders
                          </div>
                          <div className="text-xs text-gray-600">
                            Track & manage
                          </div>
                        </div>
                      </div>
                    </Link>

                    <Link
                      to="#"
                      className="p-4 bg-linear-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                          <FiHeart
                            className="text-gray-600 group-hover:text-purple-600"
                            size={18}
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 group-hover:text-purple-700">
                            Wishlist
                          </div>
                          <div className="text-xs text-gray-600">
                            Saved items
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Preferences Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-linear-to-r from-amber-50 to-orange-50 rounded-lg">
                    <FiSettings className="text-amber-600" size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Preferences & Settings
                  </h3>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-5">
                  <div className="p-4 bg-linear-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FiGlobe className="text-emerald-600" size={16} />
                      Language & Region
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Language</span>
                        <span className="text-sm font-medium text-gray-900">
                          English
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Region</span>
                        <span className="text-sm font-medium text-gray-900">
                          India
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="p-4 bg-linear-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FiCalendar className="text-purple-600" size={16} />
                      Member Since
                    </h4>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-700">
                        {new Date(userStats?.memberSince).getFullYear()}
                      </div>
                      <div className="text-sm text-purple-600">
                        {new Date(userStats?.memberSince).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
