import type { RequestOwner } from "@northbridge/workforce-contracts";

export interface RouteScore {
  value: number;
  confidence: "high" | "medium" | "low";
  strategy: string;
}

export interface RouteReason {
  code: string;
  description: string;
  ruleId?: string;
  evidenceRef?: string;
}

export interface RouteCandidate {
  owner: RequestOwner;
  score: RouteScore;
  reasons: RouteReason[];
  teamProductId?: string;
  capabilityTags?: string[];
}

export function scoreToConfidence(value: number): RouteScore["confidence"] {
  if (value >= 0.85) return "high";
  if (value >= 0.5) return "medium";
  return "low";
}

export function createRouteScore(
  value: number,
  strategy: string,
): RouteScore {
  const normalized = Math.max(0, Math.min(1, value));
  return {
    value: normalized,
    confidence: scoreToConfidence(normalized),
    strategy,
  };
}
