import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Search,
  Filter,
  MoreVertical,
  Crown,
  Shield,
  AlertCircle,
  Ban,
  UserCheck,
  UserX,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { getAllUsers, toggleUserBlock, deleteUser } from "../../utils/userApi";
import { toast } from "react-toastify";

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const usersPerPage = 10;

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllUsers();

      // Transform the API data to match the component's expected format
      const transformedUsers = data.map((user) => ({
        id: user.userId,
        username: user.username,
        email: user.email,
        role: user.role || "MEMBER",
        status: user.isBlocked ? "BLOCKED" : "ACTIVE",
        joinDate: new Date(user.created_at).toLocaleDateString(),
        lastLogin: "N/A", // This data is not available from the current API
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        isBlocked: user.isBlocked,
        created_at: user.created_at,
      }));

      setUsers(transformedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users. Please try again.");
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserBlock = async (userId, currentStatus) => {
    try {
      setActionLoading(userId);
      const shouldBlock = currentStatus === "ACTIVE";

      await toggleUserBlock(userId, shouldBlock);

      // Update the user in the local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                status: shouldBlock ? "BLOCKED" : "ACTIVE",
                isBlocked: shouldBlock,
              }
            : user
        )
      );

      toast.success(
        `User has been ${shouldBlock ? "blocked" : "unblocked"} successfully`
      );
    } catch (error) {
      console.error("Error toggling user block:", error);
      toast.error("Failed to update user status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (
      !window.confirm(
        `Are you sure you want to delete user "${username}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setActionLoading(userId);
      await deleteUser(userId);

      // Remove the user from local state
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));

      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setActionLoading(null);
    }
  };

  // Filter users based on search term and role filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "ALL" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const getRoleIcon = (role) => {
    return role === "ADMIN" ? (
      <Crown size={16} className="text-amber-600" />
    ) : (
      <User size={16} className="text-blue-600" />
    );
  };

  const getRoleBadge = (role) => {
    const baseClasses =
      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
    const roleClasses =
      role === "ADMIN"
        ? "bg-amber-100 text-amber-800 border border-amber-200"
        : "bg-blue-100 text-blue-800 border border-blue-200";

    return (
      <span className={`${baseClasses} ${roleClasses}`}>
        {getRoleIcon(role)}
        <span className="ml-1">{role}</span>
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";

    let statusClasses, statusText;

    switch (status) {
      case "ACTIVE":
        statusClasses = "bg-green-100 text-green-800 border border-green-200";
        statusText = "Active";
        break;
      case "BLOCKED":
        statusClasses = "bg-red-100 text-red-800 border border-red-200";
        statusText = "Blocked";
        break;
      default:
        statusClasses = "bg-gray-100 text-gray-800 border border-gray-200";
        statusText = "Unknown";
    }

    return (
      <span className={`${baseClasses} ${statusClasses}`}>
        <span
          className={`w-1.5 h-1.5 rounded-full mr-1 ${
            status === "ACTIVE" ? "bg-green-500" : "bg-red-500"
          }`}
        ></span>
        {statusText}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center h-64">
            <AlertCircle className="text-red-500 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-stone-800 mb-2">
              Error Loading Users
            </h2>
            <p className="text-stone-600 mb-4">{error}</p>
            <button
              onClick={fetchUsers}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <User className="text-amber-600" size={24} />
              </div>
              <h1 className="text-3xl font-bold text-stone-700">
                User Management
              </h1>
            </div>
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                "Refresh"
              )}
            </button>
          </div>
          <p className="text-stone-600">
            Manage user accounts, roles, and permissions
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400"
              />
              <input
                type="text"
                placeholder="Search by username or email..."
                className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <Filter
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400"
              />
              <select
                className="pl-10 pr-8 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-white"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="ALL">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="MEMBER">Member</option>
              </select>
            </div>
          </div>

          {/* User Statistics */}
          <div className="mt-4 flex items-center gap-6 text-sm text-stone-600">
            <span>
              Total Users: <strong>{users.length}</strong>
            </span>
            <span>
              Showing: <strong>{filteredUsers.length}</strong>
            </span>
            <span>
              Active:{" "}
              <strong>
                {users.filter((u) => u.status === "ACTIVE").length}
              </strong>
            </span>
            <span>
              Blocked:{" "}
              <strong>
                {users.filter((u) => u.status === "BLOCKED").length}
              </strong>
            </span>
            <span>
              Admins:{" "}
              <strong>{users.filter((u) => u.role === "ADMIN").length}</strong>
            </span>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-stone-700">
                    User
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-stone-700">
                    Role
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-stone-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-stone-700">
                    Join Date
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-stone-700">
                    Last Login
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-stone-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-stone-100 hover:bg-stone-50"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center text-amber-800 font-medium mr-3">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-stone-800">
                              {user.username}
                            </div>
                            <div className="text-sm text-stone-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">{getRoleBadge(user.role)}</td>
                      <td className="py-4 px-6">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="py-4 px-6 text-stone-600">
                        {user.joinDate}
                      </td>
                      <td className="py-4 px-6 text-stone-600">
                        {user.lastLogin}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {/* Block/Unblock Button */}
                          <button
                            onClick={() =>
                              handleToggleUserBlock(user.id, user.status)
                            }
                            disabled={actionLoading === user.id}
                            className={`p-2 rounded-lg transition-colors ${
                              user.status === "ACTIVE"
                                ? "hover:bg-red-100 text-red-600 hover:text-red-700"
                                : "hover:bg-green-100 text-green-600 hover:text-green-700"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                            title={
                              user.status === "ACTIVE"
                                ? "Block User"
                                : "Unblock User"
                            }
                          >
                            {actionLoading === user.id ? (
                              <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                            ) : user.status === "ACTIVE" ? (
                              <Ban size={16} />
                            ) : (
                              <UserCheck size={16} />
                            )}
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() =>
                              handleDeleteUser(user.id, user.username)
                            }
                            disabled={actionLoading === user.id}
                            className="p-2 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete User"
                          >
                            {actionLoading === user.id ? (
                              <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-stone-500">
                      No users found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-stone-200 flex items-center justify-between">
              <div className="text-sm text-stone-500">
                Showing {indexOfFirstUser + 1} to{" "}
                {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
                {filteredUsers.length} users
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-stone-300 rounded text-sm hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 border rounded text-sm ${
                        currentPage === page
                          ? "bg-amber-600 text-white border-amber-600"
                          : "border-stone-300 hover:bg-stone-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-stone-300 rounded text-sm hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Back to Admin Dashboard Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center space-x-2 bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-md transition-colors duration-200 shadow-sm"
          >
            <ArrowLeft size={20} />
            <span>Back to Admin Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
