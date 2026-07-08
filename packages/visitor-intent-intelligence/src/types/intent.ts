/** Core intent categories shared across Northbridge products. */
export const CORE_INTENT_CATEGORIES = [
  "learn_about_company",
  "explore_products",
  "compare_services",
  "evaluate_ai_capabilities",
  "request_software_development",
  "become_customer",
  "become_partner",
  "career_exploration",
  "flight_training",
  "find_instructor",
  "find_flight_school",
  "learn_about_cat",
  "general_research",
  "unknown_intent",
] as const;

export type CoreIntentCategory = (typeof CORE_INTENT_CATEGORIES)[number];

export interface IntentDefinition {
  id: string;
  label: string;
  description: string;
  /** Core category or adapter-defined extension prefixed with product id. */
  category: CoreIntentCategory | string;
  keywords?: string[];
}

export interface IntentEvidence {
  source: "navigation" | "cat" | "form" | "search" | "adapter" | "business";
  signal: string;
  weight: number;
  timestamp: number;
  supports?: string;
  conflicts?: string;
}

export interface IntentInference {
  primaryIntent: IntentDefinition;
  secondaryIntent?: IntentDefinition;
  confidence: number;
  supportingEvidence: IntentEvidence[];
  conflictingEvidence: IntentEvidence[];
  confidenceProgression: ConfidenceProgressionPoint[];
}

export interface ConfidenceProgressionPoint {
  timestamp: number;
  confidence: number;
  primaryIntentId: string;
  note?: string;
}
