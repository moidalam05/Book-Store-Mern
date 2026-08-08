import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { FaUserPen } from "react-icons/fa6";
import Loading from "../../components/Loading.jsx";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import {
  BsChevronLeft,
  BsChevronRight,
  BsSearch,
  BsGrid,
  BsBook,
  BsList,
  BsBox,
  BsPerson,
  BsBell,
  BsGear,
  BsFolder2Open,
  BsChevronDown,
  BsChevronUp,
  BsPlus,
  BsTag,
  BsPersonCircle,
  BsPencilSquare,
  BsPeople,
  BsShieldLock,
  BsHouse,
  BsGraphUp,
  BsFileText,
  BsTicket,
  BsListUl,
} from "react-icons/bs";
import { useLogoutUserMutation } from "../../app/features/auth/authApi.js";

const DashboardLayout = () => {
  const [logoutUser, { isLoading }] = useLogoutUserMutation();
  const { setCurrentUser, currentUser } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [openSubmenus, setOpenSubmenus] = useState({
    manageBooks: false,
    manageCategory: false,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  // Main navigation items
  const navigation = [
    {
      name: "Dashboard",
      icon: <BsGrid className="w-5 h-5" />,
      active:
        pathname === "/dashboard" ||
        pathname === "/dashboard/analytics" ||
        pathname === "/dashboard/reports",
      type: "submenu",
      key: "dashboard",
      items: [
        {
          name: "Overview",
          href: "/dashboard",
          icon: <BsHouse className="w-4 h-4" />,
          active: pathname === "/dashboard",
        },
      ],
    },
    {
      name: "Manage Books",
      icon: <BsList className="w-5 h-5" />,
      active: pathname.startsWith("/dashboard/manage"),
      type: "submenu",
      key: "manageBooks",
      items: [
        {
          name: "All Books",
          href: "/dashboard/manage-books",
          icon: <BsBook className="w-4 h-4" />,
          active: pathname === "/dashboard/manage-books",
        },
        {
          name: "Add New",
          href: "/dashboard/manage-books/add",
          icon: <BsPlus className="w-4 h-4" />,
          active: pathname === "/dashboard/manage-books/add",
        },
      ],
    },
    // Add this to your navigation array after "Orders" item:
    {
      name: "Manage Orders",
      icon: <BsBox className="w-5 h-5" />,
      active: pathname.startsWith("/dashboard/orders"),
      type: "submenu",
      key: "ordersManagement",
      items: [
        {
          name: "All Orders",
          href: "/dashboard/orders",
          icon: <BsBox className="w-4 h-4" />,
          active: pathname === "/dashboard/orders",
        },
      ],
    },
    {
      name: "Manage Category",
      icon: <BsFolder2Open className="w-5 h-5" />,
      active: pathname.startsWith("/dashboard/category"),
      type: "submenu",
      key: "manageCategory",
      items: [
        {
          name: "All Categories",
          href: "/dashboard/category",
          icon: <BsTag className="w-4 h-4" />,
          active: pathname === "/dashboard/category",
        },
        {
          name: "Add Category",
          href: "/dashboard/category/add",
          icon: <BsPlus className="w-4 h-4" />,
          active: pathname === "/dashboard/category/add",
        },
      ],
    },

    {
      name: "Manage Coupons",
      icon: <BsTicket className="w-5 h-5" />,
      active: pathname.startsWith("/dashboard/coupon"),
      type: "submenu",
      key: "manageCoupons",
      items: [
        {
          name: "All Coupons",
          href: "/dashboard/coupon",
          icon: <BsListUl className="w-4 h-4" />,
          active: pathname === "/dashboard/coupon",
        },
        {
          name: "Add Coupon",
          href: "/dashboard/coupon/add",
          icon: <BsPlus className="w-4 h-4" />,
          active: pathname === "/dashboard/coupon/add",
        },
      ],
    },

    // Add this to your navigation array:
    {
      name: "Manage Profile",
      icon: <BsPerson className="w-5 h-5" />,
      active:
        pathname.startsWith("/dashboard/profile") ||
        pathname.startsWith("/dashboard/admin") ||
        pathname.startsWith("/dashboard/settings"),
      type: "submenu",
      key: "profileManagement",
      items: [
        {
          name: "My Profile",
          href: "/dashboard/profile",
          icon: <BsPersonCircle className="w-4 h-4" />,
          active: pathname === "/dashboard/profile",
        },

        {
          name: "Create Admin",
          href: "/dashboard/create-admin",
          icon: <FaUserPen className="w-4 h-4" />,
          active: pathname === "/dashboard/create-admin",
        },
        {
          name: "All Users",
          href: "/dashboard/all-users",
          icon: <BsPeople className="w-4 h-4" />,
          active: pathname === "/dashboard/all-users",
        },
      ],
    },
  ];

  const userMenu = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Profile", href: "/dashboard/profile" },
    { name: "Edit Profile", href: "/dashboard/edit-profile" },
    { name: "Settings", href: "/dashboard/settings" },
  ];

  const handleLogout = async () => {
    try {
      const response = await logoutUser().unwrap();
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setCurrentUser(null);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Toggle submenu
  const toggleSubmenu = (key) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Close mobile sidebar on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-open submenu if active
  useEffect(() => {
    if (pathname.startsWith("/dashboard/manage")) {
      setOpenSubmenus((prev) => ({ ...prev, manageBooks: true }));
    }
    if (pathname.startsWith("/dashboard/category")) {
      setOpenSubmenus((prev) => ({ ...prev, manageCategory: true }));
    }
  }, [pathname]);

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50/20">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-40
        bg-white shadow-xl border-r border-gray-200
        transition-all duration-300
        ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${isSidebarOpen ? "w-64" : "w-20"}
      `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-20 px-4 border-b border-gray-200">
          <div
            className={`flex items-center space-x-3 ${isSidebarOpen ? "lg:flex" : "hidden lg:flex"}`}
          >
            <Link to="/" className="w-10 h-10 bg-linear-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <div className={`${isSidebarOpen ? "lg:block" : "lg:hidden"}`}>
              <h2 className="text-gray-900 font-bold text-lg">BookStore</h2>
              <p className="text-gray-500 text-xs">Admin Panel</p>
            </Link>
          </div>

          {/* Toggle Button - Desktop */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden lg:flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <BsChevronLeft /> : <BsChevronRight />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <div className="space-y-1">
            {navigation.map((item) => {
              if (item.type === "link") {
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                      ${
                        item.active
                          ? "bg-linear-to-r from-indigo-50 to-purple-50 text-indigo-700 border-l-4 border-indigo-500"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                      }
                    `}
                  >
                    <span
                      className={`${item.active ? "text-indigo-600" : "text-gray-500"}`}
                    >
                      {item.icon}
                    </span>
                    <span
                      className={`font-medium ${isSidebarOpen ? "lg:inline" : "lg:hidden"}`}
                    >
                      {item.name}
                    </span>
                    {item.active && (
                      <span className="ml-auto w-2 h-2 bg-indigo-500 rounded-full"></span>
                    )}
                  </Link>
                );
              }

              // Submenu item
              if (item.type === "submenu") {
                const isOpen = openSubmenus[item.key];
                const ChevronIcon = isOpen ? BsChevronUp : BsChevronDown;

                return (
                  <div key={item.name} className="space-y-1">
                    <button
                      onClick={() => toggleSubmenu(item.key)}
                      className={`
                        w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200
                        ${
                          item.active
                            ? "bg-linear-to-r from-indigo-50 to-purple-50 text-indigo-700 border-l-4 border-indigo-500"
                            : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <span
                          className={`${item.active ? "text-indigo-600" : "text-gray-500"}`}
                        >
                          {item.icon}
                        </span>
                        <span
                          className={`font-medium text-left ${isSidebarOpen ? "lg:inline" : "lg:hidden"}`}
                        >
                          {item.name}
                        </span>
                      </div>
                      <ChevronIcon
                        className={`w-3 h-3 transition-transform ${isSidebarOpen ? "lg:inline" : "lg:hidden"} ${
                          item.active ? "text-indigo-600" : "text-gray-500"
                        }`}
                      />
                    </button>

                    {/* Submenu Items */}
                    {isOpen && (
                      <div className="ml-6 pl-4 border-l border-gray-200 space-y-1">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            onClick={() => setIsMobileSidebarOpen(false)}
                            className={`
                              flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200
                              ${
                                subItem.active
                                  ? "bg-indigo-50 text-indigo-600"
                                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                              }
                            `}
                          >
                            <span
                              className={`${subItem.active ? "text-indigo-500" : "text-gray-400"}`}
                            >
                              {subItem.icon}
                            </span>
                            <span
                              className={`text-sm font-medium ${isSidebarOpen ? "lg:inline" : "lg:hidden"}`}
                            >
                              {subItem.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-200 p-4">
          <div
            className={`flex items-center space-x-3 ${isSidebarOpen ? "lg:flex" : "lg:justify-center"}`}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-200">
              <img
                src={
                  currentUser?.avatar?.url || "https://via.placeholder.com/40"
                }
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <div className={`${isSidebarOpen ? "lg:block" : "lg:hidden"}`}>
              <p className="text-gray-900 font-medium text-sm">
                {currentUser?.name}
              </p>
              <p className="text-gray-500 text-xs truncate">
                {currentUser?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className={`ml-auto text-gray-500 hover:text-gray-700 ${isSidebarOpen ? "lg:block" : "lg:hidden"}`}
              title="Logout"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`
        flex-1 transition-all duration-300
        ${isSidebarOpen ? "md:ml-20 lg:ml-64" : "md:ml-20"}
      `}
      >
        {/* Top Navigation */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm h-20">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            {/* Left Section */}
            <div className="flex items-center w-full md:max-w-2xl space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              {/* Search Bar */}
              <div className="relative w-full">
                <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search books, orders, users..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-900 bg-white"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <BsBell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Settings */}
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <BsGear className="w-5 h-5" />
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-indigo-200">
                    <img
                      src={
                        currentUser?.avatar?.url ||
                        "https://via.placeholder.com/36"
                      }
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {currentUser?.name}
                    </p>
                    <p className="text-xs text-gray-500">Admin</p>
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-20 overflow-hidden">
                      <div className="p-4 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {currentUser?.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {currentUser?.email}
                        </p>
                      </div>
                      <div className="py-1">
                        {userMenu.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => setIsDropdownOpen(false)}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-gray-100 py-1">
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            handleLogout();
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
