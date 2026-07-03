import type {
  FrictionEvent,
  JourneyEvent,
  JourneyUnderstanding,
} from "../types/journey.js";

export function buildJourneyUnderstanding(
  events: JourneyEvent[],
  adapterFriction: FrictionEvent[] = [],
  completedObjectives: string[] = [],
): JourneyUnderstanding {
  const sorted = [...events].sort((a, b) => a.timestamp - b.timestamp);
  const entry = sorted.find((e) => e.type === "entry" || e.type === "page_view");
  const pageViews = sorted.filter((e) => e.type === "page_view" || e.type === "navigation");

  const navigationSequence = pageViews
    .map((e) => e.path)
    .filter((path): path is string => Boolean(path));

  const discoveryPath = [...new Set(navigationSequence)];

  const catInteractionCount = sorted.filter(
    (e) =>
      e.type === "cat_opened" ||
      e.type === "cat_message" ||
      e.type === "cat_cta_clicked" ||
      e.type === "cat_closed",
  ).length;

  const firstCatMessage = sorted.find((e) => e.type === "cat_message");
  const firstObjective = sorted.find((e) => e.type === "objective_completed");

  const startedAt = sorted[0]?.timestamp;
  const timeToUnderstandingMs =
    startedAt && firstCatMessage
      ? firstCatMessage.timestamp - startedAt
      : undefined;

  const timeToValueMs =
    startedAt && firstObjective
      ? firstObjective.timestamp - startedAt
      : undefined;

  const abandonedPages = detectAbandonedPages(navigationSequence);
  const unansweredQuestions = extractUnansweredQuestions(sorted);
  const decisionPoints = sorted
    .filter((e) => e.type === "decision_point" || e.type === "cat_cta_clicked")
    .map((e) => e.label ?? e.path ?? e.type);

  const frictionEvents = [
    ...adapterFriction,
    ...detectCoreFriction(sorted),
  ];

  return {
    entryPoint: entry?.path,
    discoveryPath,
    catInteractionCount,
    navigationSequence,
    timeToUnderstandingMs,
    timeToValueMs,
    abandonedPages,
    completedObjectives,
    unansweredQuestions,
    decisionPoints,
    frictionEvents,
  };
}

function detectAbandonedPages(sequence: string[]): string[] {
  if (sequence.length < 2) return [];
  const last = sequence.at(-1);
  const repeats = sequence.filter((p) => p === last).length;
  return repeats >= 2 && last ? [last] : [];
}

function extractUnansweredQuestions(events: JourneyEvent[]): string[] {
  const questions: string[] = [];
  for (const event of events) {
    if (event.type === "cat_message" && event.metadata?.role === "visitor") {
      const content = String(event.metadata.content ?? event.label ?? "");
      if (content.includes("?")) {
        questions.push(content);
      }
    }
  }
  return questions;
}

function detectCoreFriction(events: JourneyEvent[]): FrictionEvent[] {
  const friction: FrictionEvent[] = [];

  for (let i = 1; i < events.length; i++) {
    const prev = events[i - 1];
    const curr = events[i];
    if (
      prev?.path &&
      curr?.path &&
      prev.path === curr.path &&
      curr.timestamp - prev.timestamp > 60_000
    ) {
      friction.push({
        timestamp: curr.timestamp,
        type: "long_dwell_no_action",
        path: curr.path,
        description: "Extended dwell without progression",
      });
    }
  }

  const fallbackCount = events.filter(
    (e) => e.type === "cat_message" && e.metadata?.matchedTopic === undefined,
  ).length;

  if (fallbackCount > 0) {
    friction.push({
      timestamp: events.at(-1)?.timestamp ?? Date.now(),
      type: "cat_fallback",
      description: `${fallbackCount} CAT response(s) without topic match`,
    });
  }

  return friction;
}
