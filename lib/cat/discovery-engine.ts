import type { DiscoveryEngineResult, DiscoveryProfile } from "@/lib/cat/discovery-types";
import { extractWebsiteUrl } from "@/lib/cat/website-analysis";

function includesAny(text: string, terms: string[]): boolean {
  return terms.some((term) => text.includes(term));
}

function extractIndustry(text: string): string | undefined {
  const industries: Record<string, string[]> = {
    dental: ["dental", "dentist", "dental clinic", "orthodont"],
    healthcare: ["healthcare", "medical", "clinic", "hospital", "patient"],
    retail: ["retail", "store", "shop", "ecommerce", "e-commerce"],
    hospitality: ["restaurant", "hotel", "hospitality", "cafe", "bar"],
    "professional-services": ["law firm", "accounting", "consulting", "agency"],
    fitness: ["gym", "fitness", "studio", "yoga"],
    salon: ["salon", "spa", "beauty"],
  };

  for (const [industry, keywords] of Object.entries(industries)) {
    if (keywords.some((keyword) => text.includes(keyword))) return industry;
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

function hasWebsiteAffirmation(text: string): boolean {
  return includesAny(text, [
    "yes",
    "yeah",
    "yep",
    "we do",
    "i do",
    "we have",
    "i have",
    "here is",
    "here's",
    "our site",
    "our website",
    "my website",
  ]);
}

function hasWebsiteNegation(text: string): boolean {
  return includesAny(text, ["no website", "don't have a website", "do not have a website", "not yet"]);
}

function isSalesPressure(text: string): boolean {
  return includesAny(text, ["how much", "pricing", "price", "cost", "buy", "subscribe", "plan"]);
}

function mergeProfile(
  current: DiscoveryProfile,
  updates: Partial<DiscoveryProfile>,
): DiscoveryProfile {
  return { ...current, ...updates };
}

function buildLearningReply(profile: DiscoveryProfile, userText: string): string {
  const industry = profile.industry;

  if (!industry) {
    return [
      "Thank you — that's helpful context.",
      "",
      "What kind of business is it, and roughly how many people are involved in day-to-day operations?",
    ].join("\n");
  }

  if (!profile.employeeCount) {
    const labels: Record<string, string> = {
      dental: "dental practice",
      healthcare: "healthcare operation",
      hospitality: "restaurant or hospitality business",
      retail: "retail business",
      salon: "salon or spa",
      fitness: "fitness business",
      "professional-services": "professional services firm",
    };

    return [
      `A ${labels[industry] ?? "business"} — understood.`,
      "",
      "Roughly how many people are involved in running it day to day?",
    ].join("\n");
  }

  if (!profile.communicationChannels?.length) {
    return [
      "That's a useful picture.",
      "",
      "How do customers usually reach you — phone, email, text, walk-ins, or something else?",
    ].join("\n");
  }

  return [
    "I appreciate you walking me through that.",
    "",
    "What tends to create the most friction in a typical week — scheduling, follow-ups, billing, staffing, or something else?",
  ].join("\n");
}

function shouldAskForWebsite(profile: DiscoveryProfile): boolean {
  return (
    !profile.websiteAsked &&
    Boolean(profile.industry) &&
    (profile.userMessageCount ?? 0) >= 1 &&
    !profile.website
  );
}

function websiteAskMessage(): string {
  return "Do you have a website?";
}

function websiteAcknowledgement(): string {
  return [
    "Perfect.",
    "",
    "I'll take a quick look while we continue talking so I can better understand your business.",
  ].join("\n");
}

function websiteDeclinedReply(): string {
  return [
    "No problem at all.",
    "",
    "We can keep learning from the conversation.",
    "",
    "What does a typical customer journey look like from first contact to completed service?",
  ].join("\n");
}

function blockSalesDuringDiscovery(): string {
  return [
    "I want to understand your business properly before we talk about solutions.",
    "",
    "Help me with one more operational detail — what part of the week feels most repetitive or time-consuming for your team?",
  ].join("\n");
}

export function processDiscoveryMessage(
  rawMessage: string,
  profile: DiscoveryProfile,
): DiscoveryEngineResult {
  const text = rawMessage.trim().toLowerCase();
  const messageCount = (profile.userMessageCount ?? 0) + 1;
  let nextProfile = mergeProfile(profile, { userMessageCount: messageCount });

  const passiveIndustry = extractIndustry(text);
  const passiveEmployees = extractEmployeeCount(text);
  const extractedUrl = extractWebsiteUrl(rawMessage);

  if (passiveIndustry) nextProfile = mergeProfile(nextProfile, { industry: passiveIndustry });
  if (passiveEmployees) nextProfile = mergeProfile(nextProfile, { employeeCount: passiveEmployees });

  const channels = new Set(nextProfile.communicationChannels ?? []);
  if (includesAny(text, ["whatsapp"])) channels.add("WhatsApp");
  if (includesAny(text, ["phone", "call us", "by phone"])) channels.add("Phone");
  if (includesAny(text, ["email", "gmail"])) channels.add("Email");
  if (channels.size > 0) {
    nextProfile = mergeProfile(nextProfile, {
      communicationChannels: Array.from(channels),
    });
  }

  if (text.length > 20) {
    nextProfile = mergeProfile(nextProfile, {
      notes: [...(nextProfile.notes ?? []), rawMessage.trim()],
    });
  }

  if (
    nextProfile.discoveryPhase !== "recommendations" &&
    nextProfile.insightDelivered !== true &&
    isSalesPressure(text)
  ) {
    return {
      reply: blockSalesDuringDiscovery(),
      profileUpdates: nextProfile,
    };
  }

  if (hasWebsiteNegation(text)) {
    nextProfile = mergeProfile(nextProfile, {
      websiteAsked: true,
      discoveryPhase: "learning",
    });
    return { reply: websiteDeclinedReply(), profileUpdates: nextProfile };
  }

  const websiteConfirmed =
    extractedUrl || (hasWebsiteAffirmation(text) && nextProfile.websiteAsked);

  if (websiteConfirmed) {
    const url = extractedUrl ?? nextProfile.website;
    if (url) {
      nextProfile = mergeProfile(nextProfile, {
        website: url,
        websiteAsked: true,
        websiteAnalysisPending: true,
        discoveryPhase: "website_analyzing",
      });

      const followUp = buildLearningReply(nextProfile, text);
      return {
        reply: [websiteAcknowledgement(), "", followUp].join("\n"),
        profileUpdates: nextProfile,
        triggerWebsiteAnalysis: url,
      };
    }

    return {
      reply: "What's the web address? I can review the public site while we keep talking.",
      profileUpdates: mergeProfile(nextProfile, { websiteAsked: true }),
    };
  }

  if (shouldAskForWebsite(nextProfile)) {
    const learning = buildLearningReply(nextProfile, text);
    nextProfile = mergeProfile(nextProfile, {
      websiteAsked: true,
      discoveryPhase: "website_prompted",
    });
    return {
      reply: [learning, "", websiteAskMessage()].join("\n"),
      profileUpdates: nextProfile,
    };
  }

  if (nextProfile.discoveryPhase === "insight_delivered" || nextProfile.insightDelivered) {
    return {
      reply: [
        "I'm still listening.",
        "",
        "Based on what you've shared, I have a clearer picture of how your business runs.",
        "",
        "Is there a specific operational challenge you'd like me to think through with you?",
      ].join("\n"),
      profileUpdates: nextProfile,
    };
  }

  return {
    reply: buildLearningReply(nextProfile, text),
    profileUpdates: nextProfile,
  };
}

export function applyWebsiteInsight(
  profile: DiscoveryProfile,
  insight: string,
): DiscoveryEngineResult {
  return {
    reply: insight,
    profileUpdates: mergeProfile(profile, {
      insightDelivered: true,
      discoveryPhase: "insight_delivered",
      websiteAnalysisPending: false,
      pendingInsight: undefined,
    }),
    deliverPendingInsight: true,
  };
}
