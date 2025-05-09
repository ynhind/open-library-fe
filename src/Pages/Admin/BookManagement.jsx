import React, { useState, useEffect } from "react";
import "./Admin.css";
import { getBooks, createBook, searchBooks } from "../../utils/bookApi";
import { updateBook } from "../../utils/bookApi";
import { deleteBook } from "../../utils/bookApi";

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

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: 0,
    quantity_available: 0,
    description: "",
    publisher: "",
    publishDate: "",
    isbn: "",
    format: "PAPERBACK", // Default value
    isAvailableOnline: false,
    previewPages: 0,
    categories: [],
  });
  const [editingBookId, setEditingBookId] = useState(null);
  //   const [bookFile, setBookFile] = useState(null);
  //   const [coverImage, setCoverImage] = useState(null);
  const [error, setError] = useState("");

  // Fetch books on component load
  useEffect(() => {
    fetchBooks();
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
    const { name, value, type, checked } = e.target;

    if (name === "categories" && type === "select-multiple") {
      // Handle multi-select element differently
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
      // Always store dates as ISO strings for the API
      const dateValue = value ? new Date(value).toISOString() : "";
      setFormData({ ...formData, [name]: dateValue });
    } else {
      // Handle other form fields normally
      const fieldValue = type === "checkbox" ? checked : value;
      setFormData({ ...formData, [name]: fieldValue });
    }
  };
  //   const handleFileChange = (e) => {
  //     const { name, files } = e.target;
  //     if (files && files[0]) {
  //       if (name === "bookFile") {
  //         setBookFile(files[0]);
  //       } else if (name === "coverImage") {
  //         setCoverImage(files[0]);
  //       }
  //     }
  //   };

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

  // Perform the actual search
  const performSearch = async (params) => {
    setLoading(true);

    try {
      // Filter out empty search params
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
    await fetchBooks(); // Reload all books
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Categories before processing:", formData.categories);
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
          : [], // Provide a fallback empty array
      };
      console.log("Processed book data:", bookData);

      if (editingBookId) {
        // If we're editing an existing book
        await updateBook(editingBookId, bookData);
        console.log("Book updated successfully");
      } else {
        // If we're creating a new book
        await createBook(bookData);
        console.log("Book created successfully");
      } // Reset form
      setFormData({
        title: "",
        author: "",
        price: 0,
        quantity_available: 0,
        description: "",
        publisher: "",
        publishDate: "",
        isbn: "",
        format: "PAPERBACK", // Default value
        isAvailableOnline: false,
        previewPages: 0,
        categories: [],
      });
      setEditingBookId(null);
      // Refresh book list
      await fetchBooks();
    } catch (error) {
      console.error("Error saving book:", error);
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
    });
    setEditingBookId(book.bookId);
  };
  const handleDelete = async (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await deleteBook(bookId);
        console.log("Book deleted successfully");
        await fetchBooks();
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h2>Book Management</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <h3>{editingBookId ? "Edit Book" : "Add New Book"}</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="author">Author</label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price ($)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="quantity_available">Quantity Available</label>
              <input
                type="number"
                id="quantity_available"
                name="quantity_available"
                value={formData.quantity_available}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="publisher">Publisher</label>
              <input
                type="text"
                id="publisher"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                required
              />
            </div>
            <input
              type="date"
              name="publishDate"
              value={
                formData.publishDate
                  ? formData.publishDate.substring(0, 10)
                  : ""
              }
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="isbn">ISBN</label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="format">Format</label>
              <select
                id="format"
                name="format"
                value={formData.format}
                onChange={handleChange}
              >
                <option value="PAPERBACK">Paperback</option>
                <option value="HARDCOVER">Hardcover</option>
                <option value="EBOOK">Ebook</option>
                <option value="AUDIOBOOK">Audiobook</option>
              </select>
            </div>
          </div>

          {/* <div className="form-row">
            <div className="form-group">
              <label htmlFor="bookFileInput">Book PDF File</label>
              <input
                type="file"
                id="bookFileInput"
                name="bookFile"
                onChange={handleFileChange}
                accept=".pdf"
              />
            </div>
            <div className="form-group">
              <label htmlFor="coverImageInput">Cover Image</label>
              <input
                type="file"
                id="coverImageInput"
                name="coverImage"
                onChange={handleFileChange}
                accept="image/jpeg, image/png"
              />
            </div>
          </div> */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="isbn">Categories</label>
              <select
                id="categories"
                name="categories"
                value={formData.categories}
                onChange={handleChange}
                multiple
              >
                <option value="1">Fiction</option>
                <option value="2">Non-Fiction</option>
                <option value="3">Science</option>
                <option value="4">History</option>
                <option value="5">Biography</option>
                <option value="6">Fantasy</option>
                <option value="7">Mystery</option>

                <option value="8">Romance</option>
                <option value="9">Thriller</option>
                <option value="10">Self-Help</option>
                <option value="11">Health</option>
                <option value="12">Travel</option>
                <option value="13">Cookbooks</option>
              </select>
            </div>
          </div>

          {/* <div className="form-row">
            <div className="form-group">
              <label htmlFor="bookFileInput">Book File (PDF)</label>
              <input
                type="file"
                id="bookFileInput"
                name="bookFile"
                onChange={handleFileChange}
                accept=".pdf"
              />
            </div>
            <div className="form-group">
              <label htmlFor="coverImageInput">Cover Image</label>
              <input
                type="file"
                id="coverImageInput"
                name="coverImage"
                onChange={handleFileChange}
                accept="image/jpeg, image/png"
              />
            </div>
          </div> */}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="previewPages">Preview Pages</label>
              <input
                type="number"
                id="previewPages"
                name="previewPages"
                value={formData.previewPages}
                onChange={handleChange}
              />
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isAvailableOnline"
                  checked={formData.isAvailableOnline}
                  onChange={handleChange}
                />
                Available Online
              </label>
            </div>
          </div>

          <div className="search-section">
            <h3 className="section-title">Search Books</h3>
            <div className="search-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="searchTitle">Title</label>
                  <input
                    type="text"
                    id="searchTitle"
                    name="title"
                    value={searchParams.title}
                    onChange={handleSearchChange}
                    placeholder="Search by title"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="searchAuthor">Author</label>
                  <input
                    type="text"
                    id="searchAuthor"
                    name="author"
                    value={searchParams.author}
                    onChange={handleSearchChange}
                    placeholder="Search by author"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="searchPublisher">Publisher</label>
                  <input
                    type="text"
                    id="searchPublisher"
                    name="publisher"
                    value={searchParams.publisher}
                    onChange={handleSearchChange}
                    placeholder="Search by publisher"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="searchCategories">Categories</label>
                  <select
                    id="searchCategories"
                    name="categories"
                    multiple
                    value={searchParams.categories}
                    onChange={handleSearchChange}
                  >
                    {/* Your category options */}
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Science">Science</option>
                    <option value="History">History</option>
                    <option value="Biography">Biography</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Romance">Romance</option>
                    <option value="Thriller">Thriller</option>
                    <option value="Self-Help">Self-Help</option>
                  </select>
                </div>
              </div>
              <div className="search-actions">
                <button
                  type="button"
                  className="admin-button secondary"
                  onClick={clearSearch}
                >
                  Clear Search
                </button>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="admin-button primary">
              {editingBookId ? "Update Book" : "Add Book"}
            </button>
            {editingBookId && (
              <button
                type="button"
                className="admin-button secondary"
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
                  });
                }}
              >
                Cancel Editing
              </button>
            )}
          </div>
        </form>

        <h3 className="section-title">All Books</h3>
        {loading ? (
          <p>Loading books...</p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Online</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.bookId}>
                    <td>{book.bookId}</td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>${book.price}</td>
                    <td>{book.quantity_available}</td>
                    <td>{book.isAvailableOnline ? "Yes" : "No"}</td>
                    <td>
                      <button
                        className="table-btn edit"
                        onClick={() => handleEdit(book)}
                      >
                        Edit
                      </button>
                      <button
                        className="table-btn delete"
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
      </div>
    </div>
  );
}
