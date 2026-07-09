export type { NordiLanguage } from "@/lib/nordi/language/types";
export { DEFAULT_NORDI_LANGUAGE } from "@/lib/nordi/language/types";

export {
  detectLanguageFromText,
  detectAndPersistLanguage,
  resolvePreferredLanguage,
} from "@/lib/nordi/language/detect-language";

export { extractBusinessSignals, type ExtractedBusinessSignals } from "@northbridge/conversation-state";
