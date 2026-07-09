import { describe, expect, it, beforeEach } from "vitest";
import {
  readLearningStore,
  resetLearningStoreForTests,
} from "@/lib/cat/conversation-learning/store";
import {
  approveForCatLearning,
  createImprovementProposal,
  generateRegressionTestCandidate,
  ingestRawConversation,
  promoteToEngineeringTask,
  rejectLearningRecord,
} from "@/lib/cat/conversation-learning/workflow";
import type { RawConversationRecord } from "@/lib/cat/conversation-learning/types";

function sampleRaw(sessionId = "session-1"): RawConversationRecord {
  return {
    sessionId,
    submittedAt: "2026-07-09T12:00:00.000Z",
    messages: [
      {
        id: "u-1",
        role: "user",
        content: "tax preparation",
        timestamp: "2026-07-09T12:00:01.000Z",
      },
      {
        id: "u-2",
        role: "user",
        content: "2",
        timestamp: "2026-07-09T12:00:02.000Z",
      },
    ],
    profile: {
      industry: "professional-services",
      employeeCount: 2,
      communicationChannels: ["phone"],
      discoveryAnswers: {
        "general-friction": "Scheduling follow-ups slip",
      },
      userMessageCount: 2,
    },
    milestones: ["business_identified"],
    industry: "professional-services",
    messageCount: 2,
    isFounderConversation: true,
    highPriority: true,
  };
}

describe("conversation learning workflow", () => {
  beforeEach(() => {
    resetLearningStoreForTests();
  });

  it("keeps raw, analyzed, and approved records separate", () => {
    const raw = sampleRaw();
    const analyzed = ingestRawConversation(raw);
    expect(analyzed?.status).toBe("analyzed");

    const storeAfterIngest = readLearningStore();
    expect(storeAfterIngest.rawConversations).toHaveLength(1);
    expect(storeAfterIngest.analyzedRecords).toHaveLength(1);
    expect(storeAfterIngest.approvedLessons).toHaveLength(0);

    const lesson = approveForCatLearning(analyzed!.id, "founder@northbridge.com", "Looks good");
    expect(lesson).not.toBeNull();

    const storeAfterApprove = readLearningStore();
    expect(storeAfterApprove.approvedLessons).toHaveLength(1);
    expect(storeAfterApprove.analyzedRecords[0]?.status).toBe("approved");
    expect(storeAfterApprove.auditLog.some((entry) => entry.action === "approved_for_cat_learning")).toBe(
      true,
    );
  });

  it("requires founder approval before generating reusable artifacts", () => {
    const analyzed = ingestRawConversation(sampleRaw("session-artifacts"));
    const lesson = approveForCatLearning(analyzed!.id, "founder", "approved");

    const regression = generateRegressionTestCandidate(lesson!.id);
    const proposal = createImprovementProposal(lesson!.id);
    expect(regression).not.toBeNull();
    expect(proposal).not.toBeNull();

    const task = promoteToEngineeringTask(lesson!.id, proposal!.id, "founder", "manual promote");
    expect(task?.status).toBe("draft");
    expect(readLearningStore().engineeringTasks).toHaveLength(1);
    expect(readLearningStore().analyzedRecords[0]?.status).toBe("promoted_to_task");
  });

  it("tracks rejected records without creating approved lessons", () => {
    const analyzed = ingestRawConversation(sampleRaw("session-reject"));
    rejectLearningRecord(analyzed!.id, "founder", "Not useful");

    const store = readLearningStore();
    expect(store.approvedLessons).toHaveLength(0);
    expect(store.analyzedRecords[0]?.status).toBe("rejected");
  });
});
