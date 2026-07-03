/**
 * Example: Northbridge Website home screen visual review.
 * Reference only — not imported by VPRE core.
 */
import { createVisualProductReviewEngine } from "../../src/core/visualProductReviewEngine.js";
import type { VisualReviewRequest } from "../../src/types/request.js";
import type { RenderedUISignals } from "../../src/types/capture.js";

const weakHomeSignals: RenderedUISignals = {
  hasPrimaryHeading: true,
  hasSubheadings: false,
  hasClearValueProposition: false,
  hasPrimaryCta: false,
  hasSecondaryCta: true,
  hasNavigation: true,
  navigationItemCount: 6,
  hasContactPath: false,
  hasTrustSignals: false,
  hasProductExplanation: true,
  hasPricingOrNextStep: false,
  hasCatWidget: true,
  catWidgetVisible: false,
  hasFooter: true,
  textDensity: "high",
  contrastConcern: false,
  tapTargetConcern: false,
  headingOrderConcern: false,
  brandElementsPresent: true,
  inconsistentSpacing: false,
  conversionStepsVisible: 0,
  estimatedScrollDepthRequired: "moderate",
};

export function runNorthbridgeWebsiteHomeReview() {
  const engine = createVisualProductReviewEngine();

  const request: VisualReviewRequest = {
    reviewId: "review-nbw-home-001",
    requesterId: "neos-executive-review",
    productId: "northbridge-website",
    productName: "Northbridge Website",
    customerPersona: "business_owner_evaluating_services",
    reviewGoal: "Evaluate home page conversion and consultative entry",
    timestamp: Date.now(),
    screens: [
      {
        captureId: "cap-home-desktop-001",
        screenId: "home",
        screenName: "Home — Desktop",
        sourceType: "browser_screenshot",
        url: "https://northbridge.example/",
        viewport: "desktop",
        capturedAt: Date.now(),
        customerJourneyStep: "first_visit",
        signals: weakHomeSignals,
      },
    ],
  };

  return engine.reviewScreens(request);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(JSON.stringify(runNorthbridgeWebsiteHomeReview(), null, 2));
}
