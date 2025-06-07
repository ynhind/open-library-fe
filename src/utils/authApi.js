import { apiRequest } from "./api";

export const registerUser = async (data) => {
  try {
    const response = await apiRequest("auth/register", {
      method: "POST",
      body: data, // apiRequest will handle JSON.stringify
    });
    return response;
  } catch (error) {
    throw new Error(error.message || "Registration failed");
  }
};

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
