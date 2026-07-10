import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext, createAuthDependencies } from "@/auth/auth-context";
import { useAuthStore } from "@/stores/ui-store";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { authClient } = useMemo(() => createAuthDependencies(), []);
  const status = useAuthStore((state) => state.status);
  const setStatus = useAuthStore((state) => state.setStatus);
  const [ready, setReady] = useState(false);

  const bootstrap = useCallback(async () => {
    setStatus("signing_in");
    const session = await authClient.getSession();
    setStatus(session ? "authenticated" : "signed_out");
    setReady(true);
  }, [authClient, setStatus]);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  const signInWithDevToken = useCallback(
    async (token: string) => {
      setStatus("signing_in");
      await authClient.signIn({ accessToken: token });
      setStatus("authenticated");
    },
    [authClient, setStatus],
  );

  const signOut = useCallback(async () => {
    await authClient.signOut();
    setStatus("signed_out");
  }, [authClient, setStatus]);

  const value = useMemo(
    () => ({
      status,
      authClient,
      signInWithDevToken,
      signOut,
      bootstrap,
    }),
    [authClient, bootstrap, signInWithDevToken, signOut, status],
  );

  if (!ready) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
