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
// src/utils/bookApi.js
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
