import { apiRequest } from "./api";

// Add a book to the wishlist
export const addToWishlist = async (bookId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    const response = await apiRequest("wishlist/adding", {
      method: "POST",
      body: { bookId },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
};

// Remove a book from the wishlist
export const removeFromWishlist = async (bookId) => {
  try {
    // Use "removing" endpoint based on backend route
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }
    const response = await apiRequest("wishlist/removing", {
      method: "DELETE",
      body: { bookId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw error;
  }
};

// Get user's wishlist
export const getUserWishlist = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication required. Please log in.");
  }
  try {
    const response = await apiRequest("wishlist", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    throw error;
  }
};

// Check if a book is in the wishlist
export const isInWishlist = async (bookId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication required. Please log in.");
  }
  try {
    // Use updated "check" endpoint
    const response = await apiRequest("wishlist/check", {
      method: "POST",
      body: { bookId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    return response.isInWishlist;
  } catch (error) {
    console.error("Error checking wishlist status:", error);
    throw error;
  }
};
