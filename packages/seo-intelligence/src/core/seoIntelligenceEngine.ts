import { auditExistingContent } from "../engines/contentAuditEngine.js";
import { scoreBusinessImpact } from "../engines/businessImpactScorer.js";
import { generateContentDraft } from "../engines/draftGenerator.js";
import {
  buildContentRecommendation,
  generateExecutiveReport,
} from "../engines/executiveReportGenerator.js";
import { detectOpportunity } from "../engines/opportunityDetector.js";
import {
  mapKeywordToProduct,
  mapKeywordWithCapabilityVerification,
  type ProductCapabilityVerifier,
} from "../engines/productMappingEngine.js";
import { classifySearchIntent } from "../engines/searchIntentClassifier.js";
import {
  assertReadOnlyOperation,
  SIE_GOVERNANCE,
} from "../governance/readOnlyPolicy.js";
import type { SEOAnalysisRequest, SEOExecutiveReport } from "../types/report.js";

export interface SEOIntelligenceEngineOptions {
  minBusinessScore?: number;
  productCapabilityVerifier?: ProductCapabilityVerifier;
  generateDrafts?: boolean;
}

export class SEOIntelligenceEngine {
  private readonly minBusinessScore: number;
  private readonly verifier?: ProductCapabilityVerifier;
  private readonly generateDrafts: boolean;

  constructor(options: SEOIntelligenceEngineOptions = {}) {
    this.minBusinessScore = options.minBusinessScore ?? 45;
    this.verifier = options.productCapabilityVerifier;
    this.generateDrafts = options.generateDrafts ?? true;
  }

  /** Read-only SEO analysis — strategist recommendations only, no publishing. */
  async analyze(request: SEOAnalysisRequest): Promise<SEOExecutiveReport> {
    assertReadOnlyOperation("seo_analysis");

    const recommendations = [];
    const skippedDuplicates: string[] = [];
    const skippedLowValue: string[] = [];

    for (const keyword of request.keywords) {
      const audit = auditExistingContent(keyword, request.existingContent);

      if (audit.recommendation === "skip_duplicate") {
        skippedDuplicates.push(keyword);
        continue;
      }

      const intent = classifySearchIntent(keyword);
      const product = this.verifier
        ? await mapKeywordWithCapabilityVerification(keyword, intent, this.verifier)
        : mapKeywordToProduct(keyword, intent);

      const opportunity = detectOpportunity(keyword, product);
      const businessScore = scoreBusinessImpact(keyword, intent, audit, product);

      if (businessScore.overall < this.minBusinessScore) {
        skippedLowValue.push(keyword);
        continue;
      }

      const draft = this.generateDrafts
        ? generateContentDraft(opportunity, product, opportunity.suggestedFormat)
        : undefined;

      recommendations.push(
        buildContentRecommendation(opportunity, audit, product, businessScore, draft),
      );
    }

    return generateExecutiveReport(
      request.analysisId,
      request.productScope,
      recommendations,
      skippedDuplicates,
      skippedLowValue,
    );
  }
}

export function createSEOIntelligenceEngine(
  options?: SEOIntelligenceEngineOptions,
): SEOIntelligenceEngine {
  return new SEOIntelligenceEngine(options);
}

export { SIE_GOVERNANCE };
