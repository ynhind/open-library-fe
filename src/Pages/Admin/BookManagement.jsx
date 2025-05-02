import React, { useState, useEffect } from "react";
import { apiRequest } from "../../utils/api";
import "./Admin.css";

export default function BookManagement() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: 0,
    quantity_available: 0,
    description: "",
    isAvailableOnline: false,
    previewPages: 20,
  });
  const [editingBookId, setEditingBookId] = useState(null);

  const [bookFile, setBookFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  // Fetch books on component load
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await apiRequest("books");
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseFloat(value)
          : value,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.name === "bookFile") {
      setBookFile(e.target.files[0]);
    } else if (e.target.name === "coverImage") {
      setCoverImage(e.target.files[0]);
    }
  };

  // Update the form submission to use FormData
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const formDataObj = new FormData();

      // Add text fields
      Object.keys(formData).forEach((key) => {
        formDataObj.append(key, formData[key]);
      });

      // Add files if they exist
      if (bookFile) {
        formDataObj.append("bookFile", bookFile);
      }

      if (coverImage) {
        formDataObj.append("coverImage", coverImage);
      }

      const endpoint = editingBookId ? `books/${editingBookId}` : "books";
      const method = editingBookId ? "PUT" : "POST";

      // Custom fetch for FormData
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/${endpoint}`,
        {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataObj,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Reset file inputs
      setBookFile(null);
      setCoverImage(null);
      document.getElementById("bookFileInput").value = "";
      document.getElementById("coverImageInput").value = "";

      // Refresh book list
      const booksData = await apiRequest("books");
      setBooks(booksData);

      // Reset form
      setFormData({
        /* your reset values */
      });
      setEditingBookId(null);
    } catch (error) {
      console.error("Error saving book:", error);
    }
  }; // Close handleSubmit function

  const handleEdit = (book) => {
    setFormData({
      title: book.title,
      author: book.author,
      price: book.price,
      quantity_available: book.quantity_available,
      description: book.description || "",
      isAvailableOnline: book.isAvailableOnline || false,
      previewPages: book.previewPages || 20,
    });
    setEditingBookId(book.bookId);
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    const token = localStorage.getItem("token");
    try {
      await apiRequest(`books/${bookId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update books list
      setBooks(books.filter((book) => book.bookId !== bookId));
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h2>Book Management</h2>

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
