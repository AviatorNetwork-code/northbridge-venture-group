import type {
  ClassifiedMessageKind,
  ClassifyMessageKindInput,
  MessageKind,
  MessageKindClassifierConfig,
  MessageWorkspace,
} from "./types.js";

const PURE_GREETING_PATTERN =
  /^(hi+|hello+|hey+|howdy|good\s+(morning|afternoon|evening)|greetings|yo|sup)(\s+(there|cat))?$/i;

const HELP_PATTERNS: RegExp[] = [
  /^help$/i,
  /^what\s+can\s+you\s+do\??$/i,
  /^what\s+do\s+you\s+do\??$/i,
  /\bhow\s+can\s+you\s+help\b/i,
  /\bwhat\s+are\s+you\s+capable\b/i,
];

const ERROR_PATTERNS: RegExp[] = [
  /^error$/i,
  /\b(something\s+(is\s+)?wrong|not\s+working|broken|bug|crashed|keeps\s+failing)\b/i,
  /\bi\s+(got|see|have)\s+(an\s+)?error\b/i,
  /\bthat\s+didn'?t\s+work\b/i,
];

const DEFAULT_OPERATIONAL_INTENT_PATTERNS: RegExp[] = [
  /\bprepare\s+(a\s+)?draft\b/i,
  /\bhelp\s+me\s+draft\b/i,
  /\bcreate\s+(a\s+)?(?:request|listing|post)\b/i,
  /\b(update|edit)\s+my\s+(profile|pricing|availability)\b/i,
];

const QUESTION_SIGNAL_PATTERNS: RegExp[] = [
  /\?/,
  /\b(what|how|why|when|where|who|which|can you|could you|tell me|show me|find|search|look up|explain|describe|summarize|analyze)\b/i,
  /\bfind\s+me\b/i,
  /\bwhat\s+is\b/i,
  /\bhow\s+many\b/i,
  /\bshow\s+my\b/i,
];

function normalizeWorkspace(workspace?: MessageWorkspace): MessageWorkspace {
  return workspace ?? "unknown";
}

function isPureGreeting(message: string): boolean {
  const stripped = message.trim().replace(/[!?.]+$/g, "").trim();
  return PURE_GREETING_PATTERN.test(stripped);
}

function isHelpRequest(message: string): boolean {
  return HELP_PATTERNS.some((pattern) => pattern.test(message));
}

function isErrorReport(message: string): boolean {
  return ERROR_PATTERNS.some((pattern) => pattern.test(message));
}

function isOperationalIntent(
  message: string,
  workspace: MessageWorkspace,
  config?: MessageKindClassifierConfig,
): boolean {
  const patterns = [
    ...DEFAULT_OPERATIONAL_INTENT_PATTERNS,
    ...(config?.operationalIntentPatterns ?? []),
  ];
  if (patterns.some((pattern) => pattern.test(message))) {
    return true;
  }
  return config?.isOperationalIntent?.(message, workspace) ?? false;
}

function hasQuestionSignal(message: string): boolean {
  const trimmed = message.trim();
  if (/^[?!.]+$/.test(trimmed)) {
    return false;
  }
  return QUESTION_SIGNAL_PATTERNS.some((pattern) => pattern.test(message));
}

function looksLikeUnknown(message: string): boolean {
  const trimmed = message.trim();
  if (trimmed.length <= 2) return true;
  if (!/[a-zA-Z]{2,}/.test(trimmed)) return true;

  const words = trimmed.split(/\s+/);
  if (words.length <= 2 && !hasQuestionSignal(trimmed) && !isPureGreeting(trimmed)) {
    const vague = /^(hmm+|um+|uh+|idk|maybe|ok+|okay|sure|thanks|thank you)$/i;
    return vague.test(trimmed);
  }

  return false;
}

/**
 * Classifies simple conversation modes before tool selection or AI calls.
 */
export function classifyMessageKind(
  input: ClassifyMessageKindInput,
  config?: MessageKindClassifierConfig,
): ClassifiedMessageKind {
  const message = input.message.trim();
  const workspace = normalizeWorkspace(input.workspace);

  if (!message) {
    return {
      kind: "unknown",
      reasoning: "Empty message — ask for clarification.",
    };
  }

  if (isPureGreeting(message)) {
    return {
      kind: "greeting",
      reasoning: "Pure greeting without operational content.",
    };
  }

  if (isHelpRequest(message)) {
    return {
      kind: "help",
      reasoning: "Explicit help or capability question.",
    };
  }

  if (isErrorReport(message)) {
    return {
      kind: "error",
      reasoning: "User reported a problem or error.",
    };
  }

  if (isOperationalIntent(message, workspace, config)) {
    return {
      kind: "intent",
      reasoning: "Operational draft or action request — route to existing intent tooling.",
    };
  }

  if (hasQuestionSignal(message)) {
    return {
      kind: "question",
      reasoning: "Question or lookup — route to existing tool/general path.",
    };
  }

  if (looksLikeUnknown(message)) {
    return {
      kind: "unknown",
      reasoning: "Message too vague or unclear for routing.",
    };
  }

  return {
    kind: "unknown",
    reasoning: "No clear greeting, help, error, intent, or question signal.",
  };
}

export function shouldHandleMessageKindDeterministically(kind: MessageKind): boolean {
  return kind === "greeting" || kind === "help" || kind === "error" || kind === "unknown";
}
