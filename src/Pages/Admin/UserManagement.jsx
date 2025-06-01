import React, { useState, useEffect } from "react";
import {
  User,
  Search,
  Filter,
  MoreVertical,
  Crown,
  Shield,
} from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Mock data for demonstration - replace with actual API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockUsers = [
        {
          id: 1,
          username: "admin",
          email: "admin@library.com",
          role: "ADMIN",
          status: "ACTIVE",
          joinDate: "2024-01-15",
          lastLogin: "2024-12-20",
        },
        {
          id: 2,
          username: "user1",
          email: "user1@example.com",
          role: "USER",
          status: "ACTIVE",
          joinDate: "2024-02-10",
          lastLogin: "2024-12-19",
        },
        {
          id: 3,
          username: "user2",
          email: "user2@example.com",
          role: "USER",
          status: "INACTIVE",
          joinDate: "2024-03-05",
          lastLogin: "2024-12-10",
        },
      ];
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

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
    const statusClasses =
      status === "ACTIVE"
        ? "bg-green-100 text-green-800 border border-green-200"
        : "bg-red-100 text-red-800 border border-red-200";

    return (
      <span className={`${baseClasses} ${statusClasses}`}>
        <span
          className={`w-1.5 h-1.5 rounded-full mr-1 ${
            status === "ACTIVE" ? "bg-green-500" : "bg-red-500"
          }`}
        ></span>
        {status}
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

  return (
    <div className="min-h-screen bg-stone-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 rounded-lg">
              <User className="text-amber-600" size={24} />
            </div>
            <h1 className="text-3xl font-bold text-stone-800">
              User Management
            </h1>
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
                <option value="USER">User</option>
              </select>
            </div>
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
                        <button className="p-2 hover:bg-stone-100 rounded-lg transition-colors">
                          <MoreVertical size={16} className="text-stone-400" />
                        </button>
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
      </div>
    </div>
  );
};

export default UserManagement;
