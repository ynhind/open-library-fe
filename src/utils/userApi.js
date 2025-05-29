import { apiRequest } from "./api";

export const getUserInformation = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    try {
      return await apiRequest("user/account", {
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
    try {
      return await apiRequest("user/profile", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: userData,
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
    console.error("Error updating user profile:", error);
    throw error;
  }
};
