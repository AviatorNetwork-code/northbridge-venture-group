export type ThinkingContext =
  | "general"
  | "reviewing-business"
  | "analyzing-shared"
  | "comparing"
  | "website"
  | "preparing";

export type ThinkingPhase = {
  label: string;
  durationMs: number;
};

const THINKING_LABELS: Record<ThinkingContext, string[]> = {
  general: ["Thinking...", "One moment..."],
  "reviewing-business": ["Reviewing your business...", "Taking this in..."],
  "analyzing-shared": ["Analyzing what you've shared...", "Processing that..."],
  comparing: ["Comparing this with similar businesses...", "Looking for patterns..."],
  website: ["Reviewing your website...", "Scanning your public site..."],
  preparing: ["Preparing observations...", "Putting this together..."],
};

function hashSeed(parts: (string | number)[]): number {
  const raw = parts.join(":");
  let hash = 0;
  for (let index = 0; index < raw.length; index += 1) {
    hash = (hash * 31 + raw.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function durationFromSeed(seed: number, offset: number): number {
  const bucket = (seed + offset * 97) % 9;
  return 300 + bucket * 100;
}

export function buildThinkingPhases(
  context: ThinkingContext,
  sessionId: string,
  messageIndex: number,
): ThinkingPhase[] {
  const seed = hashSeed([sessionId, messageIndex, context]);
  const labels = THINKING_LABELS[context];
  const primary = labels[seed % labels.length];

  const useSecondary = seed % 4 === 0 && context !== "general";
  if (!useSecondary) {
    return [{ label: primary, durationMs: durationFromSeed(seed, 0) }];
  }

  const secondary = THINKING_LABELS.general[seed % THINKING_LABELS.general.length];
  return [
    { label: primary, durationMs: durationFromSeed(seed, 1) },
    { label: secondary, durationMs: durationFromSeed(seed, 2) },
  ];
}

export function briefPauseMs(sessionId: string, messageIndex: number, step: number): number {
  const seed = hashSeed([sessionId, messageIndex, "pause", step]);
  return 250 + (seed % 4) * 50;
}

export function typingSpeedForMessage(messageId: string, base = 16): number {
  let hash = 0;
  for (let index = 0; index < messageId.length; index += 1) {
    hash = (hash * 31 + messageId.charCodeAt(index)) >>> 0;
  }
  return base - 4 + (hash % 9);
}

export function typingPauseForChar(char: string, messageId: string, index: number): number {
  if (!/[.!?]/.test(char)) return 0;
  let hash = 0;
  const key = `${messageId}:${index}`;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 17 + key.charCodeAt(i)) >>> 0;
  }
  return 80 + (hash % 120);
}
