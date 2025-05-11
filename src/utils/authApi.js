import { apiRequest } from "./api";
const API_URL = import.meta.env.VITE_API_URL;

export const registerUser = async (data) => {
  try {
    const response = await apiRequest("auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    throw new Error(error.message || "Registration failed");
  }
};

export const loginUser = async (credentials) => {
  try {
    // No mapping needed - just use the credentials directly
    const response = await apiRequest("auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    localStorage.setItem("token", response.token);

    return response;
  } catch (error) {
    throw new Error(error.message || "Login failed");
  }
};
