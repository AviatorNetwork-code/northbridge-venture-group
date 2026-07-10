import { BearerTokenAuthenticationClient } from "@/auth/auth-client";
import { InMemorySecureTokenStore } from "@/auth/secure-token-store";

describe("authentication state handling", () => {
  it("stores and retrieves bearer tokens through the secure token store abstraction", async () => {
    const store = new InMemorySecureTokenStore();
    const client = new BearerTokenAuthenticationClient(store);

    expect(await client.getSession()).toBeNull();

    await client.signIn({ accessToken: "token-customer-1" });
    const session = await client.getSession();

    expect(session?.accessToken).toBe("token-customer-1");
    expect(session?.tokenType).toBe("Bearer");
  });

  it("clears tokens on sign out", async () => {
    const store = new InMemorySecureTokenStore();
    const client = new BearerTokenAuthenticationClient(store);

    await client.signIn({ accessToken: "token-customer-1" });
    await client.signOut();

    expect(await client.getSession()).toBeNull();
  });
});
