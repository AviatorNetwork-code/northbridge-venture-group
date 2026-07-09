import type { DiscoveryProfile } from "@/lib/cat/discovery-types";

export type DiscoveryField =
  | "industry"
  | "employeeCount"
  | "communicationChannels"
  | "operationalFriction";

export type DiscoveryDecisionLog = {
  message: string;
  extractedFields: Partial<DiscoveryProfile>;
  accumulatedProfile: DiscoveryProfile;
  missingFields: DiscoveryField[];
  nextSelectedQuestion: string | null;
};

export function mergeProfile(
  current: DiscoveryProfile,
  updates: Partial<DiscoveryProfile>,
): DiscoveryProfile {
  const merged: DiscoveryProfile = {
    ...current,
    ...updates,
    answeredQuestions: updates.answeredQuestions ?? current.answeredQuestions,
    discoveryAnswers: { ...current.discoveryAnswers, ...updates.discoveryAnswers },
    communicationChannels: updates.communicationChannels ?? current.communicationChannels,
    notes: updates.notes ?? current.notes,
  };

  if ("pendingQuestionId" in updates) {
    merged.pendingQuestionId = updates.pendingQuestionId;
  }

  return merged;
}

export function collectProfileText(profile: DiscoveryProfile): string {
  return [
    ...(profile.notes ?? []),
    ...Object.values(profile.discoveryAnswers ?? {}),
  ]
    .join(" ")
    .toLowerCase();
}

export {
  getMissingDiscoveryFields,
  logDiscoveryDecision,
  profileToFactMemory,
  selectNextNordiQuestion,
  buildNordiFieldDefinitions,
} from "@/lib/cat/fact-memory-bridge";

export function hasIndustry(profile: DiscoveryProfile): boolean {
  return Boolean(profile.industry);
}

export function hasEmployeeCount(profile: DiscoveryProfile): boolean {
  return (
    profile.employeeCount != null ||
    Boolean(profile.discoveryAnswers?.["general-team-size"]) ||
    Boolean(profile.answeredQuestions?.includes("general-team-size"))
  );
}

export function hasCommunicationChannels(profile: DiscoveryProfile): boolean {
  return (
    (profile.communicationChannels?.length ?? 0) > 0 ||
    Boolean(profile.discoveryAnswers?.["general-customer-contact"]) ||
    Boolean(profile.answeredQuestions?.includes("general-customer-contact"))
  );
}

export function hasOperationalFriction(profile: DiscoveryProfile): boolean {
  return (
    Boolean(profile.discoveryAnswers?.["general-friction"]) ||
    Boolean(profile.answeredQuestions?.includes("general-friction"))
  );
}

export function hasMinimumBusinessContext(profile: DiscoveryProfile): boolean {
  return hasIndustry(profile) || (profile.answeredQuestions?.length ?? 0) >= 2;
}

export function buildMissingFieldPrompt(missingFields: DiscoveryField[]): string | null {
  if (missingFields.length === 0) return null;

  const fragments: string[] = [];

  if (missingFields.includes("industry")) {
    fragments.push("what kind of business it is");
  }
  if (missingFields.includes("employeeCount")) {
    fragments.push("roughly how many people are involved in day-to-day operations");
  }
  if (missingFields.includes("communicationChannels")) {
    fragments.push("how customers usually reach you");
  }
  if (missingFields.includes("operationalFriction")) {
    fragments.push("what creates the most friction in a typical week");
  }

  if (fragments.length === 0) return null;
  if (fragments.length === 1) return `Could you share ${fragments[0]}?`;

  const last = fragments.pop();
  return `Could you share ${fragments.join(", ")}, and ${last}?`;
}

export function diffProfileFields(
  before: DiscoveryProfile,
  after: DiscoveryProfile,
): Partial<DiscoveryProfile> {
  const extracted: Partial<DiscoveryProfile> = {};

  if (before.industry !== after.industry && after.industry) extracted.industry = after.industry;
  if (before.employeeCount !== after.employeeCount && after.employeeCount != null) {
    extracted.employeeCount = after.employeeCount;
  }
  if (before.locationCount !== after.locationCount && after.locationCount != null) {
    extracted.locationCount = after.locationCount;
  }
  if (
    JSON.stringify(before.communicationChannels) !== JSON.stringify(after.communicationChannels) &&
    after.communicationChannels
  ) {
    extracted.communicationChannels = after.communicationChannels;
  }
  if (JSON.stringify(before.answeredQuestions) !== JSON.stringify(after.answeredQuestions)) {
    extracted.answeredQuestions = after.answeredQuestions;
  }
  if (JSON.stringify(before.discoveryAnswers) !== JSON.stringify(after.discoveryAnswers)) {
    extracted.discoveryAnswers = after.discoveryAnswers;
  }

  return extracted;
}
