import type { BusinessProfile } from "@/lib/cat/types";
import type { NordiMessageCard } from "@/lib/nordi/cards";
import type { NordiLanguage } from "@/lib/nordi/language/types";

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
  hasGoogleBusinessProfile: boolean;
  technologies: string[];
  signals: WebsiteSignal[];
  analyzedAt: string;
};

export type DiscoveryProfile = BusinessProfile & {
  website?: string;
  discoveryPhase?: DiscoveryPhase;
  userMessageCount?: number;
  websiteAsked?: boolean;
  websitePermissionAsked?: boolean;
  websitePermissionGranted?: boolean;
  websiteAnalysisPending?: boolean;
  websiteAnalysis?: WebsiteAnalysisResult;
  insightDelivered?: boolean;
  pendingInsight?: string;
  callRequested?: boolean;
  locationCount?: number;
  answeredQuestions?: string[];
  discoveryAnswers?: Record<string, string>;
  pendingQuestionId?: string;
  areasForSupport?: string[];
  isReturningVisitor?: boolean;
  preferredLanguage?: NordiLanguage;
};

export type DiscoveryEngineResult = {
  reply: string;
  progressiveReply?: string[];
  thinkingContext?: "general" | "reviewing-business" | "analyzing-shared" | "comparing" | "website" | "preparing";
  profileUpdates?: Partial<DiscoveryProfile>;
  triggerWebsiteAnalysis?: string;
  deliverPendingInsight?: boolean;
  showWebsiteAnalyzing?: boolean;
  cards?: NordiMessageCard[];
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
