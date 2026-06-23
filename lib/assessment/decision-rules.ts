import {
  AUTHORITY_OPTIONS,
  BUDGET_OPTIONS,
  CURRENT_SYSTEMS_OPTIONS,
  EMPLOYEE_OPTIONS,
  SYSTEMS_GAP_VALUES,
  TIMELINE_OPTIONS,
  labelForValue,
  type AssessmentPayload,
  type LeadCategory,
} from "./schema";
import { createEvidence, sumEvidencePoints, type ScoringEvidence } from "./evidence";

export const SCORING_RULE_IDS = {
  BUDGET: "SCORE_BUDGET",
  AUTHORITY: "SCORE_AUTHORITY",
  TIMELINE: "SCORE_TIMELINE",
  EMPLOYEES: "SCORE_EMPLOYEES",
  PAIN_AT_LEAST_ONE: "SCORE_PAIN_AT_LEAST_ONE",
  PAIN_THREE_OR_MORE: "SCORE_PAIN_THREE_OR_MORE",
  SYSTEMS_GAP: "SCORE_SYSTEMS_GAP",
} as const;

export const CATEGORY_RULE_IDS = {
  HOT: "CATEGORY_HOT_LEAD",
  QUALIFIED: "CATEGORY_QUALIFIED_LEAD",
  NURTURE: "CATEGORY_NURTURE_LEAD",
  LOW_FIT: "CATEGORY_LOW_FIT",
} as const;

const CATEGORY_THRESHOLDS = {
  hot: 80,
  qualified: 55,
  nurture: 30,
} as const;

export function applyScoringRules(payload: AssessmentPayload): ScoringEvidence[] {
  const evidence: ScoringEvidence[] = [];

  const budgetOption = BUDGET_OPTIONS.find((o) => o.value === payload.budget);
  if (budgetOption) {
    evidence.push(
      createEvidence(
        SCORING_RULE_IDS.BUDGET,
        "budget",
        payload.budget,
        budgetOption.label,
        budgetOption.score,
        `Budget range "${budgetOption.label}" maps to ${budgetOption.score} points.`
      )
    );
  }

  const authorityOption = AUTHORITY_OPTIONS.find((o) => o.value === payload.authority);
  if (authorityOption) {
    evidence.push(
      createEvidence(
        SCORING_RULE_IDS.AUTHORITY,
        "authority",
        payload.authority,
        authorityOption.label,
        authorityOption.score,
        `Decision authority "${authorityOption.label}" maps to ${authorityOption.score} points.`
      )
    );
  }

  const timelineOption = TIMELINE_OPTIONS.find((o) => o.value === payload.timeline);
  if (timelineOption) {
    evidence.push(
      createEvidence(
        SCORING_RULE_IDS.TIMELINE,
        "timeline",
        payload.timeline,
        timelineOption.label,
        timelineOption.score,
        `Timeline "${timelineOption.label}" maps to ${timelineOption.score} points.`
      )
    );
  }

  const employeeOption = EMPLOYEE_OPTIONS.find((o) => o.value === payload.employees);
  if (employeeOption) {
    evidence.push(
      createEvidence(
        SCORING_RULE_IDS.EMPLOYEES,
        "employees",
        payload.employees,
        employeeOption.label,
        employeeOption.score,
        `Team size "${employeeOption.label}" maps to ${employeeOption.score} points.`
      )
    );
  }

  const painCount = payload.painPoints.length;
  if (painCount >= 1) {
    evidence.push(
      createEvidence(
        SCORING_RULE_IDS.PAIN_AT_LEAST_ONE,
        "painPoints",
        payload.painPoints,
        painCount,
        15,
        `At least one pain point selected (${painCount} total) awards 15 points.`
      )
    );
  }

  if (painCount >= 3) {
    evidence.push(
      createEvidence(
        SCORING_RULE_IDS.PAIN_THREE_OR_MORE,
        "painPoints",
        payload.painPoints,
        painCount,
        10,
        `Three or more pain points selected (${painCount} total) awards an additional 10 points.`
      )
    );
  }

  const matchingGaps = payload.currentSystems.filter((system) => SYSTEMS_GAP_VALUES.has(system));
  if (matchingGaps.length > 0) {
    const gapLabels = matchingGaps.map((value) =>
      labelForValue(CURRENT_SYSTEMS_OPTIONS, value)
    );
    evidence.push(
      createEvidence(
        SCORING_RULE_IDS.SYSTEMS_GAP,
        "currentSystems",
        payload.currentSystems,
        gapLabels.join(", "),
        10,
        `Systems gap detected (${gapLabels.join(", ")}) awards 10 points.`
      )
    );
  }

  return evidence;
}

export function calculateLeadScore(payload: AssessmentPayload): number {
  return sumEvidencePoints(applyScoringRules(payload));
}

export function getLeadCategory(score: number): LeadCategory {
  if (score >= CATEGORY_THRESHOLDS.hot) return "Hot Lead";
  if (score >= CATEGORY_THRESHOLDS.qualified) return "Qualified Lead";
  if (score >= CATEGORY_THRESHOLDS.nurture) return "Nurture Lead";
  return "Low Fit";
}

export function isQualifiedLead(category: LeadCategory): boolean {
  return category === "Hot Lead" || category === "Qualified Lead";
}
