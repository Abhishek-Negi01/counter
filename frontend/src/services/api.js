import axios from "axios";

const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:5000/api/v1"
  : "/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const authAPI = {
  register: (userData) => api.post("/users/register", userData),
  login: (credentials) => api.post("/users/login", credentials),
  logout: () => api.post("/users/logout"),
  getCurrentUser: () => api.get("/users/current-user"),
  refreshToken: (refreshToken) =>
    api.post("/users/refresh-token", { refreshToken }),
};

// Counter API calls
export const counterAPI = {
  increment: (word) => api.post("/counters/increment", { word }),
  getAll: () => api.get("/counters"),
  getOne: (word) => api.get(`/counters/${word}`),
  reset: (word) => api.put(`/counters/reset/${word}`),
};

export default api;
