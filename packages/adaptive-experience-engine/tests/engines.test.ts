import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { analyzeExperienceContext } from "../src/engines/experienceAnalyzer.js";
import { generateRecommendations } from "../src/engines/recommendationEngine.js";
import { evaluateRisk } from "../src/engines/riskEvaluator.js";
import { scorePersonalization } from "../src/engines/personalizationScoringModel.js";
import { northbridgeWebsiteAdapter } from "../examples/samples/productSamples.js";
import type { AEEInputBundle } from "../src/types/inputs.js";

describe("experienceAnalyzer", () => {
  it("classifies returning engaged users", () => {
    const inputs: AEEInputBundle = {
      productId: "quadrix",
      visitorIntent: { primaryIntent: "returning", confidence: 0.8 },
      journeyIntelligence: { repeatVisit: true, daysSinceLastVisit: 7 },
      sessionAnalytics: { sessionId: "s1", featureAdoption: ["a", "b"] },
    };

    const context = analyzeExperienceContext(inputs);
    assert.equal(context.customerMaturity, "engaged");
    assert.equal(context.repeatVisit, true);
  });
});

describe("recommendationEngine", () => {
  it("generates friction-based navigation recommendation", () => {
    const inputs: AEEInputBundle = {
      productId: "northbridge-website",
      visitorIntent: { primaryIntent: "explore_products", confidence: 0.6 },
      customerExperience: { frictionEvents: ["a", "b", "c"] },
      journeyIntelligence: { abandonedPages: ["/services"] },
    };

    const context = analyzeExperienceContext(inputs);
    const recs = generateRecommendations(context, inputs, northbridgeWebsiteAdapter);

    assert.ok(recs.some((r) => r.area === "navigation" || r.area === "content_ordering"));
  });
});

describe("riskEvaluator", () => {
  it("flags low intent confidence as high risk", () => {
    const inputs: AEEInputBundle = {
      productId: "test",
      visitorIntent: { primaryIntent: "unknown", confidence: 0.3 },
    };
    const context = analyzeExperienceContext(inputs);
    const risk = evaluateRisk(context, [], inputs);
    assert.equal(risk.overallRisk, "high");
  });
});

describe("personalizationScoringModel", () => {
  it("scores personalization from inputs", () => {
    const inputs: AEEInputBundle = {
      productId: "test",
      visitorIntent: { primaryIntent: "become_customer", confidence: 0.9 },
      businessImpact: { estimatedValueScore: 80 },
    };
    const context = analyzeExperienceContext(inputs);
    const score = scorePersonalization(context, inputs, []);
    assert.ok(score.overall > 0.4);
  });
});
