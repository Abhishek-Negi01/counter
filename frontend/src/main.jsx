import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider, CounterProvider } from "./providers";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CounterProvider>
        <App />
      </CounterProvider>
    </AuthProvider>
  </StrictMode>
);
