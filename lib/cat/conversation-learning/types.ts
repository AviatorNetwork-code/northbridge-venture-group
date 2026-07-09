import type { DiscoveryProfile } from "@/lib/cat/discovery-types";
import type { NordiChatMessage } from "@/lib/nordi/conversation-memory";

export type LearningRecordStatus =
  | "queued"
  | "analyzed"
  | "reviewed"
  | "approved"
  | "rejected"
  | "promoted_to_task";

export type RawConversationRecord = {
  sessionId: string;
  submittedAt: string;
  messages: NordiChatMessage[];
  profile: DiscoveryProfile;
  milestones: string[];
  industry?: string;
  messageCount: number;
  isFounderConversation: boolean;
  highPriority: boolean;
};

export type AnalyzedConversationRecord = {
  id: string;
  sessionId: string;
  status: LearningRecordStatus;
  submittedAt: string;
  analyzedAt?: string;
  reviewedAt?: string;
  industry?: string;
  messageCount: number;
  isFounderConversation: boolean;
  highPriority: boolean;
  patterns: string[];
  frictionThemes: string[];
  channelThemes: string[];
  notes?: string;
};

export type BehaviorLibraryEntry = {
  id: string;
  lessonId: string;
  trigger: string;
  behavior: string;
  createdAt: string;
};

export type PhraseLibraryEntry = {
  id: string;
  lessonId: string;
  context: string;
  phrase: string;
  createdAt: string;
};

export type RegressionTestCandidate = {
  id: string;
  lessonId: string;
  title: string;
  scenario: string;
  expectedBehavior: string;
  createdAt: string;
};

export type ImprovementProposal = {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  scope: string;
  createdAt: string;
  promotedAt?: string;
  engineeringTaskRef?: string;
};

export type ApprovedLesson = {
  id: string;
  analyzedRecordId: string;
  sessionId: string;
  title: string;
  summary: string;
  approvedBy: string;
  approvedAt: string;
  promotedAt?: string;
  notes?: string;
  behaviorLibraryEntries: BehaviorLibraryEntry[];
  phraseLibraryEntries: PhraseLibraryEntry[];
  regressionTestCandidates: RegressionTestCandidate[];
  improvementProposals: ImprovementProposal[];
  engineeringTaskRef?: string;
};

export type LearningAuditEntry = {
  id: string;
  recordId: string;
  action: string;
  timestamp: string;
  approvedBy?: string;
  notes?: string;
};

export type EngineeringTaskDraft = {
  id: string;
  lessonId: string;
  proposalId: string;
  title: string;
  description: string;
  scope: string;
  createdAt: string;
  promotedBy: string;
  status: "draft";
};

export type ConversationLearningStore = {
  rawConversations: RawConversationRecord[];
  analyzedRecords: AnalyzedConversationRecord[];
  approvedLessons: ApprovedLesson[];
  auditLog: LearningAuditEntry[];
  engineeringTasks: EngineeringTaskDraft[];
};
