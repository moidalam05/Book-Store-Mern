import { useState } from "react";
import { Link } from "react-router-dom";
import avatarImg from "../assets/avatar.png";
import { HiMiniBars3CenterLeft } from "react-icons/hi2";
import { IoSearchOutline } from "react-icons/io5";
import {
  HiOutlineHeart,
  HiOutlineShoppingCart,
  HiOutlineUser,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Orders", href: "/orders" },
  { name: "Cart Page", href: "/card" },
  { name: "Check Out", href: "/checkout" },
];

const Navbar = () => {
  const [isDropDownOpen, setIsDropDowwnOpen] = useState(false);
  const cartItem = useSelector((state) => state.cart.cartItems);

  const { currentUser, logout } = useAuth();
  // console.log(currentUser);

  const handleLogout = async () => {
    try {
      await logout();
      alert("User Logged Out Successfully");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <header className="container mx-auto px-4 py-6">
      <nav className="flex justify-between items-center">
        {/* left side of navbar */}
        <div className="flex items-center md:gap-16 gap-4">
          <Link to="/">
            <HiMiniBars3CenterLeft />
          </Link>

          {/* Search input */}
          <div className="relative sm:w-72 w-40 space-x-2">
            <IoSearchOutline className="absolute inline-block left-2 inset-y-2" />
            <input
              type="text"
              placeholder="Search here..."
              className="bg-[#EAEAEA] w-full py-1 md:px-8 px-6 rounded-md focus:outline-none"
            />
          </div>
        </div>

        {/* right side of navbar */}
        <div className="relative flex items-center md:space-x-3 space-x-2">
          <div>
            {currentUser ? (
              <div className="flex gap-3">
                <button
                  className="cursor-pointer"
                  onClick={() => setIsDropDowwnOpen(!isDropDownOpen)}
                >
                  <img
                    src={currentUser?.photoURL || avatarImg}
                    alt="avatar"
                    className={`size-7 rounded-full ${
                      currentUser ? "ring-2 ring-blue-500" : ""
                    }`}
                  />
                </button>
                <p className="text-lg font-semibold">
                  Hello {currentUser?.displayName.split(" ")[0]}
                </p>
                {/* dropdown */}
                {isDropDownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-40">
                    <ul className="py-2">
                      {navigation.map((item) => (
                        <li
                          key={item.name}
                          onClick={() => setIsDropDowwnOpen(false)}
                        >
                          <Link
                            className="block px-4 py-2 text-sm hover:bg-gray-100"
                            to={item.href}
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <HiOutlineUser className="size-6" />
              </Link>
            )}
          </div>
          <button className="hidden sm:block">
            <HiOutlineHeart className="size-6" />
          </button>

          <Link
            to="/cart"
            className="bg-primary p-1 sm:px-6 px-2 flex items-center rounded-md"
          >
            <HiOutlineShoppingCart className="" />
            {cartItem.length > 0 ? (
              <span className="text-sm font-semibold sm:ml-1">
                {cartItem.length}
              </span>
            ) : (
              <span className="text-sm font-semibold sm:ml-1">0</span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
