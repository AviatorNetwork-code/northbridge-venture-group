import { describe, expect, it, vi } from "vitest";
import type { MarketingOperationalReport } from "@/lib/ndp/teams/marketing";
import type { SalesOperationalReport } from "@/lib/ndp/teams/sales";
import type { CustomerServiceOperationalReport } from "@/lib/ndp/teams/customer-service";
import type { FinancialOperationalReport } from "@/lib/ndp/teams/financial";
import {
  buildMultiTeamOperationsView,
  buildNordiOperationsAnalysisContext,
  buildNordiOperationsSummary,
  createOperationsViewTelemetryContext,
  emitOperationsViewTelemetry,
  normalizeTeamOperationalReport,
} from "@/lib/ndp/operations-view";

const ORG = "org-acme";
const NOW = "2026-07-09T23:00:00.000Z";
const STALE = "2026-07-07T23:00:00.000Z";

function baseReport(
  teamId: string,
  teamLeadId: string,
  summary: string,
  generatedAt = NOW,
): Omit<MarketingOperationalReport, "pendingWork" | "recommendations"> {
  return {
    id: `report-${teamId}`,
    orgId: ORG,
    teamId,
    teamLeadId,
    periodStart: "2026-07-01T00:00:00.000Z",
    periodEnd: NOW,
    summary,
    metrics: [],
    generatedAt,
    workCompleted: ["Completed operational review"],
    specialistUtilization: [{ specialistId: "specialist-1", tasksCompleted: 1, outcome: "complete" }],
    confidenceLevels: [{ specialistId: "specialist-1", level: "high" }],
    escalations: [],
    kpis: [],
    organizationContextRef: `operations-intelligence:${ORG}:v1.0.0`,
    organizationPublicName: "Acme Co",
    operationsContextVersion: "1.0.0",
  };
}

function marketingReport(overrides?: Partial<MarketingOperationalReport>): MarketingOperationalReport {
  return {
    ...baseReport("team-marketing", "lead-team-marketing", "Lead volume is increasing from campaigns."),
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
    ...overrides,
  };
}

function salesReport(overrides?: Partial<SalesOperationalReport>): SalesOperationalReport {
  return {
    ...baseReport("team-sales", "lead-team-sales", "Pipeline converting but follow-up bottleneck detected."),
    pendingFollowUps: ["Follow up with 6 prospects", "Review stalled deals"],
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
    ...overrides,
  };
}

function customerServiceReport(
  overrides?: Partial<CustomerServiceOperationalReport>,
): CustomerServiceOperationalReport {
  return {
    ...baseReport(
      "team-customer-service",
      "lead-team-customer-service",
      "Open inquiries are increasing across inbound channels.",
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
    ...overrides,
  };
}

function financialReport(overrides?: Partial<FinancialOperationalReport>): FinancialOperationalReport {
  return {
    ...baseReport(
      "team-financial",
      "lead-team-financial",
      "Receivables review shows overdue invoices past 30 days.",
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
    ...overrides,
  };
}

describe("Multi-Team Operations View", () => {
  it("builds a valid operations view for a one-team customer without false cross-team signals", () => {
    const view = buildMultiTeamOperationsView({
      organizationId: ORG,
      hiredTeamIds: ["team-marketing"],
      teamReports: [marketingReport()],
      now: () => NOW,
    });

    expect(view.teamReports).toHaveLength(1);
    expect(view.teamReports[0]!.teamId).toBe("team-marketing");
    expect(view.crossTeamSignals).toHaveLength(0);
    expect(view.snapshot.conflictingRecommendations).toHaveLength(0);
    expect(view.dashboard.hiredTeamIds).toEqual(["team-marketing"]);
  });

  it("aggregates multiple hired teams correctly", () => {
    const view = buildMultiTeamOperationsView({
      organizationId: ORG,
      hiredTeamIds: ["team-marketing", "team-sales", "team-financial"],
      teamReports: [marketingReport(), salesReport(), financialReport()],
      now: NOW,
    });

    expect(view.teamReports.map((entry) => entry.teamId)).toEqual([
      "team-marketing",
      "team-sales",
      "team-financial",
    ]);
    expect(view.snapshot.activeTeamIds).toHaveLength(3);
    expect(view.aggregatedRecommendations.length).toBeGreaterThanOrEqual(3);
  });

  it("excludes unhired teams from the operations view", () => {
    const view = buildMultiTeamOperationsView({
      organizationId: ORG,
      hiredTeamIds: ["team-sales"],
      teamReports: [marketingReport(), salesReport(), financialReport()],
      now: NOW,
    });

    expect(view.teamReports).toHaveLength(1);
    expect(view.teamReports[0]!.teamId).toBe("team-sales");
    expect(view.snapshot.teamHealthSummaries).toHaveLength(1);
  });

  it("preserves team report ownership in normalized recommendations", () => {
    const view = buildMultiTeamOperationsView({
      organizationId: ORG,
      hiredTeamIds: ["team-marketing", "team-sales"],
      teamReports: [marketingReport(), salesReport()],
      now: NOW,
    });

    expect(view.aggregatedRecommendations.every((entry) => entry.sourceTeamId)).toBe(true);
    expect(view.aggregatedRecommendations.some((entry) => entry.sourceTeamId === "team-marketing")).toBe(
      true,
    );
    expect(view.aggregatedRecommendations.some((entry) => entry.sourceTeamId === "team-sales")).toBe(
      true,
    );
  });

  it("detects conflicting recommendations without merging them", () => {
    const view = buildMultiTeamOperationsView({
      organizationId: ORG,
      hiredTeamIds: ["team-marketing", "team-financial"],
      teamReports: [marketingReport(), financialReport()],
      now: NOW,
    });

    expect(view.snapshot.conflictingRecommendations.length).toBeGreaterThan(0);
    expect(view.crossTeamSignals.some((entry) => entry.type === "spend_increase_vs_cost_reduction")).toBe(
      true,
    );
    expect(view.aggregatedRecommendations.length).toBe(2);
  });

  it("detects cross-team dependencies between hired teams", () => {
    const view = buildMultiTeamOperationsView({
      organizationId: ORG,
      hiredTeamIds: ["team-marketing", "team-sales", "team-customer-service"],
      teamReports: [marketingReport(), salesReport(), customerServiceReport()],
      now: NOW,
    });

    expect(view.snapshot.crossTeamDependencies.length).toBeGreaterThan(0);
    expect(view.snapshot.crossTeamDependencies.some((entry) => entry.fromTeamId === "team-marketing")).toBe(
      true,
    );
  });

  it("aggregates pending approvals across teams", () => {
    const view = buildMultiTeamOperationsView({
      organizationId: ORG,
      hiredTeamIds: ["team-marketing", "team-sales"],
      teamReports: [marketingReport(), salesReport()],
      now: NOW,
    });

    expect(view.snapshot.pendingApprovals.length).toBeGreaterThan(0);
    expect(view.snapshot.pendingApprovals.some((entry) => entry.sourceTeamId === "team-marketing")).toBe(
      true,
    );
  });

  it("identifies stale team reports", () => {
    const view = buildMultiTeamOperationsView({
      organizationId: ORG,
      hiredTeamIds: ["team-marketing", "team-sales"],
      teamReports: [marketingReport({ generatedAt: STALE }), salesReport()],
      now: NOW,
    });

    const marketingFreshness = view.snapshot.reportFreshness.find(
      (entry) => entry.teamId === "team-marketing",
    );
    expect(marketingFreshness?.status).toBe("stale");
    expect(
      view.snapshot.teamHealthSummaries.find((entry) => entry.teamId === "team-marketing")
        ?.reportFreshness,
    ).toBe("stale");
  });

  it("provides structured Nordi analysis context without making Nordi request owner", () => {
    const view = buildMultiTeamOperationsView({
      organizationId: ORG,
      hiredTeamIds: ["team-marketing", "team-sales"],
      teamReports: [marketingReport(), salesReport()],
      now: NOW,
    });

    const nordiContext = buildNordiOperationsAnalysisContext(view);

    expect(nordiContext.role).toBe("nordi_analyst");
    expect(nordiContext.requestOwner).toBe("nordi");
    expect(nordiContext.mustNotPresentAsCustomerManager).toBe(true);
    expect(nordiContext.mustNotSilentlyOverrideTeamLeads).toBe(true);
    expect(nordiContext.operationsView.teamReports).toHaveLength(2);
    expect(buildNordiOperationsSummary(nordiContext)).toContain("hired team");
  });

  it("keeps manager evidence inactive without sufficient history", () => {
    const view = buildMultiTeamOperationsView({
      organizationId: ORG,
      hiredTeamIds: ["team-marketing", "team-sales", "team-financial"],
      teamReports: [marketingReport(), salesReport(), financialReport()],
      observationHistory: { observationPeriodDays: 7 },
      now: NOW,
    });

    expect(view.managerEvidence.status).toBe("inactive");
    expect(view.managerEvidence.eligible).toBe(false);
  });

  it("may mark manager evidence eligible after configured thresholds", () => {
    const view = buildMultiTeamOperationsView({
      organizationId: ORG,
      hiredTeamIds: ["team-marketing", "team-financial", "team-sales"],
      teamReports: [
        marketingReport(),
        financialReport({
          recommendations: [
            {
              id: "f-rec-1",
              category: "reduce_activity",
              summary: "Pause low-quality lead sources and reallocate effort.",
              evidence: ["Low-fit leads"],
              priority: "medium",
              customerSuccessFirst: true,
            },
          ],
        }),
        salesReport({
          recommendations: [
            {
              id: "s-rec-wait",
              category: "wait",
              summary: "Wait for current pipeline follow-ups before adding volume.",
              evidence: ["Follow-up queue full"],
              priority: "medium",
              customerSuccessFirst: true,
            },
          ],
        }),
      ],
      observationHistory: {
        observationPeriodDays: 45,
        priorCrossTeamDependencyCount: 2,
        priorUnresolvedConflictCount: 2,
        priorCustomerApprovalCount: 2,
      },
      managerEvidenceThreshold: 3,
      now: NOW,
    });

    expect(view.managerEvidence.observationPeriodDays).toBeGreaterThanOrEqual(30);
    expect(view.managerEvidence.eligible).toBe(true);
    expect(view.managerEvidence.status).toBe("eligible");
  });

  it("preserves customer-success-first and downgrade recommendation markers", () => {
    const normalized = normalizeTeamOperationalReport(
      financialReport({
        recommendations: [
          {
            id: "f-rec-wait",
            category: "reduce_activity",
            summary: "Pause low-quality lead sources and reallocate effort.",
            evidence: ["Low-fit leads"],
            priority: "medium",
            customerSuccessFirst: true,
          },
        ],
      }),
    );

    expect(normalized.recommendations[0]!.customerSuccessFirst).toBe(true);
    expect(normalized.recommendations[0]!.category).toBe("reduce_activity");
  });

  it("emits observability-compatible operations view events", async () => {
    const events: string[] = [];
    const emitter = { emit: vi.fn(async (event) => events.push(event.metadata?.phase as string)) };
    const view = buildMultiTeamOperationsView({
      organizationId: ORG,
      hiredTeamIds: ["team-marketing", "team-financial"],
      teamReports: [marketingReport(), financialReport()],
      now: NOW,
    });

    const ctx = createOperationsViewTelemetryContext({
      correlationId: "corr-ops-1",
      orgId: ORG,
      emitter,
      now: () => NOW,
    });

    await emitOperationsViewTelemetry(ctx, {
      hiredTeamIds: view.hiredTeamIds,
      crossTeamSignals: view.crossTeamSignals,
      conflicts: view.snapshot.conflictingRecommendations,
      managerEvidence: view.managerEvidence,
    });

    expect(events).toContain("operations_view_built");
    expect(events).toContain("manager_evidence_updated");
  });
});
