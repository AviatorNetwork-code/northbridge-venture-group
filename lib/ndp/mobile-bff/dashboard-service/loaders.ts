import type { OrganizationIntelligenceContext } from "@northbridge/operations-intelligence";
import { buildOperationsIntelligenceContextForOrg } from "@/lib/ndp/operations-context";
import type { CustomerServiceOperationalReport } from "@/lib/ndp/teams/customer-service";
import type { FinancialOperationalReport } from "@/lib/ndp/teams/financial";
import type { MarketingOperationalReport } from "@/lib/ndp/teams/marketing";
import type { SalesOperationalReport } from "@/lib/ndp/teams/sales";
import type {
  ActiveTeamEntitlementsLoader,
  FeatureFlagsLoader,
  MobileOperationsIntelligenceLoader,
  TeamOperationalReportsLoader,
} from "./types.js";

const NOW = "2026-07-09T23:00:00.000Z";

function baseReport(
  teamId: string,
  teamLeadId: string,
  summary: string,
  orgId: string,
): Omit<MarketingOperationalReport, "pendingWork" | "recommendations"> {
  return {
    id: `report-${teamId}`,
    orgId,
    teamId,
    teamLeadId,
    periodStart: "2026-07-01T00:00:00.000Z",
    periodEnd: NOW,
    summary,
    metrics: [],
    generatedAt: NOW,
    workCompleted: ["Completed operational review"],
    specialistUtilization: [{ specialistId: "specialist-1", tasksCompleted: 1, outcome: "complete" }],
    confidenceLevels: [{ specialistId: "specialist-1", level: "high" }],
    escalations: [],
    kpis: [],
    organizationContextRef: `operations-intelligence:${orgId}:v1.0.0`,
    organizationPublicName: "Acme Co",
    operationsContextVersion: "1.0.0",
  };
}

function marketingReport(orgId: string): MarketingOperationalReport {
  return {
    ...baseReport(
      "team-marketing",
      "lead-team-marketing",
      "Lead volume is increasing from campaigns.",
      orgId,
    ),
    pendingWork: ["Approve campaign draft"],
    recommendations: [
      {
        id: "m-rec-1",
        category: "budget_reallocation",
        summary: "Increase campaign spend on high-performing channels.",
        evidence: ["Lead volume up"],
        priority: "high",
        customerSuccessFirst: true,
      },
    ],
  };
}

function salesReport(orgId: string): SalesOperationalReport {
  return {
    ...baseReport(
      "team-sales",
      "lead-team-sales",
      "Pipeline converting but follow-up bottleneck detected.",
      orgId,
    ),
    pendingFollowUps: ["Follow up with 6 prospects"],
    recommendations: [
      {
        id: "s-rec-1",
        category: "follow_up_cadence",
        summary: "Improve follow-up cadence on warm prospects.",
        evidence: ["6 follow-ups due"],
        priority: "high",
        customerSuccessFirst: true,
      },
    ],
  };
}

function customerServiceReport(orgId: string): CustomerServiceOperationalReport {
  return {
    ...baseReport(
      "team-customer-service",
      "lead-team-customer-service",
      "Open inquiries are increasing across inbound channels.",
      orgId,
    ),
    pendingReminders: ["Send 11 reminders"],
    recommendations: [
      {
        id: "cs-rec-1",
        category: "inquiry_response",
        summary: "Clear the open inquiry queue before expanding intake channels.",
        evidence: ["14 open inquiries"],
        priority: "high",
        customerSuccessFirst: true,
      },
    ],
  };
}

function financialReport(orgId: string): FinancialOperationalReport {
  return {
    ...baseReport(
      "team-financial",
      "lead-team-financial",
      "Receivables review shows overdue invoices past 30 days.",
      orgId,
    ),
    pendingPaymentFollowUps: ["Follow up with 7 overdue accounts"],
    recommendations: [
      {
        id: "f-rec-1",
        category: "expense_control",
        summary: "Review flagged expense categories before increasing operating spend.",
        evidence: ["Expense categories flagged"],
        priority: "medium",
        customerSuccessFirst: true,
      },
    ],
  };
}

const REPORT_BUILDERS: Record<string, (orgId: string) => unknown> = {
  "team-marketing": marketingReport,
  "team-sales": salesReport,
  "team-customer-service": customerServiceReport,
  "team-financial": financialReport,
};

export class InMemoryActiveTeamEntitlementsLoader implements ActiveTeamEntitlementsLoader {
  constructor(private readonly entitlements: Map<string, string[]>) {}

  private key(customerId: string, organizationId: string): string {
    return `${customerId}:${organizationId}`;
  }

  async load(input: {
    customerId: string;
    organizationId: string;
  }): Promise<string[]> {
    return this.entitlements.get(this.key(input.customerId, input.organizationId)) ?? [];
  }
}

export class InMemoryTeamOperationalReportsLoader implements TeamOperationalReportsLoader {
  constructor(private readonly shouldFailFor?: string) {}

  async load(input: {
    organizationId: string;
    customerId: string;
    activeTeamIds: string[];
  }): Promise<unknown[]> {
    if (this.shouldFailFor && input.organizationId === this.shouldFailFor) {
      throw new Error("Team report loader failure");
    }

    return input.activeTeamIds
      .map((teamId) => REPORT_BUILDERS[teamId]?.(input.organizationId))
      .filter(Boolean);
  }
}

export class InMemoryMobileOperationsIntelligenceLoader implements MobileOperationsIntelligenceLoader {
  constructor(
    private readonly records: Map<string, OrganizationIntelligenceContext>,
    private readonly missingOrganizations: Set<string> = new Set(),
  ) {}

  async load(input: {
    organizationId: string;
    customerId: string;
  }): Promise<OrganizationIntelligenceContext | null> {
    if (this.missingOrganizations.has(input.organizationId)) {
      return null;
    }

    const existing = this.records.get(input.organizationId);
    if (existing) {
      return existing;
    }

    return buildOperationsIntelligenceContextForOrg(input.organizationId, {
      now: () => NOW,
    });
  }
}

export class InMemoryFeatureFlagsLoader implements FeatureFlagsLoader {
  constructor(private readonly flags: Map<string, Record<string, boolean>>) {}

  private key(customerId: string, organizationId: string): string {
    return `${customerId}:${organizationId}`;
  }

  async load(input: {
    customerId: string;
    organizationId: string;
  }): Promise<Record<string, boolean>> {
    return this.flags.get(this.key(input.customerId, input.organizationId)) ?? {};
  }
}

export function createExampleMobileDashboardLoaders() {
  const entitlements = new InMemoryActiveTeamEntitlementsLoader(
    new Map([
      ["customer-1:org-acme", ["team-marketing", "team-sales"]],
      ["customer-2:org-acme", ["team-marketing"]],
      ["customer-2:org-beta", ["team-marketing", "team-sales", "team-financial"]],
    ]),
  );

  const teamReports = new InMemoryTeamOperationalReportsLoader();
  const operationsIntelligence = new InMemoryMobileOperationsIntelligenceLoader(new Map());
  const featureFlags = new InMemoryFeatureFlagsLoader(
    new Map([
      ["customer-1:org-acme", { mobileDashboardV1: true }],
      ["customer-2:org-acme", { mobileDashboardV1: true }],
    ]),
  );

  return {
    entitlements,
    teamReports,
    operationsIntelligence,
    featureFlags,
  };
}
