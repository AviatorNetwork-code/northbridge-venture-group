/** Confidence tier aligned with Northbridge assistant confidence model. */
export type ConfidenceLevel = "high" | "medium" | "low";

export interface ConfidenceScore {
  level: ConfidenceLevel;
  /** Optional normalized score in [0, 1]. */
  score?: number;
  rationale?: string;
}

export function meetsMinimumConfidence(
  score: ConfidenceScore,
  minimum: ConfidenceLevel,
): boolean {
  const order: ConfidenceLevel[] = ["low", "medium", "high"];
  return order.indexOf(score.level) >= order.indexOf(minimum);
}
