import { buildRecommendations } from "@/lib/cat/knowledge";
import type { BusinessProfile } from "@/lib/cat/types";
import { loadHireSelection } from "@/lib/workforce/storage";
import {
  connectorCatalog,
  getConnectorById,
} from "@/lib/connectors/connector-catalog";
import type {
  ConnectorInstance,
  ConnectorOnboardingItem,
  ConnectorOnboardingSummary,
  ConnectorRecommendationLevel,
} from "@/lib/connectors/connector-types";

const CONNECTOR_NAME_TO_ID: Record<string, string> = {
  "google calendar": "google-calendar",
  gmail: "gmail",
  stripe: "stripe",
  whatsapp: "whatsapp",
  "whatsapp business": "whatsapp",
  hubspot: "hubspot",
  github: "github",
  vercel: "vercel",
  "google workspace": "gmail",
};

function mapConnectorNameToId(name: string): string | undefined {
  const normalized = name.toLowerCase();
  if (CONNECTOR_NAME_TO_ID[normalized]) return CONNECTOR_NAME_TO_ID[normalized];
  return connectorCatalog.find((connector) => normalized.includes(connector.name.toLowerCase()))?.id;
}

export function getRecommendedConnectorIds(profile: BusinessProfile = {}): {
  recommended: string[];
  optional: string[];
  notRecommended: string[];
} {
  const catRecommendations = buildRecommendations(profile);
  const recommended: string[] = [];
  const optional: string[] = [];
  const notRecommended: string[] = [];

  for (const rec of catRecommendations) {
    if (rec.tier !== "connector") continue;
    const id = mapConnectorNameToId(rec.name);
    if (!id) continue;

    if (rec.status === "recommended") recommended.push(id);
    if (rec.status === "optional") optional.push(id);
    if (rec.status === "not-recommended") notRecommended.push(id);
  }

  const hireSelection = typeof window !== "undefined" ? loadHireSelection() : null;
  if (hireSelection?.connectors) {
    for (const name of hireSelection.connectors) {
      const id = mapConnectorNameToId(name);
      if (id && !recommended.includes(id) && !optional.includes(id)) {
        recommended.push(id);
      }
    }
  }

  if (recommended.length === 0) {
    recommended.push("gmail", "google-calendar");
  }

  if (!optional.includes("hubspot")) {
    optional.push("hubspot");
  }

  return { recommended, optional, notRecommended };
}

export function buildOnboardingConnectorSummary(
  instances: ConnectorInstance[],
  profile: BusinessProfile = {},
): ConnectorOnboardingSummary {
  const { recommended, optional } = getRecommendedConnectorIds(profile);
  const items: ConnectorOnboardingItem[] = [];

  for (const instance of instances) {
    let level: ConnectorRecommendationLevel = "optional";
    let reason = "Available when your business needs it.";

    if (instance.status === "connected" || instance.status === "syncing") {
      level = "connected";
      reason = `${instance.name} is connected and ready for your workforce.`;
    } else if (recommended.includes(instance.id)) {
      level = "missing";
      reason = `Recommended for your business — ${instance.requiredFor[0] ?? "core operations"}.`;
    } else if (optional.includes(instance.id)) {
      level = "optional";
      reason = "Optional for your current workforce — connect when needed.";
    } else if (recommended.length > 0 && !recommended.includes(instance.id)) {
      level = "optional";
      reason = "You don't need this yet.";
    }

    const shouldInclude =
      level === "connected" ||
      level === "missing" ||
      recommended.includes(instance.id) ||
      optional.includes(instance.id);

    if (shouldInclude) {
      items.push({
        connectorId: instance.id,
        name: instance.name,
        level,
        reason,
      });
    }
  }

  const priorityItems = items.filter((item) => item.level !== "optional");
  const connected = priorityItems.filter((item) => item.level === "connected").length;
  const missing = priorityItems.filter((item) => item.level === "missing").length;
  const recommendedCount = priorityItems.filter((item) => item.level === "recommended" || item.level === "missing").length;
  const optionalCount = items.filter((item) => item.level === "optional").length;

  const totalRequired = Math.max(recommendedCount, 1);
  const launchReadinessPercent = Math.round((connected / totalRequired) * 100);

  return {
    items: priorityItems.length > 0 ? priorityItems : items.slice(0, 8),
    launchReadinessPercent: Math.min(100, launchReadinessPercent),
    connected,
    recommended: recommendedCount,
    optional: optionalCount,
    missing,
  };
}

export function getCatConnectorMessages(
  instances: ConnectorInstance[],
  profile: BusinessProfile = {},
): string[] {
  const messages: string[] = [];
  const { recommended, optional } = getRecommendedConnectorIds(profile);

  const calendar = instances.find((item) => item.id === "google-calendar");
  if (calendar && calendar.status !== "connected" && calendar.status !== "syncing") {
    messages.push("Google Calendar is not connected.");
  }

  const gmail = instances.find((item) => item.id === "gmail");
  if (gmail && gmail.status !== "connected" && recommended.includes("gmail")) {
    messages.push("I recommend connecting Gmail next.");
  }

  const whatsapp = instances.find((item) => item.id === "whatsapp");
  if (whatsapp && whatsapp.status !== "connected") {
    messages.push("WhatsApp is optional for your current workforce.");
  }

  const hubspot = instances.find((item) => item.id === "hubspot");
  if (hubspot && hubspot.status !== "connected" && optional.includes("hubspot")) {
    messages.push("You don't need HubSpot yet.");
  }

  return messages;
}

export function explainConnectorPurpose(connectorId: string): string {
  const connector = getConnectorById(connectorId);
  if (!connector) return "";

  return `${connector.name} supports ${connector.requiredFor.join(", ").toLowerCase()}. Used by ${connector.usedBySpecialists.slice(0, 2).join(" and ")}.`;
}
