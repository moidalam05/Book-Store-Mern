import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import avatarImg from "../assets/avatar.png";
import {
  HiMiniBars3CenterLeft,
  HiOutlineHeart,
  HiOutlineShoppingCart,
  HiOutlineUser,
  HiOutlineCog,
  HiOutlineBookmark,
  HiOutlineShoppingBag,
} from "react-icons/hi2";
import { GrLogout } from "react-icons/gr";
import { IoSearchOutline, IoClose } from "react-icons/io5";
import { BsBook, BsChevronDown } from "react-icons/bs";
import { useAuth } from "../context/AuthContext";
import { useGetCartQuery } from "../app/features/cart/cartApi";
import { toast } from "react-hot-toast";
import { FiHome } from "react-icons/fi";

const Navbar = () => {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  const { data: cartData } = useGetCartQuery();

  const cart = cartData?.data || {};
  const cartItem = cart?.items || [];

  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const navigation = [
    { name: "My Profile", href: "/profile", icon: <HiOutlineUser /> },
    { name: "My Addresses", href: "/addresses", icon: <FiHome /> },
    { name: "My Orders", href: "/orders", icon: <HiOutlineShoppingBag /> },
    { name: "Wishlist", href: "/wishlist", icon: <HiOutlineBookmark /> },
    { name: "Settings", href: "/settings", icon: <HiOutlineCog /> },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsDropDownOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    const logoutPromise = logout().unwrap();

    toast.promise(logoutPromise, {
      loading: "Logging out...",
      success: (res) => res?.message || "Logout successful",
      error: (err) => err?.data?.message || "Logout failed",
    });

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    await logoutPromise;

    window.location.reload();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    console.log("Searching:", searchQuery);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg" : "bg-white"
      }`}
    >
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Desktop Navigation */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="p-2 bg-linear-to-br from-indigo-600 to-purple-600 rounded-xl">
                <BsBook className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900 hidden md:block">
                Book<span className="text-indigo-600">Store</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6">
              <Link
                to="/"
                className={`text-gray-700 hover:text-indigo-600 font-medium transition-colors ${
                  location.pathname === "/" ? "text-indigo-600" : ""
                }`}
              >
                Home
              </Link>
            </div>
          </div>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex relative max-w-xl flex-1 mx-6"
          >
            <IoSearchOutline className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books, authors, genres..."
              className="w-full pl-12 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </form>

          {/* Right Icons & User */}
          <div className="flex items-center gap-4">
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg"
            >
              <IoSearchOutline className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors relative"
            >
              <HiOutlineHeart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                2
              </span>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors relative"
            >
              <HiOutlineShoppingCart className="w-6 h-6" />
              {cartItem.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-linear-to-r from-indigo-600 to-purple-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {cartItem.length}
                </span>
              )}
            </Link>

            {/* User Profile */}
            <div className="relative">
              {currentUser ? (
                <>
                  <button
                    onClick={() => setIsDropDownOpen(!isDropDownOpen)}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <img
                      src={currentUser?.avatar?.url || avatarImg}
                      alt="avatar"
                      className="w-8 h-8 rounded-full ring-2 ring-indigo-100 object-cover object-center"
                    />

                    <div className="hidden md:block text-left">
                      <p className="text-sm font-semibold text-gray-900">
                        {currentUser?.name.split(" ")[0]}
                      </p>
                    </div>
                    <BsChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform ${
                        isDropDownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropDownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsDropDownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                        <div className="p-4 bg-linear-to-r from-indigo-50 to-purple-50 border-b">
                          <div className="flex items-center gap-3">
                            <img
                              src={currentUser?.avatar?.url || avatarImg}
                              className="w-10 h-10 rounded-full ring-2 ring-white"
                              alt="avatar"
                            />
                            <div>
                              <p className="font-semibold text-gray-900">
                                {currentUser?.name}
                              </p>
                              <p className="text-xs text-gray-600">
                                {currentUser?.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="py-2">
                          {currentUser?.role === "admin" && (
                            <Link
                              to="/dashboard"
                              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
                            >
                              <span className="text-gray-400">
                                <HiMiniBars3CenterLeft />
                              </span>
                              Dashboard
                            </Link>
                          )}
                          {navigation.map((item) => (
                            <Link
                              key={item.name}
                              to={item.href}
                              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
                            >
                              <span className="text-gray-400">{item.icon}</span>
                              {item.name}
                            </Link>
                          ))}
                        </div>

                        <div className="border-t border-gray-200">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <GrLogout className="w-5 h-5" />
                            Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm hover:shadow-md"
                >
                  <HiOutlineUser className="w-5 h-5" />
                  <span className="hidden md:inline font-medium">Sign In</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg"
            >
              <HiMiniBars3CenterLeft className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-linear-to-br from-indigo-600 to-purple-600 rounded-xl">
                    <BsBook className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">
                    BookStore
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <IoClose className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative mb-6">
                <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search books..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl outline-none"
                />
              </form>

              {/* Mobile Navigation */}
              <div className="space-y-2">
                <Link
                  to="/"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Home
                </Link>
                <Link
                  to="/books"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  All Books
                </Link>
                <Link
                  to="/bestsellers"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Bestsellers
                </Link>
                <Link
                  to="/new-releases"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  New Releases
                </Link>
                <Link
                  to="/special-offers"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Special Offers
                </Link>
              </div>

              {/* User Menu in Mobile */}
              {currentUser && (
                <div className="mt-8 pt-6 border-t">
                  <div className="flex items-center gap-3 mb-6">
                    <img
                      src={currentUser?.avatar?.url || avatarImg}
                      className="w-10 h-10 rounded-full"
                      alt="avatar"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {currentUser?.name}
                      </p>
                      <p className="text-sm text-gray-600">View Profile</p>
                    </div>
                  </div>

                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
