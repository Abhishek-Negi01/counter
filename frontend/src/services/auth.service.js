import api from "./api.js";

export const authService = {
  register: async (userData) => {
    const response = await api.post("/users/register", userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post("/users/login", credentials);
    return response.data;
  },
  logout: async () => {
    const response = await api.post("/users/logout");
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get("/users/current-user");
    return response.data;
  },
  refreshToken: async (refreshToken) => {
    const response = await api.post("/users/refresh-token", refreshToken);
    return response.data;
  },
};
