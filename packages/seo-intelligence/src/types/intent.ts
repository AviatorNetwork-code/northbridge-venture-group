/** Search intent classification — strategist lens, not writer lens. */
export type SearchIntentType =
  | "informational"
  | "commercial"
  | "transactional"
  | "navigational"
  | "comparison"
  | "local";

export interface SearchIntentClassification {
  keyword: string;
  primaryIntent: SearchIntentType;
  secondaryIntents: SearchIntentType[];
  confidence: number;
  signals: string[];
  buyerIntentLevel: "low" | "medium" | "high";
}
