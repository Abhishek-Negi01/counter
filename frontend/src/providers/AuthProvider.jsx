import { useState, useEffect } from "react";
import { AuthContext } from "../contexts/index.js";
import { authService } from "../services";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const response = await authService.getCurrentUser();
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.log(error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const { user, accessToken, refreshToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      setUser(user);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration of user failed",
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.log("Logout error : ", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const getCurrentUser = async () => {
    try {
      const response = await authService.getCurrentUser();
      setUser(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    getCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
