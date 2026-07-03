import type { JourneyEvent } from "../types/journey.js";
import type { OutcomeAssessment, OutcomeClassification } from "../types/outcome.js";
import type { VisitorIntentAdapter } from "../types/adapter.js";

export function classifyOutcome(
  events: JourneyEvent[],
  adapter: VisitorIntentAdapter,
  context: import("../types/adapter.js").AdapterContext,
  completedObjectives: string[],
): OutcomeAssessment {
  const hints = adapter.classifyOutcomeHints?.(context) ?? {};

  const classification = inferClassification(events, completedObjectives, hints.classification);
  const nextBestActionTaken = events.some(
    (e) =>
      e.type === "cat_cta_clicked" ||
      e.type === "form_submit" ||
      e.type === "objective_completed",
  );

  const objectiveAchieved =
    hints.objectiveAchieved ??
    (completedObjectives.length > 0 || classification === "completed_objective");

  const successScore = computeSuccessScore(classification, nextBestActionTaken, objectiveAchieved);

  const partialCompletionReasons: string[] = [];
  if (classification === "partially_completed") {
    if (completedObjectives.length === 0) {
      partialCompletionReasons.push("Engaged but no objective marked complete");
    }
    if (!nextBestActionTaken) {
      partialCompletionReasons.push("No next-best-action taken");
    }
  }

  const summary = buildOutcomeSummary(classification, objectiveAchieved);

  return {
    classification,
    successScore,
    objectiveAchieved,
    partialCompletionReasons,
    nextBestActionTaken,
    summary,
    ...hints,
  };
}

function inferClassification(
  events: JourneyEvent[],
  completedObjectives: string[],
  hint?: OutcomeClassification,
): OutcomeClassification {
  if (hint) return hint;

  const hasContact = events.some(
    (e) =>
      e.type === "form_submit" ||
      (e.type === "cat_cta_clicked" && String(e.metadata?.cta_id).includes("contact")),
  );
  const hasDemo = events.some(
    (e) => e.type === "cat_cta_clicked" && String(e.metadata?.cta_id).includes("demo"),
  );
  const hasMarketplace = events.some(
    (e) => e.type === "navigation" && String(e.path).includes("marketplace"),
  );
  const hasOnboarding = events.some(
    (e) => e.type === "navigation" && String(e.path).includes("onboard"),
  );

  if (completedObjectives.length > 0) return "completed_objective";
  if (hasContact) return "requested_contact";
  if (hasDemo) return "requested_demo";
  if (hasMarketplace) return "entered_marketplace";
  if (hasOnboarding) return "started_onboarding";

  const catOpens = events.filter((e) => e.type === "cat_opened").length;
  const catMessages = events.filter((e) => e.type === "cat_message").length;

  if (catMessages >= 3 && completedObjectives.length === 0) return "more_engaged";
  if (catOpens > 0 && catMessages === 0) return "abandoned";
  if (events.length >= 2 && completedObjectives.length === 0) return "partially_completed";

  return "partially_completed";
}

function computeSuccessScore(
  classification: OutcomeClassification,
  nextBestActionTaken: boolean,
  objectiveAchieved: boolean,
): number {
  const baseScores: Record<OutcomeClassification, number> = {
    completed_objective: 1,
    requested_contact: 0.85,
    requested_demo: 0.85,
    entered_marketplace: 0.8,
    started_onboarding: 0.8,
    scheduled_training: 0.8,
    returned_later: 0.6,
    more_engaged: 0.55,
    partially_completed: 0.4,
    abandoned: 0.15,
  };

  let score = baseScores[classification];
  if (objectiveAchieved) score = Math.max(score, 0.9);
  if (nextBestActionTaken) score += 0.05;
  return Math.min(1, score);
}

function buildOutcomeSummary(
  classification: OutcomeClassification,
  objectiveAchieved: boolean,
): string {
  if (objectiveAchieved) return "Visitor achieved their primary objective.";
  return `Outcome classified as ${classification.replace(/_/g, " ")}.`;
}
