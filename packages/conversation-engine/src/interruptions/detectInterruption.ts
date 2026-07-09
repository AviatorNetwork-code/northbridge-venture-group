import { extractBusinessSignals } from "@northbridge/conversation-state";
import type { InterruptionDetection, InterruptionDetectionContext, InterruptionType } from "./types.js";

const QUESTION_PREFIX =
  /^(what|who|where|when|why|how|can you|could you|tell me|do you|is there|are there|qué|quién|cómo|dónde|cuál|cuáles|puedes|me puedes|quisiera saber)/i;

const TYPE_PATTERNS: Record<InterruptionType, RegExp[]> = {
  human_assistance: [
    /\btalk to someone\b/i,
    /\bspeak to (?:a )?person\b/i,
    /\bspeak with (?:a )?person\b/i,
    /\bneed a human\b/i,
    /\bwant a human\b/i,
    /\bschedule a call\b/i,
    /\bcan someone contact me\b/i,
    /\bspeak to (?:a )?human\b/i,
    /\btalk to (?:a )?human\b/i,
    /\breal person\b/i,
    /\bmember of (?:the )?team\b/i,
    /\bhablar con alguien\b/i,
    /\bnecesito (?:un )?humano\b/i,
    /\bhablar con (?:una )?persona\b/i,
  ],
  navigation: [
    /\btake me to\b/i,
    /\bgo to\b/i,
    /\bopen (?:the )?\w+/i,
    /\bshow me (?:the )?\w+/i,
    /\bnavigate to\b/i,
    /\bllev(?:a|)me a\b/i,
    /\babrir (?:la )?p[aá]gina\b/i,
  ],
  company: [
    /\bwhat is northbridge\b/i,
    /\bwhat(?:'s| is) northbridge\b/i,
    /\bwho is northbridge\b/i,
    /\bwhat does northbridge do\b/i,
    /\bwhat does northbridge\b/i,
    /\btell me about northbridge\b/i,
    /\blearn about northbridge\b/i,
    /\babout northbridge\b/i,
    /\bnorthbridge digital\b/i,
    /\bbefore we continue.*northbridge\b/i,
    /\bfirst.*northbridge\b/i,
    /\bnorthbridge.*first\b/i,
    /\bqu[eé] es northbridge\b/i,
    /\bqui[eé]n es northbridge\b/i,
    /\bsobre northbridge\b/i,
    /\bcu[eé]ntame sobre northbridge\b/i,
  ],
  founder: [
    /\bfounder\b/i,
    /\bandres suarez\b/i,
    /\bwho (?:created|founded|built)\b/i,
    /\bwho made (?:nordi|northbridge)\b/i,
    /\bfundador\b/i,
    /\bqui[eé]n (?:cre[oó]|fund[oó])\b/i,
  ],
  products: [
    /\bwhat (?:products|product)\b/i,
    /\bnordi product\b/i,
    /\bflagship platform\b/i,
    /\bqu[eé] productos\b/i,
    /\bproducto(?:s)? de northbridge\b/i,
  ],
  services: [
    /\bwhat (?:services|do you offer|do you do)\b/i,
    /\byour services\b/i,
    /\bdigital solutions\b/i,
    /\bqu[eé] servicios\b/i,
    /\bqu[eé] ofrecen\b/i,
  ],
  pricing: [
    /\bhow much\b/i,
    /\bpricing\b/i,
    /\bprice\b/i,
    /\bcost\b/i,
    /\bsubscription\b/i,
    /\bcu[aá]nto cuesta\b/i,
    /\bprecio\b/i,
    /\bcosto\b/i,
  ],
  location: [
    /\bwhere are you (?:based|located)\b/i,
    /\byour location\b/i,
    /\bwhere is northbridge\b/i,
    /\bd[oó]nde (?:est[aá]n|quedan)\b/i,
    /\bubicaci[oó]n\b/i,
  ],
  website: [
    /\bnorthbridge(?:'s)? website\b/i,
    /\byour website\b/i,
    /\bcompany website\b/i,
    /\bsitio web de northbridge\b/i,
    /\bsu sitio web\b/i,
  ],
  small_talk: [
    /^(?:hello|hi|hey|thanks|thank you|good morning|good afternoon|hola|gracias|buenos d[ií]as)(?:[.!,\s]|$)/i,
  ],
  general_knowledge: [],
};

function isQuestionLike(message: string): boolean {
  const trimmed = message.trim();
  if (trimmed.includes("?")) return true;
  return QUESTION_PREFIX.test(trimmed);
}

function matchesAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

function isLikelyPendingAnswer(pendingQuestionId: string | undefined, message: string): boolean {
  if (!pendingQuestionId) return false;

  const text = message.trim().toLowerCase();
  const signals = extractBusinessSignals(text);

  if (
    pendingQuestionId.includes("team-size") ||
    pendingQuestionId === "cat-team-size" ||
    pendingQuestionId === "employeeCount"
  ) {
    return (
      signals.employeeCount != null ||
      /\b(just me|solo yo|trabajo solo|one person|\d+\s+(people|staff|employees|empleados|personas))\b/i.test(text)
    );
  }

  if (
    pendingQuestionId.includes("customer-contact") ||
    pendingQuestionId === "cat-customer-contact" ||
    pendingQuestionId === "communicationChannels"
  ) {
    return (
      (signals.communicationChannels?.length ?? 0) > 0 ||
      /\b(phone|email|text|whatsapp|walk-?in|tel[eé]fono|correo|texto|visita)\b/i.test(text)
    );
  }

  if (pendingQuestionId.includes("friction") || pendingQuestionId === "cat-friction") {
    if (/\b(northbridge|nordi)\b/i.test(text) && isQuestionLike(message)) {
      return false;
    }
    if (isQuestionLike(message)) return false;
    if (matchesAny(message, TYPE_PATTERNS.company)) return false;
    if (matchesAny(message, TYPE_PATTERNS.pricing)) return false;
    if (matchesAny(message, TYPE_PATTERNS.human_assistance)) return false;
    if (matchesAny(message, TYPE_PATTERNS.founder)) return false;
    if (matchesAny(message, TYPE_PATTERNS.services)) return false;
    if (matchesAny(message, TYPE_PATTERNS.products)) return false;
    return text.length >= 8;
  }

  if (pendingQuestionId.includes("software") || pendingQuestionId === "cat-software") {
    return /\b(google calendar|gmail|stripe|hubspot|whatsapp|calendar|crm|software)\b/i.test(text);
  }

  if (pendingQuestionId.includes("crm") || pendingQuestionId === "cat-crm") {
    return /\b(hubspot|crm|salesforce|not a priority|no crm|sin crm)\b/i.test(text);
  }

  if (pendingQuestionId.includes("booking") || pendingQuestionId.includes("scheduling")) {
    return /\b(yes|no|online|manual|phone|s[ií]|claro|nope)\b/i.test(text) && text.length < 80;
  }

  return false;
}

export function detectInterruption(context: InterruptionDetectionContext): InterruptionDetection {
  if (!context.hasPendingQuestion) {
    return { isInterruption: false, confidence: 0 };
  }

  const message = context.message.trim();
  if (!message) {
    return { isInterruption: false, confidence: 0 };
  }

  if (isLikelyPendingAnswer(context.pendingQuestionId, message)) {
    return { isInterruption: false, confidence: 0 };
  }

  const orderedTypes: InterruptionType[] = [
    "human_assistance",
    "navigation",
    "company",
    "founder",
    "products",
    "services",
    "pricing",
    "location",
    "website",
    "small_talk",
  ];

  for (const type of orderedTypes) {
    if (matchesAny(message, TYPE_PATTERNS[type])) {
      return { isInterruption: true, type, confidence: 0.9 };
    }
  }

  if (
    isQuestionLike(message) &&
    /\b(northbridge|nordi|venture|aviator|your company|your platform)\b/i.test(message)
  ) {
    return { isInterruption: true, type: "general_knowledge", confidence: 0.75 };
  }

  if (isQuestionLike(message) && !isLikelyPendingAnswer(context.pendingQuestionId, message)) {
    return { isInterruption: true, type: "general_knowledge", confidence: 0.55 };
  }

  return { isInterruption: false, confidence: 0 };
}
