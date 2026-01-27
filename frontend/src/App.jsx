import "./App.css";
import { useAuth } from "./contexts/index.js";
import { AuthPage, DashboardPage, LoadingPage } from "./pages/index.js";

function App() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <LoadingPage />;
  }
  return isAuthenticated ? <DashboardPage /> : <AuthPage />;
}

export default App;
