import { analyzeRawConversation } from "@/lib/cat/conversation-learning/analysis";
import { readLearningStore, updateLearningStore } from "@/lib/cat/conversation-learning/store";
import type {
  AnalyzedConversationRecord,
  ApprovedLesson,
  EngineeringTaskDraft,
  ImprovementProposal,
  LearningAuditEntry,
  RawConversationRecord,
  RegressionTestCandidate,
} from "@/lib/cat/conversation-learning/types";

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function appendAudit(
  auditLog: LearningAuditEntry[],
  entry: Omit<LearningAuditEntry, "id">,
): LearningAuditEntry[] {
  return [...auditLog, { ...entry, id: createId("audit") }].slice(-100);
}

export function ingestRawConversation(raw: RawConversationRecord): AnalyzedConversationRecord | null {
  let created: AnalyzedConversationRecord | null = null;

  updateLearningStore((store) => {
    if (store.rawConversations.some((record) => record.sessionId === raw.sessionId)) {
      created = store.analyzedRecords.find((record) => record.sessionId === raw.sessionId) ?? null;
      return store;
    }

    const analyzed = analyzeRawConversation(raw);
    created = analyzed;

    return {
      ...store,
      rawConversations: [...store.rawConversations, raw],
      analyzedRecords: [...store.analyzedRecords, analyzed],
      auditLog: appendAudit(store.auditLog, {
        recordId: analyzed.id,
        action: "ingested_raw_conversation",
        timestamp: raw.submittedAt,
        notes: `session:${raw.sessionId}`,
      }),
    };
  });

  return created;
}

export function syncQueuedSubmissions(
  submissions: Array<{
    sessionId: string;
    submittedAt: string;
    industry?: string;
    messageCount: number;
    milestones: string[];
    isFounderConversation: boolean;
    highPriority: boolean;
  }>,
  resolveRaw: (sessionId: string) => RawConversationRecord | null,
): number {
  let ingested = 0;

  for (const submission of submissions) {
    const existing = readLearningStore().analyzedRecords.find(
      (record) => record.sessionId === submission.sessionId,
    );
    if (existing) continue;

    const raw =
      resolveRaw(submission.sessionId) ??
      ({
        sessionId: submission.sessionId,
        submittedAt: submission.submittedAt,
        messages: [],
        profile: { industry: submission.industry, userMessageCount: submission.messageCount },
        milestones: submission.milestones,
        industry: submission.industry,
        messageCount: submission.messageCount,
        isFounderConversation: submission.isFounderConversation,
        highPriority: submission.highPriority,
      } satisfies RawConversationRecord);

    if (ingestRawConversation(raw)) {
      ingested += 1;
    }
  }

  return ingested;
}

export function markRecordReviewed(recordId: string, notes?: string): AnalyzedConversationRecord | null {
  let updated: AnalyzedConversationRecord | null = null;

  updateLearningStore((store) => {
    const index = store.analyzedRecords.findIndex((record) => record.id === recordId);
    if (index === -1) return store;

    const record = store.analyzedRecords[index];
    if (record.status !== "analyzed" && record.status !== "queued") return store;

    updated = {
      ...record,
      status: "reviewed",
      reviewedAt: new Date().toISOString(),
      notes: notes ?? record.notes,
    };

    const analyzedRecords = [...store.analyzedRecords];
    analyzedRecords[index] = updated;

    return {
      ...store,
      analyzedRecords,
      auditLog: appendAudit(store.auditLog, {
        recordId,
        action: "marked_reviewed",
        timestamp: updated.reviewedAt!,
        notes,
      }),
    };
  });

  return updated;
}

export function approveForCatLearning(
  recordId: string,
  approvedBy: string,
  notes?: string,
): ApprovedLesson | null {
  let lesson: ApprovedLesson | null = null;

  updateLearningStore((store) => {
    const index = store.analyzedRecords.findIndex((record) => record.id === recordId);
    if (index === -1) return store;

    const record = store.analyzedRecords[index];
    if (record.status === "rejected" || record.status === "promoted_to_task") return store;

    const approvedAt = new Date().toISOString();
    const title = `${record.industry ?? "Business"} conversation patterns`;
    const summary = [
      `Patterns: ${record.patterns.join(", ")}.`,
      record.frictionThemes.length > 0
        ? `Friction themes: ${record.frictionThemes.join(", ")}.`
        : null,
      record.channelThemes.length > 0
        ? `Contact channels: ${record.channelThemes.join(", ")}.`
        : null,
    ]
      .filter(Boolean)
      .join(" ");

    lesson = {
      id: createId("lesson"),
      analyzedRecordId: record.id,
      sessionId: record.sessionId,
      title,
      summary,
      approvedBy,
      approvedAt,
      notes,
      behaviorLibraryEntries: [],
      phraseLibraryEntries: [],
      regressionTestCandidates: [],
      improvementProposals: [],
    };

    const analyzedRecords = [...store.analyzedRecords];
    analyzedRecords[index] = { ...record, status: "approved", notes: notes ?? record.notes };

    return {
      ...store,
      analyzedRecords,
      approvedLessons: [...store.approvedLessons, lesson],
      auditLog: appendAudit(store.auditLog, {
        recordId,
        action: "approved_for_cat_learning",
        timestamp: approvedAt,
        approvedBy,
        notes,
      }),
    };
  });

  return lesson;
}

export function rejectLearningRecord(
  recordId: string,
  approvedBy: string,
  notes?: string,
): AnalyzedConversationRecord | null {
  let updated: AnalyzedConversationRecord | null = null;

  updateLearningStore((store) => {
    const index = store.analyzedRecords.findIndex((record) => record.id === recordId);
    if (index === -1) return store;

    const record = store.analyzedRecords[index];
    updated = {
      ...record,
      status: "rejected",
      reviewedAt: record.reviewedAt ?? new Date().toISOString(),
      notes: notes ?? record.notes,
    };

    const analyzedRecords = [...store.analyzedRecords];
    analyzedRecords[index] = updated;

    return {
      ...store,
      analyzedRecords,
      auditLog: appendAudit(store.auditLog, {
        recordId,
        action: "rejected",
        timestamp: new Date().toISOString(),
        approvedBy,
        notes,
      }),
    };
  });

  return updated;
}

export function generateRegressionTestCandidate(
  lessonId: string,
): RegressionTestCandidate | null {
  let candidate: RegressionTestCandidate | null = null;

  updateLearningStore((store) => {
    const lessonIndex = store.approvedLessons.findIndex((lesson) => lesson.id === lessonId);
    if (lessonIndex === -1) return store;

    const lesson = store.approvedLessons[lessonIndex];
    const record = store.analyzedRecords.find((item) => item.id === lesson.analyzedRecordId);
    if (!record) return store;

    candidate = {
      id: createId("regression"),
      lessonId,
      title: `Regression: ${lesson.title}`,
      scenario: `Replay a ${record.industry ?? "business"} discovery where ${record.patterns[0] ?? "discovery"} appears.`,
      expectedBehavior:
        "Nordi stays direct, asks the next missing discovery question, and avoids incorrect solo-operator assumptions.",
      createdAt: new Date().toISOString(),
    };

    const approvedLessons = [...store.approvedLessons];
    approvedLessons[lessonIndex] = {
      ...lesson,
      regressionTestCandidates: [...lesson.regressionTestCandidates, candidate],
    };

    return {
      ...store,
      approvedLessons,
      auditLog: appendAudit(store.auditLog, {
        recordId: lesson.analyzedRecordId,
        action: "generated_regression_test_candidate",
        timestamp: candidate.createdAt,
        notes: candidate.id,
      }),
    };
  });

  return candidate;
}

export function createImprovementProposal(lessonId: string): ImprovementProposal | null {
  let proposal: ImprovementProposal | null = null;

  updateLearningStore((store) => {
    const lessonIndex = store.approvedLessons.findIndex((lesson) => lesson.id === lessonId);
    if (lessonIndex === -1) return store;

    const lesson = store.approvedLessons[lessonIndex];
    const record = store.analyzedRecords.find((item) => item.id === lesson.analyzedRecordId);

    proposal = {
      id: createId("proposal"),
      lessonId,
      title: `Improvement: ${lesson.title}`,
      description: lesson.summary,
      scope: record?.frictionThemes.join(", ") || "conversation quality",
      createdAt: new Date().toISOString(),
    };

    const approvedLessons = [...store.approvedLessons];
    approvedLessons[lessonIndex] = {
      ...lesson,
      improvementProposals: [...lesson.improvementProposals, proposal],
    };

    return {
      ...store,
      approvedLessons,
      auditLog: appendAudit(store.auditLog, {
        recordId: lesson.analyzedRecordId,
        action: "created_improvement_proposal",
        timestamp: proposal.createdAt,
        notes: proposal.id,
      }),
    };
  });

  return proposal;
}

export function promoteToEngineeringTask(
  lessonId: string,
  proposalId: string,
  promotedBy: string,
  notes?: string,
): EngineeringTaskDraft | null {
  let task: EngineeringTaskDraft | null = null;

  updateLearningStore((store) => {
    const lessonIndex = store.approvedLessons.findIndex((lesson) => lesson.id === lessonId);
    if (lessonIndex === -1) return store;

    const lesson = store.approvedLessons[lessonIndex];
    const proposalIndex = lesson.improvementProposals.findIndex(
      (proposal) => proposal.id === proposalId,
    );
    if (proposalIndex === -1) return store;

    const proposal = lesson.improvementProposals[proposalIndex];
    const promotedAt = new Date().toISOString();
    task = {
      id: createId("neo-task"),
      lessonId,
      proposalId,
      title: proposal.title,
      description: proposal.description,
      scope: proposal.scope,
      createdAt: promotedAt,
      promotedBy,
      status: "draft",
    };

    const updatedProposal: ImprovementProposal = {
      ...proposal,
      promotedAt,
      engineeringTaskRef: task.id,
    };

    const improvementProposals = [...lesson.improvementProposals];
    improvementProposals[proposalIndex] = updatedProposal;

    const recordIndex = store.analyzedRecords.findIndex(
      (record) => record.id === lesson.analyzedRecordId,
    );
    const analyzedRecords = [...store.analyzedRecords];
    if (recordIndex >= 0) {
      analyzedRecords[recordIndex] = {
        ...analyzedRecords[recordIndex],
        status: "promoted_to_task",
      };
    }

    const approvedLessons = [...store.approvedLessons];
    approvedLessons[lessonIndex] = {
      ...lesson,
      improvementProposals,
      promotedAt,
      engineeringTaskRef: task.id,
    };

    return {
      ...store,
      analyzedRecords,
      approvedLessons,
      engineeringTasks: [...store.engineeringTasks, task],
      auditLog: appendAudit(store.auditLog, {
        recordId: lesson.analyzedRecordId,
        action: "promoted_to_engineering_task",
        timestamp: promotedAt,
        approvedBy: promotedBy,
        notes: notes ?? task.id,
      }),
    };
  });

  return task;
}

export function populateLessonLibraries(lessonId: string): ApprovedLesson | null {
  let updatedLesson: ApprovedLesson | null = null;

  updateLearningStore((store) => {
    const lessonIndex = store.approvedLessons.findIndex((lesson) => lesson.id === lessonId);
    if (lessonIndex === -1) return store;

    const lesson = store.approvedLessons[lessonIndex];
    const record = store.analyzedRecords.find((item) => item.id === lesson.analyzedRecordId);
    if (!record) return store;

    const now = new Date().toISOString();
    const behaviorLibraryEntries =
      lesson.behaviorLibraryEntries.length > 0
        ? lesson.behaviorLibraryEntries
        : record.patterns.map((pattern) => ({
            id: createId("behavior"),
            lessonId,
            trigger: pattern,
            behavior: "Keep discovery direct and ask the next missing operational question.",
            createdAt: now,
          }));

    const phraseLibraryEntries =
      lesson.phraseLibraryEntries.length > 0
        ? lesson.phraseLibraryEntries
        : [
            {
              id: createId("phrase"),
              lessonId,
              context: "short factual team-size answer",
              phrase: "Ask the next discovery question without solo-operator reasoning.",
              createdAt: now,
            },
          ];

    updatedLesson = {
      ...lesson,
      behaviorLibraryEntries,
      phraseLibraryEntries,
    };

    const approvedLessons = [...store.approvedLessons];
    approvedLessons[lessonIndex] = updatedLesson;

    return {
      ...store,
      approvedLessons,
      auditLog: appendAudit(store.auditLog, {
        recordId: lesson.analyzedRecordId,
        action: "populated_lesson_libraries",
        timestamp: now,
      }),
    };
  });

  return updatedLesson;
}

export function listReviewableRecords(): AnalyzedConversationRecord[] {
  return readLearningStore().analyzedRecords.filter(
    (record) => record.status !== "rejected" && record.status !== "promoted_to_task",
  );
}

export function getApprovedLesson(lessonId: string): ApprovedLesson | null {
  return readLearningStore().approvedLessons.find((lesson) => lesson.id === lessonId) ?? null;
}
