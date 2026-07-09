/**
 * NEOS communication package registry for Nordi.
 * Packages are vendored under packages/ for independent Vercel builds.
 */

export const COMMUNICATION_PACKAGES = [
  {
    id: "@northbridge/neo-bridge",
    role: "Product → NEO session reporting and learning pipeline bridge",
    wired: "scripts",
  },
  {
    id: "@northbridge/conversation-state",
    role: "Fact-memory planner via processConversationTurn",
    wired: "discovery-planner",
  },
  {
    id: "@northbridge/conversation-engine",
    role: "Turn policy for discovery ask/confirm/finish",
    wired: "discovery-turn-policy",
  },
  {
    id: "@northbridge/core-conversation",
    role: "Pre-AI message classification, budgets, and payload redaction",
    wired: "deferred",
  },
  {
    id: "@northbridge/interaction-engine",
    role: "Interaction envelope composition across modalities",
    wired: "deferred",
  },
  {
    id: "@northbridge/interaction-standards",
    role: "NIP-001 interaction density limits",
    wired: "deferred",
  },
  {
    id: "@northbridge/adaptive-cards",
    role: "Compact expandable chat cards",
    wired: "deferred",
  },
  {
    id: "@northbridge/context-actions",
    role: "Context-aware quick actions from conversation state",
    wired: "deferred",
  },
  {
    id: "@northbridge/presentation-policy",
    role: "Presentation format selection for chat UI",
    wired: "deferred",
  },
  {
    id: "@northbridge/progressive-forms",
    role: "One-question-at-a-time form sequencing",
    wired: "deferred",
  },
  {
    id: "@northbridge/assistant-contracts",
    role: "Assistant message and rich-card contracts",
    wired: "deferred",
  },
  {
    id: "@northbridge/assistant-cards",
    role: "Rich card schema validation",
    wired: "deferred",
  },
  {
    id: "@northbridge/platform-ai",
    role: "Budget and token utilities for core-conversation",
    wired: "dependency",
  },
  {
    id: "@northbridge/workforce-contracts",
    role: "Workforce platform shared contracts (organization, roles, tasks)",
    wired: "deferred",
  },
  {
    id: "@northbridge/workforce-core",
    role: "Workforce platform core model, hierarchy, permissions, validation",
    wired: "deferred",
  },
  {
    id: "@northbridge/specialist-runtime",
    role: "Reusable specialist task lifecycle and execution runtime",
    wired: "deferred",
  },
  {
    id: "@northbridge/team-orchestrator",
    role: "Team Lead orchestration, delegation, synthesis, and reports",
    wired: "deferred",
  },
] as const;

export type CommunicationPackageId = (typeof COMMUNICATION_PACKAGES)[number]["id"];
