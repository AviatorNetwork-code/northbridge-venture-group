import type { ScoringEvidence } from "@/lib/assessment";

export function getTopEvidenceFactors(
  evidence: ScoringEvidence[],
  limit = 3
): ScoringEvidence[] {
  return [...evidence]
    .sort((a, b) => Math.abs(b.points) - Math.abs(a.points))
    .slice(0, limit);
}
