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

export const createBook = async (bookData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    return await apiRequest("books/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookData),
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

    return await apiRequest(`books/update/${bookId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookData),
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
