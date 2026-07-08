import type { DiscoveryProfile, WebsiteAnalysisResult, WebsiteSignal } from "@/lib/cat/discovery-types";
import { getIndustryLabel } from "@/lib/cat/industry-questions";
import { computeIndustryConfidence } from "@/lib/cat/profile-confidence";
import { buildInsightConfidence } from "@/lib/nordi/confidence";

export type ObservationRow = {
  label: string;
  value: string;
  tone?: "positive" | "neutral" | "muted";
};

export type WebsiteObservationCardData = {
  title: string;
  rows: ObservationRow[];
};

export type ConversationInsightCardData = {
  title: string;
  observation: string;
  confidence: string;
  reason: string;
};

export type BusinessSnapshotCardData = {
  title: string;
  business: string;
  employees: string;
  confidence: string;
};

export type NordiMessageCard =
  | { type: "website-observation"; data: WebsiteObservationCardData }
  | { type: "conversation-insight"; data: ConversationInsightCardData }
  | { type: "business-snapshot"; data: BusinessSnapshotCardData };

function detectedLabel(found: boolean): string {
  return found ? "Detected" : "Not detected";
}

export function buildWebsiteObservationCard(analysis: WebsiteAnalysisResult): WebsiteObservationCardData {
  const rows: ObservationRow[] = [
    {
      label: "Website",
      value: "Found",
      tone: "positive",
    },
    {
      label: "Services",
      value: analysis.services.length > 0 ? String(analysis.services.length) : "—",
      tone: analysis.services.length > 0 ? "neutral" : "muted",
    },
    {
      label: "Booking",
      value: detectedLabel(analysis.hasAppointmentSystem),
      tone: analysis.hasAppointmentSystem ? "positive" : "muted",
    },
    {
      label: "Contact Form",
      value: detectedLabel(analysis.hasContactForm),
      tone: analysis.hasContactForm ? "positive" : "muted",
    },
    {
      label: "Google Business",
      value: detectedLabel(analysis.hasGoogleBusinessProfile),
      tone: analysis.hasGoogleBusinessProfile ? "positive" : "neutral",
    },
  ];

  return { title: "Observation", rows };
}

export function buildConversationInsightCard(
  signal: WebsiteSignal,
  profile: DiscoveryProfile,
): ConversationInsightCardData {
  const hasConversationContext = (profile.answeredQuestions?.length ?? 0) > 0;
  const confidence = buildInsightConfidence(signal.confidence, hasConversationContext);

  return {
    title: "Conversation Insight",
    observation: signal.observation,
    confidence: confidence.level,
    reason: signal.evidence || confidence.reason,
  };
}

export function buildBusinessSnapshotCard(profile: DiscoveryProfile): BusinessSnapshotCardData | null {
  if (!profile.industry) return null;

  return {
    title: "Business Summary",
    business: getIndustryLabel(profile.industry),
    employees: profile.employeeCount ? String(profile.employeeCount) : "—",
    confidence: computeIndustryConfidence(profile),
  };
}

export function pickPrimaryInsightSignal(analysis: WebsiteAnalysisResult): WebsiteSignal | null {
  const priority = ["reminder-gap", "booking-missing", "emergency-phone", "form-only-contact", "services-without-booking"];
  for (const id of priority) {
    const match = analysis.signals.find((signal) => signal.id === id);
    if (match) return match;
  }
  return analysis.signals[0] ?? null;
}
