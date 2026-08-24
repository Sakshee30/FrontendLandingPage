import { useEffect } from "react";
import { useNavigate } from "react-router";
import { LoginPage as LoginComponent } from "../../app/components/LoginPage";
import { useAuth } from "../../context/AuthContext";
import type { AuthSession } from "../../app/services/auth";

export default function LoginPage() {
  const { state, setSession } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (state === "ok") navigate("/dashboard", { replace: true });
  }, [state, navigate]);

  function handleLogin(session: AuthSession) {
    setSession(session);
    navigate("/dashboard", { replace: true });
  }

  return (
    <LoginComponent
      onLogin={handleLogin}
      onShowSignup={() => navigate("/signup")}
      onForgotPassword={() => navigate("/forgot-password")}
    />
  );
}
