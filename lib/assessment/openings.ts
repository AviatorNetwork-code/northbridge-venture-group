import {
  MAIN_NEED_OPTIONS,
  PAIN_POINT_OPTIONS,
  labelForValue,
  type AssessmentPayload,
} from "./schema";

export function buildSuggestedCallOpening(payload: AssessmentPayload): string {
  const company = payload.company || "your company";
  const needLabel = labelForValue(MAIN_NEED_OPTIONS, payload.mainNeed);
  const primaryPain =
    payload.painPoints.length > 0
      ? labelForValue(PAIN_POINT_OPTIONS, payload.painPoints[0]).toLowerCase()
      : needLabel.toLowerCase();

  return `Hi ${payload.name}, I reviewed your assessment. It looks like ${company} is mainly dealing with ${primaryPain}. I'd like to understand how that currently works and where the biggest delay or lost opportunity happens.`;
}
