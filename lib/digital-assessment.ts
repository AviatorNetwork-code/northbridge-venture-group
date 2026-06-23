/**
 * Compatibility wrapper for the assessment rule engine.
 * Canonical implementation: lib/assessment/
 */
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
  applyScoringRules,
  buildSuggestedCallOpening,
  calculateLeadScore,
  evaluateAssessment,
  getLeadCategory,
  getRecommendedSolution,
  isQualifiedLead,
  labelForValue,
  parseAssessmentPayload,
  recommendSolution,
  validateAssessmentPayload,
} from "@/lib/assessment";

export type {
  AssessmentDecision,
  AssessmentPayload,
  AuthorityValue,
  BudgetValue,
  BusinessStageValue,
  CurrentSystemValue,
  DigitalAssessmentPayload,
  EmployeeValue,
  LeadCategory,
  MainNeedValue,
  PainPointValue,
  RecommendedSolution,
  ScoringEvidence,
  TimelineValue,
} from "@/lib/assessment";
