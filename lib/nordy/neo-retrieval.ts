import type { NordyEntryPath } from "@/lib/nordy/types";

export type NeoRetrievalResult = {
  available: boolean;
  snippets: string[];
  status: "ok" | "unavailable" | "miss";
};

export type NeoConnectionStatus = {
  repositoryIdentity: "northbridge-venture-group";
  provider: string;
  baseUrlConfigured: boolean;
  githubAppConfigured: boolean;
  liveRetrieveReady: boolean;
  classification: "LIVE_READY" | "MOCK_FALLBACK" | "EXTERNAL_CONFIGURATION";
};

/**
 * Canonical NEO retrieval boundary.
 * Live cross-repo NEO connection may be pending runtime base URL / App wiring.
 */
export async function retrieveFromNeo(query: string): Promise<NeoRetrievalResult> {
  const provider = process.env.NEXT_PUBLIC_NEO_PROVIDER ?? "mock";

  if (provider === "mock" || !process.env.NEXT_PUBLIC_NEO_BASE_URL) {
    return {
      available: false,
      snippets: [],
      status: "unavailable",
    };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_NEO_BASE_URL}/api/v1/retrieve?q=${encodeURIComponent(query)}`,
      { method: "GET" },
    );
    if (!response.ok) {
      return { available: false, snippets: [], status: "unavailable" };
    }
    const data = (await response.json()) as { snippets?: string[] };
    const snippets = data.snippets ?? [];
    return {
      available: true,
      snippets,
      status: snippets.length ? "ok" : "miss",
    };
  } catch {
    return { available: false, snippets: [], status: "unavailable" };
  }
}

/** Non-mutating connection probe for completion / founder evidence. */
export function inspectNeoConnection(
  env: NodeJS.ProcessEnv = process.env,
): NeoConnectionStatus {
  const provider = env.NEXT_PUBLIC_NEO_PROVIDER ?? "mock";
  const baseUrlConfigured = Boolean(env.NEXT_PUBLIC_NEO_BASE_URL?.trim());
  const githubAppConfigured = Boolean(
    env.NEO_GITHUB_APP_ID &&
      env.NEO_GITHUB_APP_PRIVATE_KEY &&
      env.NEO_GITHUB_APP_INSTALLATION_ID,
  );
  const liveRetrieveReady = provider !== "mock" && baseUrlConfigured;

  return {
    repositoryIdentity: "northbridge-venture-group",
    provider,
    baseUrlConfigured,
    githubAppConfigured,
    liveRetrieveReady,
    classification: liveRetrieveReady
      ? "LIVE_READY"
      : githubAppConfigured && !baseUrlConfigured
        ? "EXTERNAL_CONFIGURATION"
        : "MOCK_FALLBACK",
  };
}

export function entryPathGreeting(entryPath: NordyEntryPath): string {
  switch (entryPath) {
    case "HOME":
      return "Welcome from the Northbridge home page. I can help you explore Ventures, Engineering & AI, or Digital — or start intake if you already know what you need.";
    case "ENGINEERING_AI":
      return "You came in through Engineering & AI. Tell me about the operational problem you want to solve — systems, workflows, or AI — and I will keep context as we go.";
    case "DIGITAL":
      return "You came in through Northbridge Digital. What do you need — website, ecommerce, portal, booking, or a mobile app? I will classify whether this is a fast-path Digital project or needs Engineering & AI.";
    case "MOBILE_APPS":
      return "You came in through Mobile App Launch. Tell me about the app — who it is for, the core jobs it must do, and whether auth, booking, or payments matter. I will keep that context as we go.";
    case "CAPABILITIES":
      return "You came in through Capabilities. Ask about a specific offering, or describe what you need and I will map it to Engineering & AI or Digital.";
    case "VENTURES":
      return "You came in through Ventures. Ask about Aviator Network, AirTax, or how Northbridge builds companies — or tell me if you are exploring a partnership.";
    case "EXPLORE":
      return "Happy to help you explore Northbridge. Ask about our ventures, capabilities, Engineering & AI, Digital, or how projects work — no forced qualification.";
    default:
      return "I am Nordi. I can answer questions about Northbridge or help qualify a Digital or Engineering & AI project. What brings you in?";
  }
}
