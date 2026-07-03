import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { evaluateAllDimensions, aggregateScreenScores } from "../src/engines/dimensionEvaluators.js";
import { northbridgeWebsiteReviewAdapter } from "../src/adapters/defaultProductReviewAdapters.js";
import type { RenderedUISignals } from "../src/types/capture.js";

describe("dimensionEvaluators", () => {
  it("produces lower conversion score when CTA missing", () => {
    const signals: RenderedUISignals = {
      hasPrimaryHeading: true,
      hasSubheadings: true,
      hasClearValueProposition: true,
      hasPrimaryCta: false,
      hasSecondaryCta: false,
      hasNavigation: true,
      navigationItemCount: 5,
      hasContactPath: true,
      hasTrustSignals: true,
      hasProductExplanation: true,
      hasPricingOrNextStep: false,
      hasCatWidget: true,
      catWidgetVisible: true,
      hasFooter: true,
      textDensity: "medium",
      contrastConcern: false,
      tapTargetConcern: false,
      headingOrderConcern: false,
      brandElementsPresent: true,
      inconsistentSpacing: false,
      conversionStepsVisible: 0,
      estimatedScrollDepthRequired: "moderate",
    };

    const dimensions = evaluateAllDimensions(
      signals,
      "desktop",
      northbridgeWebsiteReviewAdapter.getReviewExpectations(),
    );
    const scores = aggregateScreenScores(dimensions);
    assert.ok(scores.conversionScore < 60);
  });
});
