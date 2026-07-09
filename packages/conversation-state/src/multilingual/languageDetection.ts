import {
  DEFAULT_LANGUAGE,
  type LanguageDetectionResult,
  type SupportedLanguage,
} from "./types.js";

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
  "necesito",
  "mis",
  "quiero",
  "atiendo",
  "soy",
  "abogado",
  "abogada",
  "contratista",
  "oficina",
  "oficinas",
  "agenda",
  "citas",
  "empleados",
  "escuela",
  "vuelo",
  "crecer",
  "cancelan",
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
  "help",
  "need",
  "my",
  "always",
  "call",
  "with",
  "flight",
  "school",
  "law",
  "firm",
  "contractor",
];

const SPANISH_BUSINESS_WORDS = [
  "clientes",
  "citas",
  "empleados",
  "negocio",
  "agenda",
  "oficina",
  "oficinas",
  "recomendaciones",
  "referidos",
  "contador",
  "abogado",
  "restaurante",
  "contratista",
  "impuestos",
  "whatsapp",
];

const SPANISH_OPENERS = /^(tengo|soy|necesito|mis|trabajo|atiendo|me\s|la\s|el\s|un\s|una\s)/i;

function countWordMatches(text: string, words: string[]): number {
  return words.reduce((score, word) => {
    return score + (new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text) ? 1 : 0);
  }, 0);
}

function countPhraseMatches(text: string, phrases: string[]): number {
  return phrases.reduce((score, phrase) => score + (text.includes(phrase) ? 1 : 0), 0);
}

export function detectLanguageFromText(text: string): LanguageDetectionResult {
  const normalized = text.trim();
  if (normalized.length < 3) {
    return { language: DEFAULT_LANGUAGE, confidence: 0, mixedLanguage: false };
  }

  const lower = normalized.toLowerCase();
  let spanishScore = SPANISH_MARKERS.reduce(
    (score, marker) => score + (lower.includes(marker) ? 2 : 0),
    0,
  );
  spanishScore += countWordMatches(lower, SPANISH_WORDS);
  spanishScore += countPhraseMatches(lower, SPANISH_BUSINESS_WORDS);

  const englishScore = countWordMatches(lower, ENGLISH_WORDS);
  const mixedLanguage = spanishScore >= 1 && englishScore >= 1;

  if (mixedLanguage) {
    const startsSpanish = SPANISH_OPENERS.test(lower);
    const businessSpanish = countWordMatches(lower, SPANISH_BUSINESS_WORDS);
    const preferSpanish =
      startsSpanish || businessSpanish >= 1 || spanishScore >= englishScore;

    return {
      language: preferSpanish ? "es" : "en",
      confidence: 0.5,
      mixedLanguage: true,
    };
  }

  if (spanishScore >= 2 && spanishScore > englishScore) {
    return {
      language: "es",
      confidence: Math.max(0.45, Math.min(1, spanishScore / 6)),
      mixedLanguage: false,
    };
  }

  if (englishScore >= 1 && englishScore >= spanishScore) {
    return {
      language: "en",
      confidence: Math.min(1, englishScore / 5),
      mixedLanguage: false,
    };
  }

  if (spanishScore > englishScore) {
    return { language: "es", confidence: 0.45, mixedLanguage: false };
  }

  return { language: DEFAULT_LANGUAGE, confidence: 0.35, mixedLanguage: false };
}

export function resolvePersistedLanguage(
  currentLanguage: SupportedLanguage | undefined,
  message: string,
  minimumLength = 8,
): SupportedLanguage {
  if (currentLanguage) return currentLanguage;
  if (message.trim().length < minimumLength) return DEFAULT_LANGUAGE;

  const detection = detectLanguageFromText(message);
  if (detection.language === "es" && detection.confidence >= 0.4) {
    return "es";
  }

  return DEFAULT_LANGUAGE;
}
