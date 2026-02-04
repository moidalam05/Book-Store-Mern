import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useCreateUserMutation } from "../app/features/auth/authApi";

const Register = () => {
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [createUser, { isLoading }] = useCreateUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // register user with email and password
  const onSubmit = async (data) => {
    try {
      const response = await createUser(data).unwrap();
      alert(response?.message);
      navigate("/login", { replace: true });
    } catch (error) {
      if (error?.status === 409) {
        setMessage(error?.data?.message);
      } else if (error?.status === 400) {
        setMessage(error?.data?.errors);
      } else {
        setMessage("Something went wrong! Please try again later.");
      }
    }
  };

  const handleGoogleSignUn = async () => {
    try {
      await signInWithGoogle();
      alert("User Logged In Successfully");
      navigate("/");
    } catch (error) {
      console.error(error.message);
    }
  };

  console.log(message);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
        Loading...
      </div>
    );

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center  px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Create your account
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Join Book Store and start exploring
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              {...register("name", { required: true })}
              type="text"
              placeholder="John Doe"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              {...register("username", { required: true })}
              type="text"
              placeholder="john_doe"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              {...register("email", { required: true })}
              type="email"
              id="email"
              placeholder="john@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition cursor-pointer"
          >
            Register
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-3 text-sm text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Google Signup */}
        <button
          onClick={handleGoogleSignUn}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2.5 rounded-lg hover:bg-gray-50 transition cursor-pointer"
        >
          <FcGoogle className="text-xl" />
          <span className="font-medium text-gray-700">Sign up with Google</span>
        </button>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>

        <p className="mt-4 text-xs text-gray-400 text-center">
          © 2025 Book Store. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Register;
