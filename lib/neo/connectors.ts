// NEO-style contract: Connector Platform + Customer Onboarding.
//
// Local stand-in for the NEO "Connector Platform" and "Customer Onboarding"
// packages (NEO is not reachable from this repo yet — see
// docs/validation/NB-VAL-004-REAL-BOOTSTRAP.md). The shapes here mirror what
// those packages are expected to expose so this can later become a thin client.
// No live OAuth, no secrets — connect actions are mocked in the UI only.

export type ConnectorId =
  | "google-calendar"
  | "gmail"
  | "whatsapp"
  | "stripe"
  | "hubspot";

export type Connector = {
  id: ConnectorId;
  name: string;
  blurb: string;
};

export const connectors: Connector[] = [
  { id: "google-calendar", name: "Google Calendar", blurb: "Scheduling & availability" },
  { id: "gmail", name: "Gmail", blurb: "Email handling" },
  { id: "whatsapp", name: "WhatsApp", blurb: "Customer messaging" },
  { id: "stripe", name: "Stripe", blurb: "Payments & invoices" },
  { id: "hubspot", name: "HubSpot", blurb: "CRM & leads" },
];

export type ConnectorTier = "required" | "recommended" | "optional";

export type OnboardingChecklist = {
  required: Connector[];
  recommended: Connector[];
  optional: Connector[];
};

const CONNECTOR_BY_ID: Record<ConnectorId, Connector> = connectors.reduce(
  (acc, c) => {
    acc[c.id] = c;
    return acc;
  },
  {} as Record<ConnectorId, Connector>,
);

function toConnectors(ids: ConnectorId[]): Connector[] {
  return ids.map((id) => CONNECTOR_BY_ID[id]);
}

// Base plan: most Specialists need scheduling + email; messaging & CRM help;
// payments are optional until you actually bill through the workforce.
const BASE: Record<ConnectorTier, ConnectorId[]> = {
  required: ["google-calendar", "gmail"],
  recommended: ["whatsapp", "hubspot"],
  optional: ["stripe"],
};

// A few industry-specific overrides — kept small and deterministic.
const INDUSTRY_OVERRIDES: Record<string, Record<ConnectorTier, ConnectorId[]>> = {
  Restaurant: {
    required: ["whatsapp", "google-calendar"],
    recommended: ["gmail", "hubspot"],
    optional: ["stripe"],
  },
  "Real Estate Office": {
    required: ["hubspot", "gmail"],
    recommended: ["google-calendar", "whatsapp"],
    optional: ["stripe"],
  },
  "Dental Clinic": {
    required: ["google-calendar", "gmail"],
    recommended: ["whatsapp"],
    optional: ["stripe", "hubspot"],
  },
};

export function onboardingChecklist(industryName?: string): OnboardingChecklist {
  const plan =
    (industryName && INDUSTRY_OVERRIDES[industryName]) || BASE;
  return {
    required: toConnectors(plan.required),
    recommended: toConnectors(plan.recommended),
    optional: toConnectors(plan.optional),
  };
}
