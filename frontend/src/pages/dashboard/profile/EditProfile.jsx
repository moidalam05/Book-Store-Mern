import { useEffect, useState } from "react";
import {
  AiOutlineCamera,
  AiOutlineSave,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import {
  FiUser,
  FiMail,
  FiArrowLeft,
  FiCheck,
  FiEdit2,
  FiShield,
  FiCalendar,
  FiLock,
  FiGlobe,
  FiUpload,
} from "react-icons/fi";
import { MdAdminPanelSettings, MdPerson, MdVerifiedUser } from "react-icons/md";
import { useForm } from "react-hook-form";
import {
  useFetchUserByIdQuery,
  useUpdateProfileMutation,
} from "../../../app/features/users/userApi";
import { toast } from "react-hot-toast";
import { useParams, useNavigate, Link } from "react-router-dom";
import Loading from "../../../components/Loading";

const EditProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  console.log(userId);

  const { data: userData, isLoading: isLoadingUser } = useFetchUserByIdQuery(
    userId,
    {
      skip: !userId,
    },
  );

  const user = userData?.data;

  const [avatarPreview, setAvatarPreview] = useState("/avatar.png");
  const [avatarFile, setAvatarFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        username: user.username || "",
        bio: user.bio || "",
      });

      setAvatarPreview(user.avatar?.url || "/avatar.png");
      setAvatarFile(null);
    }
  }, [user, reset]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processAvatarFile(file);
    }
  };

  const processAvatarFile = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, GIF)");
      return;
    }

    setIsUploading(true);
    setAvatarFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setIsUploading(false);
      toast.error("Failed to load image");
    };
    reader.readAsDataURL(file);
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
    if (file) {
      processAvatarFile(file);
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview("/avatar.png");
    toast.success("Avatar removed");
  };

  const isAvatarChanged =
    avatarFile !== null ||
    avatarPreview !== (user?.avatar?.url || "/avatar.png");

  const canSave = isDirty || isAvatarChanged;

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      if (data.name) formData.append("name", data.name);
      if (data.username) formData.append("username", data.username);
      if (data.bio) formData.append("bio", data.bio);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      } else if (avatarPreview === "/avatar.png") {
        formData.append("removeAvatar", "true");
      }

      const updatePromise = updateProfile({
        userId,
        formData,
      }).unwrap();

      toast.promise(updatePromise, {
        loading: "Updating profile...",
        success: (res) => {
          if (res.data) {
            setAvatarFile(null);
          }
          user?.rol === "admin"
            ? navigate("/dashboard/all-users")
            : navigate("/profile");
          return res.message;
        },
        error: (err) => err?.data?.message || "Failed to update profile",
      });

      await updatePromise;
    } catch (error) {
      console.error("Profile update error:", error);
    }
  };

  const handleCancel = () => {
    reset({
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
    });
    setAvatarPreview(user?.avatar?.url || "/avatar.png");
    setAvatarFile(null);
    toast.success("Changes discarded");
    user?.role === "admin"
      ? navigate("/dashboard/all-users")
      : navigate("/profile");
  };

  if (isLoadingUser) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen ">
      <div className="mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <Link
                to={
                  user?.role === "admin" ? "/dashboard/all-users" : "/profile"
                }
                className="group p-3 hover:bg-white rounded-xl transition-all duration-300 shadow-sm hover:shadow-md border border-gray-200 hover:border-purple-300 cursor-pointer"
              >
                <FiArrowLeft
                  className="text-gray-600 group-hover:text-purple-600 transition-colors"
                  size={22}
                />
              </Link>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900 bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text">
                    Edit Profile
                  </h1>
                  <div
                    className={`px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-semibold ${
                      user?.role === "admin"
                        ? "bg-linear-to-r from-red-500 to-pink-600 text-white shadow-lg"
                        : "bg-linear-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                    }`}
                  >
                    {user?.role === "admin" ? (
                      <MdAdminPanelSettings size={14} />
                    ) : (
                      <MdPerson size={14} />
                    )}
                    {user?.role?.toUpperCase()}
                  </div>
                </div>
                <p className="text-gray-600 ml-1">
                  Manage user profile and account settings
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-linear-to-r from-emerald-50 to-green-50 border border-emerald-200">
                <FiCalendar className="text-emerald-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Member since</p>
                <p className="font-semibold text-gray-900">
                  {new Date(user?.createdAt || Date.now()).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                    },
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden sticky top-24">
              {/* Profile Header */}
              <div className="relative h-32 bg-linear-to-r from-purple-600 to-indigo-600">
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                  <div className="relative group">
                    <div
                      className={`relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl ${
                        isUploading ? "opacity-60" : ""
                      }`}
                    >
                      <img
                        src={avatarPreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                      {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <AiOutlineLoading3Quarters className="text-white text-3xl animate-spin" />
                        </div>
                      )}
                    </div>

                    {/* Upload Button */}
                    <label className="absolute bottom-3 right-3 w-14 h-14 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-full flex items-center justify-center text-white shadow-xl hover:shadow-2xl cursor-pointer transition-all duration-300 group/upload transform hover:scale-105">
                      <AiOutlineCamera
                        className="group-hover/upload:scale-110 transition-transform"
                        size={22}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="pt-20 pb-6 px-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {watch("name") || user?.name || "User Name"}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    @{watch("username") || user?.username || "username"}
                  </p>
                  {user?.email && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                      <FiMail className="text-gray-500" size={14} />
                      <span className="text-sm text-gray-700">
                        {user.email}
                      </span>
                      {user.isGoogleUser && (
                        <MdVerifiedUser
                          className="text-blue-500 ml-1"
                          size={14}
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Drag & Drop Upload Area */}
                <div
                  className={`mt-6 p-6 border-2 border-dashed rounded-2xl text-center transition-all cursor-pointer ${
                    dragOver
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"
                  }`}
                  onClick={() =>
                    document.getElementById("avatar-upload").click()
                  }
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="mb-4">
                    <div className="inline-flex p-3 rounded-full bg-gray-100 text-gray-600 mb-3">
                      <FiUpload size={20} />
                    </div>
                    <h4 className="font-medium text-gray-800 mb-1">
                      Change Profile Picture
                    </h4>
                    <p className="text-sm text-gray-500">
                      Drag & drop or click to upload
                    </p>
                  </div>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  {avatarPreview !== "/avatar.png" && (
                    <button
                      type="button"
                      onClick={removeAvatar}
                      className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                    >
                      Remove current photo
                    </button>
                  )}
                  <p className="text-xs text-gray-400 mt-3">
                    JPG, PNG, GIF • Max 5MB
                  </p>
                </div>

                {/* Account Stats */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                    <FiGlobe className="text-gray-400" size={16} />
                    Account Status
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        <FiCheck size={10} />
                        {user?.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Login Type</span>
                      <span
                        className={`text-xs font-semibold ${
                          user?.isGoogleUser
                            ? "text-blue-600"
                            : "text-purple-600"
                        }`}
                      >
                        {user?.isGoogleUser ? "Google" : "Email"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Edit Form */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {/* Personal Information Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                {/* Card Header */}
                <div className="px-6 py-5 border-b border-gray-200 bg-linear-to-r from-gray-50 to-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-linear-to-r from-purple-100 to-indigo-100">
                        <FiEdit2 className="text-purple-600" size={20} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          Personal Information
                        </h2>
                        <p className="text-sm text-gray-500">
                          Update basic profile details
                        </p>
                      </div>
                    </div>
                    {(isDirty || isAvatarChanged) && (
                      <span className="px-4 py-2 bg-linear-to-r from-amber-100 to-orange-100 text-amber-700 text-sm font-medium rounded-full border border-amber-200">
                        Unsaved Changes
                      </span>
                    )}
                  </div>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                  <div className="space-y-8">
                    {/* Name Field */}
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-900">
                        <span className="flex items-center gap-2">
                          <FiUser className="text-gray-400" size={16} />
                          Full Name
                          <span className="text-red-500">*</span>
                        </span>
                      </label>
                      <input
                        {...register("name", {
                          required: "Name is required",
                          minLength: {
                            value: 2,
                            message: "Name must be at least 2 characters",
                          },
                          maxLength: {
                            value: 50,
                            message: "Name must be less than 50 characters",
                          },
                        })}
                        type="text"
                        placeholder="Enter full name"
                        className={`w-full px-5 py-3.5 bg-gray-50 border rounded-xl focus:ring-3 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all hover:border-gray-400 ${
                          errors.name ? "border-red-300" : "border-gray-300"
                        }`}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600 mt-2">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Email Field (Read-only) */}
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-900">
                        <span className="flex items-center gap-2">
                          <FiMail className="text-gray-400" size={16} />
                          Email Address
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={user?.email || ""}
                          readOnly
                          className="w-full px-5 py-3.5 bg-gray-100 border border-gray-300 rounded-xl cursor-not-allowed"
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                          <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                            <FiCheck size={10} />
                            Verified
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <FiLock size={14} />
                        Email cannot be changed for security reasons
                      </div>
                    </div>

                    {/* Username Field */}
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-900">
                        <span className="flex items-center gap-2">
                          <FiUser className="text-gray-400" size={16} />
                          Username
                          <span className="text-red-500">*</span>
                        </span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <span className="text-gray-400">@</span>
                        </div>
                        <input
                          {...register("username", {
                            required: "Username is required",
                            pattern: {
                              value: /^[a-zA-Z0-9_]+$/,
                              message:
                                "Username can only contain letters, numbers and underscores",
                            },
                            minLength: {
                              value: 3,
                              message: "Username must be at least 3 characters",
                            },
                            maxLength: {
                              value: 30,
                              message:
                                "Username must be less than 30 characters",
                            },
                          })}
                          type="text"
                          placeholder="username"
                          className={`w-full pl-10 pr-4 py-3.5 bg-gray-50 border rounded-xl focus:ring-3 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all hover:border-gray-400 ${
                            errors.username
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                        />
                      </div>
                      {errors.username && (
                        <p className="text-sm text-red-600 mt-2">
                          {errors.username.message}
                        </p>
                      )}
                    </div>

                    {/* Form Actions */}
                    <div className="pt-8 mt-8 border-t border-gray-200">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3 text-sm">
                          {canSave ? (
                            <div className="flex items-center gap-2 text-amber-600 font-medium">
                              <AiOutlineLoading3Quarters
                                className="animate-spin"
                                size={16}
                              />
                              Unsaved changes detected
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-green-600 font-medium">
                              <FiCheck size={16} />
                              All changes saved
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-3.5 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            disabled={!canSave}
                          >
                            Discard
                          </button>
                          <button
                            type="submit"
                            disabled={isUpdating || !canSave}
                            className="inline-flex items-center gap-3 px-8 py-3.5 bg-linear-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none cursor-pointer"
                          >
                            {isUpdating ? (
                              <>
                                <AiOutlineLoading3Quarters
                                  className="animate-spin"
                                  size={20}
                                />
                                <span>Saving Changes...</span>
                              </>
                            ) : (
                              <>
                                <AiOutlineSave size={20} />
                                <span>Save Changes</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Account Security Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 bg-linear-to-r from-emerald-50 to-green-50">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-linear-to-r from-emerald-100 to-green-100">
                      <FiShield className="text-emerald-600" size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Account Security
                      </h2>
                      <p className="text-sm text-gray-500">
                        Manage security settings and permissions
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-5 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-emerald-100">
                          <FiLock className="text-emerald-600" size={18} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            Reset Password
                          </h4>
                          <p className="text-sm text-gray-600">
                            Send password reset email to user
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-blue-100">
                          {user?.role === "admin" ? (
                            <MdPerson className="text-blue-600" size={18} />
                          ) : (
                            <MdAdminPanelSettings
                              className="text-blue-600"
                              size={18}
                            />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {user?.role === "admin"
                              ? "Remove Admin"
                              : "Make Admin"}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {user?.role === "admin"
                              ? "Remove admin privileges from user"
                              : "Grant admin access to user"}
                          </p>
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
    </div>
  );
};

export default EditProfile;
