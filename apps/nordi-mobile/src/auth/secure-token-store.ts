import * as SecureStore from "expo-secure-store";
import type { SecureTokenStore } from "./types";
import { SECURE_TOKEN_EXPIRY_KEY, SECURE_TOKEN_KEY } from "./types";

export class ExpoSecureTokenStore implements SecureTokenStore {
  async getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(SECURE_TOKEN_KEY);
  }

  async setToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(SECURE_TOKEN_KEY, token);
  }

  async clearToken(): Promise<void> {
    await SecureStore.deleteItemAsync(SECURE_TOKEN_KEY);
    await SecureStore.deleteItemAsync(SECURE_TOKEN_EXPIRY_KEY);
  }

  async getExpiry(): Promise<string | null> {
    return SecureStore.getItemAsync(SECURE_TOKEN_EXPIRY_KEY);
  }

  async setExpiry(expiresAt: string): Promise<void> {
    await SecureStore.setItemAsync(SECURE_TOKEN_EXPIRY_KEY, expiresAt);
  }
}

export class InMemorySecureTokenStore implements SecureTokenStore {
  private token: string | null = null;
  expiry: string | null = null;

  async getToken(): Promise<string | null> {
    return this.token;
  }

  async setToken(token: string): Promise<void> {
    this.token = token;
  }

  async clearToken(): Promise<void> {
    this.token = null;
    this.expiry = null;
  }
}
