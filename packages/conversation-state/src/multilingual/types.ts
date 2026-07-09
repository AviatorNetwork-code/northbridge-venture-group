export type SupportedLanguage = "en" | "es";

export const DEFAULT_LANGUAGE: SupportedLanguage = "en";

export type LanguageDetectionResult = {
  language: SupportedLanguage;
  confidence: number;
  mixedLanguage: boolean;
};

export type ExtractedBusinessSignals = {
  industry?: string;
  employeeCount?: number;
  locationCount?: number;
  communicationChannels?: string[];
  referralMentioned?: boolean;
  schedulingFrictionMentioned?: boolean;
  growthIntentMentioned?: boolean;
};
