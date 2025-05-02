// src/utils/api.js (open-library-fe)
const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_URL}/${endpoint}`;
  const defaultHeaders = { "Content-Type": "application/json" };
  const config = {
    ...options,
    headers: { ...defaultHeaders, ...options.headers },
  };

  const response = await fetch(url, config);
  if (!response.ok) throw new Error(`Error: ${response.status}`);
  return response.json();
}
