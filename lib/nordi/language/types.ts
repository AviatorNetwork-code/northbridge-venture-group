export type NordiLanguage = "en" | "es";

export const DEFAULT_NORDI_LANGUAGE: NordiLanguage = "en";

export type LanguageDetectionResult = {
  language: NordiLanguage;
  confidence: number;
};
