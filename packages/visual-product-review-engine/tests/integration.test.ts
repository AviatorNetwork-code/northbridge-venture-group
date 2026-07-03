import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createVisualProductReviewEngine, VPRE_GOVERNANCE } from "../src/core/visualProductReviewEngine.js";
import { assertReadOnlyOperation } from "../src/governance/readOnlyPolicy.js";
import { registerVPRECapability, VPRE_CAPABILITY } from "../src/registration/capabilityRegistration.js";
import { runNorthbridgeWebsiteHomeReview } from "../examples/flows/northbridgeWebsiteReview.js";
import type { RenderedUISignals, ScreenCapture } from "../src/types/capture.js";
import type { VisualReviewRequest } from "../src/types/request.js";

const strongSignals: RenderedUISignals = {
  hasPrimaryHeading: true,
  hasSubheadings: true,
  hasClearValueProposition: true,
  hasPrimaryCta: true,
  hasSecondaryCta: true,
  hasNavigation: true,
  navigationItemCount: 5,
  hasContactPath: true,
  hasTrustSignals: true,
  hasProductExplanation: true,
  hasPricingOrNextStep: true,
  hasCatWidget: true,
  catWidgetVisible: true,
  hasFooter: true,
  textDensity: "medium",
  contrastConcern: false,
  tapTargetConcern: false,
  headingOrderConcern: false,
  brandElementsPresent: true,
  inconsistentSpacing: false,
  conversionStepsVisible: 2,
  estimatedScrollDepthRequired: "none",
};

const weakSignals: RenderedUISignals = {
  hasPrimaryHeading: true,
  hasSubheadings: false,
  hasClearValueProposition: false,
  hasPrimaryCta: false,
  hasSecondaryCta: false,
  hasNavigation: true,
  navigationItemCount: 12,
  hasContactPath: false,
  hasTrustSignals: false,
  hasProductExplanation: false,
  hasPricingOrNextStep: false,
  hasCatWidget: false,
  catWidgetVisible: false,
  hasFooter: false,
  textDensity: "high",
  contrastConcern: true,
  tapTargetConcern: true,
  headingOrderConcern: true,
  brandElementsPresent: false,
  inconsistentSpacing: true,
  conversionStepsVisible: 0,
  estimatedScrollDepthRequired: "deep",
};

function makeRequest(screens: ScreenCapture[], productId = "northbridge-website"): VisualReviewRequest {
  return {
    reviewId: "test-review",
    requesterId: "test",
    productId,
    productName: "Test Product",
    screens,
    timestamp: Date.now(),
  };
}

function makeScreen(signals: RenderedUISignals, overrides: Partial<ScreenCapture> = {}): ScreenCapture {
  return {
    captureId: "cap-1",
    screenId: "home",
    screenName: "Home",
    sourceType: "browser_screenshot",
    viewport: "desktop",
    capturedAt: Date.now(),
    signals,
    ...overrides,
  };
}

describe("VisualProductReviewEngine integration", () => {
  it("generates executive UX report for Northbridge Website example", () => {
    const report = runNorthbridgeWebsiteHomeReview();
    assert.equal(report.productId, "northbridge-website");
    assert.equal(report.governance.readOnly, true);
    assert.equal(report.governance.requiresFounderApproval, true);
    assert.ok(report.overallScores.uxScore >= 0);
    assert.ok(report.prioritizedIssues.length > 0);
    assert.ok(report.screenReviews[0]!.scores.conversionScore < 60);
  });

  it("scores strong screens higher than weak screens", () => {
    const engine = createVisualProductReviewEngine();
    const strong = engine.reviewScreens(makeRequest([makeScreen(strongSignals)]));
    const weak = engine.reviewScreens(makeRequest([makeScreen(weakSignals)]));

    assert.ok(strong.overallScores.uxScore > weak.overallScores.uxScore);
    assert.ok(strong.overallScores.conversionScore > weak.overallScores.conversionScore);
    assert.ok(weak.overallScores.frictionScore > strong.overallScores.frictionScore);
  });

  it("includes required scores on every screen review", () => {
    const engine = createVisualProductReviewEngine();
    const report = engine.reviewScreens(makeRequest([makeScreen(strongSignals)]));
    const scores = report.screenReviews[0]!.scores;

    for (const key of [
      "uxScore",
      "productUnderstandingScore",
      "trustScore",
      "conversionScore",
      "frictionScore",
      "accessibilityScore",
    ] as const) {
      assert.ok(scores[key] >= 0 && scores[key] <= 100, key);
    }
  });

  it("issues include screenshot location, severity, and business impact", () => {
    const engine = createVisualProductReviewEngine();
    const report = engine.reviewScreens(makeRequest([makeScreen(weakSignals)]));

    assert.ok(report.prioritizedIssues.length > 0);
    const top = report.prioritizedIssues[0]!;
    assert.ok(top.screenshotLocation.screenId);
    assert.ok(top.businessImpact.length > 0);
    assert.ok(top.suggestedImprovement.length > 0);
    assert.ok(top.evidence.length > 0);
    assert.ok(top.expectedConversionImprovement.length > 0);
  });

  it("prioritizes issues by business impact over engineering preference", () => {
    const engine = createVisualProductReviewEngine();
    const report = engine.reviewScreens(makeRequest([makeScreen(weakSignals)]));

    for (let i = 1; i < report.prioritizedIssues.length; i++) {
      const prev = report.prioritizedIssues[i - 1]!;
      const curr = report.prioritizedIssues[i]!;
      const prevWeight = prev.businessImpactScore + (prev.severity === "critical" ? 1000 : 0);
      const currWeight = curr.businessImpactScore + (curr.severity === "critical" ? 1000 : 0);
      assert.ok(prevWeight >= currWeight);
    }
  });

  it("evaluates all twelve dimensions", () => {
    const engine = createVisualProductReviewEngine();
    const report = engine.reviewScreens(makeRequest([makeScreen(strongSignals)]));
    assert.equal(report.screenReviews[0]!.dimensionScores.length, 12);
  });

  it("supports Aviator Network and Quadrix adapters", () => {
    const engine = createVisualProductReviewEngine();
    assert.ok(engine.registry.listProducts().includes("aviator-network"));
    assert.ok(engine.registry.listProducts().includes("quadrix"));

    const aviatorReport = engine.reviewScreens(
      makeRequest([makeScreen(strongSignals)], "aviator-network"),
    );
    assert.equal(aviatorReport.productId, "aviator-network");
  });

  it("enforces read-only governance", () => {
    assert.equal(VPRE_GOVERNANCE.readOnly, true);
    assert.throws(() => assertReadOnlyOperation("modify_ui"));
  });

  it("registers VPRE capability in NEOS registry", () => {
    const ids: string[] = [];
    registerVPRECapability({ register(c) { ids.push(c.id); } });
    assert.deepEqual(ids, [VPRE_CAPABILITY.id]);
  });
});
