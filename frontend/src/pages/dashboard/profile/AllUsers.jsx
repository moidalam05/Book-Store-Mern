import { useState, useEffect } from "react";
import {
  FiUsers,
  FiSearch,
  FiFilter,
  FiEdit,
  FiUserCheck,
  FiUserX,
  FiUser,
  FiMail,
  FiShield,
} from "react-icons/fi";
import { MdAdminPanelSettings, MdPerson, MdVerifiedUser } from "react-icons/md";
import {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineTeam,
} from "react-icons/ai";
import { toast } from "react-hot-toast";
import {
  useFetchUsersQuery,
  useToggleUserStatusMutation,
} from "../../../app/features/users/userApi";
import { Link } from "react-router-dom";

const AllUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [accountType, setAccountType] = useState("all");
  const usersPerPage = 10;

  const { data: userData, isLoading } = useFetchUsersQuery({
    page: currentPage,
    limit: usersPerPage,
    search: searchTerm || undefined,
    role: selectedRole !== "all" ? selectedRole : undefined,
    status: selectedStatus !== "all" ? selectedStatus : undefined,
    accountType: accountType !== "all" ? accountType : undefined,
    sort: sortBy,
  });

  const users = userData?.data || [];
  const totalPages = userData?.meta?.totalPages || 1;

  const [toggleUserStatus] = useToggleUserStatusMutation();

  const start = (currentPage - 1) * usersPerPage + 1;
  const end = Math.min(
    start + users.length - 1,
    userData?.meta?.filteredUsersCount || 0,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRole, selectedStatus, sortBy, accountType]);

  const handleToggleUserStatus = async (userId) => {
    const togglePromise = toggleUserStatus(userId).unwrap();

    toast.promise(togglePromise, {
      loading: "Updating status...",
      success: (res) => res?.message,
      error: (err) => err?.data?.message || "Something went wrong",
    });

    await togglePromise;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen ">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-linear-to-r from-purple-500 to-indigo-600 text-white shadow-lg">
                <FiUsers size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  User Management
                </h1>
                <p className="text-gray-500 mt-1">
                  Manage all users and their permissions
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Total Users
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {userData?.analytics?.totalUsers}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-linear-to-r from-purple-100 to-indigo-100">
                  <AiOutlineTeam className="text-purple-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Admins</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {userData?.analytics?.admins}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-linear-to-r from-red-100 to-pink-100">
                  <MdAdminPanelSettings className="text-red-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Active Users
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {userData?.analytics?.activeUsers}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-linear-to-r from-green-100 to-emerald-100">
                  <FiUserCheck className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Google Users
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {userData?.analytics?.googleUsers}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-linear-to-r from-blue-100 to-cyan-100">
                  <MdVerifiedUser className="text-blue-600" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Search users by name, email, or username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-3 focus:ring-purple-200 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 px-4 py-3.5 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-xl transition-colors"
              >
                <FiFilter size={18} />
                Filters
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3.5 border border-gray-300 rounded-xl focus:border-purple-500 focus:ring-3 focus:ring-purple-200 focus:outline-none bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name_az">Name A-Z</option>
                <option value="email_az">Email A-Z</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-purple-500 focus:ring-3 focus:ring-purple-200 focus:outline-none bg-white"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">Regular User</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-purple-500 focus:ring-3 focus:ring-purple-200 focus:outline-none bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Type
                  </label>
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-purple-500 focus:ring-3 focus:ring-purple-200 focus:outline-none bg-white"
                  >
                    <option value="all">All Types</option>
                    <option value="google">Google Users</option>
                    <option value="regular">Regular Users</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-12 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading users...</p>
              </div>
            </div>
          ) : users?.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FiUser className="text-gray-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No users found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-linear-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">
                        User
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">
                        Email
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">
                        Role
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">
                        Created
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users?.map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img
                                src={
                                  user.avatar?.url ||
                                  `https://ui-avatars.com/api/?name=${user.name}&background=random`
                                }
                                alt={user.name}
                                className="w-10 h-10 rounded-full border-2 border-white shadow"
                              />
                              {user.role === "admin" && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-linear-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                                  <FiShield className="text-white" size={10} />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                @{user.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <FiMail className="text-gray-400" size={14} />
                            <span className="text-gray-700">{user.email}</span>
                          </div>
                          {user.accountType === "google" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 mt-1 bg-linear-to-r from-blue-50 to-cyan-50 text-blue-600 text-xs font-medium rounded-full border border-blue-200">
                              <MdVerifiedUser size={10} />
                              Google
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${
                              user.role === "admin"
                                ? "bg-linear-to-r from-red-100 to-pink-100 text-red-700"
                                : "bg-linear-to-r from-blue-100 to-indigo-100 text-blue-700"
                            }`}
                          >
                            {user.role === "admin" ? (
                              <MdAdminPanelSettings size={12} />
                            ) : (
                              <MdPerson size={12} />
                            )}
                            {user.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            {user.isActive ? (
                              <>
                                <AiOutlineCheckCircle
                                  className="text-green-500"
                                  size={18}
                                />
                                <span className="text-green-700 font-medium">
                                  Active
                                </span>
                              </>
                            ) : (
                              <>
                                <AiOutlineCloseCircle
                                  className="text-red-500"
                                  size={18}
                                />
                                <span className="text-red-700 font-medium">
                                  Inactive
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm">
                            <div className="text-gray-900">
                              {formatDate(user.createdAt)}
                            </div>
                            <div className="text-gray-500">
                              {formatTime(user.createdAt)}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/dashboard/edit-profile/${user._id}`}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                              title="Edit User"
                            >
                              <FiEdit
                                className="text-gray-600 group-hover:text-purple-600"
                                size={18}
                              />
                            </Link>

                            <button
                              onClick={() => handleToggleUserStatus(user._id)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors group cursor-pointer"
                              title={user.isActive ? "Deactivate" : "Activate"}
                            >
                              {user.isActive ? (
                                <FiUserX
                                  className="text-gray-600 group-hover:text-amber-600"
                                  size={18}
                                />
                              ) : (
                                <FiUserCheck
                                  className="text-gray-600 group-hover:text-green-600"
                                  size={18}
                                />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Showing Info */}
                    <div className="text-sm text-gray-600">
                      Showing{" "}
                      <span className="font-semibold text-gray-900">
                        {start}
                      </span>{" "}
                      to{" "}
                      <span className="font-semibold text-gray-900">{end}</span>{" "}
                      of{" "}
                      <span className="font-semibold text-gray-900">
                        {userData?.meta?.filteredUsersCount}
                      </span>{" "}
                      users
                    </div>

                    {/* Pagination Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>

                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            currentPage === i + 1
                              ? "bg-linear-to-r from-purple-600 to-indigo-600 text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages),
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
