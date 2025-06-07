import { apiRequest } from "./api";

export const registerUser = async (data) => {
  try {
    const response = await apiRequest("auth/register", {
      method: "POST",
<<<<<<< HEAD
      body: data, // apiRequest will handle JSON.stringify
=======
      body: JSON.stringify(data),
>>>>>>> 7838768 (authentication)
    });
    return response;
  } catch (error) {
    throw new Error(error.message || "Registration failed");
  }
};
<<<<<<< HEAD
<<<<<<< HEAD

export const loginUser = async (formData) => {
  try {
    // Format data according to what backend expects
    const loginData = {
      identifier: formData.identifier,
      password: formData.password,
    };

    console.log("Sending login data:", loginData);

    const response = await apiRequest("auth/login", {
      method: "POST",
      body: loginData,
    });

    return response;
  } catch (error) {
    console.error("Login error details:", error);
    throw error;
  }
};

export const verifyEmail = async (token, email) => {
  return apiRequest("auth/verify", {
    method: "POST",
    body: { token, email },
  });
};

export const resendVerification = async (email) => {
  return apiRequest("auth/resend-verification", {
    method: "POST",
    body: { email },
  });
};
=======
=======

>>>>>>> 2f3b3e4 (add book management for admin)
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
>>>>>>> 7838768 (authentication)
