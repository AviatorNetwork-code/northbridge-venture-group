import type {
  MessageKind,
  MessageKindResponse,
  MessageKindResponseConfig,
  MessageWorkspace,
} from "./types.js";

const DEFAULT_ANSWERS: Record<MessageKind, string> = {
  greeting: "What would you like to work on today?",
  help: "Pick a topic to get started:",
  error: "Sorry about that — let's try a different path.",
  unknown: "What would you like to work on? Tell me a bit more, or pick an option below.",
  question: "What would you like to work on today?",
  intent: "What would you like to work on today?",
};

function answerForKind(
  kind: MessageKind,
  config?: MessageKindResponseConfig,
): string {
  return config?.answers?.[kind] ?? DEFAULT_ANSWERS[kind] ?? DEFAULT_ANSWERS.greeting;
}

function chipsForKind(
  kind: MessageKind,
  workspace: MessageWorkspace,
  config?: MessageKindResponseConfig,
): import("./types.js").FollowUpChip[] {
  const fromConfig = config?.chipsByKind?.[kind];
  if (fromConfig) {
    return fromConfig(workspace);
  }
  return config?.defaultChips?.(workspace) ?? [];
}

export function buildMessageKindResponse(
  kind: MessageKind,
  workspace: MessageWorkspace = "unknown",
  config?: MessageKindResponseConfig,
): MessageKindResponse {
  return {
    answer: answerForKind(kind, config),
    followUpChips: chipsForKind(kind, workspace, config),
  };
}
