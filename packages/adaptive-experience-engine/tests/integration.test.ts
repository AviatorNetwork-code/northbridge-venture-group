import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { AdaptiveExperienceEngine } from "../src/core/adaptiveExperienceEngine.js";
import { assertReadOnlyOperation, AEE_GOVERNANCE } from "../src/governance/readOnlyPolicy.js";
import { registerAEECapability, AEE_CAPABILITY } from "../src/registration/capabilityRegistration.js";
import {
  aviatorNetworkAdapter,
  northbridgeWebsiteAdapter,
  quadrixAdapter,
} from "../examples/samples/productSamples.js";
import {
  aviatorNetworkSampleInput,
  northbridgeWebsiteSampleInput,
  quadrixSampleInput,
  getSampleRecommendationPreview,
} from "../examples/samples/productSamples.js";

describe("AdaptiveExperienceEngine integration", () => {
  it("generates Northbridge Website AI content ordering recommendation", () => {
    const aee = new AdaptiveExperienceEngine(northbridgeWebsiteAdapter);
    const plan = aee.generatePlan(northbridgeWebsiteSampleInput);

    assert.equal(plan.productId, "northbridge-website");
    assert.equal(plan.requiredFounderApproval, true);
    assert.ok(plan.recommendations.length > 0);

    const aiRec = plan.recommendations.find((r) =>
      r.recommendation.includes("AI product overview"),
    );
    assert.ok(aiRec);
    assert.equal(aiRec!.area, "content_ordering");
    assert.ok(aiRec!.experienceScore > 0);
    assert.ok(aiRec!.requiresFounderApproval);
  });

  it("generates Aviator Network logbook-first recommendation", () => {
    const aee = new AdaptiveExperienceEngine(aviatorNetworkAdapter);
    const plan = aee.generatePlan(aviatorNetworkSampleInput);

    const rec = plan.recommendations.find((r) =>
      r.recommendation.includes("Logbook Scanner"),
    );
    assert.ok(rec);
    assert.equal(rec!.area, "feature_discovery");
  });

  it("generates Quadrix resume progression recommendation for returning users", () => {
    const aee = new AdaptiveExperienceEngine(quadrixAdapter);
    const plan = aee.generatePlan(quadrixSampleInput);

    const rec = plan.recommendations.find((r) =>
      r.recommendation.includes("Resume progression"),
    );
    assert.ok(rec);
    assert.equal(rec!.area, "onboarding");
  });

  it("includes scoring dimensions on every recommendation", () => {
    const aee = new AdaptiveExperienceEngine(northbridgeWebsiteAdapter);
    const plan = aee.generatePlan(northbridgeWebsiteSampleInput);

    for (const rec of plan.recommendations) {
      assert.ok(rec.experienceScore >= 0 && rec.experienceScore <= 1);
      assert.ok(rec.businessImpactScore >= 0);
      assert.ok(rec.customerValueScore >= 0);
      assert.ok(rec.confidence >= 0);
      assert.ok(rec.expectedRoi >= 0);
      assert.ok(rec.strategicAlignment >= 0);
      assert.ok(rec.evidence.length > 0);
      assert.ok(rec.opportunityCost.length > 0);
    }
  });

  it("produces plan outputs: confidence, impacts, risk, evidence quality", () => {
    const aee = new AdaptiveExperienceEngine(northbridgeWebsiteAdapter);
    const plan = aee.generatePlan(northbridgeWebsiteSampleInput);

    assert.ok(plan.personalizationConfidence > 0);
    assert.ok(plan.expectedBusinessImpact.score >= 0);
    assert.ok(plan.expectedCustomerImpact.score >= 0);
    assert.ok(plan.executiveSummary.length > 0);
    assert.ok(["low", "medium", "high"].includes(plan.riskAssessment.overallRisk));
    assert.ok(plan.evidenceQuality > 0);
    assert.ok(Array.isArray(plan.dependencies));
  });

  it("enforces read-only governance", () => {
    assert.equal(AEE_GOVERNANCE.readOnly, true);
    assert.equal(AEE_GOVERNANCE.allowsExecution, false);
    assert.throws(() => assertReadOnlyOperation("execute"));
    assert.throws(() => assertReadOnlyOperation("apply_personalization"));
  });

  it("registers NEOS capability", () => {
    const ids: string[] = [];
    registerAEECapability({ register(cap) { ids.push(cap.id); } });
    assert.deepEqual(ids, [AEE_CAPABILITY.id]);
  });

  it("provides sample recommendation previews for all products", () => {
    assert.ok(getSampleRecommendationPreview("northbridge-website"));
    assert.ok(getSampleRecommendationPreview("aviator-network"));
    assert.ok(getSampleRecommendationPreview("quadrix"));
  });
});
