import { useCounter as useCounterContext } from "../contexts";

export const useCounter = () => {
  const context = useCounterContext();

  if (!context) {
    throw new Error("useCounter must be used within a CounterProvider");
  }

  return context;
};
