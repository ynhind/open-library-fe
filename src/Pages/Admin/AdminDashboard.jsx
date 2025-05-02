import React from "react";
import { Link } from "react-router-dom";
<<<<<<< HEAD
import {
  Book,
  Users,
  ShoppingCart,
  Tag,
  BarChart3,
  Settings,
  Home,
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-amber-50/50 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-amber-800 mb-4 sm:mb-0">
            Admin Dashboard
          </h2>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition-colors text-sm font-medium"
          >
            <Home className="h-4 w-4" />
            Go to Home
          </Link>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-lg shadow-sm border border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-stone-700 font-medium text-sm uppercase tracking-wider">
                  Total Books
                </h3>
                <p className="text-3xl font-serif font-bold text-amber-800 mt-2">
                  243
                </p>
              </div>
              <div className="bg-amber-200/50 p-3 rounded-full">
                <Book className="text-amber-800 h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-lg shadow-sm border border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-stone-700 font-medium text-sm uppercase tracking-wider">
                  Registered Users
                </h3>
                <p className="text-3xl font-serif font-bold text-amber-800 mt-2">
                  1,204
                </p>
              </div>
              <div className="bg-amber-200/50 p-3 rounded-full">
                <Users className="text-amber-800 h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-lg shadow-sm border border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-stone-700 font-medium text-sm uppercase tracking-wider">
                  Recent Orders
                </h3>
                <p className="text-3xl font-serif font-bold text-amber-800 mt-2">
                  56
                </p>
              </div>
              <div className="bg-amber-200/50 p-3 rounded-full">
                <ShoppingCart className="text-amber-800 h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-10">
          <h3 className="text-xl font-serif font-semibold text-stone-800 mb-5">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <Link
              to="/admin/books"
              className="flex flex-col items-center p-5 bg-white border border-amber-200 rounded-lg shadow-sm hover:bg-amber-50 transition-colors text-center"
            >
              <div className="bg-amber-100 p-3 rounded-full mb-3">
                <Book className="text-amber-800 h-6 w-6" />
              </div>
              <h4 className="font-medium text-stone-800">Manage Books</h4>
              <p className="text-sm text-stone-600 mt-2">
                Add, edit, or remove books from inventory
              </p>
            </Link>

            <Link
              to="/admin/categories"
              className="flex flex-col items-center p-5 bg-white border border-amber-200 rounded-lg shadow-sm hover:bg-amber-50 transition-colors text-center"
            >
              <div className="bg-amber-100 p-3 rounded-full mb-3">
                <Tag className="text-amber-800 h-6 w-6" />
              </div>
              <h4 className="font-medium text-stone-800">Manage Categories</h4>
              <p className="text-sm text-stone-600 mt-2">
                Organize books into searchable categories
              </p>
            </Link>

            <Link
              to="/admin/users"
              className="flex flex-col items-center p-5 bg-white border border-amber-200 rounded-lg shadow-sm hover:bg-amber-50 transition-colors text-center"
            >
              <div className="bg-amber-100 p-3 rounded-full mb-3">
                <Users className="text-amber-800 h-6 w-6" />
              </div>
              <h4 className="font-medium text-stone-800">Manage Users</h4>
              <p className="text-sm text-stone-600 mt-2">
                View and manage customer accounts
              </p>
            </Link>

            <Link
              to="/admin/orders"
              className="flex flex-col items-center p-5 bg-white border border-amber-200 rounded-lg shadow-sm hover:bg-amber-50 transition-colors text-center"
            >
              <div className="bg-amber-100 p-3 rounded-full mb-3">
                <ShoppingCart className="text-amber-800 h-6 w-6" />
              </div>
              <h4 className="font-medium text-stone-800">Manage Orders</h4>
              <p className="text-sm text-stone-600 mt-2">
                Process and track customer orders
              </p>
            </Link>
          </div>
        </div>

        {/* Additional Admin Tools */}
        <div>
          <h3 className="text-xl font-serif font-semibold text-stone-800 mb-5">
            Admin Tools
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 border border-amber-200 rounded-lg shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-amber-100 p-2 rounded-full">
                  <BarChart3 className="text-amber-800 h-5 w-5" />
                </div>
                <h4 className="font-medium text-stone-800">Analytics</h4>
              </div>
              <p className="text-stone-600 mb-4 text-sm">
                View detailed reports on sales, user activity, and inventory
                levels
              </p>
              <Link
                to="/admin/analytics"
                className="text-amber-800 font-medium text-sm hover:text-amber-900 transition-colors flex items-center"
              >
                View Reports
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

            <div className="bg-white p-5 border border-amber-200 rounded-lg shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-amber-100 p-2 rounded-full">
                  <Settings className="text-amber-800 h-5 w-5" />
                </div>
                <h4 className="font-medium text-stone-800">Settings</h4>
              </div>
              <p className="text-stone-600 mb-4 text-sm">
                Configure store settings, payment methods, and notification
                preferences
              </p>
              <Link
                to="/admin/settings"
                className="text-amber-800 font-medium text-sm hover:text-amber-900 transition-colors flex items-center"
              >
                Manage Settings
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
=======
import "./Admin.css";

export default function AdminDashboard() {
  return (
    <div className="admin-page">
      <div className="admin-container">
        <h2>Admin Dashboard</h2>
        <div className="admin-stats">
          <div className="stat-card">
            <h3>Total Books</h3>
            <p className="stat-number">243</p>
          </div>
          <div className="stat-card">
            <h3>Users</h3>
            <p className="stat-number">1,204</p>
          </div>
          <div className="stat-card">
            <h3>Orders</h3>
            <p className="stat-number">56</p>
          </div>
        </div>

        <h3>Quick Actions</h3>
        <div className="admin-actions">
          <Link to="/admin/books" className="admin-action-btn">
            Manage Books
          </Link>
          <Link to="/admin/categories" className="admin-action-btn">
            Manage Categories
          </Link>
          <Link to="/admin/users" className="admin-action-btn">
            Manage Users
          </Link>
>>>>>>> 7838768 (authentication)
        </div>
      </div>
    </div>
  );
}
