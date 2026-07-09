import type { DiscoveryEngineResult, DiscoveryProfile, WebsiteAnalysisResult } from "@/lib/cat/discovery-types";
import type { NordiMessageCard } from "@/lib/nordi/cards";
import { buildWebsiteInsightNarrative } from "@/lib/nordi/consultant-voice";
import { briefPauseMs, buildThinkingPhases, type ThinkingContext } from "@/lib/nordi/thinking-states";

export type PresenterStep =
  | { type: "think"; label: string; durationMs: number }
  | { type: "message"; content: string; animate: boolean; card?: NordiMessageCard };

export type PresenterInput = {
  result: DiscoveryEngineResult;
  sessionId: string;
  messageIndex: number;
  forceProgressive?: boolean;
};

function splitReply(reply: string): string[] {
  const paragraphs = reply
    .split(/\n\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (paragraphs.length <= 2) return [reply.trim()];
  if (paragraphs.length > 4) {
    return [paragraphs.slice(0, 2).join("\n\n"), paragraphs.slice(2).join("\n\n")];
  }
  return paragraphs;
}

function shouldAutoProgressive(reply: string, messageIndex: number): boolean {
  if (reply.length < 180) return false;
  return reply.includes("\n\n") && messageIndex % 2 === 0;
}

export function buildPresenterSequence(input: PresenterInput): PresenterStep[] {
  const { result, sessionId, messageIndex } = input;
  const steps: PresenterStep[] = [];
  const context = (result.thinkingContext ?? "general") as ThinkingContext;

  if (result.thinkingContext) {
    for (const phase of buildThinkingPhases(context, sessionId, messageIndex)) {
      steps.push({ type: "think", label: phase.label, durationMs: phase.durationMs });
    }
  }

  const segments = (
    result.progressiveReply ??
    (shouldAutoProgressive(result.reply, messageIndex) || input.forceProgressive
      ? splitReply(result.reply)
      : [result.reply])
  ).filter((segment) => segment.length > 0);

  segments.forEach((segment, index) => {
    if (index > 0) {
      steps.push({
        type: "think",
        label: "Thinking...",
        durationMs: briefPauseMs(sessionId, messageIndex, index),
      });
    }

    const card = index === segments.length - 1 ? result.cards?.[0] : undefined;
    steps.push({
      type: "message",
      content: segment,
      animate: true,
      card,
    });
  });

  if (result.cards && result.cards.length > 1) {
    for (const card of result.cards.slice(1)) {
      steps.push({
        type: "think",
        label: "Preparing observations...",
        durationMs: briefPauseMs(sessionId, messageIndex, segments.length + 1),
      });
      steps.push({ type: "message", content: "", animate: false, card });
    }
  }

  return steps;
}

export function buildSimpleSequence(
  content: string,
  options?: {
    thinkingContext?: ThinkingContext;
    sessionId?: string;
    messageIndex?: number;
    animate?: boolean;
    card?: NordiMessageCard;
  },
): PresenterStep[] {
  const steps: PresenterStep[] = [];

  if (options?.thinkingContext && options.sessionId !== undefined && options.messageIndex !== undefined) {
    for (const phase of buildThinkingPhases(options.thinkingContext, options.sessionId, options.messageIndex)) {
      steps.push({ type: "think", label: phase.label, durationMs: phase.durationMs });
    }
  }

  steps.push({
    type: "message",
    content,
    animate: options?.animate ?? true,
    card: options?.card,
  });

  return steps;
}

export function buildWebsiteAnalysisSequence(
  analysis: WebsiteAnalysisResult,
  profile: DiscoveryProfile,
  sessionId: string,
  messageIndex: number,
): PresenterStep[] {
  const steps: PresenterStep[] = [];

  for (const phase of buildThinkingPhases("website", sessionId, messageIndex)) {
    steps.push({ type: "think", label: phase.label, durationMs: phase.durationMs });
  }

  const narrative = buildWebsiteInsightNarrative(analysis, profile);

  narrative.forEach((paragraph, index) => {
    if (index > 0) {
      steps.push({
        type: "think",
        label: "Thinking...",
        durationMs: briefPauseMs(sessionId, messageIndex, index),
      });
    }

    steps.push({
      type: "message",
      content: paragraph,
      animate: true,
    });
  });

  return steps;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export async function deliverPresenterSequence(
  steps: PresenterStep[],
  handlers: {
    onThink: (label: string) => void;
    onThinkEnd: () => void;
    onMessage: (content: string, animate: boolean, card?: NordiMessageCard) => Promise<void>;
  },
): Promise<void> {
  for (const step of steps) {
    if (step.type === "think") {
      handlers.onThink(step.label);
      await sleep(step.durationMs);
      handlers.onThinkEnd();
      continue;
    }

    await handlers.onMessage(step.content, step.animate, step.card);
  }
}
