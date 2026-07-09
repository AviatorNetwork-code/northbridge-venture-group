export type ConflictPolarity = "support" | "oppose" | "neutral";

export interface TeamConflictPosition {
  specialistId: string;
  summary: string;
  polarity: ConflictPolarity;
  topicKey: string;
}

export interface TeamConflict {
  conflictId: string;
  topic: string;
  topicKey: string;
  positions: TeamConflictPosition[];
  detectedAt: string;
}

export interface ConflictDetectionInput {
  results: import("./delegation.js").DelegationResult[];
  now?: string;
}

export interface ConflictDetector {
  detect(input: ConflictDetectionInput): TeamConflict[];
}
