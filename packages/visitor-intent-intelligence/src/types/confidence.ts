export type ConfidenceSignalType =
  | "increasing_confidence"
  | "uncertainty"
  | "hesitation"
  | "confusion"
  | "frustration"
  | "disengagement"
  | "successful_completion";

export interface ConfidenceSignal {
  type: ConfidenceSignalType;
  score: number;
  timestamp: number;
  trigger: string;
  evidence?: string;
}

export interface ConfidenceAssessment {
  currentScore: number;
  trend: "rising" | "stable" | "falling";
  signals: ConfidenceSignal[];
  dominantSignal?: ConfidenceSignalType;
}
