import { describe, expect, it, beforeEach, afterEach } from "vitest";
import {
  buildLearningSubmission,
  clearLearningQueueForTests,
  isConversationComplete,
  readLearningQueue,
  submitConversationForLearning,
} from "@/lib/cat/conversation-learning-bridge";
import { readLearningStore, resetLearningStoreForTests } from "@/lib/cat/conversation-learning/store";
import { acceptLearningConsent } from "@/lib/nordi/conversation-learning-consent";
import { createEmptyMemory } from "@/lib/nordi/conversation-memory";

describe("conversation learning bridge", () => {
  beforeEach(() => {
    clearLearningQueueForTests();
    resetLearningStoreForTests();
  });

  afterEach(() => {
    clearLearningQueueForTests();
    resetLearningStoreForTests();
  });

  it("marks complete conversations as learning eligible only with consent", () => {
    const memory = createEmptyMemory("session-1");
    memory.profile = {
      discoveryPhase: "recommendations",
      industry: "professional-services",
      employeeCount: 2,
      answeredQuestions: ["general-team-size", "general-customer-contact", "general-friction"],
    };

    expect(isConversationComplete(memory.profile)).toBe(true);

    const withoutConsent = submitConversationForLearning(memory);
    expect(withoutConsent.submitted).toBe(false);
    expect(withoutConsent.reason).toBe("not_eligible");

    memory.conversationLearningConsent = acceptLearningConsent(null, "conversation_prompt").consent;
    memory.learningEligible = true;

    const withConsent = submitConversationForLearning(memory);
    expect(withConsent.submitted).toBe(true);
    expect(readLearningQueue()).toHaveLength(1);

    const store = readLearningStore();
    expect(store.rawConversations).toHaveLength(1);
    expect(store.analyzedRecords).toHaveLength(1);
    expect(store.analyzedRecords[0]?.status).toBe("analyzed");
  });

  it("does not ingest declined conversations", () => {
    const memory = createEmptyMemory("session-2");
    memory.profile = {
      discoveryPhase: "recommendations",
      industry: "dental",
      employeeCount: 3,
      answeredQuestions: ["a", "b", "c"],
    };
    memory.learningEligible = false;

    const result = submitConversationForLearning(memory);
    expect(result.submitted).toBe(false);
    expect(readLearningQueue()).toHaveLength(0);
  });

  it("builds founder conversation submissions with priority flags", () => {
    const memory = createEmptyMemory("session-founder");
    memory.profile = {
      discoveryPhase: "recommendations",
      industry: "professional-services",
      employeeCount: 1,
    };
    memory.conversationLearningConsent = acceptLearningConsent(null, "conversation_prompt").consent;
    memory.founderSession = true;
    memory.founderLearningSettings = {
      alwaysAllow: true,
      autoSendToLearningCenter: true,
      markAsFounderConversation: true,
      highPriorityLearning: true,
      autoGenerateRegressionTests: true,
    };

    const submission = buildLearningSubmission(memory);
    expect(submission?.isFounderConversation).toBe(true);
    expect(submission?.highPriority).toBe(true);
    expect(submission?.generateRegressionTestCandidates).toBe(true);
  });
});
