import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [message, setMessage] = useState("");
  const { loginUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await loginUser(data.email, data.password);
      alert("User Logged In Successfully");
      navigate("/");
    } catch (error) {
      setMessage("Oops! email and password is incorrect...");
      console.error(error.message);
    }
  };

  const handleGoogleSignIn = async() => {
    try {
      await signInWithGoogle();
      alert("User Logged In Successfully");
      navigate("/");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex justify-center items-center">
      <div className="w-full max-w-sm mx-auto bg-gray-50 shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">Please Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              {...register("email", { required: true })}
              type="email"
              name="email"
              id="email"
              placeholder="Email Address"
              className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow focus:bg-slate-300 "
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              {...register("password", { required: true })}
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow focus:bg-slate-200 "
            />
          </div>
          {message && (
            <p className="text-red-500 text-xs italic mb-4">{message}</p>
          )}
          <div>
            <button className="w-full bg-blue-500 hover:bg-blue-700 focus:outline-none py-2 px-8 text-white rounded cursor-pointer font-semibold">
              Login Here
            </button>
          </div>
        </form>
        <p className="my-4 align-baseline font-medium text-sm">
          Don't Have an Account ?{" "}
          <Link to="/register" className="text-blue-500 hover:text-blue-700">
            Please Register
          </Link>
        </p>

        {/* Google signin btn */}
        <div className="mt-4">
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-blue-950 hover:bg-blue-900 focus:outline-none py-2 px-8 text-white rounded cursor-pointer font-semibold flex justify-center items-center gap-2"
          >
            <FcGoogle className="size-6" />
            Sign in with Google
          </button>
        </div>
        <p className="mt-5 text-xs text-gray-500 text-center">
          &copy;2025 Book Store. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
