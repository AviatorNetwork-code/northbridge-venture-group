import type {
  ConversationFactMemory,
  ConversationFieldDefinition,
  ConversationPlannerDebugLog,
  ExtractedFactInput,
} from "./types.js";

export function buildPlannerDebugLog(input: {
  context?: string;
  extractedFacts: readonly ExtractedFactInput[];
  memory: ConversationFactMemory;
  selectedQuestion: ConversationFieldDefinition | null;
  skippedRepeatedQuestions: readonly string[];
}): ConversationPlannerDebugLog {
  return {
    context: input.context,
    extractedFacts: [...input.extractedFacts],
    accumulatedFacts: { ...input.memory.accumulatedFacts },
    answeredFields: [...input.memory.answeredFields],
    missingFields: [...input.memory.missingFields],
    selectedQuestion: input.selectedQuestion,
    skippedRepeatedQuestions: [...input.skippedRepeatedQuestions],
  };
}

export function logConversationPlannerDecision(
  log: ConversationPlannerDebugLog,
  options?: { enabled?: boolean },
): void {
  const enabled =
    options?.enabled ??
    (typeof process !== "undefined" &&
      (process.env.CONVERSATION_PLANNER_DEBUG === "1" || process.env.NODE_ENV !== "production"));

  if (!enabled) return;

  console.info("[ConversationPlanner]", {
    context: log.context,
    extractedFacts: log.extractedFacts,
    accumulatedFacts: log.accumulatedFacts,
    answeredFields: log.answeredFields,
    missingFields: log.missingFields,
    selectedQuestion: log.selectedQuestion
      ? {
          fieldId: log.selectedQuestion.fieldId,
          semanticKey: log.selectedQuestion.semanticKey,
          prompt: log.selectedQuestion.prompt,
        }
      : null,
    skippedRepeatedQuestions: log.skippedRepeatedQuestions,
  });
}
