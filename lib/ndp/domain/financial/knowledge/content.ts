/**
 * Production knowledge content for the Financial domain.
 * Modular, non-customer-specific reference material.
 */

export interface KnowledgeModule {
  knowledgePackId: string;
  version: string;
  sections: Array<{ id: string; title: string; content: string }>;
}

export const FINANCIAL_KNOWLEDGE_MODULES: KnowledgeModule[] = [
  {
    knowledgePackId: "knowledge-pack-financial-fundamentals",
    version: "1.0.0",
    sections: [
      {
        id: "ff-overview",
        title: "Financial Operations",
        content:
          "Maintain accurate books, timely billing, and disciplined receivables management. Financial health depends on visibility across revenue, expenses, and cash position.",
      },
      {
        id: "ff-discipline",
        title: "Operational Discipline",
        content:
          "Reconcile accounts regularly. Flag anomalies early. Financial recommendations should support sustainable business operations, not short-term cash grabs.",
      },
    ],
  },
  {
    knowledgePackId: "knowledge-pack-billing-fundamentals",
    version: "1.0.0",
    sections: [
      {
        id: "bf-invoicing",
        title: "Invoicing Basics",
        content:
          "Issue clear invoices with line items, due dates, and payment instructions. Consistent billing cycles reduce disputes and accelerate collection.",
      },
      {
        id: "bf-accuracy",
        title: "Billing Accuracy",
        content:
          "Verify scope and pricing before sending invoices. Billing errors erode trust and delay payment.",
      },
    ],
  },
  {
    knowledgePackId: "knowledge-pack-accounts-receivable-fundamentals",
    version: "1.0.0",
    sections: [
      {
        id: "ar-aging",
        title: "AR Aging",
        content:
          "Track receivables by aging bucket: current, 30, 60, 90+ days. Prioritize follow-up on overdue accounts with clear escalation paths.",
      },
      {
        id: "ar-collection",
        title: "Collection Principles",
        content:
          "Pursue payment professionally and persistently. Preserve customer relationships while protecting cash flow.",
      },
    ],
  },
  {
    knowledgePackId: "knowledge-pack-cash-flow-basics",
    version: "1.0.0",
    sections: [
      {
        id: "cf-timing",
        title: "Cash Timing",
        content:
          "Cash flow is about timing — when money enters and leaves. Monitor inflows from receivables and outflows from expenses and payables.",
      },
      {
        id: "cf-signals",
        title: "Early Warning Signals",
        content:
          "Rising DSO, declining collections, and expense spikes are early cash flow warning signs. Act before liquidity tightens.",
      },
    ],
  },
  {
    knowledgePackId: "knowledge-pack-financial-reporting",
    version: "1.0.0",
    sections: [
      {
        id: "fr-statements",
        title: "Reporting Standards",
        content:
          "Produce reports that are accurate, timely, and actionable. P&L, balance sheet, and cash flow views should align and reconcile.",
      },
      {
        id: "fr-insights",
        title: "Insight Delivery",
        content:
          "Translate numbers into business meaning. Highlight trends, variances, and risks the business owner can act on.",
      },
    ],
  },
  {
    knowledgePackId: "knowledge-pack-payment-followup-strategy",
    version: "1.0.0",
    sections: [
      {
        id: "pf-cadence",
        title: "Follow-up Cadence",
        content:
          "Follow up on overdue invoices at defined intervals: friendly reminder, firm notice, escalation. Escalate only when relationship-preserving outreach fails.",
      },
      {
        id: "pf-tone",
        title: "Professional Tone",
        content:
          "Payment follow-up should be firm but respectful. Assume good intent; clarify disputes before escalating.",
      },
    ],
  },
  {
    knowledgePackId: "knowledge-pack-expense-awareness",
    version: "1.0.0",
    sections: [
      {
        id: "ea-tracking",
        title: "Expense Tracking",
        content:
          "Categorize expenses consistently. Uncontrolled spending erodes margins even when revenue grows.",
      },
      {
        id: "ea-review",
        title: "Periodic Review",
        content:
          "Review recurring expenses quarterly. Eliminate waste before seeking revenue growth to fix margin pressure.",
      },
    ],
  },
];

export function getKnowledgeModuleContent(knowledgePackId: string): KnowledgeModule | undefined {
  return FINANCIAL_KNOWLEDGE_MODULES.find((entry) => entry.knowledgePackId === knowledgePackId);
}

export function renderKnowledgePackText(knowledgePackId: string): string {
  const knowledgeModule = getKnowledgeModuleContent(knowledgePackId);
  if (!knowledgeModule) return "";
  return knowledgeModule.sections
    .map((section) => `${section.title}\n${section.content}`)
    .join("\n\n");
}
