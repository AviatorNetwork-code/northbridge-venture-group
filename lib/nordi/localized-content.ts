import type { DiscoveryField } from "@/lib/cat/discovery-profile-state";
import type { NordiLanguage } from "@/lib/nordi/language/types";

const QUESTION_PROMPTS: Record<NordiLanguage, Record<string, string>> = {
  en: {
    "general-team-size": "Roughly how many people are involved in day-to-day operations?",
    "general-customer-contact":
      "How do customers usually reach you — phone, email, walk-ins, or something else?",
    "general-friction":
      "What creates the most friction in a typical week — scheduling, follow-ups, billing, or something else?",
    "dental-online-booking": "Do you currently have online appointment booking?",
    "dental-providers": "Approximately how many providers work there?",
    "dental-reminders": "Do you already send appointment reminders to patients?",
    "hvac-technicians": "How many technicians do you currently employ?",
    "hvac-scheduling": "How do customers schedule service today?",
    "hvac-emergency": "Do you provide emergency service?",
    "hospitality-locations": "How many locations do you operate?",
    "hospitality-reservations": "How do customers make reservations or place orders today?",
    "hospitality-staff": "Roughly how many people work across your locations?",
  },
  es: {
    "general-team-size": "¿Aproximadamente cuántas personas participan en las operaciones del día a día?",
    "general-customer-contact":
      "¿Cómo suelen contactarlo los clientes — teléfono, correo, visitas o de otra forma?",
    "general-friction":
      "¿Qué genera más fricción en una semana típica — agenda, seguimientos, facturación u otra cosa?",
    "dental-online-booking": "¿Actualmente tienen reservas de citas en línea?",
    "dental-providers": "¿Aproximadamente cuántos proveedores trabajan ahí?",
    "dental-reminders": "¿Ya envían recordatorios de citas a los pacientes?",
    "hvac-technicians": "¿Cuántos técnicos emplean actualmente?",
    "hvac-scheduling": "¿Cómo programan los clientes el servicio hoy?",
    "hvac-emergency": "¿Ofrecen servicio de emergencia?",
    "hospitality-locations": "¿Cuántas ubicaciones operan?",
    "hospitality-reservations": "¿Cómo hacen los clientes reservaciones o pedidos hoy?",
    "hospitality-staff": "¿Aproximadamente cuántas personas trabajan en sus ubicaciones?",
  },
};

const INDUSTRY_LABELS: Record<NordiLanguage, Record<string, string>> = {
  en: {
    dental: "Dental Office",
    hvac: "HVAC Company",
    aviation: "Flight School",
    healthcare: "Healthcare Practice",
    hospitality: "Restaurant / Hospitality",
    retail: "Retail Business",
    fitness: "Fitness Business",
    salon: "Salon / Spa",
    "professional-services": "Professional Services",
    general: "Business",
  },
  es: {
    dental: "Consultorio dental",
    hvac: "Empresa de HVAC",
    aviation: "Escuela de vuelo",
    healthcare: "Práctica de salud",
    hospitality: "Restaurante / Hospitalidad",
    retail: "Negocio retail",
    fitness: "Negocio fitness",
    salon: "Salón / Spa",
    "professional-services": "Servicios profesionales",
    general: "Negocio",
  },
};

const MISSING_FIELD_PROMPTS: Record<NordiLanguage, Record<DiscoveryField, string>> = {
  en: {
    industry: "what kind of business it is",
    employeeCount: "roughly how many people are involved in day-to-day operations",
    communicationChannels: "how customers usually reach you",
    operationalFriction: "what creates the most friction in a typical week",
  },
  es: {
    industry: "qué tipo de negocio es",
    employeeCount: "aproximadamente cuántas personas participan en las operaciones del día a día",
    communicationChannels: "cómo suelen contactarlo los clientes",
    operationalFriction: "qué genera más fricción en una semana típica",
  },
};

export function getLocalizedQuestionPrompt(questionId: string, language: NordiLanguage, fallback: string): string {
  return QUESTION_PROMPTS[language][questionId] ?? QUESTION_PROMPTS.en[questionId] ?? fallback;
}

export function getLocalizedIndustryLabel(industry: string | undefined, language: NordiLanguage): string {
  const labels = INDUSTRY_LABELS[language];
  return labels[industry ?? ""] ?? INDUSTRY_LABELS.en[industry ?? ""] ?? (language === "es" ? "Negocio" : "Business");
}

export function buildLocalizedMissingFieldPrompt(
  missingFields: DiscoveryField[],
  language: NordiLanguage,
): string | null {
  if (missingFields.length === 0) return null;

  const fragments = missingFields.map((field) => MISSING_FIELD_PROMPTS[language][field]);
  if (fragments.length === 1) {
    return language === "es"
      ? `¿Podría compartir ${fragments[0]}?`
      : `Could you share ${fragments[0]}?`;
  }

  const last = fragments.pop();
  if (language === "es") {
    return `¿Podría compartir ${fragments.join(", ")} y ${last}?`;
  }
  return `Could you share ${fragments.join(", ")}, and ${last}?`;
}

export function localizeSupportArea(area: string, language: NordiLanguage): string {
  if (language === "en") return area;

  const map: Record<string, string> = {
    "appointment reminder follow-through": "seguimiento de recordatorios de citas",
    "after-hours and emergency dispatch coordination": "coordinación de emergencias fuera de horario",
    "student scheduling visibility": "visibilidad de la agenda de estudiantes",
    "making scheduling clearer for new customers": "hacer la agenda más clara para clientes nuevos",
    "automated appointment reminders": "recordatorios automáticos de citas",
    "keeping customer messages organized across channels": "organizar mensajes de clientes entre canales",
    "operational follow-through": "seguimiento operativo",
    "customer communication consistency": "consistencia en la comunicación con clientes",
  };

  return map[area] ?? area;
}
