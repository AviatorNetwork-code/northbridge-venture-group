import type { NordyEntryPath } from "@/lib/nordy/types";

export type NeoRetrievalResult = {
  available: boolean;
  snippets: string[];
  status: "ok" | "unavailable" | "miss";
};

/**
 * Canonical NEO retrieval boundary.
 * Live cross-repo NEO connection may be pending GitHub App configuration.
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

export function entryPathGreeting(entryPath: NordyEntryPath): string {
  switch (entryPath) {
    case "ENGINEERING_AI":
      return "You came in through Engineering & AI. Tell me about the operational problem you want to solve — systems, workflows, or AI — and I will keep context as we go.";
    case "DIGITAL":
      return "You came in through Northbridge Digital. What do you need — website, ecommerce, portal, booking, or a mobile app? I will classify whether this is a fast-path Digital project or needs Engineering & AI.";
    case "EXPLORE":
      return "Happy to help you explore Northbridge. Ask about our ventures, capabilities, Engineering & AI, Digital, or how projects work — no forced qualification.";
    default:
      return "I am Nordi. I can answer questions about Northbridge or help qualify a Digital or Engineering & AI project. What brings you in?";
  }
}
