export type NeoProviderMode = "mock" | "local";

export type NeoConfig = {
  provider: NeoProviderMode;
  baseUrl: string;
};

export function getNeoConfig(): NeoConfig {
  const rawProvider = process.env.NEXT_PUBLIC_NEO_PROVIDER ?? "mock";
  const provider: NeoProviderMode = rawProvider === "local" ? "local" : "mock";
  const baseUrl = process.env.NEXT_PUBLIC_NEO_BASE_URL ?? "http://localhost:4000";

  return { provider, baseUrl };
}
