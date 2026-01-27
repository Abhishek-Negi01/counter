import { createContext, useContext } from "react";

export const AuthContext = createContext({
  user: null,
  loading: false,
  isAuthenticated: false,
  login: (credentials) => {},
  register: (userData) => {},
  logout: () => {},
  getCurrentUser: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};
