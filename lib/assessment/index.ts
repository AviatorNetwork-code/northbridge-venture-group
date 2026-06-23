import { applyScoringRules, calculateLeadScore, getLeadCategory, isQualifiedLead } from "./decision-rules";
import { buildSuggestedCallOpening } from "./openings";
import { parseAssessmentPayload, validateAssessmentPayload } from "./normalize";
import { recommendSolution, getRecommendedSolution } from "./recommend";
import type { ScoringEvidence } from "./evidence";
import type {
  AssessmentPayload,
  DigitalAssessmentPayload,
  LeadCategory,
  RecommendedSolution,
} from "./schema";

export type AssessmentDecision = {
  totalScore: number;
  category: LeadCategory;
  recommendation: RecommendedSolution;
  suggestedCallOpening: string;
  evidence: ScoringEvidence[];
};

export function evaluateAssessment(payload: AssessmentPayload): AssessmentDecision {
  const evidence = applyScoringRules(payload);
  const totalScore = evidence.reduce((sum, item) => sum + item.points, 0);
  const category = getLeadCategory(totalScore);
  const recommendation = recommendSolution(payload);
  const suggestedCallOpening = buildSuggestedCallOpening(payload);

  return {
    totalScore,
    category,
    recommendation,
    suggestedCallOpening,
    evidence,
  };
}

export {
  applyScoringRules,
  buildSuggestedCallOpening,
  calculateLeadScore,
  getLeadCategory,
  getRecommendedSolution,
  isQualifiedLead,
  parseAssessmentPayload,
  recommendSolution,
  validateAssessmentPayload,
};

export type { AssessmentPayload, DigitalAssessmentPayload, LeadCategory, RecommendedSolution, ScoringEvidence };

export {
  AUTHORITY_OPTIONS,
  BUDGET_OPTIONS,
  BUSINESS_STAGE_OPTIONS,
  CURRENT_SYSTEMS_OPTIONS,
  EMPLOYEE_OPTIONS,
  FIELD_LIMITS,
  MAIN_NEED_OPTIONS,
  PAIN_POINT_OPTIONS,
  TIMELINE_OPTIONS,
  labelForValue,
} from "./schema";

export type {
  AuthorityValue,
  BudgetValue,
  BusinessStageValue,
  CurrentSystemValue,
  EmployeeValue,
  MainNeedValue,
  PainPointValue,
  TimelineValue,
} from "./schema";

export { SCORING_RULE_IDS, CATEGORY_RULE_IDS } from "./decision-rules";
export { RECOMMENDATION_RULE_IDS } from "./recommend";
