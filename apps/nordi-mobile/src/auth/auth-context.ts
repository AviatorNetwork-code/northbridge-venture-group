import { createContext, useContext } from "react";
import type { AuthStatus, MobileAuthenticationClient } from "@/auth/types";
import { createDefaultAuthenticationClient } from "@/auth/auth-client";

export interface AuthContextValue {
  status: AuthStatus;
  authClient: MobileAuthenticationClient;
  signInWithDevToken: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  bootstrap: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return value;
}

export function createAuthDependencies() {
  return {
    authClient: createDefaultAuthenticationClient(),
  };
}
