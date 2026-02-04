import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { useLoginUserMutation } from "../app/features/auth/authApi";

const Login = () => {
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { setCurrentUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [loginUser, { isLoading, error }] = useLoginUserMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data).unwrap();

      // success
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.user.role);
      setCurrentUser(response?.data?.user);

      toast.success(response?.message);

      navigate("/", { replace: true });
    } catch (error) {
      const status = error?.status || error?.originalStatus;

      if (status === 401) {
        setMessage(error?.data?.message || "Invalid credentials");
      } else if (status === 400) {
        setMessage(error?.data?.errors || "Validation error");
      } else {
        setMessage("Something went wrong! Please try again later.");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast.success("User Logged In Successfully");
      navigate("/");
    } catch (error) {
      console.error(error.message);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
        Loading...
      </div>
    );

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center  px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back 👋</h2>
          <p className="text-sm text-gray-500 mt-1">
            Login using your email or username
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email / Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email or Username
            </label>
            <input
              {...register("identifier", { required: true })}
              type="text"
              placeholder="Email address or username"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>

            <div className="relative">
              <input
                {...register("password", { required: true })}
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-12
                 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              {/* Show / Hide button */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
          </div>

          {/* Error */}
          {message &&
            (Array.isArray(message) ? (
              <ul className="text-red-500 text-sm list-disc list-inside space-y-1">
                {message.map((msg, idx) => (
                  <li key={idx}>{msg?.msg || msg}</li>
                ))}
              </ul>
            ) : (
              <p className="text-red-500 text-sm">{message}</p>
            ))}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition shadow-sm cursor-pointer"
          >
            Login
          </button>
        </form>

        {/* Register */}
        <p className="text-sm text-gray-600 text-center mt-5">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Register
          </Link>
        </p>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="grow h-px bg-gray-200"></div>
          <span className="px-3 text-xs text-gray-400">OR</span>
          <div className="grow h-px bg-gray-200"></div>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-2.5 rounded-lg font-medium flex justify-center items-center gap-3 transition cursor-pointer"
        >
          <FcGoogle className="size-5" />
          Continue with Google
        </button>

        {/* Footer */}
        <p className="mt-6 text-xs text-gray-400 text-center">
          &copy; 2025 Book Store. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
