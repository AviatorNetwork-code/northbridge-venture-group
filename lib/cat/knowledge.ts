import type { BusinessProfile, CatRecommendation } from "@/lib/cat/types";

export type SpecialistDefinition = {
  id: string;
  name: string;
  description: string;
  industries: string[];
  triggers: string[];
};

export type TeamDefinition = {
  id: string;
  name: string;
  description: string;
  industries: string[];
  minEmployees?: number;
};

export const specialistCatalog: SpecialistDefinition[] = [
  {
    id: "appointment",
    name: "Appointment Specialist",
    description: "Schedules, reschedules, and confirms appointments across your calendar channels.",
    industries: ["dental", "healthcare", "salon", "fitness", "professional-services"],
    triggers: ["appointment", "scheduling", "calendar", "booking", "clinic", "dental"],
  },
  {
    id: "customer-service",
    name: "Customer Service Specialist",
    description: "Handles inbound questions, follow-ups, and client communication.",
    industries: ["dental", "retail", "hospitality", "professional-services", "general"],
    triggers: ["customer", "support", "inquiry", "whatsapp", "communication", "dental"],
  },
  {
    id: "billing",
    name: "Billing Specialist",
    description: "Invoicing, payment follow-ups, and insurance or billing coordination.",
    industries: ["dental", "healthcare", "professional-services", "general"],
    triggers: ["billing", "invoice", "payment", "insurance", "stripe", "dental"],
  },
  {
    id: "onboarding",
    name: "Onboarding Specialist",
    description: "Guides new clients through intake, setup, and first-touch workflows.",
    industries: ["general", "saas", "professional-services"],
    triggers: ["onboarding", "intake", "new client", "setup"],
  },
  {
    id: "workflow",
    name: "Workflow Specialist",
    description: "Automates repeatable operational processes and task routing.",
    industries: ["general"],
    triggers: ["automation", "workflow", "process", "operations"],
  },
];

export const teamCatalog: TeamDefinition[] = [
  {
    id: "dental-team",
    name: "Dental Team",
    description: "Coordinated appointment, billing, and patient communication specialists for dental practices.",
    industries: ["dental", "healthcare"],
    minEmployees: 5,
  },
  {
    id: "client-success",
    name: "Client Success Team",
    description: "Onboarding and support specialists working as a coordinated unit.",
    industries: ["saas", "professional-services", "general"],
    minEmployees: 10,
  },
  {
    id: "support-team",
    name: "Support Team",
    description: "Multi-channel customer service at higher volume.",
    industries: ["retail", "hospitality", "general"],
    minEmployees: 15,
  },
];

export const connectorCatalog = [
  { id: "google", name: "Google Calendar", triggers: ["calendar", "google", "appointment", "scheduling"] },
  { id: "gmail", name: "Gmail", triggers: ["email", "gmail", "communication"] },
  { id: "stripe", name: "Stripe", triggers: ["payment", "stripe", "billing", "online payments"] },
  { id: "whatsapp", name: "WhatsApp", triggers: ["whatsapp", "messaging", "sms", "communication"] },
  { id: "hubspot", name: "HubSpot", triggers: ["crm", "hubspot", "pipeline", "sales"] },
];

export const pricingKnowledge = {
  starter: {
    name: "Operations Starter",
    price: "$800/mo",
    includes: "2 Specialists, core connectors, unified inbox",
  },
  pro: {
    name: "Operations Pro",
    price: "$2,400/mo",
    includes: "Up to 12 Specialists, all connectors, analytics, priority support",
  },
  roi: [
    "Most clients save 15–25 hours per week within the first month.",
    "Start with 1–2 Specialists and measure before scaling.",
    "Managers typically pay off when you have 8+ Specialists or complex escalations.",
  ],
};

export function buildRecommendations(profile: BusinessProfile): CatRecommendation[] {
  const industry = (profile.industry ?? "general").toLowerCase();
  const employees = profile.employeeCount ?? 0;
  const software = (profile.existingSoftware ?? []).map((item) => item.toLowerCase());
  const channels = (profile.communicationChannels ?? []).map((item) => item.toLowerCase());
  const text = [
    industry,
    ...(profile.challenges ?? []),
    ...(profile.goals ?? []),
    ...software,
    ...channels,
  ]
    .join(" ")
    .toLowerCase();

  const recommendations: CatRecommendation[] = [];

  const matchedSpecialists = specialistCatalog.filter((specialist) => {
    const industryMatch =
      specialist.industries.includes(industry) || specialist.industries.includes("general");
    const triggerMatch = specialist.triggers.some((trigger) => text.includes(trigger));
    return industryMatch && (triggerMatch || industry !== "general");
  });

  const coreSpecialists =
    industry === "dental"
      ? specialistCatalog.filter((s) =>
          ["appointment", "customer-service"].includes(s.id),
        )
      : matchedSpecialists.slice(0, 2);

  for (const specialist of coreSpecialists) {
    recommendations.push({
      tier: "specialist",
      name: specialist.name,
      status: "recommended",
      reason: specialist.description,
    });
  }

  if (industry === "dental" || text.includes("billing") || text.includes("insurance")) {
    const billing = specialistCatalog.find((s) => s.id === "billing");
    if (billing && !coreSpecialists.find((s) => s.id === "billing")) {
      recommendations.push({
        tier: "specialist",
        name: billing.name,
        status: "optional",
        reason: "Useful once appointment and communication flows are stable.",
      });
    }
  }

  const optionalTeam = teamCatalog.find(
    (team) =>
      team.industries.includes(industry) &&
      (!team.minEmployees || employees >= team.minEmployees),
  );

  if (optionalTeam) {
    recommendations.push({
      tier: "team",
      name: optionalTeam.name,
      status: employees >= (optionalTeam.minEmployees ?? 20) ? "optional" : "not-recommended",
      reason:
        employees >= (optionalTeam.minEmployees ?? 20)
          ? optionalTeam.description
          : `Consider after your Specialists are handling steady volume. You have ~${employees || "a small"} team.`,
    });
  }

  const needsManager = employees >= 25 || (profile.challenges ?? []).some((c) =>
    c.toLowerCase().includes("escalat"),
  );

  recommendations.push({
    tier: "manager",
    name: "Operations Manager",
    status: needsManager ? "optional" : "not-recommended",
    reason: needsManager
      ? "May help if escalations are growing across multiple Specialists."
      : "Not recommended yet — your Specialists can handle current workload. Managers add value at higher scale or complex oversight needs.",
  });

  if (employees >= 50) {
    recommendations.push({
      tier: "regional-manager",
      name: "Regional Manager",
      status: "not-recommended",
      reason: "Only needed for multi-location operations with 50+ employees. Not justified for your current size.",
    });
  }

  for (const connector of connectorCatalog) {
    const needed = connector.triggers.some((trigger) => text.includes(trigger));
    if (needed) {
      recommendations.push({
        tier: "connector",
        name: connector.name,
        status: "recommended",
        reason: `Supports your ${connector.triggers.find((t) => text.includes(t)) ?? "operational"} needs.`,
      });
    }
  }

  if (recommendations.filter((r) => r.tier === "connector").length === 0) {
    recommendations.push({
      tier: "connector",
      name: "Google Calendar",
      status: "optional",
      reason: "A common starting connector for scheduling-heavy businesses.",
    });
  }

  return recommendations;
}

export function formatRecommendations(recommendations: CatRecommendation[]): string {
  const tiers = {
    recommended: recommendations.filter((r) => r.status === "recommended"),
    optional: recommendations.filter((r) => r.status === "optional"),
    deferred: recommendations.filter((r) => r.status === "not-recommended"),
  };

  const lines: string[] = ["Here's my recommendation — minimum solution first:\n"];

  if (tiers.recommended.length > 0) {
    lines.push("**Start with:**");
    for (const item of tiers.recommended) {
      lines.push(`✓ ${item.name} — ${item.reason}`);
    }
    lines.push("");
  }

  if (tiers.optional.length > 0) {
    lines.push("**Optional (when ready):**");
    for (const item of tiers.optional) {
      lines.push(`○ ${item.name} — ${item.reason}`);
    }
    lines.push("");
  }

  if (tiers.deferred.length > 0) {
    lines.push("**Not recommended yet:**");
    for (const item of tiers.deferred) {
      lines.push(`✗ ${item.name} — ${item.reason}`);
    }
  }

  return lines.join("\n");
}
