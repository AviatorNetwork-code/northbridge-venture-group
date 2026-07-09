import type { NordiIdentity } from "@/lib/nordi/identity";

export const CONSENT_VERSION = 1;

export type ConsentChangeSource =
  | "conversation_prompt"
  | "privacy_settings"
  | "founder_settings"
  | "version_migration";

export type ConsentAuditEntry = {
  consentVersion: number;
  timestamp: string;
  source: ConsentChangeSource;
  enabled: boolean;
};

export type ConversationLearningConsent = {
  enabled: boolean;
  askedAt: string | null;
  acceptedAt: string | null;
  declinedAt: string | null;
  consentVersion: number;
};

export type FounderLearningSettings = {
  alwaysAllow: boolean;
  autoSendToLearningCenter: boolean;
  markAsFounderConversation: boolean;
  highPriorityLearning: boolean;
  autoGenerateRegressionTests: boolean;
};

export const LEARNING_CONSENT_MESSAGE = [
  "Before we continue, I'd like to ask one quick question.",
  "",
  "Would you allow Northbridge to analyze this conversation to help improve Nordi and future AI assistants?",
  "",
  "When enabled, we learn from conversation patterns such as:",
  "",
  "• asking better follow-up questions",
  "• improving explanations",
  "• handling interruptions",
  "• understanding business conversations",
  "• improving multilingual communication",
  "",
  "This does NOT affect your ability to use Nordi.",
  "",
  "You can change this at any time in Privacy Settings.",
].join("\n");

export function createDefaultConsent(): ConversationLearningConsent {
  return {
    enabled: false,
    askedAt: null,
    acceptedAt: null,
    declinedAt: null,
    consentVersion: CONSENT_VERSION,
  };
}

export function shouldAskForConsent(
  consent: ConversationLearningConsent | null | undefined,
): boolean {
  if (!consent) return true;
  if (consent.consentVersion !== CONSENT_VERSION) return true;
  if (!consent.askedAt) return true;
  return false;
}

export function markConsentPromptShown(
  consent: ConversationLearningConsent | null | undefined,
): { consent: ConversationLearningConsent; audit: ConsentAuditEntry | null } {
  const now = new Date().toISOString();
  const base = consent ?? createDefaultConsent();

  if (base.askedAt && base.consentVersion === CONSENT_VERSION) {
    return { consent: base, audit: null };
  }

  return {
    consent: {
      ...base,
      askedAt: now,
      consentVersion: CONSENT_VERSION,
    },
    audit: null,
  };
}

export function acceptLearningConsent(
  consent: ConversationLearningConsent | null | undefined,
  source: ConsentChangeSource,
): { consent: ConversationLearningConsent; audit: ConsentAuditEntry } {
  const now = new Date().toISOString();
  const base = consent ?? createDefaultConsent();

  return {
    consent: {
      ...base,
      enabled: true,
      askedAt: base.askedAt ?? now,
      acceptedAt: now,
      declinedAt: null,
      consentVersion: CONSENT_VERSION,
    },
    audit: {
      consentVersion: CONSENT_VERSION,
      timestamp: now,
      source,
      enabled: true,
    },
  };
}

export function declineLearningConsent(
  consent: ConversationLearningConsent | null | undefined,
  source: ConsentChangeSource,
): { consent: ConversationLearningConsent; audit: ConsentAuditEntry } {
  const now = new Date().toISOString();
  const base = consent ?? createDefaultConsent();

  return {
    consent: {
      ...base,
      enabled: false,
      askedAt: base.askedAt ?? now,
      acceptedAt: null,
      declinedAt: now,
      consentVersion: CONSENT_VERSION,
    },
    audit: {
      consentVersion: CONSENT_VERSION,
      timestamp: now,
      source,
      enabled: false,
    },
  };
}

export function updateLearningConsentFromSettings(
  consent: ConversationLearningConsent | null | undefined,
  enabled: boolean,
): { consent: ConversationLearningConsent; audit: ConsentAuditEntry } {
  const now = new Date().toISOString();
  const base = consent ?? createDefaultConsent();

  return {
    consent: {
      ...base,
      enabled,
      askedAt: base.askedAt ?? now,
      acceptedAt: enabled ? now : null,
      declinedAt: enabled ? null : now,
      consentVersion: CONSENT_VERSION,
    },
    audit: {
      consentVersion: CONSENT_VERSION,
      timestamp: now,
      source: "privacy_settings",
      enabled,
    },
  };
}

export function resolveLearningEligible(
  consent: ConversationLearningConsent | null | undefined,
  founderSettings?: FounderLearningSettings | null,
): boolean {
  if (founderSettings?.alwaysAllow) return true;
  return Boolean(consent?.enabled);
}

export function createDefaultFounderLearningSettings(): FounderLearningSettings {
  return {
    alwaysAllow: true,
    autoSendToLearningCenter: true,
    markAsFounderConversation: true,
    highPriorityLearning: true,
    autoGenerateRegressionTests: true,
  };
}

export function appendConsentAudit(
  existing: ConsentAuditEntry[] | undefined,
  entry: ConsentAuditEntry,
): ConsentAuditEntry[] {
  return [...(existing ?? []), entry].slice(-20);
}

export function isFounderIdentity(identity: NordiIdentity | null | undefined): boolean {
  if (!identity?.email) return false;
  return getFounderEmails().includes(normalizeEmail(identity.email));
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function getFounderEmails(): string[] {
  const raw =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_NORDI_FOUNDER_EMAILS ?? ""
      : "";

  return raw
    .split(",")
    .map((entry) => normalizeEmail(entry))
    .filter(Boolean);
}
