// src/utils/bookApi.js
import { apiRequest } from "./api";

// Get all books
export const getBooks = async () => {
  try {
    return await apiRequest("books");
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};

//create book with file upload
export const createBook = async (bookData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    // Create FormData object for multipart/form-data request
    const formData = new FormData();

    // Add book file (PDF)
    if (bookData.file) {
      formData.append("file", bookData.file);
    } else {
      throw new Error("PDF file is required");
    }

    // Add cover image
    if (bookData.coverImage) {
      formData.append("coverImage", bookData.coverImage);
    } else {
      throw new Error("Cover image is required");
    }

    // Add all other book data fields
    Object.keys(bookData).forEach((key) => {
      // Skip file objects since we already handled them
      if (key !== "file" && key !== "coverImage") {
        // If the field is an array (like categories), join with commas
        if (Array.isArray(bookData[key])) {
          formData.append(key, bookData[key].join(","));
        } else if (bookData[key] !== null && bookData[key] !== undefined) {
          formData.append(key, bookData[key]);
        }
      }
    });

    return await apiRequest("books/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // No Content-Type header - browser will set it with the correct boundary
      },
      body: formData,
    });
  } catch (error) {
    console.error("Error creating book:", error);
    throw error;
  }
};

//update book
export const updateBook = async (bookId, bookData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }
    // Create FormData object for multipart/form-data request
    const formData = new FormData();
    // Add book file (PDF)
    if (bookData.file) {
      formData.append("file", bookData.file);
    }
    // Add cover image
    if (bookData.coverImage) {
      formData.append("coverImage", bookData.coverImage);
    }
    // Add all other book data fields
    Object.keys(bookData).forEach((key) => {
      // Skip file objects since we already handled them
      if (key !== "file" && key !== "coverImage") {
        // If the field is an array (like categories), join with commas
        if (Array.isArray(bookData[key])) {
          formData.append(key, bookData[key].join(","));
        } else if (bookData[key] !== null && bookData[key] !== undefined) {
          formData.append(key, bookData[key]);
        }
      }
    });

    return await apiRequest(`books/update/${bookId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  } catch (error) {
    console.error("Error updating book:", error);
    throw error;
  }
};

//delete book
export const deleteBook = async (bookId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    return await apiRequest(`books/delete/${bookId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
};

//search book
export const searchBooks = async (searchParams = {}) => {
  try {
    const queryParams = new URLSearchParams();

    // Add all search parameters to query string
    if (searchParams.title) {
      queryParams.append("title", searchParams.title);
    }

    if (searchParams.author) {
      queryParams.append("author", searchParams.author);
    }

    if (searchParams.publisher) {
      queryParams.append("publisher", searchParams.publisher);
    }

    // Backend expects "names" parameter for category names
    if (searchParams.categories && Array.isArray(searchParams.categories)) {
      searchParams.categories.forEach((category) => {
        queryParams.append("names", category);
      });
    }

    const queryString = queryParams.toString();
    const token = localStorage.getItem("token");

    return await apiRequest(
      `books/search${queryString ? `?${queryString}` : ""}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
  } catch (error) {
    console.error("Error searching books:", error);
    throw error;
  }
};

//get categories
export const getCategories = async () => {
  try {
    return await apiRequest("books/categories");
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
//create category
// Create new category
export const createCategory = async (categoryName) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    return await apiRequest("books/create-categories", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: categoryName }),
    });
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

//delete category
export const deleteCategory = async (categoryId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    return await apiRequest(`books/delete-categories/${categoryId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

//get book by id
export const getBookById = async (bookId) => {
  try {
    return await apiRequest(`books/${bookId}`);
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    throw error;
  }
};

// Add a rating or review to a book
export const addRating = async (bookId, ratingData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    // Make sure bookId is a proper number
    const numericBookId = Number(bookId);
    if (isNaN(numericBookId)) {
      throw new Error("Invalid book ID");
    }

    console.log("Sending rating for book ID:", numericBookId);

    return await apiRequest(`books/${numericBookId}/rating`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ratingData),
    });
  } catch (error) {
    console.error("Error adding rating:", error);
    throw error;
  }
};

// Get related books based on categories
export const getRelatedBooks = async (
  categories,
  currentBookId,
  limit = 10
) => {
  try {
    if (!categories || categories.length === 0) {
      // If no categories, return some random books
      const allBooks = await getBooks();
      return allBooks
        .filter((book) => book.bookId !== currentBookId)
        .slice(0, limit);
    }

    // Search for books in the same categories
    const relatedBooks = await searchBooks({
      categories: categories,
    });

    // Filter out the current book and limit results
    return relatedBooks
      .filter((book) => book.bookId !== currentBookId)
      .slice(0, limit);
  } catch (error) {
    console.error("Error fetching related books:", error);
    throw error;
  }
};
