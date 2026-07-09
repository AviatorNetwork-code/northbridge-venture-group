import type { ConversationTurnDecision, ConversationTurnInput } from "./types.js";

/**
 * Decide the next conversation turn action.
 * Delegates runtime work to cat-runtime / cat-orchestrator after decision.
 */
export function decideConversationTurn(
  input: ConversationTurnInput,
): ConversationTurnDecision {
  if (input.asyncInFlight) {
    return {
      action: "wait",
      reasoning: "Async operation in flight — hold turn until complete.",
    };
  }

  if (input.workflowComplete) {
    return {
      action: "finish_workflow",
      reasoning: "Workflow goal satisfied — summarize and close.",
    };
  }

  if (input.requiresConfirmation && !input.toolReady) {
    return {
      action: "confirm",
      reasoning: "Side effect pending — explicit user confirmation required.",
    };
  }

  if (input.hasPendingQuestions) {
    return {
      action: "ask",
      reasoning: "Required information missing — ask next progressive question.",
    };
  }

  if (input.toolReady) {
    return {
      action: "execute_tool",
      reasoning: "Tool path cleared — execute certified tool.",
    };
  }

  if (input.canAnswerDirectly) {
    return {
      action: "answer",
      reasoning: "Sufficient context — respond directly.",
    };
  }

  return {
    action: "ask",
    reasoning: "Insufficient context — clarify user intent.",
  };
}
