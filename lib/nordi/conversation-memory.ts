import type { DiscoveryProfile } from "@/lib/cat/discovery-types";
import type { NordiMessageCard } from "@/lib/nordi/cards";
import type {
  ConsentAuditEntry,
  ConversationLearningConsent,
  FounderLearningSettings,
} from "@/lib/nordi/conversation-learning-consent";
import type { NordiIdentity } from "@/lib/nordi/identity";

export const NORDI_MEMORY_VERSION = 1;

export type ConversationMilestone =
  | "business_identified"
  | "website_reviewed"
  | "profile_completed"
  | "appointment_workflow_discussed"
  | "conversation_saved";

export type NordiChatMessage = {
  id: string;
  role: "cat" | "user";
  content: string;
  card?: NordiMessageCard;
  timestamp: string;
  animate?: boolean;
};

export type NordiConversationMemory = {
  version: number;
  sessionId: string;
  messages: NordiChatMessage[];
  profile: DiscoveryProfile;
  identity: NordiIdentity | null;
  saved: boolean;
  callRequested: boolean;
  milestones: ConversationMilestone[];
  knownSince: string;
  lastUpdated: string;
  welcomeBackShown?: boolean;
  conversationLearningConsent?: ConversationLearningConsent | null;
  learningEligible?: boolean;
  consentAuditLog?: ConsentAuditEntry[];
  founderSession?: boolean;
  founderLearningSettings?: FounderLearningSettings | null;
  learningSubmitted?: boolean;
};

export function createEmptyMemory(sessionId: string): NordiConversationMemory {
  const now = new Date().toISOString();
  return {
    version: NORDI_MEMORY_VERSION,
    sessionId,
    messages: [],
    profile: { discoveryPhase: "learning", userMessageCount: 0 },
    identity: null,
    saved: false,
    callRequested: false,
    milestones: [],
    knownSince: now,
    lastUpdated: now,
  };
}

export function touchMemory(memory: NordiConversationMemory): NordiConversationMemory {
  return { ...memory, lastUpdated: new Date().toISOString() };
}

export function hasRelationship(memory: NordiConversationMemory): boolean {
  return Boolean(
    memory.identity ||
      memory.saved ||
      memory.profile.industry ||
      memory.messages.length > 1,
  );
}

export function deriveMilestones(profile: DiscoveryProfile, existing: ConversationMilestone[]): ConversationMilestone[] {
  const milestones = new Set(existing);

  if (profile.industry) milestones.add("business_identified");

  if (profile.websiteAnalysis) milestones.add("website_reviewed");

  if (
    profile.industry &&
    profile.employeeCount &&
    (profile.answeredQuestions?.length ?? 0) >= 2
  ) {
    milestones.add("profile_completed");
  }

  const schedulingDiscussed =
    profile.discoveryAnswers?.["dental-online-booking"] ||
    profile.discoveryAnswers?.["dental-reminders"] ||
    profile.discoveryAnswers?.["hvac-scheduling"] ||
    profile.discoveryAnswers?.["aviation-online-booking"] ||
    profile.discoveryAnswers?.["healthcare-booking"];

  if (schedulingDiscussed) milestones.add("appointment_workflow_discussed");

  return Array.from(milestones);
}
