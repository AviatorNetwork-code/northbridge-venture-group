import {
  createConnectorRouter,
  InMemoryConnectorRegistry,
  type Connector,
  type ConnectorDefinition,
} from "@northbridge/workforce-connectors";
import { FINANCIAL_EXECUTION_CAPABILITIES } from "../capabilities/index.js";

const MOCK_CONNECTOR_ID = "connector-financial-mock";

export interface MockCapabilityOutput {
  summary: string;
  evidence: string[];
  metrics?: Record<string, number>;
}

const MOCK_OUTPUTS: Record<string, MockCapabilityOutput> = {
  "finance.analyze": {
    summary:
      "Financial analysis complete. Revenue trending up 6% month over month; margin stable. Two expense categories flagged for review.",
    evidence: [
      "Revenue: $84,200 MTD (+6% vs prior month)",
      "Gross margin: 62%",
      "Expense categories flagged: software subscriptions, contractor fees",
    ],
    metrics: { revenueMtd: 84200, revenueGrowth: 0.06, grossMargin: 0.62 },
  },
  "billing.review": {
    summary:
      "Billing review: 18 invoices issued this month; 3 pending approval. Average invoice value $1,240.",
    evidence: [
      "18 invoices issued MTD",
      "3 invoices pending approval",
      "Average invoice value: $1,240",
    ],
    metrics: { invoicesIssued: 18, pendingApproval: 3, avgInvoiceValue: 1240 },
  },
  "invoice.prepare": {
    summary:
      "Invoice preparation: 4 draft invoices ready for review with itemized scope and payment terms.",
    evidence: [
      "4 draft invoices prepared",
      "All drafts include payment terms and due dates",
      "2 drafts require scope confirmation",
    ],
    metrics: { draftsPrepared: 4, awaitingScope: 2 },
  },
  "receivables.review": {
    summary:
      "Receivables review: $28,400 outstanding across 12 accounts. 4 invoices past due beyond 30 days.",
    evidence: [
      "Total AR outstanding: $28,400",
      "12 open receivable accounts",
      "4 invoices past 30 days overdue",
    ],
    metrics: { arOutstanding: 28400, openAccounts: 12, pastDue30: 4 },
  },
  "payment.followup": {
    summary:
      "Payment follow-up plan: 7 overdue accounts need outreach this week. Escalation recommended for 2 accounts past 60 days.",
    evidence: [
      "7 accounts due for payment follow-up",
      "2 accounts past 60 days — escalation recommended",
      "Friendly reminder templates prepared for 5 accounts",
    ],
    metrics: { followUpsDue: 7, escalationCandidates: 2 },
  },
  "financial.report": {
    summary:
      "Financial report ready: P&L, balance sheet summary, and cash flow snapshot generated for the current period.",
    evidence: [
      "P&L generated for current month",
      "Balance sheet summary reconciled",
      "Cash flow snapshot shows positive operating trend",
    ],
    metrics: { reportPeriods: 1, cashFlowPositive: 1 },
  },
};

function buildMockConnector(now: () => string): Connector {
  const definition: ConnectorDefinition = {
    id: MOCK_CONNECTOR_ID,
    connectorKind: "financial-mock",
    displayName: "Financial Mock Connector",
    capabilityIds: FINANCIAL_EXECUTION_CAPABILITIES.map((entry) => entry.id),
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

export function createFinancialMockConnectorRegistry(
  now: () => string = () => new Date().toISOString(),
): InMemoryConnectorRegistry {
  const registry = new InMemoryConnectorRegistry();

  for (const capability of FINANCIAL_EXECUTION_CAPABILITIES) {
    registry.registerCapability({
      id: capability.id,
      requiredPermission: capability.requiredPermission ?? "execute_task",
    });
  }

  registry.registerConnector(buildMockConnector(now));
  return registry;
}

export function createFinancialConnectorRouter(
  now: () => string = () => new Date().toISOString(),
) {
  const registry = createFinancialMockConnectorRegistry(now);
  return createConnectorRouter({ registry, now });
}

export { MOCK_OUTPUTS };
