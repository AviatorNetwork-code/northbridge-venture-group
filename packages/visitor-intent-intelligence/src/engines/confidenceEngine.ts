import type { ConfidenceAssessment, ConfidenceSignal } from "../types/confidence.js";
import type { JourneyEvent } from "../types/journey.js";

const FRICTION_TYPES = new Set(["friction", "cat_closed"]);
const POSITIVE_TYPES = new Set(["objective_completed", "cat_cta_clicked", "form_submit"]);

export function assessConfidence(
  events: JourneyEvent[],
  intentConfidence: number,
): ConfidenceAssessment {
  const signals: ConfidenceSignal[] = [];
  let score = intentConfidence;

  const catMessages = events.filter((e) => e.type === "cat_message");
  const catOpens = events.filter((e) => e.type === "cat_opened").length;
  const catCloses = events.filter((e) => e.type === "cat_closed").length;

  if (catOpens > 0 && catCloses >= catOpens && catMessages.length < 2) {
    signals.push({
      type: "disengagement",
      score: 0.7,
      timestamp: events.at(-1)?.timestamp ?? Date.now(),
      trigger: "cat_closed_early",
      evidence: "CAT opened but closed with minimal interaction",
    });
    score -= 0.15;
  }

  const frictionEvents = events.filter((e) => FRICTION_TYPES.has(e.type));
  for (const event of frictionEvents) {
    signals.push({
      type: "frustration",
      score: 0.6,
      timestamp: event.timestamp,
      trigger: event.type,
      evidence: event.label,
    });
    score -= 0.1;
  }

  const positiveEvents = events.filter((e) => POSITIVE_TYPES.has(e.type));
  for (const event of positiveEvents) {
    signals.push({
      type: "increasing_confidence",
      score: 0.8,
      timestamp: event.timestamp,
      trigger: event.type,
      evidence: event.label,
    });
    score += 0.12;
  }

  const repeatedPaths = findRepeatedPaths(events);
  if (repeatedPaths.length > 0) {
    signals.push({
      type: "hesitation",
      score: 0.55,
      timestamp: events.at(-1)?.timestamp ?? Date.now(),
      trigger: "repeated_navigation",
      evidence: repeatedPaths.join(", "),
    });
    score -= 0.08;
  }

  if (catMessages.length >= 4) {
    signals.push({
      type: "uncertainty",
      score: 0.5,
      timestamp: catMessages.at(-1)?.timestamp ?? Date.now(),
      trigger: "extended_cat_conversation",
      evidence: `${catMessages.length} CAT messages exchanged`,
    });
  }

  const completed = events.some((e) => e.type === "objective_completed");
  if (completed) {
    signals.push({
      type: "successful_completion",
      score: 0.95,
      timestamp: events.at(-1)?.timestamp ?? Date.now(),
      trigger: "objective_completed",
    });
    score = Math.max(score, 0.85);
  }

  score = clamp(score, 0, 1);

  const rising = signals.filter((s) => s.type === "increasing_confidence" || s.type === "successful_completion").length;
  const falling = signals.filter((s) =>
    ["frustration", "disengagement", "confusion"].includes(s.type),
  ).length;

  const trend: ConfidenceAssessment["trend"] =
    rising > falling ? "rising" : falling > rising ? "falling" : "stable";

  const dominantSignal = signals.sort((a, b) => b.score - a.score)[0]?.type;

  return {
    currentScore: score,
    trend,
    signals,
    dominantSignal,
  };
}

function findRepeatedPaths(events: JourneyEvent[]): string[] {
  const pathCounts = new Map<string, number>();
  for (const event of events) {
    if (event.path) {
      pathCounts.set(event.path, (pathCounts.get(event.path) ?? 0) + 1);
    }
  }
  return [...pathCounts.entries()]
    .filter(([, count]) => count >= 2)
    .map(([path]) => path);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
