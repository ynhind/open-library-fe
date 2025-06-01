import React, { useState, useEffect } from "react";
import {
  getCategories,
  createCategory,
  deleteCategory,
} from "../../utils/bookApi";
import {
  PlusIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

export const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
      setError("");
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setError("Category name cannot be empty");
      return;
    }

    try {
      setLoading(true);
      await createCategory(newCategoryName.trim());
      setNewCategoryName("");
      setSuccess("Category created successfully!");
      setError("");
      await fetchCategories(); // Refresh the categories list
    } catch (error) {
      console.error("Error creating category:", error);
      setError(error.message || "Failed to create category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this category? This action cannot be undone and will remove the category from all associated books."
      )
    ) {
      try {
        setDeletingId(categoryId);
        await deleteCategory(categoryId);
        setSuccess("Category deleted successfully!");
        setError("");
        await fetchCategories(); // Refresh the categories list
      } catch (error) {
        console.error("Error deleting category:", error);
        setError(
          error.message || "Failed to delete category. Please try again."
        );
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-yellow-50/20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg border border-amber-100/50 p-6 sm:p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <TagIcon className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-800">
                  Category Management
                </h1>
                <p className="text-stone-600 mt-1">
                  Manage book categories for your library collection
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">
                  {categories.length}
                </div>
                <div className="text-xs text-stone-500 uppercase tracking-wide">
                  Categories
                </div>
              </div>
            </div>
          </div>

          {/* Alert Messages with Icons */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 rounded-md p-4 mb-6">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-400 rounded-md p-4 mb-6">
              <div className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-green-800">
                    Success
                  </h3>
                  <p className="text-sm text-green-700 mt-1">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Add Category Form */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 rounded-xl p-6 border border-amber-200/50">
            <div className="flex items-center space-x-2 mb-4">
              <PlusIcon className="h-5 w-5 text-amber-600" />
              <h3 className="text-lg font-semibold text-stone-800">
                Add New Category
              </h3>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 sm:space-y-0 sm:flex sm:items-end sm:space-x-4"
            >
              <div className="flex-1">
                <label
                  htmlFor="categoryName"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  Category Name
                </label>
                <input
                  id="categoryName"
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g., Science Fiction, Romance, Biography..."
                  className="w-full border border-amber-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                {loading ? "Adding..." : "Add Category"}
              </button>
            </form>
          </div>
        </div>

        {/* Categories Table Section */}
        <div className="bg-white rounded-xl shadow-lg border border-amber-100/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-amber-100">
            <h3 className="text-lg font-semibold text-stone-800">
              All Categories ({categories.length})
            </h3>
          </div>

          {loading && !categories.length ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-600 border-t-transparent"></div>
                <span className="text-stone-600">Loading categories...</span>
              </div>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <TagIcon className="mx-auto h-12 w-12 text-stone-400 mb-4" />
              <h3 className="text-lg font-medium text-stone-900 mb-2">
                No categories yet
              </h3>
              <p className="text-stone-600 mb-4">
                Get started by creating your first book category above.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-amber-100">
                <thead className="bg-amber-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">
                      Category Name
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-stone-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-amber-50">
                  {categories.map((category, index) => (
                    <tr
                      key={category.categoryId}
                      className={`hover:bg-amber-25 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-amber-25/30"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">
                        #{category.categoryId}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-stone-900">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                          <span>{category.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleDelete(category.categoryId)}
                          disabled={deletingId === category.categoryId}
                          className="inline-flex items-center px-3 py-1.5 border border-red-200 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          <TrashIcon className="h-4 w-4 mr-1" />
                          {deletingId === category.categoryId
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer with Back Button */}
        <div className="mt-8 flex justify-between items-center">
          <div className="text-sm text-stone-500">
            Manage your book categories to organize your library collection
            effectively.
          </div>
          <button
            onClick={() => (window.location.href = "/admin")}
            className="inline-flex items-center px-4 py-2 border border-amber-200 text-sm font-medium rounded-lg text-amber-700 bg-white hover:bg-amber-50 hover:border-amber-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Admin Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
