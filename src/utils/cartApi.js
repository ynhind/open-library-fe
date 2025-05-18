import { apiRequest } from "./api";

//add item to cart
// Add a book to the user's cart
export const addToCart = async (bookId, quantity) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    return await apiRequest("cart/add-item", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookId, quantity }),
    });
  } catch (error) {
    console.error("Error adding book to cart:", error);
    throw error;
  }
};

//get cart items
export const getCartItems = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    return await apiRequest("cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error getting cart items:", error);
    throw error;
  }
};

// Update cart item quantity
export const updateCartItem = async (bookId, quantity) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    return await apiRequest("cart/update-item", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookId, quantity }),
    });
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
};

// Remove item from cart
export const removeCartItem = async (bookId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    return await apiRequest(`cart/remove-item/${bookId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error removing cart item:", error);
    throw error;
  }
};

// Clear all items from cart
export const clearCart = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    return await apiRequest("cart/clear-all", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};
