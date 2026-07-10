import { describe, expect, it } from "vitest";
import type { MarketingOperationalReport } from "@/lib/ndp/teams/marketing";
import type { SalesOperationalReport } from "@/lib/ndp/teams/sales";
import type { FinancialOperationalReport } from "@/lib/ndp/teams/financial";
import { buildDashboardModel } from "@/lib/ndp/dashboard";
import {
  assertNoInternalFields,
  DASHBOARD_BFF_API_VERSION,
  DASHBOARD_BFF_SCHEMA_VERSION,
  mapDashboardModelToResponse,
  parseSerializedDashboardResponse,
  serializeDashboardResponse,
  validateDashboardRequest,
  validateDashboardResponse,
  validateResponseIntegrity,
} from "@/lib/ndp/mobile-bff/dashboard";
import type { DashboardRequest } from "@/lib/ndp/mobile-bff/dashboard";

const ORG = "org-acme";
const NOW = "2026-07-09T23:00:00.000Z";
const STALE = "2026-07-07T23:00:00.000Z";

function baseRequest(overrides?: Partial<DashboardRequest>): DashboardRequest {
  return {
    organizationId: ORG,
    customerId: "customer-1",
    activeTeamIds: ["team-marketing"],
    locale: "en-US",
    timezone: "America/New_York",
    appVersion: "1.0.0",
    dashboardVersionRequested: "1.0.0",
    ...overrides,
  };
}

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

function buildResponse(request: DashboardRequest) {
  const model = buildDashboardModel({
    organizationId: request.organizationId,
    activeTeamIds: request.activeTeamIds,
    teamReports:
      request.activeTeamIds.length === 1 && request.activeTeamIds[0] === "team-marketing"
        ? [marketingReport()]
        : request.activeTeamIds.includes("team-marketing") &&
            request.activeTeamIds.includes("team-sales")
          ? [
              marketingReport(
                request.activeTeamIds.length > 2 ? undefined : { generatedAt: STALE },
              ),
              salesReport(),
              ...(request.activeTeamIds.includes("team-financial") ? [financialReport()] : []),
            ]
          : [salesReport()],
    now: NOW,
  });

  return mapDashboardModelToResponse(model, { request });
}

describe("Native Dashboard BFF Contract", () => {
  it("validates well-formed dashboard requests", () => {
    const result = validateDashboardRequest(baseRequest());
    expect(result.valid).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it("rejects invalid dashboard requests", () => {
    const result = validateDashboardRequest({
      organizationId: "",
      customerId: "",
      activeTeamIds: "team-marketing",
      locale: "invalid locale",
      dashboardVersionRequested: "9.9.9",
    });

    expect(result.valid).toBe(false);
    expect(result.issues.some((issue) => issue.path === "organizationId")).toBe(true);
    expect(result.issues.some((issue) => issue.path === "customerId")).toBe(true);
    expect(result.issues.some((issue) => issue.path === "activeTeamIds")).toBe(true);
    expect(result.issues.some((issue) => issue.path === "locale")).toBe(true);
    expect(result.issues.some((issue) => issue.path === "dashboardVersionRequested")).toBe(true);
  });

  it("maps dashboard model to response with correct structure and versioning", () => {
    const response = buildResponse(
      baseRequest({ activeTeamIds: ["team-marketing", "team-sales"] }),
    );

    expect(response.schemaVersion).toBe(DASHBOARD_BFF_SCHEMA_VERSION);
    expect(response.apiVersion).toBe(DASHBOARD_BFF_API_VERSION);
    expect(response.metadata.dashboardVersion).toBe("1.0.0");
    expect(response.metadata.customerId).toBe("customer-1");
    expect(validateDashboardResponse(response).valid).toBe(true);
    expect(validateResponseIntegrity(response).valid).toBe(true);
  });

  it("preserves recommendation and alert attribution in mapped response", () => {
    const response = buildResponse(
      baseRequest({ activeTeamIds: ["team-marketing", "team-sales"] }),
    );

    const marketingRec = response.recommendations.find((entry) => entry.id === "m-rec-1");
    const salesRec = response.recommendations.find((entry) => entry.id === "s-rec-1");

    expect(marketingRec?.recommendation).toBe(
      "Increase campaign spend on high-performing channels.",
    );
    expect(marketingRec?.sourceTeamId).toBe("team-marketing");
    expect(marketingRec?.confidence).toBe("high");
    expect(salesRec?.sourceTeamId).toBe("team-sales");

    expect(response.alerts.every((alert) => alert.sourceTeamId)).toBe(true);
    expect(response.alerts.every((alert) => alert.category && alert.timestamp)).toBe(true);
  });

  it("preserves freshness and confidence in mapped response", () => {
    const response = buildResponse(
      baseRequest({ activeTeamIds: ["team-marketing", "team-sales"] }),
    );

    const staleEntry = response.freshness.find((entry) => entry.teamId === "team-marketing");
    expect(staleEntry?.status).toBe("stale");
    expect(response.confidence.organizationLevel).toBe("high");
    expect(response.confidence.byTeam.some((entry) => entry.teamId === "team-sales")).toBe(true);
  });

  it("hides internal fields from public response payloads", () => {
    const response = buildResponse(
      baseRequest({ activeTeamIds: ["team-marketing", "team-sales"] }),
    );

    const violations = assertNoInternalFields(response);
    expect(violations).toHaveLength(0);
    expect(response.metadata).not.toHaveProperty("operationsContextRef");

    const withDebug = mapDashboardModelToResponse(
      buildDashboardModel({
        organizationId: ORG,
        activeTeamIds: ["team-marketing"],
        teamReports: [marketingReport()],
        now: NOW,
      }),
      { request: baseRequest({ includeDebugMetadata: true }) },
    );

    expect(withDebug.debug?.operationsContextRef).toContain(ORG);
    expect(assertNoInternalFields(withDebug, "$").filter((path) => path.includes("debug"))).toEqual(
      [],
    );
  });

  it("excludes placeholder sections unless requested", () => {
    const defaultResponse = buildResponse(baseRequest());
    expect(defaultResponse.sections.some((section) => section.id === "manager")).toBe(false);

    const withPlaceholders = mapDashboardModelToResponse(
      buildDashboardModel({
        organizationId: ORG,
        activeTeamIds: ["team-marketing"],
        teamReports: [marketingReport()],
        now: NOW,
      }),
      { request: baseRequest({ includePlaceholders: true }) },
    );

    expect(withPlaceholders.sections.some((section) => section.id === "manager")).toBe(true);
    expect(
      withPlaceholders.sections.find((section) => section.id === "executive")?.placeholder,
    ).toBe(true);
  });

  it("uses card payload DTO field instead of internal data field", () => {
    const response = buildResponse(baseRequest());
    const card = response.sections
      .flatMap((section) => section.cards)
      .find((entry) => entry.id.includes("active_campaigns"));

    expect(card).toBeDefined();
    expect(card).toHaveProperty("payload");
    expect(card).not.toHaveProperty("data");
  });

  it("includes future expansion placeholders on every response", () => {
    const response = buildResponse(baseRequest());

    for (const key of [
      "offlineSync",
      "pagination",
      "widgetRefresh",
      "deltaUpdates",
      "liveSubscriptions",
    ] as const) {
      expect(response[key]).toEqual({ enabled: false, reserved: true });
    }
  });

  it("serializes responses deterministically", () => {
    const response = buildResponse(
      baseRequest({ activeTeamIds: ["team-marketing", "team-sales"] }),
    );

    const first = serializeDashboardResponse(response);
    const second = serializeDashboardResponse({
      ...response,
      metadata: { ...response.metadata },
    });
    const roundTrip = parseSerializedDashboardResponse(first);

    expect(first).toBe(second);
    expect(roundTrip.schemaVersion).toBe(DASHBOARD_BFF_SCHEMA_VERSION);
    expect(validateDashboardResponse(roundTrip).valid).toBe(true);
  });

  it("builds team summaries and supported actions for native clients", () => {
    const response = buildResponse(
      baseRequest({ activeTeamIds: ["team-marketing", "team-sales"] }),
    );

    expect(response.teamSummaries.length).toBeGreaterThan(0);
    expect(response.teamSummaries.every((entry) => entry.teamId && entry.teamName)).toBe(true);
    expect(response.supportedActions.some((action) => action.type === "refresh_dashboard")).toBe(
      true,
    );
    expect(
      response.supportedActions.some((action) => action.type === "approve_recommendation"),
    ).toBe(true);
  });
});
