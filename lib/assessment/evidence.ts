export type ScoringEvidence = {
  ruleId: string;
  inputField: string;
  rawValue: string | string[] | number;
  normalizedValue: string | number | boolean;
  points: number;
  rationale: string;
};

export function createEvidence(
  ruleId: string,
  inputField: string,
  rawValue: string | string[] | number,
  normalizedValue: string | number | boolean,
  points: number,
  rationale: string
): ScoringEvidence {
  return { ruleId, inputField, rawValue, normalizedValue, points, rationale };
}

export function sumEvidencePoints(evidence: ScoringEvidence[]): number {
  return evidence.reduce((total, item) => total + item.points, 0);
}
