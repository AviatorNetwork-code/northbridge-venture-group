import type { DiscoveryProfile } from "@/lib/cat/discovery-types";
import { getIndustryLabel } from "@/lib/cat/industry-questions";

export type ConfidenceLevel = "Learning" | "Medium" | "High" | "Very High";

export function computeIndustryConfidence(profile: DiscoveryProfile): ConfidenceLevel {
  let score = 0;

  if (profile.industry) score += 2;
  if (profile.employeeCount) score += 1;
  if ((profile.answeredQuestions?.length ?? 0) >= 2) score += 2;
  if (profile.websiteAnalysis) score += 2;
  if (profile.website && !profile.websiteAnalysis) score += 1;
  if ((profile.communicationChannels?.length ?? 0) > 0) score += 1;

  if (score >= 7) return "Very High";
  if (score >= 5) return "High";
  if (score >= 3) return "Medium";
  return "Learning";
}

export function getProfileCardFields(profile: DiscoveryProfile) {
  const websiteStatus = profile.websiteAnalysisPending
    ? "Analyzing"
    : profile.websiteAnalysis || profile.website
      ? "Connected"
      : "Not connected";

  return {
    business: profile.industry ? getIndustryLabel(profile.industry) : "Learning…",
    employees: profile.employeeCount ? String(profile.employeeCount) : "—",
    locations: profile.locationCount ? String(profile.locationCount) : profile.industry ? "1" : "—",
    website: websiteStatus,
    confidence: computeIndustryConfidence(profile),
  };
}

export function getBusinessSummaryFields(
  profile: DiscoveryProfile,
  knownSince: string,
  lastUpdated: string,
  formatKnownSince: (iso: string) => string,
  formatLastUpdated: (iso: string) => string,
) {
  const base = getProfileCardFields(profile);
  return {
    ...base,
    knownSince: formatKnownSince(knownSince),
    lastUpdated: formatLastUpdated(lastUpdated),
  };
}
