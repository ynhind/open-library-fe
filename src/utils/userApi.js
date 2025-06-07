import { apiRequest } from "./api";

export const getUserInformation = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    try {
      return await apiRequest("user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      // Check if token has expired
      if (error.message === "Token has been expired") {
        // Redirect to login page
        localStorage.removeItem("token");
        window.location.href = "/login";
        throw new Error("Session expired. Please login again.");
      }
      throw error;
    }
  } catch (error) {
    console.error("Error getting user information:", error);
    throw error;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    console.log("Updating profile with data:", userData);

    // Using XMLHttpRequest for maximum control over the HTTP method
    try {
      const API_URL = import.meta.env.VITE_API_URL || "/api";
      const url = `${API_URL}/user/update-profile`;

      console.log("Using XMLHttpRequest for PATCH to:", url);

      // Create a promise that will resolve or reject based on XMLHttpRequest
      const responsePromise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Set up event handlers
        xhr.onload = function () {
          console.log("XHR completed with status:", xhr.status);
          console.log("XHR request method used:", "PATCH");

          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (error) {
              console.error("Error parsing response:", error);
              resolve({});
            }
          } else {
            let errorMessage;
            try {
              const errorData = JSON.parse(xhr.responseText);
              errorMessage =
                errorData.error ||
                errorData.message ||
                `API Error: ${xhr.status}`;
            } catch {
              errorMessage = `API Error: ${xhr.status}`;
            }
            reject(new Error(errorMessage));
          }
        };

        xhr.onerror = function () {
          reject(new Error("Network error occurred"));
        };

        // Open the request and set headers
        xhr.open("PATCH", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.withCredentials = true; // For CORS with credentials

        // Send the request with data
        xhr.send(JSON.stringify(userData));
      });

      return await responsePromise;
    } catch (innerError) {
      console.error("XHR Error in update profile:", innerError);

      // Check if token has expired
      if (innerError.message === "Token has been expired") {
        // Redirect to login page
        localStorage.removeItem("token");
        window.location.href = "/login";
        throw new Error("Session expired. Please login again.");
      }
      throw innerError;
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const requestPasswordChange = async (currentPassword) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    try {
      return await apiRequest("user/change-password", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: { currentPassword },
      });
    } catch (error) {
      // Check if token has expired
      if (error.message === "Token has been expired") {
        // Redirect to login page
        localStorage.removeItem("token");
        window.location.href = "/login";
        throw new Error("Session expired. Please login again.");
      }
      throw error;
    }
  } catch (error) {
    console.error("Error requesting password change:", error);
    throw error;
  }
};

export const confirmPasswordChange = async (token, newPassword) => {
  try {
    const authToken = localStorage.getItem("token");
    if (!authToken) {
      throw new Error("Authentication required. Please log in.");
    }

    try {
      return await apiRequest("user/verify-token", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: { token, newPassword },
      });
    } catch (error) {
      // Check if token has expired
      if (error.message === "Token has been expired") {
        // Redirect to login page
        localStorage.removeItem("token");
        window.location.href = "/login";
        throw new Error("Session expired. Please login again.");
      }
      throw error;
    }
  } catch (error) {
    console.error("Error confirming password change:", error);
    throw error;
  }
};

// Admin only: Get all users
export const getAllUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    try {
      return await apiRequest("user/all-users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      // Check if token has expired
      if (error.message === "Token has been expired") {
        // Redirect to login page
        localStorage.removeItem("token");
        window.location.href = "/login";
        throw new Error("Session expired. Please login again.");
      }
      throw error;
    }
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

// Admin only: Toggle user block/unblock status
export const toggleUserBlock = async (userId, block) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    try {
      return await apiRequest(`user/toggle-block/${userId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: { block },
      });
    } catch (error) {
      // Check if token has expired
      if (error.message === "Token has been expired") {
        // Redirect to login page
        localStorage.removeItem("token");
        window.location.href = "/login";
        throw new Error("Session expired. Please login again.");
      }
      throw error;
    }
  } catch (error) {
    console.error("Error toggling user block status:", error);
    throw error;
  }
};

// Admin only: Delete user
export const deleteUser = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    try {
      return await apiRequest(`user/delete-user/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      // Check if token has expired
      if (error.message === "Token has been expired") {
        // Redirect to login page
        localStorage.removeItem("token");
        window.location.href = "/login";
        throw new Error("Session expired. Please login again.");
      }
      throw error;
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const getPurchasedBooks = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    try {
      return await apiRequest("user/purchased-books", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      // Check if token has expired
      if (error.message === "Token has been expired") {
        // Redirect to login page
        localStorage.removeItem("token");
        window.location.href = "/login";
        throw new Error("Session expired. Please login again.");
      }
      throw error;
    }
  } catch (error) {
    console.error("Error getting purchased books:", error);
    throw error;
  }
};
