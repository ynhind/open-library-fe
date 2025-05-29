const API_URL = import.meta.env.VITE_API_URL || "/api";

console.log("API URL being used:", API_URL);

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_URL}/${endpoint}`;
  console.log("Making request to:", url);

  // Default headers
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  // Build fetch config
  const config = {
    ...options,
    headers: { ...defaultHeaders, ...options.headers },
    mode: "cors",
    credentials: "include", // gửi cookie/session
  };

  // Nếu body là FormData thì không set Content-Type (browser tự set)
  if (options.body instanceof FormData) {
    delete config.headers["Content-Type"];
  } else if (
    options.body &&
    typeof options.body === "object" &&
    !(options.body instanceof FormData)
  ) {
    // JSON stringify body nếu là object bình thường
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      // Cố gắng lấy message lỗi từ response JSON
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage =
          errorData.error ||
          errorData.message ||
          `API Error: ${response.status}`;
        console.log("API Error response:", errorData);
      } catch {
        errorMessage = `API Error: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Hàm test kết nối API đơn giản
export async function testApiConnection() {
  try {
    const response = await fetch(API_URL, {
      mode: "cors",
      credentials: "include",
    });

    if (response.ok) {
      return "API connection successful";
    } else {
      throw new Error(`API responded with status: ${response.status}`);
    }
  } catch (error) {
    console.error("API connection test failed:", error);
    throw error;
  }
}
