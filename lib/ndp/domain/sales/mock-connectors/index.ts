import {
  createConnectorRouter,
  InMemoryConnectorRegistry,
  type Connector,
  type ConnectorDefinition,
} from "@northbridge/workforce-connectors";
import { SALES_EXECUTION_CAPABILITIES } from "../capabilities/index.js";

const MOCK_CONNECTOR_ID = "connector-sales-mock";

export interface MockCapabilityOutput {
  summary: string;
  evidence: string[];
  metrics?: Record<string, number>;
}

const MOCK_OUTPUTS: Record<string, MockCapabilityOutput> = {
  "sales.analyze": {
    summary:
      "Pipeline analysis shows conversion improving on qualified leads. Proposal stage is the primary bottleneck.",
    evidence: [
      "Qualified lead conversion: 34%",
      "Average time in proposal stage: 9 days",
      "Top source: inbound web inquiries",
    ],
    metrics: { qualifiedLeads: 42, conversionRate: 0.34, openDeals: 18 },
  },
  "lead.qualify": {
    summary:
      "Lead queue reviewed. 12 high-intent leads identified for immediate outreach; 8 low-fit leads flagged for nurture.",
    evidence: [
      "High-intent criteria: budget confirmed, timeline within 30 days",
      "8 leads missing decision-maker contact",
      "Recommend prioritizing pricing inquiries from last 48 hours",
    ],
    metrics: { highIntentLeads: 12, lowFitLeads: 8, pendingQualification: 24 },
  },
  "proposal.prepare": {
    summary:
      "Proposal outline prepared with scoped deliverables, timeline, and two pricing options.",
    evidence: [
      "Option A: standard package",
      "Option B: premium package with extended support",
      "Proposal ready for review before send",
    ],
    metrics: { proposalsDrafted: 3, avgProposalValue: 4200 },
  },
  "followup.plan": {
    summary:
      "Follow-up plan created: 6 prospects due today, 14 within the week. Cadence adjusted for warm vs stalled deals.",
    evidence: [
      "6 follow-ups due today",
      "14 follow-ups due this week",
      "Stalled deals: value-add check-in recommended",
    ],
    metrics: { followUpsDueToday: 6, followUpsDueWeek: 14, stalledDeals: 5 },
  },
  "crm.update": {
    summary:
      "CRM hygiene review complete. 9 records updated, 4 missing next actions flagged, pipeline stages normalized.",
    evidence: [
      "9 contact/deal records updated",
      "4 deals missing next action date",
      "2 deals in wrong stage corrected",
    ],
    metrics: { recordsUpdated: 9, dataQualityScore: 0.91 },
  },
  "pipeline.review": {
    summary:
      "Pipeline review: 18 open deals, $126K weighted value. Proposal and negotiation stages need attention.",
    evidence: [
      "18 open deals across 4 stages",
      "Weighted pipeline: $126K",
      "Bottleneck: proposal stage aging",
    ],
    metrics: { openDeals: 18, weightedPipeline: 126000, winRate: 0.28 },
  },
};

function buildMockConnector(now: () => string): Connector {
  const definition: ConnectorDefinition = {
    id: MOCK_CONNECTOR_ID,
    connectorKind: "sales-mock",
    displayName: "Sales Mock Connector",
    capabilityIds: SALES_EXECUTION_CAPABILITIES.map((entry) => entry.id),
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

export function createSalesMockConnectorRegistry(
  now: () => string = () => new Date().toISOString(),
): InMemoryConnectorRegistry {
  const registry = new InMemoryConnectorRegistry();

  for (const capability of SALES_EXECUTION_CAPABILITIES) {
    registry.registerCapability({
      id: capability.id,
      requiredPermission: capability.requiredPermission ?? "execute_task",
    });
  }

  registry.registerConnector(buildMockConnector(now));
  return registry;
}

export function createSalesConnectorRouter(
  now: () => string = () => new Date().toISOString(),
) {
  const registry = createSalesMockConnectorRegistry(now);
  return createConnectorRouter({ registry, now });
}

export { MOCK_OUTPUTS };
