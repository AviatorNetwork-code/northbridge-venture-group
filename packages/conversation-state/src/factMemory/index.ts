export type {
  AccumulatedFact,
  AskedQuestionRecord,
  ConversationFactMemory,
  ConversationFieldDefinition,
  ConversationPlannerDebugLog,
  ExtractedFactInput,
  FactConfidence,
  FieldCorrection,
} from "./types.js";

export {
  createEmptyFactMemory,
  isPresentFactValue,
  mergeExtractedFacts,
} from "./merge.js";

export {
  isFieldAnswered,
  recordAnswerForQuestion,
  recordAskedQuestion,
  selectNextQuestion,
  syncMissingFields,
} from "./planner.js";

export {
  buildPlannerDebugLog,
  logConversationPlannerDecision,
} from "./debug.js";

export {
  planAndRecordQuestion,
  processConversationTurn,
  type ProcessConversationTurnInput,
  type ProcessConversationTurnResult,
} from "./processTurn.js";
