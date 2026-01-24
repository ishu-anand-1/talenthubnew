import axios from "axios";

// ===================== BASE URL (LOCALHOST) =====================
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

console.log("🌐 API Base URL:", BASE_URL);

// ===================== AXIOS INSTANCE =====================
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 30000,
});

// ===================== REQUEST INTERCEPTOR =====================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ⚠️ Do NOT break FormData (video upload)
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ===================== RESPONSE INTERCEPTOR =====================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network / CORS error
    if (!error.response) {
      console.error("🚨 Network Error:", error.message);
      return Promise.reject(error);
    }

    // Unauthorized
    if (error.response.status === 401) {
      console.warn("🔐 Unauthorized – clearing token");
      localStorage.removeItem("token");
    }

    console.error(
      "❌ API Error:",
      error.response.status,
      error.response.data
    );

    return Promise.reject(error);
  }
);

export default api;
