import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

api.interceptors.request.use(
  (config) => {
    const pathname = window.location.pathname;

    const isSalonOwnerPortal = pathname.startsWith("/salon-owner");
    const isAdminPortal = pathname.startsWith("/admin");

    const tokenKey = isSalonOwnerPortal
      ? "salonOwnerToken"
      : isAdminPortal
        ? "adminToken"
        : "token";

    const token = localStorage.getItem(tokenKey);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
