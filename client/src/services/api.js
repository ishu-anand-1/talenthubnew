import axios from "axios";

// Base API URL from .env
const BASE_URL = import.meta.env.VITE_API_URL || "https://talenthubnew-1.onrender.com/api";

console.log("API Base URL:", BASE_URL);

// Create Axios instance
const api = axios.create({
  baseURL: BASE_URL, // Do NOT add /api here again
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Attach token automatically for every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
