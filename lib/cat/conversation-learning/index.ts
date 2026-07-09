export type {
  AnalyzedConversationRecord,
  ApprovedLesson,
  BehaviorLibraryEntry,
  ConversationLearningStore,
  EngineeringTaskDraft,
  ImprovementProposal,
  LearningAuditEntry,
  LearningRecordStatus,
  PhraseLibraryEntry,
  RawConversationRecord,
  RegressionTestCandidate,
} from "@/lib/cat/conversation-learning/types";

export { analyzeRawConversation } from "@/lib/cat/conversation-learning/analysis";
export {
  CAT_LEARNING_STORE_KEY,
  createEmptyLearningStore,
  readLearningStore,
  resetLearningStoreForTests,
  setLearningStoreForTests,
  updateLearningStore,
  writeLearningStore,
} from "@/lib/cat/conversation-learning/store";
export {
  approveForCatLearning,
  createImprovementProposal,
  generateRegressionTestCandidate,
  getApprovedLesson,
  ingestRawConversation,
  listReviewableRecords,
  markRecordReviewed,
  populateLessonLibraries,
  promoteToEngineeringTask,
  rejectLearningRecord,
  syncQueuedSubmissions,
} from "@/lib/cat/conversation-learning/workflow";
