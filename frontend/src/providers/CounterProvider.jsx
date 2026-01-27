import { useState, useEffect } from "react";
import { CounterContext } from "../contexts/index.js";
import { counterService } from "../services/counter.service.js";
import { useAuth } from "../contexts";

export const CounterProvider = ({ children }) => {
  const [counters, setCounters] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      getAllCounters();
    }
  }, [isAuthenticated]);

  const getAllCounters = async () => {
    setLoading(true);
    try {
      const response = await counterService.getAll();
      setCounters(response.data || []);
    } catch (error) {
      console.error("Error while fetching counters : ", error);
      setCounters([]);
    } finally {
      setLoading(false);
    }
  };

  const incrementCounter = async (word) => {
    try {
      const response = await counterService.increment(word);
      const updatedCounter = response.data;

      setCounters((prev) => {
        const existing = prev.find((c) => c.word === word.toLowerCase());

        if (existing) {
          return prev.map((c) =>
            c.word === word.toLowerCase() ? updatedCounter : c
          );
        } else {
          return [...prev, updatedCounter];
        }
      });

      return {
        success: true,
        data: updatedCounter,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to increment counter",
      };
    }
  };

  const getCounter = async (word) => {
    try {
      const response = await counterService.getOne(word);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to get counter",
      };
    }
  };

  const resetCounter = async (word) => {
    try {
      const response = await counterService.reset(word);
      const counterAfterReset = response.data;

      setCounters((prev) => {
        return prev.map((c) =>
          c.word === word.toLowerCase() ? counterAfterReset : c
        );
      });

      return {
        success: true,
        data: counterAfterReset,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to reset counter",
      };
    }
  };

  const value = {
    counters,
    loading,
    incrementCounter,
    getAllCounters,
    getCounter,
    resetCounter,
  };

  return (
    <CounterContext.Provider value={value}>{children}</CounterContext.Provider>
  );
};
