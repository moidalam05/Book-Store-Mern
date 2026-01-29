import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { MdAdminPanelSettings, MdCloudUpload } from "react-icons/md";
import { FiUser, FiMail, FiKey, FiUserCheck } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useCreateAdminMutation } from "../../../app/features/auth/authApi";

const CreateAdmin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [createAdmin] = useCreateAdminMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setAvatarPreview(URL.createObjectURL(file));
      setAvatarFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setAvatarPreview(URL.createObjectURL(file));
      setAvatarFile(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      if (data.name) formData.append("name", data.name);
      if (data.username) formData.append("username", data.username);
      if (data.email) formData.append("email", data.email);
      if (data.password) formData.append("password", data.password);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const createPromise = createAdmin(formData).unwrap();

      toast.promise(createPromise, {
        loading: "Creating admin...",
        success: (res) => {
          reset();
          setAvatarPreview("");
          setAvatarFile(null);
          return res.message;
        },
        error: (err) => err?.data?.message || "Something went wrong",
      });

      await createPromise;
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to create admin");
    }
  };

  const handleCancel = () => {
    reset();
    setAvatarPreview("");
    setAvatarFile(null);
  };

  return (
    <div className="min-h-screen ">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-linear-to-r from-purple-500 to-indigo-600 text-white shadow-lg">
                <MdAdminPanelSettings size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Create New Admin
                </h1>
                <p className="text-gray-500 mt-1">
                  Add a new administrator with full system access
                </p>
              </div>
            </div>
            <div className="hidden md:block">
              <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                Admin Dashboard
              </span>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Avatar Upload Section */}
              <div className="mb-10">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FiUser className="text-purple-600" />
                  Profile Avatar
                </h2>

                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Avatar Preview */}
                  <div className="relative">
                    <div className="h-40 w-40 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-linear-to-br from-gray-100 to-gray-200">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="avatar preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex flex-col items-center justify-center text-gray-400">
                          <FiUser size={48} />
                          <span className="text-sm mt-2">No image</span>
                        </div>
                      )}
                    </div>
                    {avatarPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setAvatarPreview("");
                          setAvatarFile(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition shadow-lg"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Upload Area */}
                  <div className="flex-1">
                    <div
                      className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                        dragOver
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() =>
                        document.getElementById("avatar-upload").click()
                      }
                    >
                      <div className="mb-4">
                        <div className="inline-flex p-4 rounded-full bg-purple-100 text-purple-600 mb-3">
                          <MdCloudUpload size={28} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          Upload Profile Picture
                        </h3>
                        <p className="text-gray-500 text-sm mb-4">
                          Drag & drop an image here, or click to browse
                        </p>
                      </div>

                      <div className="space-y-3">
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                        <button
                          type="button"
                          className="px-6 py-2.5 bg-linear-to-r from-purple-500 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-600 hover:to-indigo-700 transition shadow-md"
                        >
                          Browse Files
                        </button>
                        <p className="text-xs text-gray-400">
                          JPG, PNG or GIF • Max 5MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FiUser className="text-gray-400" />
                    Full Name
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400" />
                    </div>
                    <input
                      {...register("name", { required: "Name is required" })}
                      type="text"
                      placeholder="Enter full name"
                      className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Username Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FiUserCheck className="text-gray-400" />
                    Username
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUserCheck className="text-gray-400" />
                    </div>
                    <input
                      {...register("username", {
                        required: "Username is required",
                      })}
                      type="text"
                      placeholder="admin_username"
                      className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition"
                    />
                  </div>
                  {errors.username && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FiMail className="text-gray-400" />
                    Email Address
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                    <input
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      type="email"
                      placeholder="admin@example.com"
                      className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FiKey className="text-gray-400" />
                    Password
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiKey className="text-gray-400" />
                    </div>
                    <input
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                      })}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-3.5 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-purple-600 transition cursor-pointer"
                    >
                      {showPassword ? (
                        <AiOutlineEyeInvisible size={20} />
                      ) : (
                        <AiOutlineEye size={20} />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.password.message}
                    </p>
                  )}
                  <div className="mt-2 text-xs text-gray-500">
                    <ul className="list-disc list-inside space-y-1">
                      <li>At least 8 characters</li>
                      <li>Include uppercase & lowercase letters</li>
                      <li>Include numbers & special characters</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Permissions Section (Optional - for future enhancement) */}
              <div className="pt-6 border-t border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Admin Permissions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <label className="flex items-center p-3 rounded-lg border border-gray-300 hover:border-purple-400 hover:bg-purple-50 transition cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded text-purple-600 focus:ring-purple-500"
                      defaultChecked
                    />
                    <span className="ml-3 text-gray-700">
                      Full System Access
                    </span>
                  </label>
                  <label className="flex items-center p-3 rounded-lg border border-gray-300 hover:border-purple-400 hover:bg-purple-50 transition cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded text-purple-600 focus:ring-purple-500"
                      defaultChecked
                    />
                    <span className="ml-3 text-gray-700">User Management</span>
                  </label>
                  <label className="flex items-center p-3 rounded-lg border border-gray-300 hover:border-purple-400 hover:bg-purple-50 transition cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded text-purple-600 focus:ring-purple-500"
                      defaultChecked
                    />
                    <span className="ml-3 text-gray-700">
                      Content Management
                    </span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-8 border-t border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-sm text-gray-500">
                    <span className="text-red-500">*</span> Required fields
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-8 py-3.5 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3.5 rounded-xl bg-linear-to-r from-purple-500 to-indigo-600 text-white font-semibold hover:from-purple-600 hover:to-indigo-700 transition shadow-lg hover:shadow-xl cursor-pointer flex items-center gap-2"
                    >
                      <MdAdminPanelSettings size={20} />
                      Create Admin Account
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            The new admin will receive an email notification with login
            credentials. Ensure all information is accurate before submission.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateAdmin;
