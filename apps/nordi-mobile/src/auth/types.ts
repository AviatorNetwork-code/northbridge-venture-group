export type AuthStatus =
  | "signed_out"
  | "signing_in"
  | "authenticated"
  | "expired_session";

export interface AuthenticatedSession {
  accessToken: string;
  tokenType: "Bearer";
  expiresAt?: string;
}

export interface SignInInput {
  accessToken: string;
  expiresAt?: string;
}

export interface MobileAuthenticationClient {
  getSession(): Promise<AuthenticatedSession | null>;
  signIn(input: SignInInput): Promise<AuthenticatedSession>;
  signOut(): Promise<void>;
  refreshSession(): Promise<AuthenticatedSession | null>;
}

export interface SecureTokenStore {
  getToken(): Promise<string | null>;
  setToken(token: string): Promise<void>;
  clearToken(): Promise<void>;
}

export const SECURE_TOKEN_KEY = "nordi.mobile.accessToken";
export const SECURE_TOKEN_EXPIRY_KEY = "nordi.mobile.tokenExpiresAt";
