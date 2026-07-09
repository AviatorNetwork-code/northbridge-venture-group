export type FactConfidence = "low" | "medium" | "high";

export type AccumulatedFact = {
  fieldId: string;
  value: unknown;
  confidence: FactConfidence;
  sourceMessageId?: string;
  sourceMessageIds?: readonly string[];
  updatedAt: string;
  isCorrection?: boolean;
  previousValue?: unknown;
};

export type FieldCorrection = {
  fieldId: string;
  previousValue: unknown;
  correctedValue: unknown;
  sourceMessageId?: string;
  correctedAt: string;
};

export type AskedQuestionRecord = {
  fieldId: string;
  semanticKey: string;
  prompt: string;
  askedAt: string;
  sourceMessageId?: string;
};

export type ConversationFactMemory = {
  accumulatedFacts: Record<string, AccumulatedFact>;
  answeredFields: readonly string[];
  missingFields: readonly string[];
  corrections: readonly FieldCorrection[];
  lastAskedQuestion: string | null;
  askedQuestionHistory: readonly AskedQuestionRecord[];
};

export type ExtractedFactInput = {
  fieldId: string;
  value: unknown;
  confidence?: FactConfidence;
  sourceMessageId?: string;
  /** When true, replaces an existing fact and records a correction. */
  isCorrection?: boolean;
};

export type ConversationFieldDefinition = {
  fieldId: string;
  /** Shared semantic identity — prevents asking the same meaning twice under different ids. */
  semanticKey: string;
  prompt: string;
  required: boolean;
  priority?: number;
  /** Product-specific answered check beyond raw accumulated facts. */
  isAnswered?: (
    facts: Readonly<Record<string, AccumulatedFact>>,
    answeredFields: readonly string[],
  ) => boolean;
};

export type ConversationPlannerDebugLog = {
  context?: string;
  extractedFacts: ExtractedFactInput[];
  accumulatedFacts: Record<string, AccumulatedFact>;
  answeredFields: readonly string[];
  missingFields: readonly string[];
  selectedQuestion: ConversationFieldDefinition | null;
  skippedRepeatedQuestions: readonly string[];
};
