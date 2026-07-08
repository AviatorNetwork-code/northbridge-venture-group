import type { DiscoveryProfile } from "@/lib/cat/discovery-types";
import { getIndustryLabel } from "@/lib/cat/industry-questions";
import {
  deriveMilestones,
  type ConversationMilestone,
  type NordiConversationMemory,
} from "@/lib/nordi/conversation-memory";
import { formatIdentityContact, type NordiIdentity } from "@/lib/nordi/identity";

export function buildSaveConversationPrompt(): string {
  return [
    "Before we continue...",
    "",
    "I'd hate for you to lose everything we've discussed.",
    "",
    "Would you like me to save this conversation so we can continue anytime?",
  ].join("\n");
}

export function buildSaveConfirmation(identity: NordiIdentity): string {
  const contact = formatIdentityContact(identity);
  const secured = identity.verified
    ? " Your access is secured with a verification code."
    : "";

  return [
    `You're all set — I'll remember you as **${contact}**.${secured}`,
    "",
    "Whenever you return, we'll pick up right where we left off.",
  ].join("\n");
}

function describeLastDiscussion(profile: DiscoveryProfile): string {
  const parts: string[] = [];

  if (profile.industry) {
    parts.push(`your ${getIndustryLabel(profile.industry).toLowerCase()}`);
  }

  if (profile.discoveryAnswers?.["dental-reminders"] || profile.discoveryAnswers?.["dental-online-booking"]) {
    parts.push("appointment scheduling");
  } else if (profile.discoveryAnswers?.["hvac-scheduling"]) {
    parts.push("how customers schedule service");
  } else if (profile.discoveryAnswers?.["aviation-online-booking"]) {
    parts.push("student booking");
  } else if (profile.websiteAnalysis) {
    parts.push("your website");
  } else if (profile.areasForSupport?.length) {
    parts.push(profile.areasForSupport[0]);
  }

  if (parts.length === 0) return "your business";
  if (parts.length === 1) return parts[0];
  return `${parts[0]} and ${parts[1]}`;
}

export function buildWelcomeBackMessage(memory: NordiConversationMemory): string {
  const discussion = describeLastDiscussion(memory.profile);

  return [
    "Welcome back.",
    "",
    `Last time we discussed ${discussion}.`,
    "",
    "Would you like to continue where we left off?",
  ].join("\n");
}

const MILESTONE_LABELS: Record<ConversationMilestone, string> = {
  business_identified: "Business profile started",
  website_reviewed: "Website reviewed",
  profile_completed: "Business profile completed",
  appointment_workflow_discussed: "Appointment workflow discussed",
  conversation_saved: "Conversation saved",
};

export function buildResumeMessage(memory: NordiConversationMemory): string {
  const milestones = deriveMilestones(memory.profile, memory.milestones);
  const highlights = milestones
    .filter((milestone) => milestone !== "conversation_saved")
    .slice(0, 3)
    .map((milestone) => `• ${MILESTONE_LABELS[milestone]}`);

  if (highlights.length === 0) {
    return [
      "Here's where we left off.",
      "",
      "I already know a little about your business.",
      "",
      "What would you like to work on today?",
    ].join("\n");
  }

  return [
    "Welcome back.",
    "",
    "Here's where we left off.",
    "",
    ...highlights,
    "",
    "What would you like to work on today?",
  ].join("\n");
}

export function buildRelationshipAcknowledgment(profile: DiscoveryProfile, userText: string): string | null {
  const text = userText.toLowerCase();
  const industry = profile.industry;

  if (!industry) return null;

  const industryKeywords: Record<string, string[]> = {
    dental: ["dental", "dentist"],
    hvac: ["hvac", "heating"],
    aviation: ["flight school", "aviation"],
    hospitality: ["restaurant"],
  };

  const keywords = industryKeywords[industry] ?? [];
  const repeatingBusiness = keywords.some((keyword) => text.includes(keyword));

  if (repeatingBusiness && (profile.userMessageCount ?? 0) > 1) {
    return `I remember — you're running a ${getIndustryLabel(industry).toLowerCase()}. I won't ask that again.`;
  }

  return null;
}

export function enrichProfileForRelationship(profile: DiscoveryProfile): DiscoveryProfile {
  return {
    ...profile,
    isReturningVisitor: true,
  };
}

export function formatKnownSince(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function formatLastUpdated(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (sameDay) return "Today";

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  if (isYesterday) return "Yesterday";

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
