import type {
  AuthenticatedMobileCustomer,
  MobileAuthenticationProvider,
  MobileAuthRequestContext,
} from "./types.js";

const TOKEN_PREFIX = "Bearer ";

export class InMemoryMobileAuthenticationProvider implements MobileAuthenticationProvider {
  constructor(private readonly tokens: Map<string, AuthenticatedMobileCustomer>) {}

  async authenticate(context: MobileAuthRequestContext): Promise<AuthenticatedMobileCustomer | null> {
    const header = context.authorizationHeader?.trim();
    if (!header || !header.startsWith(TOKEN_PREFIX)) {
      return null;
    }

    const token = header.slice(TOKEN_PREFIX.length).trim();
    return this.tokens.get(token) ?? null;
  }
}

export function createExampleMobileAuthenticationProvider(): InMemoryMobileAuthenticationProvider {
  return new InMemoryMobileAuthenticationProvider(
    new Map([
      [
        "token-customer-1",
        { customerId: "customer-1", sessionId: "session-customer-1", displayName: "Acme Owner" },
      ],
      [
        "token-customer-2",
        { customerId: "customer-2", sessionId: "session-customer-2", displayName: "Beta Owner" },
      ],
    ]),
  );
}
