import type { NordiConversationMemory } from "@/lib/nordi/conversation-memory";
import {
  resolveLearningEligible,
  type FounderLearningSettings,
} from "@/lib/nordi/conversation-learning-consent";
import { ingestRawConversation } from "@/lib/cat/conversation-learning/workflow";
import type {
  RawConversationRecord,
  LearningRecordStatus,
} from "@/lib/cat/conversation-learning/types";

export const CAT_LEARNING_QUEUE_KEY = "northbridge-cat-learning-queue";

export type ConversationLearningSubmission = {
  sessionId: string;
  submittedAt: string;
  learningEligible: true;
  isFounderConversation: boolean;
  highPriority: boolean;
  autoSendToLearningCenter: boolean;
  generateRegressionTestCandidates: boolean;
  messageCount: number;
  milestones: string[];
  industry?: string;
  discoveryPhase?: string;
  status: LearningRecordStatus;
};

export type LearningSubmissionResult = {
  submitted: boolean;
  submission: ConversationLearningSubmission | null;
  reason?: "not_eligible" | "already_submitted";
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

let memoryQueue: ConversationLearningSubmission[] = [];
let memoryQueueHydrated = false;

function readQueueFromStorage(): ConversationLearningSubmission[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(CAT_LEARNING_QUEUE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ConversationLearningSubmission[];
  } catch {
    return [];
  }
}

function hydrateQueue(): void {
  if (memoryQueueHydrated) return;
  memoryQueueHydrated = true;
  memoryQueue = readQueueFromStorage();
}

function readQueue(): ConversationLearningSubmission[] {
  hydrateQueue();
  return memoryQueue;
}

function writeQueue(entries: ConversationLearningSubmission[]): void {
  memoryQueue = entries.slice(-50);
  memoryQueueHydrated = true;
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(CAT_LEARNING_QUEUE_KEY, JSON.stringify(memoryQueue));
  } catch {
    // Ignore quota failures.
  }
}

export function isConversationComplete(profile: NordiConversationMemory["profile"]): boolean {
  return (
    profile.discoveryPhase === "recommendations" ||
    ((profile.answeredQuestions?.length ?? 0) >= 3 &&
      Boolean(profile.industry) &&
      Boolean(profile.employeeCount))
  );
}

export function buildRawConversationRecord(
  memory: NordiConversationMemory,
  founderSettings?: FounderLearningSettings | null,
): RawConversationRecord | null {
  const learningEligible = resolveLearningEligible(
    memory.conversationLearningConsent,
    founderSettings ?? memory.founderLearningSettings,
  );

  if (!learningEligible) return null;

  const settings = founderSettings ?? memory.founderLearningSettings;

  return {
    sessionId: memory.sessionId,
    submittedAt: new Date().toISOString(),
    messages: memory.messages,
    profile: memory.profile,
    milestones: memory.milestones,
    industry: memory.profile.industry,
    messageCount: memory.messages.length,
    isFounderConversation: Boolean(memory.founderSession && settings?.markAsFounderConversation),
    highPriority: Boolean(settings?.highPriorityLearning),
  };
}

export function buildLearningSubmission(
  memory: NordiConversationMemory,
  founderSettings?: FounderLearningSettings | null,
): ConversationLearningSubmission | null {
  const raw = buildRawConversationRecord(memory, founderSettings);
  if (!raw) return null;

  const settings = founderSettings ?? memory.founderLearningSettings;

  return {
    sessionId: raw.sessionId,
    submittedAt: raw.submittedAt,
    learningEligible: true,
    isFounderConversation: raw.isFounderConversation,
    highPriority: raw.highPriority,
    autoSendToLearningCenter: Boolean(settings?.autoSendToLearningCenter ?? true),
    generateRegressionTestCandidates: Boolean(settings?.autoGenerateRegressionTests),
    messageCount: raw.messageCount,
    milestones: raw.milestones,
    industry: raw.industry,
    discoveryPhase: memory.profile.discoveryPhase,
    status: "queued",
  };
}

export function submitConversationForLearning(
  memory: NordiConversationMemory,
): LearningSubmissionResult {
  if (!isConversationComplete(memory.profile)) {
    return { submitted: false, submission: null, reason: "not_eligible" };
  }

  const learningEligible = resolveLearningEligible(
    memory.conversationLearningConsent,
    memory.founderLearningSettings,
  );

  if (!learningEligible) {
    return { submitted: false, submission: null, reason: "not_eligible" };
  }

  const raw = buildRawConversationRecord(memory);
  const submission = buildLearningSubmission(memory);
  if (!raw || !submission) {
    return { submitted: false, submission: null, reason: "not_eligible" };
  }

  const queue = readQueue();
  if (queue.some((entry) => entry.sessionId === memory.sessionId)) {
    return { submitted: false, submission: null, reason: "already_submitted" };
  }

  writeQueue([...queue, submission]);
  ingestRawConversation(raw);

  return { submitted: true, submission };
}

export function readLearningQueue(): ConversationLearningSubmission[] {
  return readQueue();
}

export function clearLearningQueueForTests(): void {
  memoryQueue = [];
  memoryQueueHydrated = true;
  if (!isBrowser()) return;
  window.localStorage.removeItem(CAT_LEARNING_QUEUE_KEY);
}
