import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createSEOIntelligenceEngine, SIE_GOVERNANCE } from "../src/core/seoIntelligenceEngine.js";
import { classifySearchIntent } from "../src/engines/searchIntentClassifier.js";
import { auditExistingContent } from "../src/engines/contentAuditEngine.js";
import { mapKeywordToProduct } from "../src/engines/productMappingEngine.js";
import { assertReadOnlyOperation } from "../src/governance/readOnlyPolicy.js";
import { registerSIECapability, SIE_CAPABILITY } from "../src/registration/capabilityRegistration.js";
import { runAviationSEOAnalysis } from "../examples/flows/aviationSeoAnalysis.js";
import type { SEOAnalysisRequest } from "../src/types/report.js";

describe("searchIntentClassifier", () => {
  it("classifies informational intent for how-to keywords", () => {
    const intent = classifySearchIntent("how to start a flight school");
    assert.equal(intent.primaryIntent, "informational");
  });

  it("classifies commercial intent for best-app keywords", () => {
    const intent = classifySearchIntent("best pilot logbook app");
    assert.equal(intent.primaryIntent, "commercial");
  });
});

describe("contentAuditEngine", () => {
  it("skips duplicate when matching high-quality page exists", () => {
    const audit = auditExistingContent("flight school website design", [
      {
        url: "/services",
        title: "Flight School Website Design Services",
        slug: "flight-school-website-design",
        topics: ["flight school", "website", "design"],
        qualityScore: 85,
        needsImprovement: false,
      },
    ]);
    assert.equal(audit.recommendation, "skip_duplicate");
  });
});

describe("productMappingEngine", () => {
  it("maps flight school keyword to Aviator Network", () => {
    const intent = classifySearchIntent("how to start a flight school");
    const mapping = mapKeywordToProduct("how to start a flight school", intent);
    assert.equal(mapping.recommendedProductId, "aviator-network");
    assert.equal(mapping.honestNoFit, false);
  });

  it("allows honest no-fit for unrelated keywords", () => {
    const intent = classifySearchIntent("random unrelated topic xyz");
    const mapping = mapKeywordToProduct("random unrelated topic xyz", intent);
    assert.equal(mapping.honestNoFit, true);
    assert.equal(mapping.recommendedProductId, "none");
  });
});

describe("SEOIntelligenceEngine integration", () => {
  it("generates executive report with business-justified recommendations", async () => {
    const report = await runAviationSEOAnalysis();
    assert.equal(report.governance.readOnly, true);
    assert.equal(report.governance.requiresFounderApproval, true);
    assert.ok(report.recommendations.length > 0);
    assert.ok(report.executiveSummary.length > 0);

    const top = report.recommendations[0]!;
    assert.ok(top.opportunityScore >= 0 && top.opportunityScore <= 100);
    assert.ok(top.estimatedBusinessImpact.length > 0);
    assert.ok(top.whyNow.length > 0);
    assert.ok(top.draft?.seoTitle);
    assert.ok(top.draft?.outline.length > 0);
    assert.ok(top.draft?.faqSchema.length > 0);
  });

  it("avoids duplicate content recommendations", async () => {
    const engine = createSEOIntelligenceEngine();
    const request: SEOAnalysisRequest = {
      analysisId: "dup-test",
      requesterId: "test",
      productScope: "test",
      keywords: ["best pilot logbook app"],
      existingContent: [
        {
          url: "/blog/best-pilot-logbook-app",
          title: "Best Pilot Logbook App Guide",
          slug: "best-pilot-logbook-app",
          topics: ["pilot", "logbook", "app", "best"],
          qualityScore: 90,
          needsImprovement: false,
        },
      ],
      timestamp: Date.now(),
    };
    const report = await engine.analyze(request);
    assert.ok(report.skippedDuplicates.includes("best pilot logbook app"));
    assert.equal(report.recommendations.length, 0);
  });

  it("includes flight school example from mission spec", async () => {
    const engine = createSEOIntelligenceEngine();
    const report = await engine.analyze({
      analysisId: "flight-school",
      requesterId: "test",
      productScope: "Aviator Network",
      keywords: ["how to start a flight school"],
      existingContent: [],
      timestamp: Date.now(),
    });
    const rec = report.recommendations.find(
      (r) => r.opportunity.keyword === "how to start a flight school",
    );
    assert.ok(rec);
    assert.equal(rec!.productMapping.recommendedProductId, "aviator-network");
    assert.ok(rec!.draft?.urlSlug.includes("flight-school"));
  });

  it("enforces read-only governance", () => {
    assert.equal(SIE_GOVERNANCE.allowsAutomaticPublishing, false);
    assert.throws(() => assertReadOnlyOperation("publish"));
  });

  it("registers SIE capability in NEOS registry", () => {
    const ids: string[] = [];
    registerSIECapability({ register(c) { ids.push(c.id); } });
    assert.deepEqual(ids, [SIE_CAPABILITY.id]);
  });
});
