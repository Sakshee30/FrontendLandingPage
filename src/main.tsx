// src/main.tsx
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { HelmetProvider } from "react-helmet-async";
import { router } from "./routes/index";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </HelmetProvider>
);