import { apiRequest } from "./api";

/**
 * Create a new payment for an order
 * @param {Object} paymentData - Payment data
 * @param {number} paymentData.orderId - ID of the order to pay for
 * @param {string} paymentData.payment_method - Payment method (e.g. "CREDIT_CARD", "PAYPAL")
 * @returns {Promise<Object>} Payment result with isPaid status
 */
export const createPayment = async (paymentData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    return await apiRequest("payment", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};

/**
 * Get payment history for the current user
 * @returns {Promise<Object>} Object containing array of user payments
 */
export const getUserPayments = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    return await apiRequest("payment/payments-history", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    throw error;
  }
};

/**
 * Admin only: Get all payments across all users
 * @returns {Promise<Object>} Object containing array of all payments
 */
export const getAllPayments = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    return await apiRequest("payment/admin/all-payments", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error fetching all payments:", error);
    throw error;
  }
};
