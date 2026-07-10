import type {
  AuthenticatedSession,
  MobileAuthenticationClient,
  SecureTokenStore,
  SignInInput,
} from "./types";
import { ExpoSecureTokenStore } from "./secure-token-store";

function isExpired(expiresAt?: string | null): boolean {
  if (!expiresAt) return false;
  return Date.parse(expiresAt) <= Date.now();
}

export class BearerTokenAuthenticationClient implements MobileAuthenticationClient {
  constructor(private readonly store: SecureTokenStore = new ExpoSecureTokenStore()) {}

  async getSession(): Promise<AuthenticatedSession | null> {
    const accessToken = await this.store.getToken();
    if (!accessToken) return null;

    const expiresAt =
      "getExpiry" in this.store && typeof this.store.getExpiry === "function"
        ? await (this.store as ExpoSecureTokenStore).getExpiry()
        : null;

    if (isExpired(expiresAt)) {
      await this.signOut();
      return null;
    }

    return {
      accessToken,
      tokenType: "Bearer",
      expiresAt: expiresAt ?? undefined,
    };
  }

  async signIn(input: SignInInput): Promise<AuthenticatedSession> {
    await this.store.setToken(input.accessToken);

    if (input.expiresAt && "setExpiry" in this.store) {
      await (this.store as ExpoSecureTokenStore).setExpiry(input.expiresAt);
    }

    return {
      accessToken: input.accessToken,
      tokenType: "Bearer",
      expiresAt: input.expiresAt,
    };
  }

  async signOut(): Promise<void> {
    await this.store.clearToken();
  }

  async refreshSession(): Promise<AuthenticatedSession | null> {
    return this.getSession();
  }
}

export function createDefaultAuthenticationClient(): MobileAuthenticationClient {
  return new BearerTokenAuthenticationClient();
}
