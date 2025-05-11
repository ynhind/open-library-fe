const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_URL}/${endpoint}`;
  const defaultHeaders = { "Content-Type": "application/json" };
  const config = {
    ...options,
    headers: { ...defaultHeaders, ...options.headers },
  };

  // Process FormData before sending the request
  if (options.body instanceof FormData) {
    // Don't set Content-Type for FormData (browser will set it with boundary)
    delete config.headers["Content-Type"];
  } else if (options.body && typeof options.body === "object") {
    // Stringify JSON bodies
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      // Try to get error details from response
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}
