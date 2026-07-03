import type { ContentAuditResult } from "./opportunity.js";
import type { ContentDraft } from "./draft.js";
import type { ProductMappingResult } from "./product.js";
import type { SEOBusinessScore } from "./scoring.js";
import type { SearchOpportunity } from "./opportunity.js";
import type { ContentFormatRecommendation } from "./opportunity.js";

export interface SEOContentRecommendation {
  recommendationId: string;
  opportunity: SearchOpportunity;
  audit: ContentAuditResult;
  productMapping: ProductMappingResult;
  businessScore: SEOBusinessScore;
  contentFormat: ContentFormatRecommendation;
  draft?: ContentDraft;
  opportunityScore: number;
  estimatedBusinessImpact: string;
  estimatedTrafficValue: string;
  expectedConversionImpact: string;
  recommendedProduct: string;
  whyNow: string;
  opportunityCostIfDelayed: string;
  requiresFounderApproval: true;
}

export interface SEOExecutiveReport {
  reportId: string;
  generatedAt: number;
  productScope: string;
  executiveSummary: string;
  recommendations: SEOContentRecommendation[];
  skippedDuplicates: string[];
  skippedLowValue: string[];
  governance: {
    readOnly: true;
    requiresFounderApproval: true;
  };
}

export interface SEOAnalysisRequest {
  analysisId: string;
  requesterId: string;
  productScope: string;
  keywords: string[];
  existingContent: import("./opportunity.js").ExistingContentRecord[];
  timestamp: number;
}
