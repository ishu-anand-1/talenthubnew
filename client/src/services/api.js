import axios from "axios";

/* ===================== BASE URL ===================== */
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/* ===================== AXIOS INSTANCE ===================== */
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  withCredentials: true,
});

/* ===================== LOGOUT HELPER ===================== */
const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
};

/* ===================== REQUEST INTERCEPTOR ===================== */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ===================== RESPONSE INTERCEPTOR ===================== */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    /* ================= NETWORK ERROR ================= */
    if (!error.response) {
      console.error("🚨 Network error:", error.message);

      return Promise.reject({
        status: 0,
        message: "Network error. Please check your internet connection.",
      });
    }

    const { status, data } = error.response;

    /* ================= UNAUTHORIZED ================= */
    if (status === 401) {
      console.warn("🔐 Session expired — logging out");

      clearAuth();

      if (!window.location.pathname.includes("/login")) {
        window.location.replace("/login");
      }
    }

    /* ================= FORBIDDEN ================= */
    if (status === 403) {
      console.warn("⛔ Forbidden request");
    }

    /* ================= SERVER ERROR ================= */
    if (status >= 500) {
      console.error("🔥 Server error:", data);
    }

    /* ================= NORMALIZED ERROR ================= */
    return Promise.reject({
      status,
      message:
        data?.error ||
        data?.message ||
        "Something went wrong. Please try again.",
      raw: error,
    });
  }
);

export default api;
