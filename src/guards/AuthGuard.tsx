import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
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
        Checking session…
      </div>
    );
  }

  if (state === "no") return <Navigate to="/login" replace />;

  return <>{children}</>;
}
