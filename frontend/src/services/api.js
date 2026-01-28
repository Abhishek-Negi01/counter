import axios from "axios";

const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:5000/api/v1"
  : "/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post("/users/refresh-token");
        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post("/users/register", userData),
  login: (credentials) => api.post("/users/login", credentials),
  logout: () => api.post("/users/logout"),
  getCurrentUser: () => api.get("/users/current-user"),
  refreshToken: (refreshToken) =>
    api.post("/users/refresh-token", { refreshToken }),
  verifyEmail: (token) => api.get(`/users/verify-email?token=${token}`),
  resendVerification: (email) =>
    api.post("/users/resend-verification", { email }),
};

// Counter API calls
export const counterAPI = {
  increment: (word) => api.post("/counters/increment", { word }),
  getAll: () => api.get("/counters"),
  getOne: (word) => api.get(`/counters/${word}`),
  reset: (word) => api.put(`/counters/reset/${word}`),
};

export default api;
