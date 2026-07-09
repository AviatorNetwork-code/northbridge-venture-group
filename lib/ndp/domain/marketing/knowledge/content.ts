/**
 * Production knowledge content for the Marketing domain.
 * Modular, non-customer-specific reference material.
 */

export interface KnowledgeModule {
  knowledgePackId: string;
  version: string;
  sections: Array<{ id: string; title: string; content: string }>;
}

export const MARKETING_KNOWLEDGE_MODULES: KnowledgeModule[] = [
  {
    knowledgePackId: "knowledge-pack-marketing-fundamentals",
    version: "1.0.0",
    sections: [
      {
        id: "mf-audience",
        title: "Audience Definition",
        content:
          "Define target audiences by need, behavior, and buying stage. Avoid generic demographics without actionable intent signals.",
      },
      {
        id: "mf-funnel",
        title: "Marketing Funnel",
        content:
          "Structure work across awareness, consideration, and conversion. Match channel and message to funnel stage.",
      },
      {
        id: "mf-measurement",
        title: "Measurement Basics",
        content:
          "Track leading indicators (reach, engagement) and lagging indicators (leads, conversions). Compare period-over-period with context.",
      },
    ],
  },
  {
    knowledgePackId: "knowledge-pack-campaign-planning",
    version: "1.0.0",
    sections: [
      {
        id: "cp-structure",
        title: "Campaign Structure",
        content:
          "Each campaign needs objective, audience, offer, channels, timeline, budget envelope, and success metrics before launch.",
      },
      {
        id: "cp-sequencing",
        title: "Launch Sequencing",
        content:
          "Sequence creative development, audience validation, channel setup, and measurement before spend activation.",
      },
      {
        id: "cp-audience",
        title: "Audience Recommendations",
        content:
          "Recommend audiences based on existing customer patterns, geographic fit, and offer relevance — not platform defaults alone.",
      },
    ],
  },
  {
    knowledgePackId: "knowledge-pack-content-strategy",
    version: "1.0.0",
    sections: [
      {
        id: "cs-calendar",
        title: "Content Calendar",
        content:
          "Plan content around business rhythms, seasonal relevance, and campaign milestones. Balance evergreen and timely posts.",
      },
      {
        id: "cs-platforms",
        title: "Platform Selection",
        content:
          "Choose platforms by audience presence and content format fit. Prefer depth on fewer channels over thin presence everywhere.",
      },
      {
        id: "cs-scheduling",
        title: "Scheduling Guidance",
        content:
          "Recommend posting frequency based on capacity and engagement patterns. Consistency beats volume spikes.",
      },
    ],
  },
  {
    knowledgePackId: "knowledge-pack-branding",
    version: "1.0.0",
    sections: [
      {
        id: "br-voice",
        title: "Brand Voice",
        content:
          "Maintain consistent voice across channels. Flag deviations in tone, terminology, or visual identity references.",
      },
      {
        id: "br-messaging",
        title: "Messaging Consistency",
        content:
          "Align headlines, calls-to-action, and value propositions with established brand positioning.",
      },
      {
        id: "br-review",
        title: "Identity Review",
        content:
          "Review content for brand alignment before publication. Note specific corrections, not vague style preferences.",
      },
    ],
  },
  {
    knowledgePackId: "knowledge-pack-marketing-analytics",
    version: "1.0.0",
    sections: [
      {
        id: "ma-kpis",
        title: "KPI Review",
        content:
          "Evaluate CTR, conversion rate, cost per lead, and ROAS in context. Compare against prior periods and campaign goals.",
      },
      {
        id: "ma-trends",
        title: "Trend Detection",
        content:
          "Identify sustained trends vs. noise. Surface seasonality, channel shifts, and audience behavior changes.",
      },
      {
        id: "ma-recommendations",
        title: "Analysis Output",
        content:
          "Recommendations must cite observed metrics. Prioritize customer outcomes over spend increases.",
      },
    ],
  },
  {
    knowledgePackId: "knowledge-pack-budget-optimization",
    version: "1.0.0",
    sections: [
      {
        id: "bo-allocation",
        title: "Budget Allocation",
        content:
          "Allocate budget by expected ROI and strategic priority. Reserve test budget for experiments with clear success criteria.",
      },
      {
        id: "bo-roi",
        title: "ROI Analysis",
        content:
          "Compare channel and campaign ROI. Recommend reallocation toward proven performers and away from underperforming spend.",
      },
      {
        id: "bo-prioritization",
        title: "Campaign Prioritization",
        content:
          "Prioritize campaigns by customer impact and efficiency. Recommend pausing or reducing spend when ROI is negative.",
      },
    ],
  },
];

export function getKnowledgeModuleContent(
  knowledgePackId: string,
): KnowledgeModule | undefined {
  return MARKETING_KNOWLEDGE_MODULES.find(
    (entry) => entry.knowledgePackId === knowledgePackId,
  );
}

export function renderKnowledgePackText(knowledgePackId: string): string {
  const knowledgeModule = getKnowledgeModuleContent(knowledgePackId);
  if (!knowledgeModule) {
    return "";
  }
  return knowledgeModule.sections
    .map((section) => `${section.title}: ${section.content}`)
    .join("\n");
}
