import type { ScreenCapture, ScreenshotLocation } from "../types/capture.js";
import type { ProductReviewExpectations } from "../types/adapter.js";
import type { DimensionScore, ReviewIssue, IssueSeverity } from "../types/scores.js";
import { DIMENSION_LABELS, type ReviewDimension } from "../types/dimensions.js";

function locationFromCapture(capture: ScreenCapture): ScreenshotLocation {
  return {
    screenId: capture.screenId,
    captureId: capture.captureId,
    sourceType: capture.sourceType,
    path: capture.path,
    url: capture.url,
    viewport: capture.viewport,
  };
}

function issue(
  capture: ScreenCapture,
  dimension: ReviewDimension,
  severity: IssueSeverity,
  title: string,
  description: string,
  businessImpact: string,
  suggestedImprovement: string,
  evidence: string[],
  expectedConversionImprovement: string,
  businessImpactScore: number,
): ReviewIssue {
  return {
    issueId: `${capture.screenId}-${dimension}-${title.toLowerCase().replace(/\s+/g, "-").slice(0, 40)}`,
    dimension,
    screenshotLocation: locationFromCapture(capture),
    severity,
    title,
    description,
    businessImpact,
    suggestedImprovement,
    evidence,
    expectedConversionImprovement,
    businessImpactScore,
  };
}

export function detectScreenIssues(
  capture: ScreenCapture,
  dimensionScores: DimensionScore[],
  expectations: ProductReviewExpectations,
): ReviewIssue[] {
  const issues: ReviewIssue[] = [];
  const { signals } = capture;
  const scoreMap = Object.fromEntries(dimensionScores.map((d) => [d.dimension, d.score])) as Record<
    ReviewDimension,
    number
  >;

  if (!signals.hasClearValueProposition) {
    issues.push(
      issue(
        capture,
        "first_impression",
        "high",
        "Unclear value proposition",
        "A new visitor cannot quickly understand why this product matters.",
        "Weak first impression reduces exploration and increases bounce rate.",
        "Add a concise headline and subheadline stating who it is for and the primary outcome.",
        ["No clear value proposition signal detected"],
        "Moderate — clearer above-the-fold messaging typically improves engagement 5–15%.",
        75,
      ),
    );
  }

  if (!signals.hasPrimaryCta) {
    issues.push(
      issue(
        capture,
        "conversion_path",
        "critical",
        "Missing primary call-to-action",
        "No primary CTA is visible on the rendered screen.",
        "Visitors who understand the product still lack an obvious next step.",
        "Add one primary CTA above the fold aligned to the conversion goal.",
        ["hasPrimaryCta=false"],
        "High — visible primary CTA often improves conversion 10–25% on landing screens.",
        90,
      ),
    );
  }

  if (expectations.catExpected && !signals.hasCatWidget) {
    issues.push(
      issue(
        capture,
        "cat_interaction_quality",
        "high",
        "Consultant entry point not visible",
        "CAT/consultant widget expected for this product but not detected.",
        "Consultative products lose guided discovery when help is not visible.",
        "Ensure consultant launcher is visible without blocking core content.",
        ["hasCatWidget=false", `catExpected=true for ${expectations.productId}`],
        "Moderate — visible consultative entry can improve qualified lead capture 8–18%.",
        70,
      ),
    );
  }

  if (!signals.hasTrustSignals && !signals.hasContactPath) {
    issues.push(
      issue(
        capture,
        "trust",
        "medium",
        "Limited trust signals",
        "Neither trust markers nor a contact path are clearly visible.",
        "New visitors may hesitate before engaging or converting.",
        "Add credibility markers (about, proof, contact) near primary content.",
        ["hasTrustSignals=false", "hasContactPath=false"],
        "Moderate — trust elements often improve consultation requests 5–12%.",
        55,
      ),
    );
  }

  if (signals.contrastConcern || signals.tapTargetConcern) {
    issues.push(
      issue(
        capture,
        "accessibility",
        signals.contrastConcern ? "high" : "medium",
        "Accessibility friction detected",
        "Contrast or tap target concerns may exclude or frustrate users.",
        "Accessibility friction reduces usable audience and increases abandonment.",
        "Audit contrast ratios and minimum tap target sizes on this screen.",
        [
          signals.contrastConcern ? "contrastConcern=true" : "",
          signals.tapTargetConcern ? "tapTargetConcern=true" : "",
        ].filter(Boolean),
        "Low–moderate — accessibility fixes reduce drop-off among affected users.",
        60,
      ),
    );
  }

  if (capture.viewport === "mobile" && signals.textDensity === "high") {
    issues.push(
      issue(
        capture,
        "mobile_experience",
        "medium",
        "Dense mobile layout",
        "High text density on a mobile viewport increases scanning effort.",
        "Mobile visitors may abandon before reaching conversion actions.",
        "Reduce copy density, increase spacing, and prioritize one action per screen.",
        ["viewport=mobile", "textDensity=high"],
        "Moderate — mobile simplification often improves mobile conversion 8–20%.",
        65,
      ),
    );
  }

  if ((scoreMap.navigation ?? 100) < 50) {
    issues.push(
      issue(
        capture,
        "navigation",
        "medium",
        "Navigation clarity concern",
        dimensionScores.find((d) => d.dimension === "navigation")?.rationale ??
          "Navigation score below threshold.",
        "Poor navigation increases cognitive load and journey abandonment.",
        "Simplify navigation labels and reduce top-level items to essential paths.",
        [`navigation score=${scoreMap.navigation}`],
        "Low–moderate — clearer navigation improves multi-page journey completion.",
        50,
      ),
    );
  }

  if (signals.estimatedScrollDepthRequired === "deep" && !signals.hasPrimaryCta) {
    issues.push(
      issue(
        capture,
        "information_hierarchy",
        "medium",
        "Conversion action buried",
        "Deep scroll appears required before key actions are reachable.",
        "Hidden CTAs delay decision-making and increase drop-off.",
        "Move primary action higher or add sticky conversion entry on long pages.",
        ["estimatedScrollDepthRequired=deep"],
        "Moderate — reducing scroll-to-CTA distance improves conversion on long pages.",
        58,
      ),
    );
  }

  return issues;
}

export function prioritizeIssuesByBusinessImpact(issues: ReviewIssue[]): ReviewIssue[] {
  const severityWeight: Record<IssueSeverity, number> = {
    critical: 1000,
    high: 100,
    medium: 10,
    low: 1,
  };

  return [...issues].sort(
    (a, b) =>
      b.businessImpactScore + severityWeight[b.severity] -
      (a.businessImpactScore + severityWeight[a.severity]),
  );
}

export { DIMENSION_LABELS };
