import type { BusinessCorrelation, BusinessCorrelationSummary, BusinessSignal } from "../types/business.js";
import type { IntentInference } from "../types/intent.js";
import type { OutcomeAssessment } from "../types/outcome.js";

export function correlateBusinessSignals(
  intent: IntentInference,
  signals: BusinessSignal[],
  outcome: OutcomeAssessment,
): BusinessCorrelation | undefined {
  if (signals.length === 0 && !outcome.nextBestActionTaken) {
    return undefined;
  }

  const leadGenerated = signals.some((s) => s.type === "lead_generated");
  const activated = signals.some((s) => s.type === "activation");
  const converted = signals.some(
    (s) => s.type === "conversion" || s.type === "subscription",
  );

  const valueFromSignals = signals.reduce((sum, s) => sum + (s.value ?? 0), 0);
  const outcomeBonus = outcome.objectiveAchieved ? 25 : outcome.successScore * 15;
  const estimatedValueScore = Math.min(100, valueFromSignals + outcomeBonus);

  let retentionIndicator: BusinessCorrelation["retentionIndicator"] = "neutral";
  if (converted || activated) retentionIndicator = "positive";
  if (outcome.classification === "abandoned") retentionIndicator = "negative";

  const summary = buildSummary(intent.primaryIntent.id, leadGenerated, converted, activated);

  return {
    intentId: intent.primaryIntent.id,
    signals,
    estimatedValueScore,
    leadGenerated,
    activated,
    converted,
    retentionIndicator,
    summary,
  };
}

function buildSummary(
  intentId: string,
  lead: boolean,
  converted: boolean,
  activated: boolean,
): string {
  const parts = [`Intent: ${intentId}`];
  if (converted) parts.push("converted");
  else if (lead) parts.push("lead generated");
  else if (activated) parts.push("activated");
  else parts.push("no business signal yet");
  return parts.join(" · ");
}

export function summarizeBusinessCorrelations(
  correlations: BusinessCorrelation[],
): import("../types/business.js").BusinessCorrelationSummary {
  const byIntent: BusinessCorrelationSummary["byIntent"] = {};

  for (const item of correlations) {
    const current = byIntent[item.intentId] ?? {
      sessionCount: 0,
      leadCount: 0,
      conversionCount: 0,
      averageValueScore: 0,
    };

    current.sessionCount += 1;
    if (item.leadGenerated) current.leadCount += 1;
    if (item.converted) current.conversionCount += 1;
    current.averageValueScore =
      (current.averageValueScore * (current.sessionCount - 1) + item.estimatedValueScore) /
      current.sessionCount;

    byIntent[item.intentId] = current;
  }

  const highestValueIntentId = Object.entries(byIntent).sort(
    (a, b) => b[1].averageValueScore - a[1].averageValueScore,
  )[0]?.[0];

  return { byIntent, highestValueIntentId };
}
