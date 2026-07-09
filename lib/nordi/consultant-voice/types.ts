import type { DiscoveryProfile, WebsiteAnalysisResult } from "@/lib/cat/discovery-types";
import type { NordiLanguage } from "@/lib/nordi/language/types";

export type ConsultantTurnInput = {
  profile: DiscoveryProfile;
  userMessage: string;
  answeredQuestionId?: string;
  nextQuestionId: string;
  nextQuestionPrompt: string;
};

export type ConsultantTurnOutput = {
  progressiveReply?: string[];
  reply: string;
};

export type ConsultantVoiceCopy = {
  soloOperatorReasoning: string;
  smallTeamReasoning: string;
  multiChannelReasoning: string;
  singleChannelReasoning: string;
  frictionReasoning: string;
  referralReasoning: string;
  industryDetailReasoning: (label: string) => string;
  referralConnection: string[];
  schedulingContactConnection: string;
  soloFrictionConnection: string;
  questionReasons: Record<string, string>;
  trustSummaryHeader: string;
  trustSummaryFooter: string;
  soloOperatorLabel: string;
  employeeCountLabel: (count: number) => string;
  customersViaLabel: (channels: string) => string;
  recommendationLeads: string[];
  recommendationFooter: string;
  websitePermissionLeads: string[];
  websiteUrlAckPrefix: string;
  websiteFinishedReview: string;
  noOnlineBooking: string;
  noContactForm: string;
  hvacEmergencyObs: string;
  schedulingAlignment: string;
  websiteFrictionConnection: string;
  industryOpening: (label: string) => string;
  websitePermissionPrompt: string;
  websiteUrlReady: string;
  websiteDeclinedLead: string;
  websiteDeclinedFollowUp: string;
  whileThatRunsPrefix: string;
  customerFindYouFallback: string;
  salesPressureDeflection: string[];
  generalFrictionLead: string;
  generalFrictionQuestion: string;
  relationshipAcknowledgment: string;
};

export type ConsultantVoice = {
  language: NordiLanguage;
  copy: ConsultantVoiceCopy;
  buildConsultantQuestionTurn: (input: ConsultantTurnInput) => ConsultantTurnOutput;
  buildConsultantRecommendationReply: (
    profile: DiscoveryProfile,
    areas: string[],
  ) => ConsultantTurnOutput;
  buildConsultantWebsitePermissionLead: (profile: DiscoveryProfile) => string;
  buildConsultantWebsiteUrlAck: (continueLine: string) => string;
  buildWebsiteInsightNarrative: (
    analysis: WebsiteAnalysisResult,
    profile: DiscoveryProfile,
  ) => string[];
  getIndustryLabel: (industry: string | undefined) => string;
};
