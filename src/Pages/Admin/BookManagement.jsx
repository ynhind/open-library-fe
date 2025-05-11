import React, { useState, useEffect, useRef } from "react";
import {
  getBooks,
  createBook,
  searchBooks,
  updateBook,
  deleteBook,
  getCategories,
} from "../../utils/bookApi";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function BookManagement() {
  //fetch categories
  const [categories, setCategories] = useState([]);
  const fetchCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load categories. Please try again.");
    }
  };

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    title: "",
    author: "",
    publisher: "",
    categories: [],
  });
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchParams = useDebounce(searchParams, 500);

  // File references
  const fileInputRef = useRef(null);
  const coverImageRef = useRef(null);

  // Remaining state and hook logic (unchanged)
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: 0,
    quantity_available: 0,
    description: "",
    publisher: "",
    publishDate: "",
    isbn: "",
    format: "PAPERBACK",
    isAvailableOnline: false,
    previewPages: 0,
    categories: [],
    file: null, // Add for PDF file
    coverImage: null, // Add for cover image
    filePreview: "", // For displaying file name
    coverPreview: "", // For displaying cover preview
  });

  const [editingBookId, setEditingBookId] = useState(null);
  const [error, setError] = useState("");
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);

  // All effect hooks and handlers remain unchanged
  useEffect(() => {
    // Check if any search parameter has a value
    const hasSearchParams = Object.values(debouncedSearchParams).some(
      (value) =>
        value &&
        (typeof value === "string" ? value.trim() !== "" : value.length > 0)
    );
    if (hasSearchParams) {
      performSearch(debouncedSearchParams);
      setIsSearching(true);
    } else if (isSearching) {
      // If search params were cleared, reset to all books
      fetchBooks();
      setIsSearching(false);
    }
  }, [debouncedSearchParams]);

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await getBooks();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
      setError("Failed to load books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "file" && files && files[0]) {
      // Handle PDF file upload
      setFormData({
        ...formData,
        file: files[0],
        filePreview: files[0].name,
      });
    } else if (name === "coverImage" && files && files[0]) {
      // Handle cover image upload
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({
          ...formData,
          coverImage: files[0],
          coverPreview: e.target.result,
        });
      };
      reader.readAsDataURL(files[0]);
    } else if (name === "categories" && type === "select-multiple") {
      const selectedOptions = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setFormData({
        ...formData,
        [name]: selectedOptions,
      });
    } else {
      setFormData({
        ...formData,
        [name]:
          type === "checkbox"
            ? checked
            : type === "number"
            ? parseFloat(value)
            : value,
      });
    }

    if (name === "publishDate") {
      const dateValue = value ? new Date(value).toISOString() : "";
      setFormData({ ...formData, [name]: dateValue });
    } else if (!["file", "coverImage"].includes(name)) {
      const fieldValue = type === "checkbox" ? checked : value;
      setFormData({ ...formData, [name]: fieldValue });
    }
  };

  const handleSearchChange = (e) => {
    const { name, value, type, selectedOptions } = e.target;
    if (type === "select-multiple") {
      const selectedValues = Array.from(
        selectedOptions,
        (option) => option.value
      );
      setSearchParams((prev) => ({
        ...prev,
        [name]: selectedValues,
      }));
    } else {
      setSearchParams((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const performSearch = async (params) => {
    setLoading(true);
    try {
      const filteredParams = Object.entries(params).reduce(
        (acc, [key, value]) => {
          if (
            value &&
            (typeof value === "string" ? value.trim() !== "" : value.length > 0)
          ) {
            acc[key] = value;
          }
          return acc;
        },
        {}
      );
      const results = await searchBooks(filteredParams);
      setBooks(results);
    } catch (error) {
      console.error("Error searching books:", error);
      setError("Failed to search books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = async () => {
    setSearchParams({
      title: "",
      author: "",
      publisher: "",
      categories: [],
    });
    setIsSearching(false);
    await fetchBooks();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required files for new book
    if (!editingBookId) {
      if (!formData.file) {
        setError("Please upload a PDF file for the book.");
        return;
      }
      if (!formData.coverImage) {
        setError("Please upload a cover image for the book.");
        return;
      }
    }

    try {
      const bookData = {
        ...formData,
        price: Number(formData.price),
        quantity_available: Number(formData.quantity_available),
        publishDate: formData.publishDate
          ? new Date(formData.publishDate).toISOString()
          : null,
        previewPages: Number(formData.previewPages),
        categories: Array.isArray(formData.categories)
          ? formData.categories.map((id) => Number(id))
          : [],
        file: formData.file,
        coverImage: formData.coverImage,
      };

      if (editingBookId) {
        await updateBook(editingBookId, bookData);
      } else {
        console.log("Sending book data:", bookData);
        const result = await createBook(bookData);
        console.log("Book created successfully:", result);
        setError("");
      }

      // Reset form
      setFormData({
        title: "",
        author: "",
        price: 0,
        quantity_available: 0,
        description: "",
        publisher: "",
        publishDate: "",
        isbn: "",
        format: "PAPERBACK",
        isAvailableOnline: false,
        previewPages: 0,
        categories: [],
        file: null,
        coverImage: null,
        filePreview: "",
        coverPreview: "",
      });

      // Reset file inputs
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (coverImageRef.current) coverImageRef.current.value = "";

      setEditingBookId(null);
      setShowAdvancedFields(false);
      // Refresh book list
      await fetchBooks();
    } catch (error) {
      console.error("Error saving book:", error);
      setError("Failed to save book. Please check your inputs and try again.");
    }
  };

  const handleEdit = (book) => {
    setFormData({
      title: book.title,
      author: book.author,
      price: book.price || 0,
      quantity_available: book.quantity_available || 0,
      description: book.description || "",
      isAvailableOnline: book.isAvailableOnline || false,
      previewPages: book.previewPages || 20,
      publisher: book.publisher || "",
      publishDate: book.publishDate || "",
      isbn: book.isbn || "",
      format: book.format || "PAPERBACK",
      categories: book.categories
        ? book.categories.map((category) => category.categoryId)
        : [],
      file: null,
      coverImage: null,
      filePreview: "Current file will be kept if not changed",
      coverPreview: book.coverImage || "",
    });
    setEditingBookId(book.bookId);
    setShowAdvancedFields(true); // Show all fields when editing
  };

  const handleDelete = async (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await deleteBook(bookId);
        await fetchBooks();
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-amber-50/50 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-amber-800 mb-6">
          Book Management
        </h2>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}

        {/* Simplified Book Form */}
        <div className="mb-10">
          <details
            className="bg-amber-50/70 p-6 rounded-lg shadow-sm"
            open={editingBookId !== null}
          >
            <summary className="text-xl font-serif font-semibold text-stone-800 mb-5 cursor-pointer">
              {editingBookId ? "Edit Book" : "Add New Book"}
            </summary>

            <form onSubmit={handleSubmit}>
              {/* File upload section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex flex-col">
                  <label
                    htmlFor="file"
                    className="text-sm font-medium text-stone-700 mb-1"
                  >
                    Book PDF{" "}
                    {!editingBookId && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="file"
                    id="file"
                    name="file"
                    accept=".pdf"
                    onChange={handleChange}
                    ref={fileInputRef}
                    className="border border-amber-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required={!editingBookId}
                  />
                  {formData.filePreview && (
                    <p className="text-xs text-stone-500 mt-1">
                      {formData.filePreview}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="coverImage"
                    className="text-sm font-medium text-stone-700 mb-1"
                  >
                    Cover Image{" "}
                    {!editingBookId && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="file"
                    id="coverImage"
                    name="coverImage"
                    accept="image/*"
                    onChange={handleChange}
                    ref={coverImageRef}
                    className="border border-amber-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required={!editingBookId}
                  />
                  {formData.coverPreview && (
                    <div className="mt-2">
                      <img
                        src={formData.coverPreview}
                        alt="Cover preview"
                        className="h-20 w-auto object-contain rounded"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="flex flex-col">
                  <label
                    htmlFor="title"
                    className="text-sm font-medium text-stone-700 mb-1"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="border border-amber-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="author"
                    className="text-sm font-medium text-stone-700 mb-1"
                  >
                    Author
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                    className="border border-amber-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="price"
                    className="text-sm font-medium text-stone-700 mb-1"
                  >
                    Price ($)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    required
                    className="border border-amber-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="quantity_available"
                    className="text-sm font-medium text-stone-700 mb-1"
                  >
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="quantity_available"
                    name="quantity_available"
                    value={formData.quantity_available}
                    onChange={handleChange}
                    required
                    className="border border-amber-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="format"
                    className="text-sm font-medium text-stone-700 mb-1"
                  >
                    Format
                  </label>
                  <select
                    id="format"
                    name="format"
                    value={formData.format}
                    onChange={handleChange}
                    className="border border-amber-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="PAPERBACK">Paperback</option>
                    <option value="HARDCOVER">Hardcover</option>
                    <option value="EBOOK">Ebook</option>
                    <option value="AUDIOBOOK">Audiobook</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="isbn"
                    className="text-sm font-medium text-stone-700 mb-1"
                  >
                    ISBN
                  </label>
                  <input
                    type="text"
                    id="isbn"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleChange}
                    required
                    className="border border-amber-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Toggle for advanced fields */}
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => setShowAdvancedFields(!showAdvancedFields)}
                  className="text-amber-800 hover:text-amber-900 flex items-center text-sm font-medium"
                >
                  {showAdvancedFields
                    ? "Hide Advanced Fields"
                    : "Show Advanced Fields"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 ml-1 transform ${
                      showAdvancedFields ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {/* Advanced fields */}
              {showAdvancedFields && (
                <>
                  <div className="mb-6">
                    <label
                      htmlFor="description"
                      className="text-sm font-medium text-stone-700 mb-1 block"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      className="w-full border border-amber-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <div className="flex flex-col">
                      <label
                        htmlFor="publisher"
                        className="text-sm font-medium text-stone-700 mb-1"
                      >
                        Publisher
                      </label>
                      <input
                        type="text"
                        id="publisher"
                        name="publisher"
                        value={formData.publisher}
                        onChange={handleChange}
                        className="border border-amber-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="publishDate"
                        className="text-sm font-medium text-stone-700 mb-1"
                      >
                        Publish Date
                      </label>
                      <input
                        type="date"
                        id="publishDate"
                        name="publishDate"
                        value={
                          formData.publishDate
                            ? formData.publishDate.substring(0, 10)
                            : ""
                        }
                        onChange={handleChange}
                        className="border border-amber-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="previewPages"
                        className="text-sm font-medium text-stone-700 mb-1"
                      >
                        Preview Pages
                      </label>
                      <input
                        type="number"
                        id="previewPages"
                        name="previewPages"
                        value={formData.previewPages}
                        onChange={handleChange}
                        className="border border-amber-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="categories"
                        className="text-sm font-medium text-stone-700 mb-1"
                      >
                        Categories
                      </label>
                      <select
                        id="categories"
                        name="categories"
                        value={formData.categories}
                        onChange={handleChange}
                        multiple
                        className="border border-amber-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 h-24 bg-white"
                      >
                        {categories.length > 0 ? (
                          categories.map((category) => (
                            <option
                              key={category.categoryId}
                              value={category.categoryId}
                            >
                              {category.name}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            Loading categories...
                          </option>
                        )}
                      </select>
                      <p className="text-xs text-stone-500 mt-1">
                        Hold Ctrl/Cmd to select multiple
                      </p>
                    </div>

                    <div className="flex items-center mt-4">
                      <input
                        type="checkbox"
                        id="isAvailableOnline"
                        name="isAvailableOnline"
                        checked={formData.isAvailableOnline}
                        onChange={handleChange}
                        className="w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
                      />
                      <label
                        htmlFor="isAvailableOnline"
                        className="ml-2 text-sm font-medium text-stone-700"
                      >
                        Available Online
                      </label>
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="bg-amber-800 text-white px-5 py-2 rounded-md hover:bg-amber-900 transition-colors"
                >
                  {editingBookId ? "Update Book" : "Add Book"}
                </button>
                {editingBookId && (
                  <button
                    type="button"
                    className="bg-stone-700 text-white px-5 py-2 rounded-md hover:bg-stone-800 transition-colors"
                    onClick={() => {
                      setEditingBookId(null);
                      setFormData({
                        title: "",
                        author: "",
                        price: 0,
                        quantity_available: 0,
                        description: "",
                        isAvailableOnline: false,
                        previewPages: 20,
                        publisher: "",
                        publishDate: "",
                        isbn: "",
                        format: "PAPERBACK",
                        categories: [],
                        file: null,
                        coverImage: null,
                        filePreview: "",
                        coverPreview: "",
                      });
                      if (fileInputRef.current) fileInputRef.current.value = "";
                      if (coverImageRef.current)
                        coverImageRef.current.value = "";
                      setShowAdvancedFields(false);
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </details>
        </div>

        {/* Rest of the component remains unchanged */}
        {/* Search Section */}
        <div className="bg-white border border-amber-200 rounded-lg p-5 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-serif font-medium text-stone-800">
              Search Books
            </h3>
            <button
              type="button"
              onClick={clearSearch}
              className="text-sm text-amber-800 hover:text-amber-900"
            >
              Clear Search
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <label
                htmlFor="searchTitle"
                className="text-sm font-medium text-stone-700 mb-1"
              >
                Title
              </label>
              <input
                type="text"
                id="searchTitle"
                name="title"
                value={searchParams.title}
                onChange={handleSearchChange}
                placeholder="Search by title"
                className="border border-amber-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="searchAuthor"
                className="text-sm font-medium text-stone-700 mb-1"
              >
                Author
              </label>
              <input
                type="text"
                id="searchAuthor"
                name="author"
                value={searchParams.author}
                onChange={handleSearchChange}
                placeholder="Search by author"
                className="border border-amber-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="searchPublisher"
                className="text-sm font-medium text-stone-700 mb-1"
              >
                Publisher
              </label>
              <input
                type="text"
                id="searchPublisher"
                name="publisher"
                value={searchParams.publisher}
                onChange={handleSearchChange}
                placeholder="Search by publisher"
                className="border border-amber-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="searchCategories"
                className="text-sm font-medium text-stone-700 mb-1"
              >
                Categories
              </label>
              <select
                id="searchCategories"
                name="categories"
                multiple
                value={searchParams.categories}
                onChange={handleSearchChange}
                className="border border-amber-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 h-10 bg-white"
              >
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <option key={category.categoryId} value={category.name}>
                      {category.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Loading categories...
                  </option>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Books Table */}
        <h3 className="text-xl font-serif font-semibold text-stone-800 mb-4">
          All Books
        </h3>

        {loading ? (
          <div className="flex justify-center items-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-800"></div>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-8 bg-amber-50/30 rounded-lg border border-amber-100">
            <p className="text-stone-600">
              No books found. Try adjusting your search criteria.
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
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-stone-700 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-stone-700 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-stone-700 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-stone-700 uppercase tracking-wider">
                    Format
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-stone-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-amber-100">
                {books.map((book) => (
                  <tr
                    key={book.bookId}
                    className="hover:bg-amber-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-stone-700">
                      {book.bookId}
                    </td>
                    <td className="px-4 py-3 whitespace-normal text-sm font-medium text-stone-800 max-w-[200px] truncate">
                      {book.title}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-stone-700">
                      {book.author}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-stone-700">
                      ${book.price}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-stone-700">
                      {book.quantity_available}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-stone-700">
                      <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">
                        {book.format?.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <button
                        className="bg-amber-600 text-white px-3 py-1 rounded mr-2 text-xs hover:bg-amber-700 transition-colors"
                        onClick={() => handleEdit(book)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors"
                        onClick={() => handleDelete(book.bookId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
}
