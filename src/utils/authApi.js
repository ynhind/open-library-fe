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

export const loginUser = async (formData) => {
  try {
    // For login, backend expects email and password
    // In your form, you've named it "identifier" for username/email
    const loginData = {
      // Map the frontend field to what the backend expects
      email: formData.identifier,
      password: formData.password,
    };

    console.log("Sending login data", loginData);

    const response = await apiRequest("auth/login", {
      method: "POST",
      body: loginData,
    });

    console.log("Login response:", response);
    return response;
  } catch (error) {
    console.error("Login error details:", error);
    throw error;
  }
};
export const resendVerification = async (email) => {
  return apiRequest("auth/resend-verification", {
    method: "POST",
    body: { email },
  });
};
