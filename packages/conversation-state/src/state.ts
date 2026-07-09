import type {
  ConversationGoal,
  ConversationState,
  ConversationStatePatch,
  PendingQuestion,
  WorkflowProgress,
} from "./types.js";

export function createConversationState(sessionId: string): ConversationState {
  return {
    sessionId,
    goal: null,
    workflow: null,
    pendingQuestions: [],
    temporaryMemory: {},
    resumeToken: null,
    updatedAt: new Date().toISOString(),
  };
}

export function applyStatePatch(
  state: ConversationState,
  patch: ConversationStatePatch,
): ConversationState {
  return {
    ...state,
    goal: patch.goal !== undefined ? patch.goal : state.goal,
    workflow: patch.workflow !== undefined ? patch.workflow : state.workflow,
    pendingQuestions:
      patch.pendingQuestions !== undefined
        ? patch.pendingQuestions
        : state.pendingQuestions,
    temporaryMemory: {
      ...state.temporaryMemory,
      ...(patch.temporaryMemory ?? {}),
    },
    resumeToken:
      patch.resumeToken !== undefined ? patch.resumeToken : state.resumeToken,
    updatedAt: new Date().toISOString(),
  };
}

export function setConversationGoal(
  state: ConversationState,
  goal: ConversationGoal,
): ConversationState {
  return applyStatePatch(state, { goal });
}

export function setWorkflowProgress(
  state: ConversationState,
  workflow: WorkflowProgress,
): ConversationState {
  return applyStatePatch(state, { workflow });
}

export function enqueuePendingQuestion(
  state: ConversationState,
  question: PendingQuestion,
): ConversationState {
  const exists = state.pendingQuestions.some((q) => q.fieldId === question.fieldId);
  if (exists) return state;
  return applyStatePatch(state, {
    pendingQuestions: [...state.pendingQuestions, question],
  });
}

export function dequeuePendingQuestion(
  state: ConversationState,
  fieldId: string,
): ConversationState {
  return applyStatePatch(state, {
    pendingQuestions: state.pendingQuestions.filter((q) => q.fieldId !== fieldId),
  });
}

export function resumeConversation(
  state: ConversationState,
  resumeToken: string,
): { ok: true; state: ConversationState } | { ok: false; reason: string } {
  if (!state.resumeToken || state.resumeToken !== resumeToken) {
    return { ok: false, reason: "Invalid or expired resume token" };
  }
  return { ok: true, state };
}

export function issueResumeToken(state: ConversationState): ConversationState {
  const token = `resume_${state.sessionId}_${Date.now()}`;
  return applyStatePatch(state, { resumeToken: token });
}
