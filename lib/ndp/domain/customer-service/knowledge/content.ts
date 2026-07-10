/**
 * Production knowledge content for the Customer Service domain.
 * Modular, non-customer-specific reference material.
 */

export interface KnowledgeModule {
  knowledgePackId: string;
  version: string;
  sections: Array<{ id: string; title: string; content: string }>;
}

export const CUSTOMER_SERVICE_KNOWLEDGE_MODULES: KnowledgeModule[] = [
  {
    knowledgePackId: "knowledge-pack-customer-service-fundamentals",
    version: "1.0.0",
    sections: [
      {
        id: "csf-response",
        title: "Response Principles",
        content:
          "Acknowledge the customer promptly, clarify the request, and provide a clear next step. Tone should be professional and empathetic.",
      },
      {
        id: "csf-ownership",
        title: "Ownership",
        content:
          "Own the inquiry through resolution or handoff. Never leave the customer without a status or follow-up expectation.",
      },
    ],
  },
  {
    knowledgePackId: "knowledge-pack-reception-fundamentals",
    version: "1.0.0",
    sections: [
      {
        id: "rf-triage",
        title: "Inbound Triage",
        content:
          "Classify inbound requests by urgency, topic, and routing need. Urgent issues escalate; routine requests queue with clear response windows.",
      },
      {
        id: "rf-first-contact",
        title: "First Contact",
        content:
          "First contact sets expectations. Confirm who you are helping, what they need, and when they will hear back.",
      },
    ],
  },
  {
    knowledgePackId: "knowledge-pack-appointment-handling",
    version: "1.0.0",
    sections: [
      {
        id: "ah-scheduling",
        title: "Scheduling Workflow",
        content:
          "Confirm service type, preferred times, and contact details before booking. Offer alternatives when the first slot is unavailable.",
      },
      {
        id: "ah-reschedule",
        title: "Reschedule & Cancel",
        content:
          "Handle changes with minimal friction. Confirm new time, send confirmation, and update reminder schedules.",
      },
    ],
  },
  {
    knowledgePackId: "knowledge-pack-reminder-strategy",
    version: "1.0.0",
    sections: [
      {
        id: "rs-timing",
        title: "Reminder Timing",
        content:
          "Send reminders at intervals that reduce no-shows without overwhelming customers. Typical cadence: 48 hours and 24 hours before appointment.",
      },
      {
        id: "rs-channel",
        title: "Channel Selection",
        content:
          "Match reminder channel to customer preference and urgency. SMS for time-sensitive; email for detailed instructions.",
      },
    ],
  },
  {
    knowledgePackId: "knowledge-pack-customer-success-fundamentals",
    version: "1.0.0",
    sections: [
      {
        id: "cs-success",
        title: "Success Metrics",
        content:
          "Track satisfaction signals, repeat engagement, and resolution quality. Proactive outreach prevents churn before complaints arise.",
      },
      {
        id: "cs-retention",
        title: "Retention",
        content:
          "Retention improves when customers feel heard and supported. Follow up after resolution to confirm satisfaction.",
      },
    ],
  },
  {
    knowledgePackId: "knowledge-pack-complaint-handling",
    version: "1.0.0",
    sections: [
      {
        id: "ch-acknowledge",
        title: "Acknowledge & Listen",
        content:
          "Acknowledge frustration without defensiveness. Summarize the issue to confirm understanding before proposing resolution.",
      },
      {
        id: "ch-escalation",
        title: "Escalation Criteria",
        content:
          "Escalate when resolution exceeds authority, legal risk is present, or the customer requests supervisor involvement.",
      },
    ],
  },
  {
    knowledgePackId: "knowledge-pack-service-recovery",
    version: "1.0.0",
    sections: [
      {
        id: "sr-recovery",
        title: "Recovery Steps",
        content:
          "Apologize sincerely, explain what went wrong, fix the issue, and offer appropriate goodwill when warranted.",
      },
      {
        id: "sr-followup",
        title: "Follow-up",
        content:
          "Confirm recovery was satisfactory. Document lessons learned to prevent recurrence.",
      },
    ],
  },
];

export function getKnowledgeModuleContent(knowledgePackId: string): KnowledgeModule | undefined {
  return CUSTOMER_SERVICE_KNOWLEDGE_MODULES.find(
    (entry) => entry.knowledgePackId === knowledgePackId,
  );
}

export function renderKnowledgePackText(knowledgePackId: string): string {
  const knowledgeModule = getKnowledgeModuleContent(knowledgePackId);
  if (!knowledgeModule) return "";
  return knowledgeModule.sections
    .map((section) => `${section.title}\n${section.content}`)
    .join("\n\n");
}
