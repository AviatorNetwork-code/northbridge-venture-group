import type { SearchIntentClassification } from "./intent.js";

export type ContentFormatRecommendation =
  | "landing_page"
  | "knowledge_article"
  | "comparison_page"
  | "industry_guide"
  | "faq"
  | "tool_page"
  | "resource_library"
  | "case_study";

export interface SearchOpportunity {
  opportunityId: string;
  keyword: string;
  keywordCluster: string[];
  intent: SearchIntentClassification;
  estimatedMonthlyDemand: "low" | "medium" | "high";
  competitionLevel: "low" | "medium" | "high";
  unansweredQuestion: boolean;
  suggestedFormat: ContentFormatRecommendation;
  rationale: string;
}

export interface ExistingContentRecord {
  url: string;
  title: string;
  slug: string;
  topics: string[];
  qualityScore: number;
  lastUpdated?: number;
  needsImprovement: boolean;
  improvementReason?: string;
}

export interface ContentAuditResult {
  keyword: string;
  exists: boolean;
  matchingPages: ExistingContentRecord[];
  duplicateRisk: boolean;
  improvementCandidate?: ExistingContentRecord;
  recommendation: "create_new" | "improve_existing" | "skip_duplicate";
}
