import {
  buildOperationsSnapshot,
  getModuleLabel,
  moduleKnowledge,
  navigationAliases,
} from "@/lib/cat/operations-context";
import {
  buildRecommendations,
  formatRecommendations,
  pricingKnowledge,
} from "@/lib/cat/knowledge";
import {
  buildDefaultConnectorState,
  mergeConnectorInstances,
} from "@/lib/connectors/connector-health";
import {
  getCatConnectorMessages,
  explainConnectorPurpose,
} from "@/lib/connectors/connector-recommendations";
import { tryConversationInterruption } from "@/lib/cat/interruption-bridge";
import type {
  BusinessProfile,
  CatEngineContext,
  CatEngineResult,
  CatRecommendation,
} from "@/lib/cat/types";

function includesAny(text: string, terms: string[]): boolean {
  return terms.some((term) => text.includes(term));
}

function extractIndustry(text: string): string | undefined {
  const industries: Record<string, string[]> = {
    dental: ["dental", "dentist", "dental clinic", "orthodont"],
    healthcare: ["healthcare", "medical", "clinic", "hospital", "patient"],
    retail: ["retail", "store", "shop", "ecommerce", "e-commerce"],
    hospitality: ["restaurant", "hotel", "hospitality", "cafe"],
    "professional-services": ["law firm", "accounting", "consulting", "agency"],
    saas: ["saas", "software", "startup", "platform"],
    fitness: ["gym", "fitness", "studio", "yoga"],
    salon: ["salon", "spa", "beauty"],
  };

  for (const [industry, keywords] of Object.entries(industries)) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      return industry;
    }
  }

  return undefined;
}

function extractEmployeeCount(text: string): number | undefined {
  const match = text.match(/(\d+)\s*(employees|staff|people|team members)/i);
  if (match) return Number.parseInt(match[1], 10);

  if (includesAny(text, ["just me", "solo", "one person", "only me"])) return 1;
  if (includesAny(text, ["small team", "few people"])) return 5;

  return undefined;
}

function extractSoftware(text: string): string[] {
  const found: string[] = [];
  const map: Record<string, string[]> = {
    "Google Calendar": ["google calendar", "google cal", "gcal"],
    Gmail: ["gmail", "google mail"],
    Stripe: ["stripe", "online payment", "online payments"],
    WhatsApp: ["whatsapp", "whats app"],
    HubSpot: ["hubspot", "crm"],
    "Google Workspace": ["google workspace", "g suite"],
  };

  for (const [name, triggers] of Object.entries(map)) {
    if (triggers.some((trigger) => text.includes(trigger))) {
      found.push(name);
    }
  }

  return found;
}

function extractChannels(text: string): string[] {
  const channels: string[] = [];
  if (includesAny(text, ["whatsapp"])) channels.push("WhatsApp");
  if (includesAny(text, ["email", "gmail"])) channels.push("Email");
  if (includesAny(text, ["sms", "text message"])) channels.push("SMS");
  if (includesAny(text, ["instagram", "dm"])) channels.push("Instagram");
  if (includesAny(text, ["phone", "call"])) channels.push("Phone");
  return channels;
}

function detectNavigation(text: string): string | undefined {
  if (!includesAny(text, ["take me", "open", "show", "go to", "navigate", "bring me"])) {
    return undefined;
  }

  for (const [alias, moduleId] of Object.entries(navigationAliases)) {
    if (text.includes(alias)) {
      return moduleId;
    }
  }

  return undefined;
}

function detectModuleExplanation(text: string): string | undefined {
  if (!includesAny(text, ["what is", "explain", "tell me about", "how does", "what does"])) {
    return undefined;
  }

  for (const [alias, moduleId] of Object.entries(navigationAliases)) {
    if (text.includes(alias)) {
      return moduleId;
    }
  }

  if (includesAny(text, ["operations center", "platform", "cat"])) {
    return "dashboard";
  }

  return undefined;
}

function isBlockedRequest(text: string): string | undefined {
  if (includesAny(text, ["approve", "authorize", "charge", "refund", "pay invoice"])) {
    return "I can't approve financial decisions — that's outside my role as your advisor. I can explain pricing and help you understand ROI, but billing actions require your authorization in the Billing module.";
  }

  if (
    includesAny(text, [
      "run workflow",
      "execute workflow",
      "process this",
      "handle this ticket",
      "reply to this customer",
      "send this email",
      "book this appointment",
    ])
  ) {
    return "I don't perform operational work — that's what Specialists are for. I can recommend the right Specialist and guide your setup, but I won't execute workflows or act on your behalf.";
  }

  if (
    includesAny(text, [
      "as a specialist",
      "i'll handle your support",
      "let me process",
      "i can book",
      "i will invoice",
    ])
  ) {
    return "I'm CAT, your Northbridge Workforce Advisor — not a Specialist. I discover needs, recommend solutions, and coordinate onboarding. Specialists handle the actual work.";
  }

  return undefined;
}

function buildOnboardingSummary(moduleId: string): CatEngineResult {
  const snapshot = buildOperationsSnapshot(moduleId);
  const { onboarding, connectors: connectorList } = snapshot;

  const connected = connectorList.filter((c) => c.connected);
  const missing = connectorList.filter((c) => !c.connected);
  const pendingItems = onboarding.items.filter((item) => !item.complete);

  const lines = [
    `You are **${onboarding.readinessPercent}% ready** for launch.`,
    onboarding.canLaunch
      ? "Your workforce can launch today with your current setup."
      : "A few more steps will get you to a confident launch.",
    "",
    "**Connectors:**",
    ...connected.map((c) => `✓ ${c.name} is connected`),
    ...missing.map((c) => `○ ${c.name} is still missing or syncing`),
    "",
    "**Remaining checklist:**",
    ...(pendingItems.length > 0
      ? pendingItems.map((item) => `○ ${item.item}`)
      : ["✓ All checklist items complete"]),
  ];

  if (missing.find((c) => c.name === "HubSpot")) {
    lines.push("", "You don't need HubSpot yet unless CRM tracking is a priority right now.");
  }

  return {
    reply: lines.join("\n"),
    quickReplies: ["What should I do next?", "Take me to Onboarding", "Recommend Specialists"],
    actions: [
      { type: "navigate", label: "Open Onboarding", href: "/operations/onboarding" },
      { type: "navigate", label: "View Connectors", href: "/operations/connectors" },
    ],
  };
}

function buildDiscoveryFollowUp(profile: BusinessProfile): string | undefined {
  if (!profile.employeeCount) {
    return "How many employees do you have?";
  }

  if (!profile.communicationChannels?.length) {
    return "Do customers contact you through WhatsApp, email, or phone?";
  }

  if (!profile.existingSoftware?.length) {
    return "Do you already use Google Calendar or collect online payments?";
  }

  if (!profile.existingSoftware?.some((s) => s.toLowerCase().includes("crm"))) {
    return "Do you use a CRM like HubSpot, or is that not a priority yet?";
  }

  return undefined;
}

function resolveCatPendingQuestion(profile: BusinessProfile): { id: string; prompt: string } | undefined {
  const followUp = buildDiscoveryFollowUp(profile);
  if (!followUp) return undefined;

  if (!profile.employeeCount) {
    return { id: "cat-team-size", prompt: followUp };
  }
  if (!profile.communicationChannels?.length) {
    return { id: "cat-customer-contact", prompt: followUp };
  }
  if (!profile.existingSoftware?.length) {
    return { id: "cat-software", prompt: followUp };
  }
  return { id: "cat-crm", prompt: followUp };
}

function attachCatPendingState(result: CatEngineResult, profile: BusinessProfile): CatEngineResult {
  const merged = mergeProfile(profile, result.profileUpdates ?? {});
  const pending = resolveCatPendingQuestion(merged);

  if (!pending) {
    return {
      ...result,
      profileUpdates: {
        ...result.profileUpdates,
        pendingQuestionId: undefined,
        pendingQuestionPrompt: undefined,
      },
    };
  }

  return {
    ...result,
    profileUpdates: {
      ...result.profileUpdates,
      pendingQuestionId: pending.id,
      pendingQuestionPrompt: pending.prompt,
    },
  };
}

function uniqueStrings(...groups: (string[] | undefined)[]): string[] {
  return Array.from(new Set(groups.flatMap((group) => group ?? [])));
}

function mergeProfile(
  current: BusinessProfile,
  updates: Partial<BusinessProfile>,
): BusinessProfile {
  return {
    ...current,
    ...updates,
    goals: uniqueStrings(current.goals, updates.goals),
    challenges: uniqueStrings(current.challenges, updates.challenges),
    existingSoftware: uniqueStrings(current.existingSoftware, updates.existingSoftware),
    communicationChannels: uniqueStrings(
      current.communicationChannels,
      updates.communicationChannels,
    ),
    notes: uniqueStrings(current.notes, updates.notes),
    answeredQuestions: updates.answeredQuestions ?? current.answeredQuestions,
  };
}

function inferProfileFromMessage(text: string, current: BusinessProfile): Partial<BusinessProfile> {
  const updates: Partial<BusinessProfile> = {};
  const industry = extractIndustry(text);
  const employees = extractEmployeeCount(text);
  const software = extractSoftware(text);
  const channels = extractChannels(text);

  if (industry) updates.industry = industry;
  if (employees) updates.employeeCount = employees;
  if (software.length) updates.existingSoftware = software;
  if (channels.length) updates.communicationChannels = channels;

  if (includesAny(text, ["billing", "insurance", "invoice"])) {
    updates.challenges = ["billing and insurance coordination"];
  }
  if (includesAny(text, ["appointment", "scheduling", "no-show"])) {
    updates.challenges = ["appointment management"];
  }

  if (text.length > 10 && (industry || includesAny(text, ["own a", "run a", "we are a"]))) {
    updates.notes = [text];
  }

  if (Object.keys(updates).length === 0) return {};

  return updates;
}

export function processCatMessage(
  rawMessage: string,
  context: CatEngineContext,
): CatEngineResult {
  const text = rawMessage.trim().toLowerCase();
  const { currentModule, session } = context;
  let profile = session.businessProfile ?? {};

  if (profile.pendingQuestionId && profile.pendingQuestionPrompt) {
    const interruption = tryConversationInterruption({
      message: rawMessage,
      pendingQuestionId: profile.pendingQuestionId,
      pendingQuestionPrompt: profile.pendingQuestionPrompt,
      answeredQuestions: profile.answeredQuestions,
    });

    if (interruption) {
      return { reply: interruption.fullReply };
    }

    profile = mergeProfile(profile, {
      ...inferProfileFromMessage(text, profile),
      answeredQuestions: [...(profile.answeredQuestions ?? []), profile.pendingQuestionId!],
      pendingQuestionId: undefined,
      pendingQuestionPrompt: undefined,
    });
  }

  const blocked = isBlockedRequest(text);
  if (blocked) {
    return {
      reply: blocked,
      quickReplies: ["What do I need to get started?", "Explain pricing", "Show onboarding status"],
    };
  }

  const navTarget = detectNavigation(text);
  if (navTarget) {
    const moduleInfo = moduleKnowledge[navTarget];
    return {
      reply: `Opening **${getModuleLabel(navTarget)}** for you.`,
      actions: [{ type: "navigate", label: `Go to ${getModuleLabel(navTarget)}`, href: moduleInfo.href }],
    };
  }

  const explainTarget = detectModuleExplanation(text);
  if (explainTarget) {
    const moduleInfo = moduleKnowledge[explainTarget];
    return {
      reply: [
        `**${getModuleLabel(explainTarget)}**`,
        moduleInfo.summary,
        "",
        "I can help you:",
        ...moduleInfo.catCanHelp.map((item) => `• ${item}`),
      ].join("\n"),
      quickReplies: [`Take me to ${getModuleLabel(explainTarget)}`, "What do I need?", "Explain pricing"],
      actions: [{ type: "navigate", label: `Open ${getModuleLabel(explainTarget)}`, href: moduleInfo.href }],
    };
  }

  if (
    includesAny(text, [
      "onboarding status",
      "onboarding progress",
      "how ready",
      "readiness",
      "am i ready",
      "launch today",
    ])
  ) {
    return buildOnboardingSummary(currentModule);
  }

  if (includesAny(text, ["pricing", "price", "cost", "how much", "plan", "subscription"])) {
    const snapshot = buildOperationsSnapshot(currentModule);
    return {
      reply: [
        `You're on **${snapshot.billing.plan}** (${snapshot.billing.price}/mo).`,
        "",
        `**${pricingKnowledge.starter.name}** — ${pricingKnowledge.starter.price}`,
        pricingKnowledge.starter.includes,
        "",
        `**${pricingKnowledge.pro.name}** — ${pricingKnowledge.pro.price}`,
        pricingKnowledge.pro.includes,
        "",
        "**ROI guidance:**",
        ...pricingKnowledge.roi.map((line) => `• ${line}`),
        "",
        "I always recommend starting with the minimum that solves your problem — scale when the data supports it.",
      ].join("\n"),
      quickReplies: ["What do I need to get started?", "Show onboarding status", "Take me to Billing"],
      actions: [{ type: "navigate", label: "Open Billing", href: "/operations/billing" }],
    };
  }

  if (includesAny(text, ["roi", "return on investment", "time saved", "worth it"])) {
    return {
      reply: [
        "**ROI from the Operations Center:**",
        ...pricingKnowledge.roi.map((line) => `• ${line}`),
        "",
        "Track time saved and response time in Analytics after your first Specialist is live. I recommend measuring for 2–4 weeks before adding more capacity.",
      ].join("\n"),
      quickReplies: ["Take me to Analytics", "Recommend Specialists", "Explain pricing"],
      actions: [{ type: "navigate", label: "Open Analytics", href: "/operations/analytics" }],
    };
  }

  if (
    includesAny(text, ["manager", "hire a manager", "need a manager", "regional manager"])
  ) {
    const snapshot = buildOperationsSnapshot(currentModule);
    const employees = profile.employeeCount ?? 0;

    if (employees < 15 && snapshot.workforce.avgWorkload < 80) {
      return {
        reply: [
          "I recommend **waiting before hiring a Manager**.",
          "",
          `Your ${snapshot.workforce.specialistCount} Specialists are handling workload effectively (avg ${snapshot.workforce.avgWorkload}% utilization). Managers add the most value when you have 8+ Specialists, growing escalations, or complex multi-team coordination.`,
          "",
          "Start with Specialists. Revisit a Manager when volume or oversight complexity increases.",
        ].join("\n"),
        quickReplies: ["Recommend Specialists", "What's my onboarding status?", "Explain Teams"],
      };
    }

    return {
      reply:
        "A Manager may be worth considering given your scale, but I'd still start by ensuring your Specialists are fully utilized. Want me to review your current workforce setup?",
      quickReplies: ["Recommend Specialists", "Take me to Workforce", "Show onboarding status"],
      actions: [{ type: "navigate", label: "Open Workforce", href: "/operations/workforce" }],
    };
  }

  if (
    includesAny(text, [
      "launch",
      "launch readiness",
      "go live",
      "go-live",
      "begin working",
      "ready to launch",
      "launch score",
    ])
  ) {
    return {
      reply: [
        "Your **Launch Command Center** combines workforce, connectors, and business discovery into one readiness score.",
        "",
        "I can explain:",
        "• Why your launch score is what it is",
        "• What is blocking launch vs what can wait",
        "• Whether a Manager is recommended (usually not yet)",
        "• What to connect first",
      ].join("\n"),
      quickReplies: ["Show onboarding status", "Take me to Launch", "What do I need?"],
      actions: [{ type: "navigate", label: "Open Launch Center", href: "/operations/launch" }],
    };
  }

  if (
    includesAny(text, [
      "connector",
      "connectors",
      "gmail connected",
      "google calendar",
      "hubspot",
      "whatsapp",
      "integration",
      "connect service",
    ])
  ) {
    const instances = mergeConnectorInstances(buildDefaultConnectorState());
    const messages = getCatConnectorMessages(instances, profile);

    if (messages.length > 0) {
      return {
        reply: ["**Connector Status**", "", ...messages.map((m) => `• ${m}`)].join("\n"),
        quickReplies: ["Take me to Connectors", "Show onboarding status", "What do I need?"],
        actions: [{ type: "navigate", label: "Open Connector Center", href: "/operations/connectors" }],
      };
    }

    const calendar = instances.find((item) => item.id === "google-calendar");
    if (calendar) {
      return {
        reply: explainConnectorPurpose("google-calendar"),
        quickReplies: ["Take me to Connectors", "Recommend Specialists"],
        actions: [{ type: "navigate", label: "Connect Google Calendar", href: "/operations/connectors" }],
      };
    }
  }

  if (
    includesAny(text, [
      "what do i need",
      "get started",
      "recommend",
      "suggestion",
      "what should i",
      "help me choose",
    ]) ||
    extractIndustry(text)
  ) {
    const profileUpdates = inferProfileFromMessage(text, profile);
    const merged = mergeProfile(profile, profileUpdates);
    const recommendations = buildRecommendations(merged);
    const followUp = buildDiscoveryFollowUp(merged);

    if (followUp && !extractIndustry(text) && Object.keys(profileUpdates).length === 0) {
      return attachCatPendingState(
        {
          reply:
            "I'd like to understand your business first so I recommend the minimum you actually need. " +
            followUp,
          quickReplies: ["I own a dental clinic", "About 8 employees", "Yes, we use WhatsApp"],
          profileUpdates: merged,
        },
        merged,
      );
    }

    const discoveryLines: string[] = [];

    if (merged.industry) {
      const industryLabels: Record<string, string> = {
        dental: "dental practice",
        healthcare: "healthcare operation",
        retail: "retail business",
        hospitality: "hospitality business",
        "professional-services": "professional services firm",
        saas: "SaaS company",
        fitness: "fitness business",
        salon: "salon or spa",
        general: "business",
      };

      discoveryLines.push(
        `For your ${industryLabels[merged.industry] ?? merged.industry}, I've identified these operational areas:`,
      );

      if (merged.industry === "dental") {
        discoveryLines.push(
          "• Appointments and scheduling",
          "• Billing and insurance coordination",
          "• Patient communication",
          "• Staff coordination",
        );
        discoveryLines.push("");
      }
    }

    const reply = [
      ...discoveryLines,
      formatRecommendations(recommendations),
      "",
      "I recommend starting with Specialists only — add Teams and Managers when workload justifies it.",
    ].join("\n");

    const quickReplies = followUp
      ? [followUp, "Take me to Workforce", "Show onboarding status"]
      : ["Why these recommendations?", "Take me to Onboarding", "Explain pricing"];

    if (followUp) {
      return attachCatPendingState(
        {
          reply,
          quickReplies,
          recommendations,
          profileUpdates: merged,
          actions: [
            { type: "navigate", label: "Open Workforce", href: "/operations/workforce" },
            { type: "navigate", label: "View Onboarding", href: "/operations/onboarding" },
          ],
        },
        merged,
      );
    }

    return {
      reply,
      quickReplies,
      recommendations,
      profileUpdates: merged,
      actions: [
        { type: "navigate", label: "Open Workforce", href: "/operations/workforce" },
        { type: "navigate", label: "View Onboarding", href: "/operations/onboarding" },
      ],
    };
  }

  if (includesAny(text, ["why", "explain recommendation", "why these", "why not manager"])) {
    const merged = profile;
    const recommendations = buildRecommendations(merged);

    if (recommendations.length === 0) {
      return {
        reply: "Tell me about your business first — industry, team size, and how customers reach you — and I'll explain every recommendation.",
        quickReplies: ["I own a dental clinic", "What do I need to get started?"],
      };
    }

    return {
      reply: [
        "Here's why I made these recommendations:",
        "",
        ...recommendations.map(
          (rec) =>
            `**${rec.name}** (${rec.status}): ${rec.reason}`,
        ),
        "",
        "My approach: minimum solution first, scale only when justified by workload and data.",
      ].join("\n"),
      recommendations,
      quickReplies: ["Take me to Workforce", "Show onboarding status", "Explain pricing"],
    };
  }

  if (includesAny(text, ["ai capability", "what can ai", "what can specialists", "capabilities"])) {
    return {
      reply: [
        "**What AI Specialists can do:**",
        "• Handle scheduling, follow-ups, and client communication",
        "• Route and triage inbound messages",
        "• Execute defined workflows and escalations",
        "• Coordinate across your connected tools",
        "",
        "**What I (CAT) do:**",
        "• Discover your business needs",
        "• Recommend the right Specialists, Teams, and Connectors",
        "• Explain pricing and ROI",
        "• Guide onboarding and navigate the Operations Center",
        "",
        "**What I don't do:**",
        "• Perform operational work",
        "• Act as a Specialist or Manager",
        "• Approve financial decisions",
      ].join("\n"),
      quickReplies: ["What do I need to get started?", "I own a dental clinic", "Explain pricing"],
    };
  }

  if (includesAny(text, ["hello", "hi", "hey", "help"])) {
    const snapshot = buildOperationsSnapshot(currentModule);
    return {
      reply: [
        `Hello! You're currently in **${getModuleLabel(currentModule)}**.`,
        `Onboarding readiness: **${snapshot.onboarding.readinessPercent}%**.`,
        "",
        "I can help you discover what your business needs, recommend Specialists, explain the platform, check onboarding progress, or navigate anywhere in the Operations Center.",
      ].join("\n"),
      quickReplies: [
        "I own a dental clinic",
        "What's my onboarding status?",
        "Take me to Connectors",
        "What do I need to get started?",
      ],
    };
  }

  const passiveUpdates = inferProfileFromMessage(text, profile);
  if (Object.keys(passiveUpdates).length > 0) {
    const merged = mergeProfile(profile, passiveUpdates);
    const followUp = buildDiscoveryFollowUp(merged);

    if (followUp) {
      return attachCatPendingState(
        {
          reply: `Got it — that helps. ${followUp}`,
          quickReplies: ["About 8 employees", "Yes, WhatsApp", "We use Google Calendar"],
          profileUpdates: merged,
        },
        merged,
      );
    }

    const recommendations = buildRecommendations(merged);
    return {
      reply: formatRecommendations(recommendations),
      recommendations,
      profileUpdates: merged,
      quickReplies: ["Why these recommendations?", "Take me to Onboarding", "Explain pricing"],
    };
  }

  return {
    reply: [
      "I'm here to advise — not to execute. I can help you:",
      "• Discover what your business needs",
      "• Recommend Specialists, Teams, and Connectors",
      "• Check onboarding progress",
      "• Explain pricing and ROI",
      "• Navigate the Operations Center",
      "",
      "Try: \"I own a dental clinic\" or \"Take me to Connectors\"",
    ].join("\n"),
    quickReplies: [
      "I own a dental clinic",
      "What's my onboarding status?",
      "Take me to Connectors",
      "What do I need to get started?",
    ],
  };
}

export function groupRecommendations(recommendations: CatRecommendation[]) {
  return {
    recommended: recommendations.filter((r) => r.status === "recommended"),
    optional: recommendations.filter((r) => r.status === "optional"),
    notRecommended: recommendations.filter((r) => r.status === "not-recommended"),
  };
}
