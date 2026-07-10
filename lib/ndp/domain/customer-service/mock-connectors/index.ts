import {
  createConnectorRouter,
  InMemoryConnectorRegistry,
  type Connector,
  type ConnectorDefinition,
} from "@northbridge/workforce-connectors";
import { CUSTOMER_SERVICE_EXECUTION_CAPABILITIES } from "../capabilities/index.js";

const MOCK_CONNECTOR_ID = "connector-customer-service-mock";

export interface MockCapabilityOutput {
  summary: string;
  evidence: string[];
  metrics?: Record<string, number>;
}

const MOCK_OUTPUTS: Record<string, MockCapabilityOutput> = {
  "customer.answer": {
    summary:
      "Open inquiries reviewed. 14 awaiting response; average first-response time is 2.4 hours. Three high-priority items flagged.",
    evidence: [
      "14 open inquiries in queue",
      "Average first-response time: 2.4 hours",
      "3 high-priority inquiries need same-day response",
    ],
    metrics: { openInquiries: 14, avgResponseTimeHours: 2.4, highPriority: 3 },
  },
  "reception.triage": {
    summary:
      "Inbound triage complete. 8 routed to scheduling, 4 to billing questions, 2 escalated for complaint handling.",
    evidence: [
      "8 requests routed to scheduling",
      "4 billing-related inquiries queued",
      "2 complaints escalated for service recovery",
    ],
    metrics: { routedScheduling: 8, routedBilling: 4, escalations: 2 },
  },
  "appointment.schedule": {
    summary:
      "Scheduling review: 6 appointment requests pending confirmation. Next available slots identified for this week.",
    evidence: [
      "6 appointment requests awaiting confirmation",
      "4 slots available Tuesday–Thursday",
      "2 customers requested morning appointments",
    ],
    metrics: { appointmentsRequested: 6, slotsAvailable: 4 },
  },
  "appointment.reschedule": {
    summary:
      "Reschedule queue: 3 change requests processed. Updated confirmations prepared for all affected customers.",
    evidence: [
      "3 reschedule requests completed",
      "Reminder schedules updated for changed appointments",
      "No scheduling conflicts detected",
    ],
    metrics: { rescheduleRequests: 3, conflicts: 0 },
  },
  "reminder.prepare": {
    summary:
      "Reminder plan prepared: 11 reminders due in the next 48 hours. SMS and email channels assigned by customer preference.",
    evidence: [
      "11 reminders due within 48 hours",
      "7 SMS reminders scheduled",
      "4 email reminders scheduled",
    ],
    metrics: { remindersDue: 11, smsReminders: 7, emailReminders: 4 },
  },
  "customer.success.review": {
    summary:
      "Customer success review: satisfaction score 4.6/5 this month. Two at-risk accounts identified for proactive outreach.",
    evidence: [
      "Average satisfaction: 4.6/5",
      "2 at-risk accounts flagged for follow-up",
      "Repeat engagement up 8% month over month",
    ],
    metrics: { satisfactionScore: 4.6, atRiskAccounts: 2, engagementDelta: 0.08 },
  },
};

function buildMockConnector(now: () => string): Connector {
  const definition: ConnectorDefinition = {
    id: MOCK_CONNECTOR_ID,
    connectorKind: "customer-service-mock",
    displayName: "Customer Service Mock Connector",
    capabilityIds: CUSTOMER_SERVICE_EXECUTION_CAPABILITIES.map((entry) => entry.id),
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

export function createCustomerServiceMockConnectorRegistry(
  now: () => string = () => new Date().toISOString(),
): InMemoryConnectorRegistry {
  const registry = new InMemoryConnectorRegistry();

  for (const capability of CUSTOMER_SERVICE_EXECUTION_CAPABILITIES) {
    registry.registerCapability({
      id: capability.id,
      requiredPermission: capability.requiredPermission ?? "execute_task",
    });
  }

  registry.registerConnector(buildMockConnector(now));
  return registry;
}

export function createCustomerServiceConnectorRouter(
  now: () => string = () => new Date().toISOString(),
) {
  const registry = createCustomerServiceMockConnectorRegistry(now);
  return createConnectorRouter({ registry, now });
}

export { MOCK_OUTPUTS };
