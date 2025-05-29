import { apiRequest } from "./api";

//add item to cart
// Add a book to the user's cart
export const addToCart = async (bookId, quantity) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    const result = await apiRequest("cart/add-item", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookId, quantity }),
    });

    // Dispatch an event to notify components that the cart has been updated
    window.dispatchEvent(new Event("cart-updated"));

    return result;
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
export const updateCartItem = async (bookId, quantity, onOptimisticUpdate) => {
  try {
    // update UI immediately for better UX
    if (onOptimisticUpdate) {
      onOptimisticUpdate(bookId, quantity);
    }

    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    const result = await apiRequest("cart/update-item", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookId, quantity }),
    });

    // Dispatch event sau khi API thành công
    window.dispatchEvent(new Event("cart-updated"));
    return result;
  } catch (error) {
    // if API fail, rollback UI to the previous state
    if (onOptimisticUpdate) {
      // call rollback function or refresh data
      window.dispatchEvent(new Event("cart-update-failed"));
    }
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

    return await apiRequest("cart/remove-item", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookId }),
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
