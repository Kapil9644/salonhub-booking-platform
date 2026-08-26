import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.29.8:5000/api",
});

api.interceptors.request.use(
  (config) => {
    const isSalonOwnerPortal =
      window.location.pathname.startsWith("/salon-owner");

    const tokenKey = isSalonOwnerPortal ? "salonOwnerToken" : "token";

    const token = localStorage.getItem(tokenKey);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
