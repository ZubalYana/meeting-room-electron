import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import Auth from "./components/Auth/Auth";
import Dashboard from "./pages/Dashboard";
import "./main.css";

export function Main() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsAuth(true);
  }, []);

  return isAuth ? (
    <Dashboard />
  ) : (
    <Auth onSuccess={() => setIsAuth(true)} />
  );
}

// Render
const container = document.getElementById("root")!;
createRoot(container).render(<Main />);
