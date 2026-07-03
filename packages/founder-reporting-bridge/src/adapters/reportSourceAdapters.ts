import type { ReportSourceInput } from "../types/report.js";

/** Sample aggregated inputs — production adapters pull from connected repos. */
export function createSampleReportSources(): ReportSourceInput[] {
  const now = Date.now();
  return [
    {
      sourceId: "northbridge_website_neo",
      productId: "northbridge-website",
      summary: "Consultative CAT v1 deployed; discovery-first flow active.",
      highlights: [
        "CAT consultative selling stages live",
        "Flight-school example passes without immediate pitch",
      ],
      recommendations: [
        "Connect Website CAT to Product Capability Broker via thin adapter",
      ],
      pendingDecisions: [
        "Approve PCB adapter integration for Website CAT",
      ],
      timestamp: now,
    },
    {
      sourceId: "aviator_network_neo",
      productId: "aviator-network",
      summary: "Aviator NEO packages progressing; capability broker adapter ready.",
      highlights: ["Product Capability Broker Aviator adapter complete"],
      timestamp: now,
    },
    {
      sourceId: "cat_website_analytics",
      productId: "northbridge-website",
      summary: "CAT analytics: discovery_started and qualified_lead_detected events firing.",
      highlights: [
        "Consultative flow generating discovery_started events",
        "No customer PII in analytics payloads",
      ],
      timestamp: now,
    },
    {
      sourceId: "executive_intelligence",
      summary: "Executive intelligence recommends SEO content for flight school keywords.",
      highlights: ["SEO Intelligence Engine identifies high-value aviation opportunities"],
      recommendations: ["Review SEO brief for 'how to start a flight school'"],
      timestamp: now,
    },
    {
      sourceId: "product_capability_broker",
      summary: "PCB blocking unsupported 'guaranteed student acquisition' claims.",
      highlights: ["Aviator capability responses include unsupported claim guardrails"],
      timestamp: now,
    },
    {
      sourceId: "institutional_memory",
      summary: "NEOS capability registry updated with 6 platform packages.",
      highlights: ["VII, AEE, PCB, VPRE, SIE capabilities registered"],
      timestamp: now,
    },
  ];
}

export function aggregateSources(inputs: ReportSourceInput[]): ReportSourceInput[] {
  return inputs.map((input) => ({
    ...input,
    summary: input.summary.slice(0, 500),
    highlights: input.highlights.map((h) => h.slice(0, 300)),
    recommendations: input.recommendations?.map((r) => r.slice(0, 300)),
    pendingDecisions: input.pendingDecisions?.map((d) => d.slice(0, 300)),
    risks: input.risks?.map((r) => r.slice(0, 300)),
  }));
}
