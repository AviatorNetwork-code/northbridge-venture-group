import type { DiscoveryProfile } from "@/lib/cat/discovery-types";
import {
  detectLanguageFromText as detectNeoLanguage,
  resolvePersistedLanguage,
  type LanguageDetectionResult as NeoLanguageDetectionResult,
} from "@northbridge/conversation-state";
import { DEFAULT_NORDI_LANGUAGE, type LanguageDetectionResult, type NordiLanguage } from "@/lib/nordi/language/types";

export type { NordiLanguage };

function toNordiResult(result: NeoLanguageDetectionResult): LanguageDetectionResult {
  return {
    language: result.language,
    confidence: result.confidence,
  };
}

export function detectLanguageFromText(text: string): LanguageDetectionResult {
  return toNordiResult(detectNeoLanguage(text));
}

export function resolvePreferredLanguage(
  profile: DiscoveryProfile,
  message: string,
): NordiLanguage {
  return resolvePersistedLanguage(profile.preferredLanguage, message);
}

export function detectAndPersistLanguage(
  profile: DiscoveryProfile,
  message: string,
): NordiLanguage {
  return resolvePersistedLanguage(profile.preferredLanguage, message);
}

export { DEFAULT_NORDI_LANGUAGE };
