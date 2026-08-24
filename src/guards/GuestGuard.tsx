import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function GuestGuard() {
  const { state } = useAuth();

  if (state === "checking") {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F4F6F8",
          fontFamily: "Inter, Arial, sans-serif",
          fontSize: 14,
          color: "#637381",
        }}
      >
        Loading…
      </div>
    );
  }

  if (state === "ok") return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
