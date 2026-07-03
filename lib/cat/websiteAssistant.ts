import {
  CAT_CTAS,
  CAT_FALLBACK_MESSAGE,
  CAT_GREETING,
  KNOWLEDGE_TOPICS,
  type KnowledgeTopic,
} from "./websiteKnowledge";
import type {
  CatAssistantResponse,
  CatConversationContext,
  CatRecommendation,
  CatRecommendationAction,
  CatRuntimeAdapter,
} from "./websiteAssistantTypes";

function normalizeInput(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, " ");
}

function scoreTopic(topic: KnowledgeTopic, normalized: string): number {
  let score = 0;
  for (const keyword of topic.keywords) {
    if (normalized.includes(keyword)) {
      score += keyword.split(" ").length;
    }
  }
  return score;
}

function findBestTopic(input: string): KnowledgeTopic | null {
  const normalized = normalizeInput(input);
  if (!normalized) return null;

  let best: KnowledgeTopic | null = null;
  let bestScore = 0;

  for (const topic of KNOWLEDGE_TOPICS) {
    const score = scoreTopic(topic, normalized);
    if (score > bestScore) {
      bestScore = score;
      best = topic;
    }
  }

  return bestScore > 0 ? best : null;
}

function buildRecommendation(
  topic: KnowledgeTopic | null,
): CatRecommendation | undefined {
  if (!topic?.recommendationAction) return undefined;

  const action = topic.recommendationAction;
  const summaries: Record<CatRecommendationAction, string> = {
    explore_products: "Explore Northbridge offerings",
    complete_assessment: "Discuss a structured assessment",
    contact: "Contact Northbridge",
    book_meeting: "Request a partnership conversation",
    continue_browsing: "Continue learning about Northbridge",
  };

  return {
    action,
    summary: summaries[action],
    reason:
      topic.recommendationReason ??
      "Based on your question, this is the most helpful next step.",
  };
}

/** Static, deterministic response engine for v1. */
export function respondToVisitorInput(
  input: string,
  _context?: CatConversationContext,
): CatAssistantResponse {
  const topic = findBestTopic(input);

  if (topic) {
    return {
      message: topic.message,
      ctas: [...topic.ctas],
      recommendation: buildRecommendation(topic),
      matchedTopic: topic.id,
    };
  }

  return {
    message: CAT_FALLBACK_MESSAGE,
    ctas: [CAT_CTAS.services, CAT_CTAS.ventures, CAT_CTAS.contact],
    recommendation: {
      action: "continue_browsing",
      summary: "Browse suggested topics",
      reason: "No exact match—offering general guidance paths.",
    },
  };
}

export function getGreetingResponse(): CatAssistantResponse {
  return {
    message: CAT_GREETING,
    ctas: [CAT_CTAS.services, CAT_CTAS.ventures, CAT_CTAS.contact],
    recommendation: {
      action: "continue_browsing",
      summary: "Start with a suggested question",
      reason: "New conversation opened.",
    },
  };
}

/** Adapter boundary for future live CAT runtime integration. */
export const staticCatAdapter: CatRuntimeAdapter = {
  mode: "static",
  respond: async (input, context) => respondToVisitorInput(input, context),
};

let activeAdapter: CatRuntimeAdapter = staticCatAdapter;

export function setCatRuntimeAdapter(adapter: CatRuntimeAdapter): void {
  activeAdapter = adapter;
}

export function getCatRuntimeAdapter(): CatRuntimeAdapter {
  return activeAdapter;
}

export async function askCatAssistant(
  input: string,
  context?: CatConversationContext,
): Promise<CatAssistantResponse> {
  return activeAdapter.respond(input, context);
}
