import type { RawConversationRecord, AnalyzedConversationRecord } from "@/lib/cat/conversation-learning/types";

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function extractFrictionThemes(raw: RawConversationRecord): string[] {
  const friction = raw.profile.discoveryAnswers?.["general-friction"];
  const themes: string[] = [];
  const context = [
    friction ?? "",
    ...(raw.profile.notes ?? []),
    ...Object.values(raw.profile.discoveryAnswers ?? {}),
  ]
    .join(" ")
    .toLowerCase();

  if (/schedul|appointment|agenda|cita/.test(context)) themes.push("scheduling");
  if (/follow.?up|seguimiento/.test(context)) themes.push("follow-up");
  if (/message|email|phone|call/.test(context)) themes.push("customer contact");
  if (/staff|team|employee|personal/.test(context)) themes.push("team coordination");
  if (friction) themes.push("operational friction");
  return Array.from(new Set(themes));
}

function extractChannelThemes(raw: RawConversationRecord): string[] {
  return raw.profile.communicationChannels ?? [];
}

function extractPatterns(raw: RawConversationRecord): string[] {
  const patterns: string[] = [];
  const userMessages = raw.messages.filter((message) => message.role === "user");

  if (userMessages.some((message) => message.content.trim().length <= 8)) {
    patterns.push("short factual answers");
  }
  if (raw.profile.employeeCount === 1) {
    patterns.push("solo operator");
  }
  if ((raw.profile.communicationChannels?.length ?? 0) > 1) {
    patterns.push("multi-channel contact");
  }
  if (raw.milestones.includes("website_reviewed")) {
    patterns.push("website-informed discovery");
  }
  if (raw.milestones.includes("appointment_workflow_discussed")) {
    patterns.push("scheduling workflow discussed");
  }
  if (userMessages.length >= 6) {
    patterns.push("extended discovery session");
  }

  return patterns.length > 0 ? patterns : ["general business discovery"];
}

export function analyzeRawConversation(raw: RawConversationRecord): AnalyzedConversationRecord {
  const now = new Date().toISOString();

  return {
    id: createId("analyzed"),
    sessionId: raw.sessionId,
    status: "analyzed",
    submittedAt: raw.submittedAt,
    analyzedAt: now,
    industry: raw.industry ?? raw.profile.industry,
    messageCount: raw.messageCount,
    isFounderConversation: raw.isFounderConversation,
    highPriority: raw.highPriority,
    patterns: extractPatterns(raw),
    frictionThemes: extractFrictionThemes(raw),
    channelThemes: extractChannelThemes(raw),
  };
}
