import { apiRequest } from "./api";

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
    const response = await apiRequest("auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    return response;
  } catch (error) {
    throw new Error(error.message || "Login failed");
  }
};
