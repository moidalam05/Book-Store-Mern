import { useState } from "react";
import {
  FiHome,
  FiMapPin,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiX,
  FiUser,
  FiPhone,
  FiMap,
  FiGlobe,
  FiStar,
  FiNavigation,
  FiClock,
  FiPackage,
  FiBriefcase as FiOffice,
  FiPlus,
  FiSearch,
} from "react-icons/fi";
import { useForm } from "react-hook-form";
import {
  useCreateAddressMutation,
  useDeleteAddressMutation,
  useGetAddressesQuery,
  useSetDefaultAddressMutation,
  useUpdateAddressMutation,
} from "../../app/features/address/addressApi";
import { toast } from "react-hot-toast";

const Address = () => {
  const { data: addressData, refetch } = useGetAddressesQuery();
  const addresses = addressData?.data || [];

  const [deleteAddress] = useDeleteAddressMutation();
  const [setDefaultAddress] = useSetDefaultAddressMutation();
  const [createAddress] = useCreateAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();

  const [editingAddress, setEditingAddress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const EMPTY_FORM = {
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    addressType: "Home",
    isDefault: false,
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: EMPTY_FORM,
  });

  const selectedType = watch("addressType");

  const addressTypes = [
    {
      value: "Home",
      icon: FiHome,
      color: "text-blue-600",
      linear: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      activeBorder: "border-blue-500",
    },
    {
      value: "Work",
      icon: FiOffice,
      color: "text-emerald-600",
      linear: "from-emerald-500 to-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      activeBorder: "border-emerald-500",
    },
    {
      value: "Other",
      icon: FiMapPin,
      color: "text-purple-600",
      linear: "from-purple-500 to-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-200",
      activeBorder: "border-purple-500",
    },
  ];

  const filteredAddresses = addresses.filter((address) => {
    const matchesSearch =
      searchQuery === "" ||
      address.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      address.addressLine1.toLowerCase().includes(searchQuery.toLowerCase()) ||
      address.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      filterType === "all" || address.addressType.toLowerCase() === filterType;

    return matchesSearch && matchesType;
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      if (editingAddress) {
        const updatePromise = updateAddress({
          addressId: editingAddress._id,
          data: {
            ...data,
            isDefault: !!data.isDefault,
          },
        }).unwrap();

        toast.promise(updatePromise, {
          loading: "Updating address...",
          success: (res) => {
            refetch();
            return res?.message || "Address updated successfully";
          },
          error: (err) => err?.data?.message || "Failed to update address",
        });

        await updatePromise;
      } else {
        const createPromise = createAddress({
          ...data,
          isDefault: data.isDefault || false,
        }).unwrap();

        toast.promise(createPromise, {
          loading: "Creating address...",
          success: (res) => {
            refetch();
            return res?.message || "Address created successfully";
          },
          error: (err) => err?.data?.message || "Failed to create address",
        });

        await createPromise;
      }

      reset(EMPTY_FORM);
      setEditingAddress(null);
    } catch (error) {
      console.error("Address operation failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (address) => {
    reset({
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      addressType: address.addressType,
      isDefault: address.isDefault,
    });
    setEditingAddress(address);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      const deleteAddressPromise = deleteAddress({ addressId: id }).unwrap();

      toast.promise(deleteAddressPromise, {
        loading: "Deleting address...",
        success: (res) => {
          refetch();
          return res?.message || "Address deleted successfully";
        },
        error: (err) => err?.data?.message || "Failed to delete address",
      });

      await deleteAddressPromise;
    }
  };

  const handleSetDefault = async (id) => {
    const setDefaultAddressPromise = setDefaultAddress({
      addressId: id,
    }).unwrap();

    toast.promise(setDefaultAddressPromise, {
      loading: "Setting default address...",
      success: (res) => {
        refetch();
        return res?.message || "Default address set successfully";
      },
      error: (err) => err?.data?.message || "Failed to set default address",
    });

    await setDefaultAddressPromise;
  };

  const getAddressIcon = (type) => {
    const typeInfo = addressTypes.find((t) => t.value === type);
    const Icon = typeInfo?.icon || FiMapPin;
    return <Icon className={typeInfo?.color} size={20} />;
  };

  return (
    <div className="min-h-screen  py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-linear-to-r from-blue-600 to-blue-700 rounded-lg shadow-md">
                  <FiNavigation className="text-white" size={22} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Address Management
                  </h1>
                  <p className="text-gray-600 text-sm">
                    Manage your delivery addresses efficiently
                  </p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
                <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-lg font-bold text-gray-900">
                    {addresses.length}
                  </div>
                  <div className="text-xs text-gray-600 flex items-center gap-1">
                    <FiMapPin size={12} />
                    Total Addresses
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-lg font-bold text-blue-600">
                    {addresses.filter((a) => a.isDefault).length}
                  </div>
                  <div className="text-xs text-gray-600 flex items-center gap-1">
                    <FiStar size={12} />
                    Default
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-lg font-bold text-emerald-600">
                    {addresses.filter((a) => a.addressType === "home").length}
                  </div>
                  <div className="text-xs text-gray-600 flex items-center gap-1">
                    <FiHome size={12} />
                    Home
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-lg font-bold text-purple-600">
                    {addresses.filter((a) => a.addressType === "work").length}
                  </div>
                  <div className="text-xs text-gray-600 flex items-center gap-1">
                    <FiOffice size={12} />
                    Work
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-lg font-bold text-purple-600">
                    {addresses.filter((a) => a.addressType === "other").length}
                  </div>
                  <div className="text-xs text-gray-600 flex items-center gap-1">
                    <FiOffice size={12} />
                    Other
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Address Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 mb-6 overflow-hidden">
              {/* Form Header */}
              <div className="border-b border-gray-200 px-6 py-4 bg-linear-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {editingAddress ? "Edit Address" : "Add New Address"}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {editingAddress
                        ? "Update your delivery address details"
                        : "Enter new delivery address details"}
                    </p>
                  </div>
                  {editingAddress && (
                    <button
                      onClick={() => {
                        reset(EMPTY_FORM);
                        setEditingAddress(null);
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <FiX size={16} />
                      Cancel Edit
                    </button>
                  )}
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                <div className="space-y-6">
                  {/* Address Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Address Type <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {addressTypes.map((type) => (
                        <button
                          type="button"
                          key={type.value}
                          onClick={() => setValue("addressType", type.value)}
                          className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all cursor-pointer ${
                            selectedType === type.value
                              ? `${type.bg} ${type.activeBorder} shadow-sm`
                              : `${type.border} hover:${type.activeBorder} hover:${type.bg}`
                          }`}
                        >
                          <div className="mb-2">
                            <type.icon
                              className={`${type.color} ${
                                selectedType === type.value
                                  ? "opacity-100"
                                  : "opacity-70"
                              }`}
                              size={20}
                            />
                          </div>
                          <span
                            className={`text-sm font-medium ${
                              selectedType === type.value
                                ? "text-gray-900"
                                : "text-gray-700"
                            }`}
                          >
                            {type.value}
                          </span>
                        </button>
                      ))}
                    </div>
                    <input
                      type="hidden"
                      {...register("addressType", {
                        required: "Please select an address type",
                      })}
                    />
                    {errors.addressType && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.addressType.message}
                      </p>
                    )}
                  </div>

                  {/* Form Fields Grid */}
                  <div className="space-y-5">
                    {/* Full Name & Phone Row */}
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiUser className="text-gray-400" size={16} />
                          </div>
                          <input
                            placeholder="Enter full name"
                            className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                              errors.fullName
                                ? "border-red-300"
                                : "border-gray-300"
                            }`}
                            {...register("fullName", {
                              required: "Full name is required",
                              minLength: {
                                value: 3,
                                message: "Minimum 3 characters required",
                              },
                            })}
                          />
                        </div>
                        {errors.fullName && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.fullName.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiPhone className="text-gray-400" size={16} />
                          </div>
                          <input
                            placeholder="10-digit mobile number"
                            className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                              errors.phone
                                ? "border-red-300"
                                : "border-gray-300"
                            }`}
                            {...register("phone", {
                              required: "Phone number is required",
                              pattern: {
                                value: /^[0-9]{10}$/,
                                message: "Enter a valid 10-digit phone number",
                              },
                            })}
                          />
                        </div>
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Address Line 1 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Address Line 1 <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMap className="text-gray-400" size={16} />
                        </div>
                        <input
                          placeholder="Flat No., Building, Street"
                          className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                            errors.addressLine1
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          {...register("addressLine1", {
                            required: "Address is required",
                          })}
                        />
                      </div>
                      {errors.addressLine1 && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.addressLine1.message}
                        </p>
                      )}
                    </div>

                    {/* Address Line 2 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        placeholder="Area, Landmark, Society"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        {...register("addressLine2")}
                      />
                    </div>

                    {/* City, State, PIN Row */}
                    <div className="grid md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          placeholder="Mumbai"
                          className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                            errors.city ? "border-red-300" : "border-gray-300"
                          }`}
                          {...register("city", {
                            required: "City is required",
                          })}
                        />
                        {errors.city && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.city.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          State <span className="text-red-500">*</span>
                        </label>
                        <input
                          placeholder="Maharashtra"
                          className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                            errors.state ? "border-red-300" : "border-gray-300"
                          }`}
                          {...register("state", {
                            required: "State is required",
                          })}
                        />
                        {errors.state && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.state.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          PIN Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          placeholder="400001"
                          className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                            errors.postalCode
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          {...register("postalCode", {
                            required: "PIN code is required",
                            pattern: {
                              value: /^[0-9]{6}$/,
                              message: "Enter a valid 6-digit PIN code",
                            },
                          })}
                        />
                        {errors.postalCode && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.postalCode.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiGlobe className="text-gray-400" size={16} />
                        </div>
                        <input
                          value="India"
                          readOnly
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
                          {...register("country", {
                            required: "Country is required",
                          })}
                        />
                      </div>
                    </div>

                    {/* Default Address Checkbox */}
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <input
                        type="checkbox"
                        id="isDefault"
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                        {...register("isDefault")}
                      />
                      <label
                        htmlFor="isDefault"
                        className="text-sm text-gray-900 cursor-pointer"
                      >
                        <div className="font-medium">
                          Set as default address
                        </div>
                        <div className="text-gray-600 mt-0.5">
                          This address will be pre-selected during checkout
                        </div>
                      </label>
                    </div>

                    {/* Form Actions */}
                    <div className="pt-4 border-t border-gray-200">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            {editingAddress ? (
                              <>
                                <FiCheck size={16} />
                                Update Address
                              </>
                            ) : (
                              <>
                                <FiPlus size={16} />
                                Add Address
                              </>
                            )}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Address List */}
          <div className="lg:col-span-1">
            {/* Address List Header */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 mb-6">
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Saved Addresses ({filteredAddresses.length})
                  </h3>
                </div>

                {/* Search and Filter */}
                <div className="space-y-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="text-gray-400" size={16} />
                    </div>
                    <input
                      type="text"
                      placeholder="Search addresses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFilterType("all")}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                        filterType === "all"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      All
                    </button>
                    {addressTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setFilterType(type.value.toLowerCase())}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                          filterType === type.value.toLowerCase()
                            ? `${type.bg} ${type.color}`
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {type.value}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Address List */}
            <div className="space-y-4 lg:max-h-167.5 lg:overflow-y-auto pr-2">
              {filteredAddresses.length > 0 ? (
                filteredAddresses.map((address) => (
                  <div
                    key={address._id}
                    className={`bg-white rounded-lg border-2 shadow-sm transition-all duration-200 hover:shadow-md ${
                      address.isDefault
                        ? "border-blue-300"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="p-5">
                      {/* Address Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2.5 rounded-lg ${
                              addressTypes.find(
                                (t) => t.value === address.addressType
                              )?.bg || "bg-gray-100"
                            }`}
                          >
                            {getAddressIcon(address.addressType)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                  addressTypes.find(
                                    (t) => t.value === address.addressType
                                  )?.bg || "bg-gray-100"
                                } ${
                                  addressTypes.find(
                                    (t) => t.value === address.addressType
                                  )?.color || "text-gray-700"
                                }`}
                              >
                                {address.addressType.toUpperCase()}
                              </span>
                              {address.isDefault && (
                                <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-1">
                                  <FiStar size={10} />
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <FiClock size={10} />
                              {new Date(address.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEdit(address)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <FiEdit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(address._id)}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Address Details */}
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {address.fullName}
                          </h4>
                          <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                            <FiPhone size={12} />
                            {address.phone}
                          </div>
                        </div>

                        <div className="text-sm text-gray-700 space-y-1.5">
                          <p className="flex items-start gap-2">
                            <FiMap
                              className="text-gray-400 mt-0.5 shrink-0"
                              size={12}
                            />
                            <span>{address.addressLine1}</span>
                          </p>
                          {address.addressLine2 && (
                            <p className="text-gray-600 pl-4">
                              {address.addressLine2}
                            </p>
                          )}
                          <p className="flex items-start gap-2">
                            <FiHome
                              className="text-gray-400 mt-0.5 shrink-0"
                              size={12}
                            />
                            <span>
                              {address.city}, {address.state} -{" "}
                              {address.postalCode}
                            </span>
                          </p>
                          <p className="flex items-start gap-2">
                            <FiGlobe
                              className="text-gray-400 mt-0.5 shrink-0"
                              size={12}
                            />
                            <span>{address.country}</span>
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                        {!address.isDefault && (
                          <button
                            onClick={() => handleSetDefault(address._id)}
                            className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <FiStar size={12} />
                            Set Default
                          </button>
                        )}
                        <button className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer">
                          <FiPackage size={12} />
                          Use This
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiMapPin className="text-gray-400" size={24} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Addresses Found
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {searchQuery || filterType !== "all"
                      ? "No addresses match your search criteria"
                      : "Add your first address to get started"}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Address;
