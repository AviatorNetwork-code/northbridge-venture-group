import type { DiscoveryProfile } from "@/lib/cat/discovery-types";
import type { ConsultantTurnInput } from "@/lib/nordi/consultant-voice/types";

export type ConsultantCadenceMode =
  | "direct"
  | "light_ack"
  | "brief_observation"
  | "deeper_insight"
  | "summary";

export type CadenceContentType =
  | "answer_reasoning"
  | "fact_connection"
  | "question_reason"
  | "trust_summary";

function isExplicitSoloAnswer(message: string): boolean {
  const lower = message.trim().toLowerCase();
  return [
    "just me",
    "solo",
    "only me",
    "one person",
    "solo yo",
    "sólo yo",
    "unicamente yo",
    "únicamente yo",
  ].some((term) => lower.includes(term));
}

function isShortFactualAnswer(message: string): boolean {
  const trimmed = message.trim();
  if (!trimmed) return true;
  if (/^\d+$/.test(trimmed)) return true;
  if (isExplicitSoloAnswer(trimmed)) return false;
  if (trimmed.length <= 16 && trimmed.split(/\s+/).length <= 3) return true;
  return false;
}

function userAskedWhy(message: string): boolean {
  return /\bwhy\b|\bpor qu[eé]\b|\bporque\b/i.test(message);
}

export function countKnownContextFields(profile: DiscoveryProfile): number {
  let count = 0;
  if (profile.industry) count++;
  if (profile.employeeCount != null) count++;
  if ((profile.communicationChannels?.length ?? 0) > 0) count++;
  if (profile.discoveryAnswers?.["general-friction"]) count++;
  return count;
}

export function hasMeaningfulContextForSave(profile: DiscoveryProfile): boolean {
  const hasBusinessType = Boolean(profile.industry);
  const hasEmployees = profile.employeeCount != null;
  const hasPainOrChannel =
    (profile.communicationChannels?.length ?? 0) > 0 ||
    Boolean(profile.discoveryAnswers?.["general-friction"]);
  return hasBusinessType && hasEmployees && hasPainOrChannel;
}

export function decideConsultantCadence(input: ConsultantTurnInput): ConsultantCadenceMode {
  const { profile, userMessage } = input;
  const seed = profile.userMessageCount ?? 0;
  const contextFields = countKnownContextFields(profile);

  if (shouldShowTrustSummary(profile)) {
    return "summary";
  }

  if (userAskedWhy(userMessage)) {
    return "deeper_insight";
  }

  if (profile.employeeCount === 1 && isExplicitSoloAnswer(userMessage)) {
    return "brief_observation";
  }

  if (isShortFactualAnswer(userMessage)) {
    return "direct";
  }

  if (seed <= 2 || contextFields < 2) {
    return "direct";
  }

  const cadenceSlot = seed % 10;
  if (cadenceSlot < 7) return "direct";
  if (cadenceSlot < 9) return "brief_observation";
  return "deeper_insight";
}

export function shouldShowTrustSummary(profile: DiscoveryProfile): boolean {
  const seed = profile.userMessageCount ?? 0;
  if (seed < 5) return false;
  if (countKnownContextFields(profile) < 3) return false;
  return seed % 7 === 0;
}

export function shouldIncludeCadenceContent(
  mode: ConsultantCadenceMode,
  contentType: CadenceContentType,
  input: ConsultantTurnInput,
): boolean {
  const seed = input.profile.userMessageCount ?? 0;

  switch (contentType) {
    case "trust_summary":
      return mode === "summary";
    case "answer_reasoning":
      if (mode === "direct" || mode === "light_ack") return false;
      if (mode === "brief_observation") return seed % 2 === 0;
      return mode === "deeper_insight" || mode === "summary";
    case "fact_connection":
      if (mode === "direct" || mode === "light_ack") return false;
      if (mode === "brief_observation") return countKnownContextFields(input.profile) >= 3;
      return mode === "deeper_insight" || mode === "summary";
    case "question_reason":
      if (mode === "direct" || mode === "light_ack" || mode === "brief_observation") {
        return false;
      }
      return seed % 5 === 0;
    default:
      return false;
  }
}

export function isSoloOperatorProfile(profile: DiscoveryProfile, userMessage: string): boolean {
  if (profile.employeeCount !== 1) return false;
  const text = userMessage.toLowerCase();
  const soloTerms = [
    "just me",
    "solo",
    "only me",
    "one person",
    "solo yo",
    "sólo yo",
    "unicamente yo",
    "únicamente yo",
  ];
  return soloTerms.some((term) => text.includes(term)) || profile.employeeCount === 1;
}
