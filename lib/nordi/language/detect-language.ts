import type { DiscoveryProfile } from "@/lib/cat/discovery-types";
import { DEFAULT_NORDI_LANGUAGE, type LanguageDetectionResult, type NordiLanguage } from "@/lib/nordi/language/types";

const SPANISH_MARKERS = ["ñ", "á", "é", "í", "ó", "ú", "ü", "¿", "¡"];

const SPANISH_WORDS = [
  "tengo",
  "negocio",
  "impuestos",
  "impuesto",
  "restaurante",
  "restaurantes",
  "solo",
  "sola",
  "clientes",
  "teléfono",
  "telefono",
  "texto",
  "mensajes",
  "empresa",
  "somos",
  "trabajo",
  "referidos",
  "recomendaciones",
  "contabilidad",
  "contador",
  "semana",
  "operaciones",
  "hola",
  "gracias",
  "sí",
  "claro",
];

const ENGLISH_WORDS = [
  "the",
  "business",
  "tax",
  "restaurant",
  "customers",
  "phone",
  "just",
  "employees",
  "company",
  "operations",
  "scheduling",
  "referral",
  "hello",
  "thanks",
];

function countWordMatches(text: string, words: string[]): number {
  return words.reduce((score, word) => {
    return score + (new RegExp(`\\b${word}\\b`, "i").test(text) ? 1 : 0);
  }, 0);
}

export function detectLanguageFromText(text: string): LanguageDetectionResult {
  const normalized = text.trim();
  if (normalized.length < 3) {
    return { language: DEFAULT_NORDI_LANGUAGE, confidence: 0 };
  }

  const lower = normalized.toLowerCase();
  let spanishScore = SPANISH_MARKERS.reduce(
    (score, marker) => score + (lower.includes(marker) ? 2 : 0),
    0,
  );
  spanishScore += countWordMatches(lower, SPANISH_WORDS);
  const englishScore = countWordMatches(lower, ENGLISH_WORDS);

  if (spanishScore >= 2 && spanishScore > englishScore) {
    return { language: "es", confidence: Math.max(0.45, Math.min(1, spanishScore / 6)) };
  }

  if (englishScore >= 1 && englishScore >= spanishScore) {
    return { language: "en", confidence: Math.min(1, englishScore / 5) };
  }

  if (spanishScore > englishScore) {
    return { language: "es", confidence: 0.45 };
  }

  return { language: DEFAULT_NORDI_LANGUAGE, confidence: 0.35 };
}

export function resolvePreferredLanguage(
  profile: DiscoveryProfile,
  message: string,
): NordiLanguage {
  if (profile.preferredLanguage) return profile.preferredLanguage;

  const detection = detectLanguageFromText(message);
  if (detection.language === "es" && detection.confidence >= 0.4) {
    return "es";
  }

  return DEFAULT_NORDI_LANGUAGE;
}

export function detectAndPersistLanguage(
  profile: DiscoveryProfile,
  message: string,
): NordiLanguage {
  if (profile.preferredLanguage) return profile.preferredLanguage;
  if (message.trim().length < 8) return DEFAULT_NORDI_LANGUAGE;

  const detection = detectLanguageFromText(message);
  if (detection.language === "es" && detection.confidence >= 0.4) {
    return "es";
  }

  return DEFAULT_NORDI_LANGUAGE;
}
