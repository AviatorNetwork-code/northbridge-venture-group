/** Twelve evaluation dimensions — customer-perspective product review. */
export type ReviewDimension =
  | "first_impression"
  | "product_understanding"
  | "trust"
  | "navigation"
  | "information_hierarchy"
  | "visual_clarity"
  | "conversion_path"
  | "cat_interaction_quality"
  | "accessibility"
  | "mobile_experience"
  | "consistency"
  | "business_impact";

export const REVIEW_DIMENSIONS: ReviewDimension[] = [
  "first_impression",
  "product_understanding",
  "trust",
  "navigation",
  "information_hierarchy",
  "visual_clarity",
  "conversion_path",
  "cat_interaction_quality",
  "accessibility",
  "mobile_experience",
  "consistency",
  "business_impact",
];

export const DIMENSION_LABELS: Record<ReviewDimension, string> = {
  first_impression: "First impression",
  product_understanding: "Product understanding",
  trust: "Trust",
  navigation: "Navigation",
  information_hierarchy: "Information hierarchy",
  visual_clarity: "Visual clarity",
  conversion_path: "Conversion path",
  cat_interaction_quality: "CAT interaction quality",
  accessibility: "Accessibility",
  mobile_experience: "Mobile experience",
  consistency: "Consistency",
  business_impact: "Business impact",
};
