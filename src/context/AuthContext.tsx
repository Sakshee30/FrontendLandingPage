import { createContext, useContext, useEffect, useState } from "react";
import {
  AuthSession,
  AuthUser,
  clearSession,
  getMe,
  getStoredSession,
  storeSession,
} from "../app/services/auth";

type AuthState = "checking" | "ok" | "no";

type AuthCtx = {
  state: AuthState;
  session: AuthSession | null;
  user: AuthUser | null;
  refresh: () => Promise<void>;
  setSession: (session: AuthSession | null) => void;
};

const AuthContext = createContext<AuthCtx>({
  state: "checking",
  session: null,
  user: null,
  refresh: async () => {},
  setSession: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(() =>
    getStoredSession() ? "checking" : "no"
  );
  const [session, setSessionState] = useState<AuthSession | null>(() =>
    getStoredSession()
  );

  async function doFetch() {
    setState("checking");
    try {
      const user = await getMe();
      const s: AuthSession = { user };
      storeSession(s);
      setSessionState(s);
      setState("ok");
    } catch {
      clearSession();
      setSessionState(null);
      setState("no");
    }
  }

  function setSession(s: AuthSession | null) {
    if (s) {
      storeSession(s);
      setSessionState(s);
      setState("ok");
    } else {
      clearSession();
      setSessionState(null);
      setState("no");
    }
  }

  useEffect(() => {
    if (getStoredSession()) {
      doFetch();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ state, session, user: session?.user ?? null, refresh: doFetch, setSession }}
    >
      {children}
    </AuthContext.Provider>
  );
}
