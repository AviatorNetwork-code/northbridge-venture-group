/**
 * Example: SEO analysis for Northbridge aviation keywords.
 */
import { createSEOIntelligenceEngine } from "../../src/core/seoIntelligenceEngine.js";
import { getSeedOpportunities } from "../../src/engines/opportunityDetector.js";
import type { SEOAnalysisRequest } from "../../src/types/report.js";

export async function runAviationSEOAnalysis() {
  const engine = createSEOIntelligenceEngine();

  const request: SEOAnalysisRequest = {
    analysisId: "analysis-aviation-001",
    requesterId: "neos-seo-strategist",
    productScope: "Northbridge aviation portfolio",
    keywords: getSeedOpportunities().slice(0, 4),
    existingContent: [
      {
        url: "/services",
        title: "Northbridge Digital Services",
        slug: "services",
        topics: ["website", "digital", "platform"],
        qualityScore: 80,
        needsImprovement: false,
      },
    ],
    timestamp: Date.now(),
  };

  return engine.analyze(request);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runAviationSEOAnalysis().then((report) => console.log(JSON.stringify(report, null, 2)));
}
