import type { ReviewDimension } from "../types/dimensions.js";
import type { RenderedUISignals } from "../types/capture.js";
import type { ProductReviewExpectations } from "../types/adapter.js";
import type { DimensionScore } from "../types/scores.js";

function clampScore(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function scoreFirstImpression(signals: RenderedUISignals): DimensionScore {
  let score = 50;
  if (signals.hasClearValueProposition) score += 25;
  if (signals.hasPrimaryHeading) score += 10;
  if (signals.brandElementsPresent) score += 10;
  if (signals.textDensity === "high") score -= 15;
  if (signals.inconsistentSpacing) score -= 10;
  return {
    dimension: "first_impression",
    score: clampScore(score),
    rationale: signals.hasClearValueProposition
      ? "Clear value proposition supports strong first impression."
      : "Value proposition is unclear or missing above the fold.",
  };
}

function scoreProductUnderstanding(signals: RenderedUISignals): DimensionScore {
  let score = 40;
  if (signals.hasProductExplanation) score += 30;
  if (signals.hasSubheadings) score += 10;
  if (signals.hasPrimaryHeading) score += 10;
  if (signals.textDensity === "high" && !signals.hasSubheadings) score -= 15;
  return {
    dimension: "product_understanding",
    score: clampScore(score),
    rationale: signals.hasProductExplanation
      ? "Product purpose is explained on screen."
      : "Visitor may struggle to understand what the product does.",
  };
}

function scoreTrust(signals: RenderedUISignals): DimensionScore {
  let score = 35;
  if (signals.hasTrustSignals) score += 25;
  if (signals.hasContactPath) score += 20;
  if (signals.hasFooter) score += 10;
  if (!signals.hasTrustSignals && !signals.hasContactPath) score -= 10;
  return {
    dimension: "trust",
    score: clampScore(score),
    rationale: signals.hasTrustSignals
      ? "Trust signals are visible."
      : "Limited visible trust signals for a new visitor.",
  };
}

function scoreNavigation(signals: RenderedUISignals): DimensionScore {
  let score = 30;
  if (signals.hasNavigation) score += 25;
  if (signals.navigationItemCount >= 3 && signals.navigationItemCount <= 7) score += 20;
  if (signals.navigationItemCount > 10) score -= 15;
  if (!signals.hasNavigation) score -= 10;
  return {
    dimension: "navigation",
    score: clampScore(score),
    rationale: signals.hasNavigation
      ? `Navigation present with ${signals.navigationItemCount} items.`
      : "Navigation is missing or not detectable.",
  };
}

function scoreInformationHierarchy(signals: RenderedUISignals): DimensionScore {
  let score = 45;
  if (signals.hasPrimaryHeading && signals.hasSubheadings) score += 25;
  if (signals.headingOrderConcern) score -= 25;
  if (signals.textDensity === "high") score -= 10;
  return {
    dimension: "information_hierarchy",
    score: clampScore(score),
    rationale: signals.headingOrderConcern
      ? "Heading structure may confuse scanning."
      : "Heading hierarchy supports scannable content.",
  };
}

function scoreVisualClarity(signals: RenderedUISignals): DimensionScore {
  let score = 50;
  if (signals.textDensity === "low" || signals.textDensity === "medium") score += 15;
  if (signals.inconsistentSpacing) score -= 20;
  if (signals.contrastConcern) score -= 25;
  return {
    dimension: "visual_clarity",
    score: clampScore(score),
    rationale: signals.contrastConcern
      ? "Contrast concerns may reduce readability."
      : "Visual clarity appears acceptable for scanning.",
  };
}

function scoreConversionPath(signals: RenderedUISignals): DimensionScore {
  let score = 30;
  if (signals.hasPrimaryCta) score += 30;
  if (signals.hasPricingOrNextStep) score += 20;
  if (signals.conversionStepsVisible >= 2) score += 10;
  if (signals.estimatedScrollDepthRequired === "deep") score -= 15;
  if (!signals.hasPrimaryCta) score -= 10;
  return {
    dimension: "conversion_path",
    score: clampScore(score),
    rationale: signals.hasPrimaryCta
      ? "Primary conversion action is visible."
      : "No clear primary call-to-action detected.",
  };
}

function scoreCatInteraction(signals: RenderedUISignals, catExpected: boolean): DimensionScore {
  let score = catExpected ? 30 : 70;
  if (signals.hasCatWidget && signals.catWidgetVisible) score += catExpected ? 45 : 10;
  if (catExpected && !signals.hasCatWidget) score -= 20;
  if (catExpected && signals.hasCatWidget && !signals.catWidgetVisible) score -= 15;
  return {
    dimension: "cat_interaction_quality",
    score: clampScore(score),
    rationale:
      catExpected && !signals.hasCatWidget
        ? "Consultant (CAT) expected but not detected on screen."
        : signals.catWidgetVisible
          ? "Consultant entry point is visible."
          : "Consultant not required for this product context.",
  };
}

function scoreAccessibility(signals: RenderedUISignals): DimensionScore {
  let score = 55;
  if (signals.contrastConcern) score -= 25;
  if (signals.headingOrderConcern) score -= 15;
  if (signals.tapTargetConcern) score -= 20;
  return {
    dimension: "accessibility",
    score: clampScore(score),
    rationale:
      signals.contrastConcern || signals.tapTargetConcern
        ? "Accessibility concerns detected from rendered signals."
        : "No major accessibility concerns detected from available signals.",
  };
}

function scoreMobileExperience(signals: RenderedUISignals, viewport: string): DimensionScore {
  let score = viewport === "mobile" ? 55 : 70;
  if (viewport === "mobile" && signals.tapTargetConcern) score -= 25;
  if (viewport === "mobile" && signals.textDensity === "high") score -= 15;
  if (viewport === "mobile" && !signals.hasPrimaryCta) score -= 20;
  return {
    dimension: "mobile_experience",
    score: clampScore(viewport === "mobile" ? score : 75),
    rationale:
      viewport === "mobile"
        ? "Mobile viewport review applied."
        : "Desktop capture — mobile-specific friction not fully observable.",
  };
}

function scoreConsistency(signals: RenderedUISignals): DimensionScore {
  let score = 60;
  if (signals.brandElementsPresent) score += 15;
  if (signals.inconsistentSpacing) score -= 25;
  return {
    dimension: "consistency",
    score: clampScore(score),
    rationale: signals.inconsistentSpacing
      ? "Visual inconsistency may reduce brand trust."
      : "Brand and layout consistency appear stable.",
  };
}

function scoreBusinessImpact(
  dimensionScores: DimensionScore[],
  expectations: ProductReviewExpectations,
): DimensionScore {
  const conversion = dimensionScores.find((d) => d.dimension === "conversion_path")?.score ?? 0;
  const trust = dimensionScores.find((d) => d.dimension === "trust")?.score ?? 0;
  const friction = 100 - (dimensionScores.find((d) => d.dimension === "visual_clarity")?.score ?? 50);
  const score = clampScore(conversion * 0.45 + trust * 0.35 + (100 - friction) * 0.2);
  return {
    dimension: "business_impact",
    score,
    rationale: `Weighted toward ${expectations.primaryConversionGoal} — conversion and trust drive business impact.`,
  };
}

export function evaluateAllDimensions(
  signals: RenderedUISignals,
  viewport: string,
  expectations: ProductReviewExpectations,
): DimensionScore[] {
  const base = [
    scoreFirstImpression(signals),
    scoreProductUnderstanding(signals),
    scoreTrust(signals),
    scoreNavigation(signals),
    scoreInformationHierarchy(signals),
    scoreVisualClarity(signals),
    scoreConversionPath(signals),
    scoreCatInteraction(signals, expectations.catExpected),
    scoreAccessibility(signals),
    scoreMobileExperience(signals, viewport),
    scoreConsistency(signals),
  ];

  return [...base, scoreBusinessImpact(base, expectations)];
}

export function aggregateScreenScores(dimensionScores: DimensionScore[]): import("../types/scores.js").ScreenScores {
  const byDim = Object.fromEntries(dimensionScores.map((d) => [d.dimension, d.score])) as Record<
    ReviewDimension,
    number
  >;

  const clarity = byDim.visual_clarity ?? 50;
  const conversion = byDim.conversion_path ?? 50;
  const nav = byDim.navigation ?? 50;
  const hierarchy = byDim.information_hierarchy ?? 50;

  const frictionScore = clampScore(
    100 -
      (conversion * 0.35 +
        nav * 0.2 +
        hierarchy * 0.2 +
        clarity * 0.25),
  );

  const uxScore = clampScore(
    dimensionScores.reduce((sum, d) => sum + d.score, 0) / dimensionScores.length,
  );

  return {
    uxScore,
    productUnderstandingScore: byDim.product_understanding ?? 50,
    trustScore: byDim.trust ?? 50,
    conversionScore: conversion,
    frictionScore,
    accessibilityScore: byDim.accessibility ?? 50,
  };
}
