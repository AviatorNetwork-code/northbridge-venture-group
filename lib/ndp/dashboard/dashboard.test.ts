import { describe, expect, it } from "vitest";
import type { MarketingOperationalReport } from "@/lib/ndp/teams/marketing";
import type { SalesOperationalReport } from "@/lib/ndp/teams/sales";
import type { CustomerServiceOperationalReport } from "@/lib/ndp/teams/customer-service";
import type { FinancialOperationalReport } from "@/lib/ndp/teams/financial";
import { buildOperationsIntelligenceContextForOrg } from "@/lib/ndp/operations-context";
import {
  answerNordiDashboardQuestion,
  buildDashboardModel,
  buildNordiDashboardContext,
} from "@/lib/ndp/dashboard";

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

describe("Dashboard Composition Engine", () => {
  it("builds a one-team dashboard with always-available sections and no cross-team section", () => {
    const dashboard = buildDashboardModel({
      organizationId: ORG,
      activeTeamIds: ["team-marketing"],
      teamReports: [marketingReport()],
      now: NOW,
    });

    expect(dashboard.organizationId).toBe(ORG);
    expect(dashboard.sections.some((section) => section.id === "organization_overview")).toBe(true);
    expect(dashboard.sections.some((section) => section.id === "active_digital_teams")).toBe(true);
    expect(dashboard.sections.some((section) => section.id === "recent_activity")).toBe(true);
    expect(dashboard.sections.some((section) => section.id === "alerts")).toBe(true);
    expect(dashboard.sections.some((section) => section.id === "marketing")).toBe(true);
    expect(dashboard.sections.some((section) => section.id === "cross_team")).toBe(false);
    expect(dashboard.sections.some((section) => section.id === "sales")).toBe(false);
  });

  it("builds an all-four-teams dashboard with team sections and cross-team section", () => {
    const dashboard = buildDashboardModel({
      organizationId: ORG,
      activeTeamIds: [
        "team-marketing",
        "team-sales",
        "team-customer-service",
        "team-financial",
      ],
      teamReports: [
        marketingReport(),
        salesReport(),
        customerServiceReport(),
        financialReport(),
      ],
      now: NOW,
    });

    expect(dashboard.metadata.availableTeams).toHaveLength(4);
    expect(dashboard.metadata.activeSections).toContain("marketing");
    expect(dashboard.metadata.activeSections).toContain("sales");
    expect(dashboard.metadata.activeSections).toContain("customer_service");
    expect(dashboard.metadata.activeSections).toContain("financial");
    expect(dashboard.metadata.activeSections).toContain("cross_team");
    expect(dashboard.metadata.missingSections).toHaveLength(0);
  });

  it("hides sections for teams that are not hired", () => {
    const dashboard = buildDashboardModel({
      organizationId: ORG,
      activeTeamIds: ["team-sales"],
      teamReports: [marketingReport(), salesReport(), financialReport()],
      now: NOW,
    });

    expect(dashboard.sections.some((section) => section.id === "sales")).toBe(true);
    expect(dashboard.sections.some((section) => section.id === "marketing")).toBe(false);
    expect(dashboard.sections.some((section) => section.id === "financial")).toBe(false);
    expect(dashboard.metadata.missingSections).toContain("marketing");
    expect(dashboard.metadata.missingSections).toContain("financial");
  });

  it("shows cross-team section only when more than one team is hired", () => {
    const singleTeam = buildDashboardModel({
      organizationId: ORG,
      activeTeamIds: ["team-marketing"],
      teamReports: [marketingReport()],
      now: NOW,
    });
    const multiTeam = buildDashboardModel({
      organizationId: ORG,
      activeTeamIds: ["team-marketing", "team-sales"],
      teamReports: [marketingReport(), salesReport()],
      now: NOW,
    });

    expect(singleTeam.sections.find((section) => section.id === "cross_team")).toBeUndefined();
    const crossTeam = multiTeam.sections.find((section) => section.id === "cross_team");
    expect(crossTeam?.available).toBe(true);
    expect(crossTeam?.cards.map((card) => card.title)).toEqual([
      "Cross-Team Opportunities",
      "Risks",
      "Pending Decisions",
      "Dependencies",
      "Recommendation Conflicts",
    ]);
  });

  it("preserves recommendation attribution without rewriting recommendation text", () => {
    const dashboard = buildDashboardModel({
      organizationId: ORG,
      activeTeamIds: ["team-marketing", "team-sales"],
      teamReports: [marketingReport(), salesReport()],
      now: NOW,
    });

    const marketingRec = dashboard.recommendations.find((entry) => entry.id === "m-rec-1");
    const salesRec = dashboard.recommendations.find((entry) => entry.id === "s-rec-1");

    expect(marketingRec?.recommendation).toBe(
      "Increase campaign spend on high-performing channels.",
    );
    expect(marketingRec?.sourceTeamId).toBe("team-marketing");
    expect(marketingRec?.confidence).toBe("high");
    expect(marketingRec?.evidenceAvailable).toBe(true);
    expect(salesRec?.sourceTeamId).toBe("team-sales");
    expect(salesRec?.approvalRequired).toBe(true);
  });

  it("preserves alert attribution and does not collapse unrelated alerts", () => {
    const dashboard = buildDashboardModel({
      organizationId: ORG,
      activeTeamIds: ["team-sales", "team-financial"],
      teamReports: [
        salesReport(),
        financialReport({
          escalations: ["Overdue receivables require executive review"],
        }),
      ],
      now: NOW,
    });

    expect(dashboard.alerts.length).toBeGreaterThanOrEqual(3);
    expect(dashboard.alerts.every((alert) => alert.sourceTeamId)).toBe(true);
    expect(dashboard.alerts.some((alert) => alert.sourceTeamId === "team-sales")).toBe(true);
    expect(dashboard.alerts.some((alert) => alert.sourceTeamId === "team-financial")).toBe(true);
    expect(dashboard.alerts.every((alert) => alert.category && alert.timestamp)).toBe(true);
    expect(new Set(dashboard.alerts.map((alert) => alert.id)).size).toBe(dashboard.alerts.length);

    const salesAlerts = dashboard.alerts.filter((alert) => alert.sourceTeamId === "team-sales");
    const financialAlerts = dashboard.alerts.filter((alert) => alert.sourceTeamId === "team-financial");
    expect(salesAlerts.length).toBeGreaterThan(0);
    expect(financialAlerts.length).toBeGreaterThan(0);
    expect(salesAlerts[0]?.message).not.toBe(financialAlerts[0]?.message);
  });

  it("identifies stale reports in metadata and team health cards", () => {
    const dashboard = buildDashboardModel({
      organizationId: ORG,
      activeTeamIds: ["team-marketing", "team-sales"],
      teamReports: [marketingReport({ generatedAt: STALE }), salesReport()],
      now: NOW,
    });

    const staleEntry = dashboard.metadata.reportFreshness.find(
      (entry) => entry.teamId === "team-marketing",
    );
    expect(staleEntry?.status).toBe("stale");

    const marketingHealth = dashboard.sections
      .find((section) => section.id === "active_digital_teams")
      ?.cards.find((card) => card.sourceTeamId === "team-marketing");
    expect(marketingHealth?.data.reportFreshness).toBe("stale");
  });

  it("includes complete dashboard metadata", () => {
    const oil = buildOperationsIntelligenceContextForOrg(ORG, { now: () => NOW });
    const dashboard = buildDashboardModel({
      organizationId: ORG,
      activeTeamIds: ["team-marketing", "team-sales"],
      teamReports: [marketingReport(), salesReport()],
      operationsIntelligence: oil,
      now: NOW,
    });

    expect(dashboard.metadata.organizationId).toBe(ORG);
    expect(dashboard.metadata.dashboardVersion).toBe("1.0.0");
    expect(dashboard.metadata.generatedAt).toBe(NOW);
    expect(dashboard.metadata.availableTeams).toEqual(["team-marketing", "team-sales"]);
    expect(dashboard.metadata.activeSections.length).toBeGreaterThan(0);
    expect(dashboard.metadata.confidenceSummary.byTeam).toHaveLength(2);
    expect(dashboard.metadata.organizationPublicName).toBeDefined();
    expect(dashboard.metadata.operationsContextRef).toContain(ORG);
  });

  it("aggregates confidence across teams at organization level", () => {
    const dashboard = buildDashboardModel({
      organizationId: ORG,
      activeTeamIds: ["team-marketing", "team-sales"],
      teamReports: [marketingReport(), salesReport()],
      now: NOW,
    });

    expect(dashboard.metadata.confidenceSummary.organizationLevel).toBe("high");
    expect(dashboard.metadata.confidenceSummary.byTeam).toEqual([
      { teamId: "team-marketing", level: "high" },
      { teamId: "team-sales", level: "high" },
    ]);
  });

  it("includes future placeholder sections without implementing them", () => {
    const dashboard = buildDashboardModel({
      organizationId: ORG,
      activeTeamIds: ["team-marketing"],
      teamReports: [marketingReport()],
      now: NOW,
    });

    for (const sectionId of ["manager", "director", "executive", "ai_insights"] as const) {
      const section = dashboard.sections.find((entry) => entry.id === sectionId);
      expect(section?.placeholder).toBe(true);
      expect(section?.available).toBe(false);
      expect(section?.cards).toHaveLength(0);
    }
  });

  it("provides Nordi dashboard context that consumes DashboardModel without fabrication flags", () => {
    const dashboard = buildDashboardModel({
      organizationId: ORG,
      activeTeamIds: ["team-marketing", "team-sales"],
      teamReports: [marketingReport(), salesReport()],
      now: NOW,
    });

    const nordiContext = buildNordiDashboardContext(dashboard);

    expect(nordiContext.dashboard).toBe(dashboard);
    expect(nordiContext.mustNotFabricateDashboardCards).toBe(true);
    expect(nordiContext.mustNotInventKpis).toBe(true);
    expect(nordiContext.mustNotChangeOwnership).toBe(true);
    expect(answerNordiDashboardQuestion(dashboard, "How is my business doing?")).toContain(
      "active team",
    );
    expect(
      answerNordiDashboardQuestion(dashboard, "What should I approve?"),
    ).toContain("team-marketing");
  });
});
