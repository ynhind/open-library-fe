import { apiRequest } from "./api";

/**
 * Create an order from the current user's cart
 * @param {Array} selectedBookIds - Optional array of book IDs to include in the order (if not provided, all cart items are included)
 * @returns {Promise<Object>} The created order object
 */
export const createOrderFromCart = async (selectedBookIds = []) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    return await apiRequest("order/place-order", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ selectedBookIds }),
    });
  } catch (error) {
    console.error("Error creating order from cart:", error);
    throw error;
  }
};

/**
 * Get a specific order by ID
 * @param {number} orderId - The ID of the order to retrieve
 * @returns {Promise<Object>} The order details
 */
export const getOrderById = async (orderId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    // Get all orders and find the one with matching ID
    const orders = await apiRequest("order/get-my-orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const targetOrder = orders.find((order) => order.orderId === orderId);

    if (!targetOrder) {
      throw new Error("Order not found");
    }

    return targetOrder;
  } catch (error) {
    console.error(`Error fetching order #${orderId}:`, error);
    throw error;
  }
};

/**
 * Get all orders for the current user
 * @returns {Promise<Array>} Array of user orders
 */
export const getUserOrders = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    return await apiRequest("order/get-my-orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};

/**
 * Create an immediate order for a book without adding to cart first
 * @param {Object} orderData - Order data
 * @param {number} orderData.bookId - ID of the book to order
 * @param {number} orderData.quantity - Quantity to order (defaults to 1)
 * @returns {Promise<Object>} The created order
 */
export const buyNow = async (orderData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    return await apiRequest("order/buy-now", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });
  } catch (error) {
    console.error("Error with buy now order:", error);
    throw error;
  }
};
