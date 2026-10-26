import axios from "axios";

const salonOwnerApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

salonOwnerApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("salonOwnerToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default salonOwnerApi;
