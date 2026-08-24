import { useNavigate } from "react-router";
import { SignupPage as SignupComponent } from "../../app/components/SignupPage";
import { useAuth } from "../../context/AuthContext";
import type { AuthSession } from "../../app/services/auth";

export default function SignupPage() {
  const { setSession } = useAuth();
  const navigate = useNavigate();

  function handleRegistered(session: AuthSession) {
    setSession(session);
    navigate("/dashboard", { replace: true });
  }

  return (
    <SignupComponent
      onRegistered={handleRegistered}
      onShowLogin={() => navigate("/login")}
    />
  );
}
