import type { ExtractedBusinessSignals } from "./types.js";

type IndustryPattern = {
  industry: string;
  patterns: string[];
};

const INDUSTRY_PATTERNS: IndustryPattern[] = [
  {
    industry: "aviation",
    patterns: [
      "flight school",
      "escuela de vuelo",
      "pilot training",
      "flying school",
      "cfi",
      "aviation",
      "aviación",
      "escuela de aviación",
    ],
  },
  {
    industry: "dental",
    patterns: ["dental", "dentist", "dental office", "dental clinic", "orthodont", "odontolog"],
  },
  {
    industry: "hvac",
    patterns: ["hvac", "heating and cooling", "heating", "air conditioning", "furnace", "calefacción"],
  },
  {
    industry: "healthcare",
    patterns: ["healthcare", "medical", "clinic", "hospital", "patient", "clínica", "paciente"],
  },
  {
    industry: "hospitality",
    patterns: [
      "restaurant",
      "restaurants",
      "hotel",
      "hospitality",
      "cafe",
      "bar",
      "restaurante",
      "restaurantes",
      "cafetería",
      "cafeteria",
      "tengo un restaurante",
    ],
  },
  {
    industry: "retail",
    patterns: ["retail", "store", "shop", "ecommerce", "e-commerce", "tienda", "comercio"],
  },
  {
    industry: "professional-services",
    patterns: [
      "law firm",
      "attorney",
      "abogado",
      "abogada",
      "soy abogado",
      "soy abogada",
      "accounting",
      "consulting",
      "agency",
      "tax",
      "taxes",
      "cpa",
      "bookkeeping",
      "accountant",
      "tax preparer",
      "tax preparation",
      "impuestos",
      "impuesto",
      "contabilidad",
      "contador",
      "contadores",
      "soy contador",
      "soy contadora",
      "fiscal",
      "negocio de impuestos",
    ],
  },
  {
    industry: "fitness",
    patterns: ["gym", "fitness", "studio", "yoga", "gimnasio"],
  },
  {
    industry: "salon",
    patterns: ["salon", "spa", "beauty", "salón", "belleza"],
  },
  {
    industry: "general",
    patterns: [
      "contractor",
      "contratista",
      "soy contratista",
      "general contractor",
      "construction",
      "construcción",
      "business",
      "company",
      "firm",
      "practice",
      "shop",
      "store",
      "negocio",
      "empresa",
      "firma",
      "tengo una oficina",
    ],
  },
];

const SOLO_OPERATOR_PATTERNS = [
  "just me",
  "only me",
  "one person",
  "solo yo",
  "sólo yo",
  "unicamente yo",
  "únicamente yo",
  "trabajo solo",
  "trabajar solo",
  "trabajo sola",
  "work alone",
  "by myself",
];

const SMALL_TEAM_PATTERNS = ["small team", "few people", "equipo pequeño", "pocas personas"];

const REFERRAL_PATTERNS = [
  "referral",
  "referrals",
  "word of mouth",
  "word-of-mouth",
  "referido",
  "referidos",
  "recomendación",
  "recomendaciones",
  "boca a boca",
  "llegan por recomendaciones",
  "por recomendaciones",
];

const SCHEDULING_FRICTION_PATTERNS = [
  "scheduling",
  "appointment",
  "cancel",
  "book",
  "calendar",
  "agenda",
  "cita",
  "citas",
  "cancelan",
  "cancelación",
  "cancelaciones",
  "me cancelan las citas",
];

const GROWTH_INTENT_PATTERNS = ["quiero crecer", "want to grow", "grow the business", "crecer"];

function includesAny(text: string, terms: string[]): boolean {
  return terms.some((term) => text.includes(term));
}

function extractIndustry(text: string): string | undefined {
  for (const { industry, patterns } of INDUSTRY_PATTERNS) {
    if (patterns.some((pattern) => text.includes(pattern))) {
      return industry;
    }
  }
  return undefined;
}

function extractEmployeeCount(text: string): number | undefined {
  const numericMatch = text.match(
    /(\d+)\s*(employees|staff|people|team members|technicians|instructors|providers|workers|empleados|personal|personas|técnicos|trabajadores)/i,
  );
  if (numericMatch) return Number.parseInt(numericMatch[1], 10);

  const wordMatch = text.match(
    /\b(two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\s+(restaurants|locations|offices|stores|restaurantes|ubicaciones|oficinas|tiendas|empleados|personas)/i,
  );
  if (wordMatch) {
    const words: Record<string, number> = {
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
      ten: 10,
      eleven: 11,
      twelve: 12,
      dos: 2,
      tres: 3,
      cuatro: 4,
      cinco: 5,
      seis: 6,
      siete: 7,
      ocho: 8,
      nueve: 9,
      diez: 10,
    };
    return words[wordMatch[1].toLowerCase()];
  }

  if (includesAny(text, SOLO_OPERATOR_PATTERNS) || /\bsolo\b/.test(text) && includesAny(text, ["yo", "trabajo"])) {
    return 1;
  }

  if (includesAny(text, SMALL_TEAM_PATTERNS)) return 5;

  return undefined;
}

function extractLocationCount(text: string): number | undefined {
  const match = text.match(
    /(\d+)\s*(locations|restaurants|offices|stores|sites|oficinas|ubicaciones|restaurantes|tiendas)/i,
  );
  if (match) return Number.parseInt(match[1], 10);

  const wordOfficeMatch = text.match(
    /\b(dos|tres|cuatro|two|three|four)\s+(oficinas|offices|ubicaciones|locations)/i,
  );
  if (wordOfficeMatch) {
    const words: Record<string, number> = { dos: 2, tres: 3, cuatro: 4, two: 2, three: 3, four: 4 };
    return words[wordOfficeMatch[1].toLowerCase()];
  }

  if (includesAny(text, ["two restaurants", "2 restaurants", "dos restaurantes"])) return 2;
  if (includesAny(text, ["tengo dos oficinas", "two offices", "2 offices"])) return 2;

  return undefined;
}

function extractCommunicationChannels(text: string): string[] {
  const channels = new Set<string>();

  if (includesAny(text, ["whatsapp", "atiendo por whatsapp", "por whatsapp"])) {
    channels.add("WhatsApp");
  }
  if (includesAny(text, ["phone", "call us", "by phone", "teléfono", "telefono", "llamada", "llamadas"])) {
    channels.add("Phone");
  }
  if (includesAny(text, ["text", "texts", "sms", "text message", "texto", "mensaje", "mensajes"])) {
    channels.add("Text");
  }
  if (includesAny(text, ["email", "gmail", "correo"])) {
    channels.add("Email");
  }
  if (includesAny(text, ["walk-in", "walk in", "visita", "visitas"])) {
    channels.add("Walk-ins");
  }

  return Array.from(channels);
}

export function extractBusinessSignals(rawText: string): ExtractedBusinessSignals {
  const text = rawText.trim().toLowerCase();
  if (!text) return {};

  const signals: ExtractedBusinessSignals = {};

  const industry = extractIndustry(text);
  if (industry) signals.industry = industry;

  const employeeCount = extractEmployeeCount(text);
  if (employeeCount != null) signals.employeeCount = employeeCount;

  const locationCount = extractLocationCount(text);
  if (locationCount != null) signals.locationCount = locationCount;

  const communicationChannels = extractCommunicationChannels(text);
  if (communicationChannels.length > 0) signals.communicationChannels = communicationChannels;

  if (includesAny(text, REFERRAL_PATTERNS)) signals.referralMentioned = true;
  if (includesAny(text, SCHEDULING_FRICTION_PATTERNS)) signals.schedulingFrictionMentioned = true;
  if (includesAny(text, GROWTH_INTENT_PATTERNS)) signals.growthIntentMentioned = true;

  return signals;
}
