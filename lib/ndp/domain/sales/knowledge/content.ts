/**
 * Production knowledge content for the Sales domain.
 * Modular, non-customer-specific reference material.
 */

export interface KnowledgeModule {
  knowledgePackId: string;
  version: string;
  sections: Array<{ id: string; title: string; content: string }>;
}

export const SALES_KNOWLEDGE_MODULES: KnowledgeModule[] = [
  {
    knowledgePackId: "knowledge-pack-sales-fundamentals",
    version: "1.0.0",
    sections: [
      {
        id: "sf-pipeline",
        title: "Pipeline Basics",
        content:
          "Structure opportunities by stage with clear entry and exit criteria. Every deal should have next action, owner, and expected close timing.",
      },
      {
        id: "sf-conversion",
        title: "Conversion Principles",
        content:
          "Focus on buyer readiness and fit before pushing proposals. Conversion improves when qualification and follow-up are disciplined.",
      },
    ],
  },
  {
    knowledgePackId: "knowledge-pack-lead-qualification",
    version: "1.0.0",
    sections: [
      {
        id: "lq-scoring",
        title: "Lead Scoring",
        content:
          "Score leads by intent, budget fit, timeline, and authority. Prioritize high-intent inquiries with clear next steps.",
      },
      {
        id: "lq-disqualify",
        title: "Disqualification",
        content:
          "Disqualify early when fit is poor. Protect team capacity for prospects with genuine conversion potential.",
      },
    ],
  },
  {
    knowledgePackId: "knowledge-pack-consultative-selling",
    version: "1.0.0",
    sections: [
      {
        id: "cs-discovery",
        title: "Discovery",
        content:
          "Use discovery questions to understand pain, urgency, and decision process before recommending solutions.",
      },
      {
        id: "cs-trust",
        title: "Trust Building",
        content:
          "Recommend only what fits the customer's situation. Long-term trust outperforms short-term closing tactics.",
      },
    ],
  },
  {
    knowledgePackId: "knowledge-pack-proposal-quote-strategy",
    version: "1.0.0",
    sections: [
      {
        id: "pq-structure",
        title: "Proposal Structure",
        content:
          "Lead with customer outcomes, scope, timeline, and pricing clarity. Avoid complexity that slows decision-making.",
      },
      {
        id: "pq-pricing",
        title: "Pricing Presentation",
        content:
          "Present pricing in context of value delivered. Offer options when helpful — not to confuse.",
      },
    ],
  },
  {
    knowledgePackId: "knowledge-pack-follow-up-strategy",
    version: "1.0.0",
    sections: [
      {
        id: "fu-cadence",
        title: "Follow-up Cadence",
        content:
          "Define follow-up intervals by lead temperature. Warm leads need faster response; cold leads need value-add touchpoints.",
      },
      {
        id: "fu-reengage",
        title: "Re-engagement",
        content:
          "Re-engage stalled prospects with new information or questions — not repetitive pressure.",
      },
    ],
  },
  {
    knowledgePackId: "knowledge-pack-crm-hygiene",
    version: "1.0.0",
    sections: [
      {
        id: "crm-records",
        title: "Record Quality",
        content:
          "Keep contact, stage, and activity fields current. Stale CRM data causes missed follow-ups and bad forecasts.",
      },
      {
        id: "crm-stages",
        title: "Stage Definitions",
        content:
          "Use consistent stage definitions across the team. Move deals only when stage criteria are met.",
      },
    ],
  },
  {
    knowledgePackId: "knowledge-pack-sales-pipeline-management",
    version: "1.0.0",
    sections: [
      {
        id: "pm-velocity",
        title: "Pipeline Velocity",
        content:
          "Track time-in-stage and identify bottlenecks. Accelerate deals with clear next actions, not additional outreach volume.",
      },
      {
        id: "pm-forecast",
        title: "Forecasting",
        content:
          "Forecast from qualified pipeline with realistic close probabilities. Flag risk early.",
      },
    ],
  },
];

export function getKnowledgeModuleContent(knowledgePackId: string): KnowledgeModule | undefined {
  return SALES_KNOWLEDGE_MODULES.find((entry) => entry.knowledgePackId === knowledgePackId);
}

export function renderKnowledgePackText(knowledgePackId: string): string {
  const knowledgeModule = getKnowledgeModuleContent(knowledgePackId);
  if (!knowledgeModule) return "";
  return knowledgeModule.sections
    .map((section) => `${section.title}\n${section.content}`)
    .join("\n\n");
}
