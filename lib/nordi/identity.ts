export type IdentityMethod = "email" | "phone";

export type NordiIdentity = {
  method: IdentityMethod;
  email?: string;
  phone?: string;
  verified: boolean;
  savedAt: string;
};

export function normalizePhone(value: string): string {
  return value.replace(/[^\d]/g, "");
}

export function formatIdentityContact(identity: NordiIdentity): string {
  if (identity.method === "email") return identity.email ?? "you";
  return identity.phone ?? "you";
}

export function createIdentity(
  method: IdentityMethod,
  contact: string,
  verified: boolean,
): NordiIdentity {
  return {
    method,
    email: method === "email" ? contact.trim() : undefined,
    phone: method === "phone" ? normalizePhone(contact) : undefined,
    verified,
    savedAt: new Date().toISOString(),
  };
}

/** Mock OTP — replace with real provider via NordiVerificationService. */
export function generateMockVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function verifyMockCode(input: string, expected: string): boolean {
  return normalizePhone(input) === expected;
}

export interface NordiVerificationProvider {
  sendCode(identity: NordiIdentity): Promise<{ code: string }>;
  verifyCode(input: string, expected: string): boolean;
}

export const mockVerificationProvider: NordiVerificationProvider = {
  async sendCode() {
    return { code: generateMockVerificationCode() };
  },
  verifyCode: verifyMockCode,
};
