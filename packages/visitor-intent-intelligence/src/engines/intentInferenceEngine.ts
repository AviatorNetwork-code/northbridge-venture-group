import type {
  IntentDefinition,
  IntentEvidence,
  IntentInference,
} from "../types/intent.js";

function scoreIntent(
  intent: IntentDefinition,
  evidence: IntentEvidence[],
): { score: number; supporting: IntentEvidence[]; conflicting: IntentEvidence[] } {
  let score = 0;
  const supporting: IntentEvidence[] = [];
  const conflicting: IntentEvidence[] = [];

  for (const item of evidence) {
    const keywordMatch =
      intent.keywords?.some((keyword) =>
        item.signal.toLowerCase().includes(keyword.toLowerCase()),
      ) ?? false;
    const idMatch = item.signal.includes(intent.id);

    if (keywordMatch || idMatch || item.supports === intent.id) {
      score += item.weight;
      supporting.push(item);
    }
    if (item.conflicts === intent.id) {
      score -= item.weight * 0.5;
      conflicting.push(item);
    }
  }

  return { score: Math.max(0, score), supporting, conflicting };
}

export function inferIntent(
  catalog: IntentDefinition[],
  evidence: IntentEvidence[],
  timestamps: number[],
): IntentInference {
  const ranked = catalog
    .map((intent) => {
      const result = scoreIntent(intent, evidence);
      return { intent, ...result };
    })
    .sort((a, b) => b.score - a.score);

  const top = ranked[0];
  const second = ranked[1];

  const unknown = catalog.find((i) => i.id === "unknown_intent");
  const primary =
    top && top.score > 0
      ? top.intent
      : (unknown ?? top?.intent ?? catalog[0]!);
  const maxScore = Math.max(top?.score ?? 0, 1);
  const primaryConfidence =
    top && top.score > 0 ? Math.min(0.98, top.score / maxScore) : 0;

  const secondary =
    second && second.score > 0 && second.intent.id !== primary.id
      ? second.intent
      : undefined;

  const progression = timestamps.map((timestamp, index) => ({
    timestamp,
    confidence: Math.min(0.98, primaryConfidence * ((index + 1) / timestamps.length)),
    primaryIntentId: primary.id,
  }));

  return {
    primaryIntent: primary,
    secondaryIntent: secondary,
    confidence: primaryConfidence,
    supportingEvidence: top?.supporting ?? [],
    conflictingEvidence: top?.conflicting ?? [],
    confidenceProgression: progression.length > 0 ? progression : [{
      timestamp: Date.now(),
      confidence: primaryConfidence,
      primaryIntentId: primary.id,
    }],
  };
}

export function buildEvidenceFromKeywords(
  text: string,
  source: IntentEvidence["source"],
  timestamp: number,
  catalog: IntentDefinition[],
): IntentEvidence[] {
  const normalized = text.toLowerCase();
  const evidence: IntentEvidence[] = [];

  for (const intent of catalog) {
    for (const keyword of intent.keywords ?? []) {
      if (normalized.includes(keyword.toLowerCase())) {
        evidence.push({
          source,
          signal: keyword,
          weight: 1 + keyword.split(" ").length * 0.25,
          timestamp,
          supports: intent.id,
        });
      }
    }
  }

  return evidence;
}
