import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Authorization header if JWT token is stored in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jyotish_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional: Clear token on unauthorized/expired token
      // localStorage.removeItem("jyotish_token");
      // localStorage.removeItem("jyotish_user");
    }
    return Promise.reject(error);
  }
);

export default api;
