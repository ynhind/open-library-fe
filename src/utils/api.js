// const API_URL =
//   import.meta.env.VITE_API_URL || "https://open-library-api.onrender.com/api";
// const API_URL = "https://open-library-api.onrender.com/api";
// console.log("API URL:", API_URL);

// export async function apiRequest(endpoint, options = {}) {
//   const url = `${API_URL}/${endpoint}`;
//   const defaultHeaders = { "Content-Type": "application/json" };
//   const config = {
//     ...options,
//     headers: { ...defaultHeaders, ...options.headers },
//   };

//   // Process FormData before sending the request
//   if (options.body instanceof FormData) {
//     // Don't set Content-Type for FormData (browser will set it with boundary)
//     delete config.headers["Content-Type"];
//   } else if (options.body && typeof options.body === "object") {
//     // Stringify JSON bodies
//     config.body = JSON.stringify(options.body);
//   }

//   try {
//     const response = await fetch(url, config);
//     if (!response.ok) {
//       // Try to get error details from response
//       const errorData = await response.json().catch(() => ({}));
//       throw new Error(errorData.message || `API Error: ${response.status}`);
//     }

//     return response.json();
//   } catch (error) {
//     console.error(`API request failed for ${endpoint}:`, error);
//     throw error;
//   }
// }
const API_URL = import.meta.env.VITE_API_URL || "/api";

console.log("API URL being used:", API_URL);

export async function apiRequest(endpoint, options = {}) {
  // Ensure we have the correct /api/ path in the URL

  const url = `${API_URL}/${endpoint}`;
  console.log("Making request to:", url);

  // Default headers
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  // Configure the request
  const config = {
    ...options,
    headers: { ...defaultHeaders, ...options.headers },
    // For CORS requests
    mode: "cors",
    // Don't include credentials unless you're using cookies
    credentials: "omit",
  };

  // Process request body
  if (options.body instanceof FormData) {
    delete config.headers["Content-Type"];
  } else if (
    options.body &&
    typeof options.body === "object" &&
    !(options.body instanceof FormData)
  ) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || `API Error: ${response.status}`;
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

// Simple function to test API connectivity
export async function testApiConnection() {
  try {
    // Check an endpoint that exists (e.g. the root or auth endpoints)
    const response = await fetch(`${API_URL}`, {
      mode: "cors",
      credentials: "omit",
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
