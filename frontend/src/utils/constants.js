export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/users/register",
    LOGIN: "/users/login",
    LOGOUT: "/users/logout",
    CURRENT_USER: "/users/current-user",
    REFRESH_TOKEN: "/users/refresh-token",
  },
  COUNTERS: {
    INCREMENT: "/counters/increment",
    GET_ALL: "/counters",
    GET_ONE: (word) => `/counters/${word}`,
    RESET: (word) => `/counters/reset/${word}`,
  },
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
};
