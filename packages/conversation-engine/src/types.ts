export const CONVERSATION_TURN_ACTIONS = [
  "answer",
  "ask",
  "confirm",
  "execute_tool",
  "wait",
  "finish_workflow",
] as const;

export type ConversationTurnAction = (typeof CONVERSATION_TURN_ACTIONS)[number];

export type ConversationTurnInput = {
  message: string;
  hasPendingQuestions: boolean;
  requiresConfirmation: boolean;
  toolReady: boolean;
  asyncInFlight: boolean;
  workflowComplete: boolean;
  canAnswerDirectly: boolean;
};

export type ConversationTurnDecision = {
  action: ConversationTurnAction;
  reasoning: string;
};
