import type { SearchIntentClassification, SearchIntentType } from "../types/intent.js";

const INTENT_PATTERNS: Array<{ intent: SearchIntentType; patterns: RegExp[]; weight: number }> = [
  {
    intent: "transactional",
    patterns: [/\bbuy\b|\bpricing\b|\bcost\b|\bhire\b|get started|sign up|\bbook\b|\bpurchase\b|\bquote\b/i],
    weight: 0.9,
  },
  {
    intent: "commercial",
    patterns: [/best|top|review|vs|alternative|software|platform|solution|tool|app/i],
    weight: 0.75,
  },
  {
    intent: "comparison",
    patterns: [/ vs | versus |compare|comparison|better than|difference between/i],
    weight: 0.85,
  },
  {
    intent: "local",
    patterns: [/near me|local|in [a-z]+ county|city|regional/i],
    weight: 0.7,
  },
  {
    intent: "navigational",
    patterns: [/northbridge|aviator network|quadrix|airtax|login|sign in|official/i],
    weight: 0.8,
  },
  {
    intent: "informational",
    patterns: [/how to|what is|guide|learn|steps|checklist|requirements|faq|explain/i],
    weight: 0.65,
  },
];

export function classifySearchIntent(keyword: string): SearchIntentClassification {
  const normalized = keyword.toLowerCase().trim();
  const scores = new Map<SearchIntentType, number>();
  const signals: string[] = [];

  for (const entry of INTENT_PATTERNS) {
    for (const pattern of entry.patterns) {
      if (pattern.test(normalized)) {
        scores.set(entry.intent, (scores.get(entry.intent) ?? 0) + entry.weight);
        signals.push(`${entry.intent}:${pattern.source.slice(0, 30)}`);
      }
    }
  }

  if (scores.size === 0) {
    scores.set("informational", 0.5);
    signals.push("default:informational");
  }

  const sorted = [...scores.entries()].sort((a, b) => b[1] - a[1]);
  const primaryIntent = sorted[0]![0];
  const secondaryIntents = sorted.slice(1, 3).map(([intent]) => intent);
  const confidence = Math.min(1, sorted[0]![1]);

  const buyerIntentLevel =
    primaryIntent === "transactional"
      ? "high"
      : primaryIntent === "commercial" || primaryIntent === "comparison"
        ? "medium"
        : "low";

  return {
    keyword,
    primaryIntent,
    secondaryIntents,
    confidence,
    signals,
    buyerIntentLevel,
  };
}
