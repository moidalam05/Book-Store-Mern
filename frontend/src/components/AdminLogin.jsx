import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useLoginUserMutation } from "../app/features/auth/authApi.js";
import {
  FiLock,
  FiMail,
  FiUser,
  FiEye,
  FiEyeOff,
  FiLogIn,
  FiShield,
} from "react-icons/fi";
import { MdAdminPanelSettings, MdSecurity } from "react-icons/md";
import { toast } from "react-hot-toast";

const AdminLogin = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const navigate = useNavigate();
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const { setCurrentUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setMessage("");

    try {
      const response = await loginUser(data).unwrap();

      const token = response?.data?.token;
      const user = response?.data?.user;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role);
      }

      setCurrentUser({
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        role: user.role,
        token,
      });

      if (user.role === "admin") {
        setMessageType("success");

        toast.success(response?.message || "Login successful");

        navigate("/dashboard", { replace: true });
      } else {
        setMessageType("error");
        setMessage("Access denied. Admin privileges required.");

        toast.error("Access denied. Admin privileges required.");
      }
    } catch (error) {
      setMessageType("error");

      const status = error?.status || error?.originalStatus;
      let errorMessage = "Something went wrong. Please try again.";

      if (status === 401) {
        errorMessage =
          error?.data?.message || "Invalid credentials. Please try again.";
      } else if (status === 400) {
        errorMessage =
          error?.data?.errors || "Validation error. Please check input.";
      } else if (status === 403) {
        errorMessage = "Access forbidden. Please contact system administrator.";
      } else if (status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else {
        errorMessage = "Network error. Please check your connection.";
      }

      // 👉 UI message (inline)
      setMessage(errorMessage);

      // 👉 Global notification
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-gray-50 via-white to-gray-100">
      {/* Decorative Background Elements */}

      <div className="relative w-full max-w-lg">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Card Header with linear */}

          <div className="p-8 md:p-10">
            {/* Welcome Section */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center p-3 rounded-xl bg-linear-to-r from-purple-50 to-indigo-50 mb-4">
                <MdAdminPanelSettings className="text-3xl text-purple-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Admin Portal
              </h1>
              <p className="text-gray-500 text-sm">
                Secure access to the management dashboard
              </p>
            </div>

            {/* Status Message */}
            {message && (
              <div
                className={`mb-6 p-4 rounded-xl border ${
                  messageType === "success"
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`shrink-0 p-2 rounded-lg ${
                      messageType === "success" ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    {messageType === "success" ? (
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <FiShield className="w-5 h-5" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{message}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Email/Username Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <FiUser className="text-gray-400" />
                    Email or Username
                  </span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                  </div>
                  <input
                    {...register("identifier", {
                      required: "Email or username is required",
                      minLength: {
                        value: 3,
                        message: "Must be at least 3 characters",
                      },
                    })}
                    type="text"
                    placeholder="admin@example.com or admin_user"
                    className={`w-full pl-10 pr-4 py-3.5 rounded-xl border ${
                      errors.identifier
                        ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    } focus:outline-none transition-all duration-200`}
                  />
                  {errors.identifier && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.identifier.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <span className="flex items-center gap-2">
                      <FiLock className="text-gray-400" />
                      Password
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    className="text-xs text-gray-500 hover:text-purple-600 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {showPassword ? "Hide Password" : "Show Password"}
                  </button>
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock
                      className={`text-gray-400 ${
                        isHovering
                          ? "text-purple-600"
                          : "group-focus-within:text-purple-600"
                      } transition-colors`}
                    />
                  </div>

                  <input
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-12 py-3.5 rounded-xl border ${
                      errors.password
                        ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    } focus:outline-none transition-all duration-200`}
                  />

                  {/* Password Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors cursor-pointer ${
                      isHovering ? "text-purple-600" : "text-gray-400"
                    }`}
                  >
                    {showPassword ? (
                      <FiEyeOff className="w-5 h-5" />
                    ) : (
                      <FiEye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}

                {/* Password Strength Hint */}
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                    <span>Minimum 6 characters</span>
                  </div>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors cursor-pointer"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot your password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !isValid}
                className={`w-full py-3.5 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  isLoading || !isValid
                    ? "bg-gray-300 cursor-not-allowed text-gray-500"
                    : "bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <FiLogIn className="w-5 h-5" />
                    <span>Sign in to Dashboard</span>
                  </>
                )}
              </button>

              {/* Security Note */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <MdSecurity className="text-gray-400" />
                  <span>
                    Your credentials are encrypted and securely transmitted
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
