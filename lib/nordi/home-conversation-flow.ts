import type { DiscoveryProfile } from "@/lib/cat/discovery-types";
import { hasMinimumBusinessContext } from "@/lib/cat/discovery-profile-state";

export const INTRO_MESSAGE = [
  "Hello.",
  "",
  "I'm Nordi.",
  "",
  "I was created by Northbridge Digital to help business owners understand their business, organize their operations, and determine whether technology can genuinely help.",
  "",
  "I'm not here to sell software.",
  "",
  "I'm here to understand your business first.",
].join("\n");

export const BROWSE_MESSAGE = [
  "Every business is different.",
  "",
  "Some people prefer to speak with me first.",
  "",
  "Others prefer to learn about Northbridge before we begin.",
  "",
  "If you'd like to explore our company, services, ventures, and products first, you can do that anytime.",
].join("\n");

export const SAVE_PROMPT_MESSAGE = [
  "By the way...",
  "",
  "I don't want you to lose everything we've discussed.",
  "",
  "You can save this conversation at any time and continue later.",
].join("\n");

export const HUMAN_CONNECT_MESSAGE = [
  "Absolutely.",
  "",
  "I'd be happy to connect you with a member of the Northbridge team.",
].join("\n");

const HUMAN_ASSISTANCE_PATTERNS = [
  /\btalk to someone\b/i,
  /\bspeak to (?:a )?person\b/i,
  /\bspeak with (?:a )?person\b/i,
  /\bspeak to someone\b/i,
  /\bneed a human\b/i,
  /\bwant a human\b/i,
  /\bschedule a call\b/i,
  /\bcan someone contact me\b/i,
  /\bspeak to (?:a )?human\b/i,
  /\btalk to (?:a )?human\b/i,
  /\breal person\b/i,
  /\bactual person\b/i,
  /\bmember of (?:the )?team\b/i,
];

export function detectHumanAssistanceRequest(text: string): boolean {
  const normalized = text.trim();
  if (!normalized) return false;
  return HUMAN_ASSISTANCE_PATTERNS.some((pattern) => pattern.test(normalized));
}

export function shouldOfferSavePrompt(profile: DiscoveryProfile): boolean {
  const userMessages = profile.userMessageCount ?? 0;

  if (userMessages >= 5) return true;
  if (userMessages >= 3 && hasMinimumBusinessContext(profile)) return true;

  const answeredCount = profile.answeredQuestions?.length ?? 0;
  if (userMessages >= 3 && answeredCount >= 2) return true;

  return false;
}

export function shouldShowSaveButton(profile: DiscoveryProfile, saved: boolean): boolean {
  return saved || shouldOfferSavePrompt(profile);
}
