import { Link } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiChevronDown,
  FiPlus,
  FiHome,
  FiBriefcase,
  FiCreditCard,
  FiCheck,
  FiGlobe,
  FiLock,
  FiTruck,
  FiShield,
} from "react-icons/fi";

const CheckoutForm = ({
  register,
  errors,
  showAddressDropdown,
  setShowAddressDropdown,
  addresses,
  handleAddressSelect,
  paymentMethod,
  setPaymentMethod,
  currentUser,
  cart,
}) => {
  const getAddressIcon = (type) => {
    switch (type) {
      case "Home":
        return <FiHome className="text-blue-600" size={18} />;
      case "Work":
        return <FiBriefcase className="text-emerald-600" size={18} />;
      default:
        return <FiMapPin className="text-purple-600" size={18} />;
    }
  };

  return (
    <>
      {/* Contact & Shipping */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
              <FiUser className="text-blue-600" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Contact & Shipping
            </h2>
          </div>
        </div>

        <div className="p-6">
          {/* Personal Details */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
              Contact Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" size={18} />
                  </div>
                  <input
                    {...register("name", {
                      required: "Name is required",
                    })}
                    type="text"
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${
                      errors.name
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    } rounded-xl focus:ring-2 focus:ring-opacity-20 outline-none transition-all`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" size={18} />
                  </div>
                  <input
                    defaultValue={currentUser?.email}
                    type="email"
                    placeholder="abc@gmail.com"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Saved Addresses */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Saved Addresses
              </h3>
              <button
                type="button"
                onClick={() => setShowAddressDropdown(!showAddressDropdown)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer"
              >
                {showAddressDropdown ? "Hide" : "Show All"}
                <FiChevronDown
                  className={`transform transition-transform ${
                    showAddressDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {showAddressDropdown && (
              <div className="mb-6 grid md:grid-cols-3 gap-4">
                {addresses?.map((address) => (
                  <div
                    key={address._id}
                    onClick={() => handleAddressSelect(address)}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      address?.isDefault
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="shrink-0">
                        {getAddressIcon(address.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <span className="font-medium text-gray-900">
                              {address.type}
                            </span>
                            <p className="text-md font-semibold line-clamp-2">
                              {address?.fullName}
                            </p>
                          </div>
                          {address.isDefault && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {address?.phone}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {address?.addressLine1}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {address?.addressLine2}
                        </p>
                        <p className="text-sm text-gray-600">
                          {address?.city}, {address?.state},{address?.country}
                          <br />
                          {address?.postalCode}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <Link
                  to="/addresses"
                  type="button"
                  className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:text-blue-600 transition-colors text-gray-500 flex flex-col items-center justify-center gap-2"
                >
                  <FiPlus size={20} />
                  <span className="text-sm font-medium">Add New</span>
                </Link>
              </div>
            )}
          </div>

          {/* Shipping Address Form */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
              Shipping Address
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <textarea
                  {...register("address", {
                    required: "Address is required",
                  })}
                  rows={3}
                  className={`w-full px-4 py-3 bg-gray-50 border ${
                    errors.address
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  } rounded-xl focus:ring-2 focus:ring-opacity-20 outline-none transition-all resize-none`}
                  placeholder="House no., Building, Street, Area"
                />
                {errors.address && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Landmark (Optional)
                </label>
                <textarea
                  {...register("landmark")}
                  rows={3}
                  className={`w-full px-4 py-3 bg-gray-50 border ${
                    errors.landmark
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  } rounded-xl focus:ring-2 focus:ring-opacity-20 outline-none transition-all resize-none`}
                  placeholder="Near Metro Station"
                />
                {errors.landmark && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.landmark.message}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    {...register("city", {
                      required: "City is required",
                    })}
                    type="text"
                    className={`w-full px-4 py-3 bg-gray-50 border ${
                      errors.city
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    } rounded-xl focus:ring-2 focus:ring-opacity-20 outline-none transition-all`}
                    placeholder="Mumbai"
                  />
                  {errors.city && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    {...register("state", {
                      required: "State is required",
                    })}
                    type="text"
                    className={`w-full px-4 py-3 bg-gray-50 border ${
                      errors.state
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    } rounded-xl focus:ring-2 focus:ring-opacity-20 outline-none transition-all`}
                    placeholder="Maharashtra"
                  />
                  {errors.state && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.state.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiGlobe className="text-gray-400" size={18} />
                    </div>
                    <input
                      {...register("country", {
                        required: "Country is required",
                      })}
                      type="text"
                      placeholder="India"
                      className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${
                        errors.country
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      } rounded-xl focus:ring-2 focus:ring-opacity-20 outline-none transition-all`}
                    />
                  </div>
                  {errors.country && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.country.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    {...register("zipcode", {
                      required: "ZIP code is required",
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: "Enter a valid 6-digit PIN code",
                      },
                    })}
                    type="text"
                    className={`w-full px-4 py-3 bg-gray-50 border ${
                      errors.zipcode
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    } rounded-xl focus:ring-2 focus:ring-opacity-20 outline-none transition-all`}
                    placeholder="400001"
                  />
                  {errors.zipcode && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.zipcode.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="text-gray-400" size={18} />
                  </div>
                  <input
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Enter a valid 10-digit phone number",
                      },
                    })}
                    type="tel"
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${
                      errors.phone
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    } rounded-xl focus:ring-2 focus:ring-opacity-20 outline-none transition-all`}
                    placeholder="9876543210"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-purple-50 to-purple-100 rounded-xl flex items-center justify-center">
              <FiCreditCard className="text-purple-600" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div
              className={`p-5 border-2 rounded-xl cursor-pointer transition-all ${
                paymentMethod === "razorpay"
                  ? "border-blue-500 bg-blue-50 shadow-sm"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setPaymentMethod("razorpay")}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "razorpay"
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {paymentMethod === "razorpay" && (
                      <FiCheck className="text-white w-3 h-3" />
                    )}
                  </div>
                  <span className="font-semibold text-gray-900">
                    Online Payment
                  </span>
                </div>
                <img
                  src="https://badges.razorpay.com/badge-light.png"
                  alt="Razorpay"
                  className="h-5"
                />
              </div>
              <p className="text-sm text-gray-600 ml-8">
                Credit/Debit Card, UPI, Net Banking
              </p>
            </div>

            {cart?.appliedCoupon ? null : (
              <div
                className={`p-5 border-2 rounded-xl cursor-pointer transition-all ${
                  paymentMethod === "cod"
                    ? "border-emerald-500 bg-emerald-50 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setPaymentMethod("cod")}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "cod"
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-gray-300"
                    }`}
                  >
                    {paymentMethod === "cod" && (
                      <FiCheck className="text-white w-3 h-3" />
                    )}
                  </div>
                  <span className="font-semibold text-gray-900">
                    Cash on Delivery
                  </span>
                </div>
                <p className="text-sm text-gray-600 ml-8">
                  Pay when you receive your order
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 text-center hover:shadow-sm transition-shadow">
          <FiLock className="text-emerald-600 mx-auto mb-3" size={20} />
          <div className="text-sm font-semibold text-gray-900 mb-1">
            Secure Payment
          </div>
          <div className="text-xs text-gray-500">SSL Encrypted</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 text-center hover:shadow-sm transition-shadow">
          <FiTruck className="text-blue-600 mx-auto mb-3" size={20} />
          <div className="text-sm font-semibold text-gray-900 mb-1">
            Free Shipping
          </div>
          <div className="text-xs text-gray-500">Above ₹499</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 text-center hover:shadow-sm transition-shadow">
          <FiCheck className="text-purple-600 mx-auto mb-3" size={20} />
          <div className="text-sm font-semibold text-gray-900 mb-1">
            Easy Returns
          </div>
          <div className="text-xs text-gray-500">10 Days Return</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 text-center hover:shadow-sm transition-shadow">
          <FiShield className="text-amber-600 mx-auto mb-3" size={20} />
          <div className="text-sm font-semibold text-gray-900 mb-1">
            Best Prices
          </div>
          <div className="text-xs text-gray-500">Price Match</div>
        </div>
      </div>
    </>
  );
};

export default CheckoutForm;
