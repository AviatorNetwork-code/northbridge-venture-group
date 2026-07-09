export type WorkflowStepStatus = "pending" | "in_progress" | "completed" | "skipped";

export type ConversationGoal = {
  id: string;
  label: string;
  startedAt: string;
};

export type WorkflowProgress = {
  workflowId: string;
  currentStepId: string | null;
  completedStepIds: readonly string[];
};

export type PendingQuestion = {
  fieldId: string;
  prompt: string;
  required: boolean;
};

export type ConversationState = {
  sessionId: string;
  goal: ConversationGoal | null;
  workflow: WorkflowProgress | null;
  pendingQuestions: readonly PendingQuestion[];
  temporaryMemory: Record<string, unknown>;
  resumeToken: string | null;
  updatedAt: string;
};

export type ConversationStatePatch = {
  goal?: ConversationGoal | null;
  workflow?: WorkflowProgress | null;
  pendingQuestions?: readonly PendingQuestion[];
  temporaryMemory?: Record<string, unknown>;
  resumeToken?: string | null;
};
