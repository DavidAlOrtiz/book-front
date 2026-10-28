import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { keycloak } from "./keycloak";

interface AuthState {
  ready: boolean;
  authenticated: boolean;
  isAdmin: boolean;
  username?: string;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

let initPromise: Promise<boolean> | null = null;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    initPromise ??= keycloak.init({
      onLoad: "check-sso",
      pkceMethod: "S256",
      checkLoginIframe: false,
    });
    initPromise
      .then(setAuthenticated)
      .catch(() => setAuthenticated(false))
      .finally(() => setReady(true));
  }, []);

  const value: AuthState = {
    ready,
    authenticated,
    isAdmin: authenticated && keycloak.hasRealmRole("admin"),
    username: keycloak.tokenParsed?.preferred_username as string | undefined,
    login: () => keycloak.login({ redirectUri: window.location.origin }),
    logout: () => keycloak.logout({ redirectUri: window.location.origin }),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}