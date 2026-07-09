import {
  createConnectorRouter,
  InMemoryConnectorRegistry,
  type Connector,
  type ConnectorDefinition,
} from "@northbridge/workforce-connectors";
import { MARKETING_EXECUTION_CAPABILITIES } from "../capabilities/index.js";

const MOCK_CONNECTOR_ID = "connector-marketing-mock";

export interface MockCapabilityOutput {
  summary: string;
  evidence: string[];
  metrics?: Record<string, number>;
}

const MOCK_OUTPUTS: Record<string, MockCapabilityOutput> = {
  "campaign.create": {
    summary:
      "Draft campaign plan created with awareness and conversion objectives, segmented audiences, and a 4-week launch timeline.",
    evidence: [
      "Campaign objective: customer acquisition",
      "Primary audience: local service seekers within 25 miles",
      "Recommended channels: search, social, email nurture",
    ],
    metrics: { estimatedReach: 12000, plannedBudget: 2500 },
  },
  "campaign.review": {
    summary:
      "Active campaigns reviewed. Top performer is search acquisition; social awareness campaign shows rising engagement.",
    evidence: [
      "Search campaign CTR: 3.2%",
      "Social engagement rate up 18% week-over-week",
      "One display campaign underperforming on conversion",
    ],
    metrics: { activeCampaigns: 3, avgCtr: 0.032 },
  },
  "content.plan": {
    summary:
      "Content themes mapped to acquisition and trust-building with platform-specific formats.",
    evidence: [
      "Weekly educational posts planned",
      "Customer story series recommended for social proof",
      "Brand tone aligned to professional, approachable voice",
    ],
  },
  "content.calendar": {
    summary:
      "30-day content calendar drafted with 3 posts per week across primary platforms.",
    evidence: [
      "12 posts scheduled across 4 weeks",
      "Posting cadence: Tue/Thu/Sat",
      "Seasonal hook identified for upcoming month",
    ],
    metrics: { scheduledPosts: 12, backlogItems: 4 },
  },
  "marketing.analyze": {
    summary:
      "Marketing performance shows lead volume up 14% with stable cost per lead. Social channel gaining share.",
    evidence: [
      "Lead volume: +14% vs prior 30 days",
      "Cost per lead: $42 (stable)",
      "Top channel: paid search (42% of leads)",
    ],
    metrics: { leadVolume: 86, costPerLead: 42, conversionRate: 0.048 },
  },
  "budget.review": {
    summary:
      "Budget utilization at 72%. Recommend shifting 15% from underperforming display to search retargeting.",
    evidence: [
      "Total budget utilized: 72%",
      "Display ROI below target — recommend reduction",
      "Search retargeting ROI above target — recommend increase",
    ],
    metrics: { budgetUtilization: 0.72, recommendedReallocation: 0.15 },
  },
};

function buildMockConnector(now: () => string): Connector {
  const definition: ConnectorDefinition = {
    id: MOCK_CONNECTOR_ID,
    connectorKind: "marketing-mock",
    displayName: "Marketing Mock Connector",
    capabilityIds: MARKETING_EXECUTION_CAPABILITIES.map((entry) => entry.id),
    status: "active",
    orgScope: "platform",
  };

  return {
    definition,
    health: async () => ({
      connectorId: definition.id,
      status: "healthy",
      checkedAt: now(),
    }),
    checkPermission: () => ({ allowed: true }),
    execute: async (request) => {
      const output = MOCK_OUTPUTS[request.capabilityId] ?? {
        summary: `Mock execution completed for ${request.capabilityId}`,
        evidence: [`Capability ${request.capabilityId} executed in mock mode`],
      };

      return {
        requestId: request.requestId,
        capabilityId: request.capabilityId,
        status: "success",
        output,
      };
    },
  };
}

export function createMarketingMockConnectorRegistry(now: () => string = () =>
  new Date().toISOString()): InMemoryConnectorRegistry {
  const registry = new InMemoryConnectorRegistry();

  for (const capability of MARKETING_EXECUTION_CAPABILITIES) {
    registry.registerCapability({
      id: capability.id,
      requiredPermission: capability.requiredPermission ?? "execute_task",
    });
  }

  registry.registerConnector(buildMockConnector(now));
  return registry;
}

export function createMarketingConnectorRouter(
  now: () => string = () => new Date().toISOString(),
) {
  const registry = createMarketingMockConnectorRegistry(now);
  return createConnectorRouter({ registry, now });
}

export { MOCK_OUTPUTS };
