import type { AssessmentPayload, RecommendedSolution } from "./schema";

export const RECOMMENDATION_RULE_IDS: Record<AssessmentPayload["mainNeed"], string> = {
  "starting-business": "RECOMMEND_LAUNCH_SYSTEM",
  "more-customers": "RECOMMEND_CUSTOMER_ACQUISITION",
  "improve-operations": "RECOMMEND_OPERATIONS_AUTOMATION",
  "better-visibility": "RECOMMEND_BUSINESS_INTELLIGENCE",
  "custom-software": "RECOMMEND_CUSTOM_SOFTWARE",
  "not-sure": "RECOMMEND_BUSINESS_SYSTEMS_REVIEW",
};

const MAIN_NEED_TO_SOLUTION: Record<AssessmentPayload["mainNeed"], RecommendedSolution> = {
  "starting-business": "Launch System",
  "more-customers": "Customer Acquisition System",
  "improve-operations": "Operations & Automation",
  "better-visibility": "Business Intelligence",
  "custom-software": "Custom Software",
  "not-sure": "Business Systems Review",
};

export function recommendSolution(payload: AssessmentPayload): RecommendedSolution {
  return MAIN_NEED_TO_SOLUTION[payload.mainNeed] ?? "Business Systems Review";
}

/** @deprecated Use recommendSolution — kept for compatibility */
export function getRecommendedSolution(payload: AssessmentPayload): RecommendedSolution {
  return recommendSolution(payload);
}
