import type { BusinessProfile } from "@/lib/cat/types";

export type DiscoveryPhase =
  | "learning"
  | "website_prompted"
  | "website_analyzing"
  | "insight_delivered"
  | "recommendations";

export type WebsiteSignal = {
  id: string;
  category: string;
  observation: string;
  evidence: string;
  confidence: "high" | "medium" | "low";
};

export type WebsiteAnalysisResult = {
  url: string;
  title?: string;
  category?: string;
  services: string[];
  contactMethods: string[];
  hasBookingFlow: boolean;
  hasAppointmentSystem: boolean;
  appointmentProvider?: string;
  hasBusinessHours: boolean;
  hasContactForm: boolean;
  hasEmergencyMessaging: boolean;
  phoneProminent: boolean;
  technologies: string[];
  signals: WebsiteSignal[];
  analyzedAt: string;
};

export type DiscoveryProfile = BusinessProfile & {
  website?: string;
  discoveryPhase?: DiscoveryPhase;
  userMessageCount?: number;
  websiteAsked?: boolean;
  websiteAnalysisPending?: boolean;
  websiteAnalysis?: WebsiteAnalysisResult;
  insightDelivered?: boolean;
  pendingInsight?: string;
  callRequested?: boolean;
};

export type DiscoveryEngineResult = {
  reply: string;
  profileUpdates?: Partial<DiscoveryProfile>;
  triggerWebsiteAnalysis?: string;
  deliverPendingInsight?: boolean;
};

export type StructuredRecommendation = {
  name: string;
  observed: string;
  whyItMatters: string;
  evidence: string;
  assumptions: string;
  confidence: "high" | "medium" | "low";
  alternatives?: string;
};
