import { createContext, useContext } from "react";

export const CounterContext = createContext({
  counters: [],
  loading: false,
  incrementCounter: (word) => {},
  getAllCounters: () => {},
  getCounter: (word) => {},
  resetCounter: (word) => {},
});

export const useCounter = () => {
  return useContext(CounterContext);
};
