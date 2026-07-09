import { buildPlannerDebugLog, logConversationPlannerDecision } from "./debug.js";
import { mergeExtractedFacts } from "./merge.js";
import {
  recordAskedQuestion,
  selectNextQuestion,
  syncMissingFields,
} from "./planner.js";
import type {
  ConversationFactMemory,
  ConversationFieldDefinition,
  ConversationPlannerDebugLog,
  ExtractedFactInput,
} from "./types.js";

export type ProcessConversationTurnInput = {
  memory: ConversationFactMemory;
  extractedFacts: readonly ExtractedFactInput[];
  fieldDefinitions: readonly ConversationFieldDefinition[];
  now?: () => string;
  messageId?: string;
  debugContext?: string;
  logDebug?: boolean;
};

export type ProcessConversationTurnResult = {
  memory: ConversationFactMemory;
  selectedQuestion: ConversationFieldDefinition | null;
  skippedRepeatedQuestions: string[];
  debug: ConversationPlannerDebugLog;
};

/**
 * One deterministic turn: merge facts → sync missing → select next question.
 * Code owns what is missing and what to ask; LLM may only phrase the prompt later.
 */
export function processConversationTurn(
  input: ProcessConversationTurnInput,
): ProcessConversationTurnResult {
  const merged = mergeExtractedFacts(input.memory, input.extractedFacts, input.now);
  const synced = syncMissingFields(merged, input.fieldDefinitions);
  const { question, skippedRepeatedQuestions } = selectNextQuestion(
    synced,
    input.fieldDefinitions,
  );

  const debug = buildPlannerDebugLog({
    context: input.debugContext,
    extractedFacts: input.extractedFacts,
    memory: synced,
    selectedQuestion: question,
    skippedRepeatedQuestions,
  });

  if (input.logDebug) {
    logConversationPlannerDecision(debug);
  }

  return {
    memory: synced,
    selectedQuestion: question,
    skippedRepeatedQuestions,
    debug,
  };
}

export function planAndRecordQuestion(
  input: ProcessConversationTurnInput,
): ProcessConversationTurnResult & { memoryWithAsk: ConversationFactMemory } {
  const result = processConversationTurn(input);
  const memoryWithAsk = result.selectedQuestion
    ? recordAskedQuestion(result.memory, result.selectedQuestion, input.messageId, input.now)
    : result.memory;

  return {
    ...result,
    memory: memoryWithAsk,
    memoryWithAsk,
  };
}
