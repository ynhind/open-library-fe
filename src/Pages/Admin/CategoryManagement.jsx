import React, { useState, useEffect } from "react";
import { getCategories, createCategory } from "../../utils/bookApi";

export const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="min-h-screen bg-amber-50/50 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-amber-800 mb-6">
          Category Management
        </h2>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
            <p>{success}</p>
          </div>
        )}

        {/* Add Category Form */}
        <div className="mb-10">
          <div className="bg-amber-50/70 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-serif font-semibold text-stone-800 mb-5">
              Add New Category
            </h3>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col md:flex-row gap-4"
            >
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name"
                className="flex-grow border border-amber-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-amber-800 text-white px-5 py-2 rounded-md hover:bg-amber-900 transition-colors whitespace-nowrap disabled:opacity-70"
              >
                {loading ? "Adding..." : "Add Category"}
              </button>
            </form>
          </div>
        </div>

        {/* Categories List */}
        <h3 className="text-xl font-serif font-semibold text-stone-800 mb-4">
          All Categories
        </h3>

        {loading && !categories.length ? (
          <div className="flex justify-center items-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-800"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8 bg-amber-50/30 rounded-lg border border-amber-100">
            <p className="text-stone-600">
              No categories found. Add your first category above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full divide-y divide-amber-200">
              <thead className="bg-amber-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-stone-700 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-stone-700 uppercase tracking-wider">
                    Category Name
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-amber-100">
                {categories.map((category) => (
                  <tr
                    key={category.categoryId}
                    className="hover:bg-amber-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-stone-700">
                      {category.categoryId}
                    </td>
                    <td className="px-4 py-3 whitespace-normal text-sm font-medium text-stone-800">
                      {category.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Back button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => (window.location.href = "/admin")}
            className="flex items-center space-x-2 bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-md transition-colors duration-200 shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span>Back to Admin Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
