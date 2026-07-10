import { describe, expect, it } from "vitest";
import {
  assertNoInternalFields,
  serializeDashboardResponse,
} from "@/lib/ndp/mobile-bff/dashboard";
import {
  buildMobileDashboardResponse,
  createExampleMobileDashboardDependencies,
  InMemoryActiveTeamEntitlementsLoader,
  InMemoryMobileDashboardTelemetryEmitter,
  InMemoryMobileOperationsIntelligenceLoader,
  InMemoryTeamOperationalReportsLoader,
} from "@/lib/ndp/mobile-bff/dashboard-service";

const CORRELATION = "corr-mobile-dashboard-1";

function authorizedInput(overrides?: {
  organizationId?: string;
  locale?: string;
  timezone?: string;
  dashboardVersion?: string;
  token?: string;
}) {
  return {
    correlationId: CORRELATION,
    authorizationHeader: `Bearer ${overrides?.token ?? "token-customer-1"}`,
    query: {
      organizationId: overrides?.organizationId ?? "org-acme",
      locale: overrides?.locale,
      timezone: overrides?.timezone,
      dashboardVersion: overrides?.dashboardVersion,
    },
    now: "2026-07-09T23:00:00.000Z",
  };
}

describe("Authenticated Mobile Dashboard Transport", () => {
  it("returns dashboard for authenticated customer with authorized organization", async () => {
    const result = await buildMobileDashboardResponse(
      authorizedInput(),
      createExampleMobileDashboardDependencies(),
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.status).toBe(200);
    expect(result.body.metadata.organizationId).toBe("org-acme");
    expect(result.body.metadata.customerId).toBe("customer-1");
    expect(result.body.sections.length).toBeGreaterThan(0);
  });

  it("returns 401 for unauthenticated requests", async () => {
    const result = await buildMobileDashboardResponse(
      {
        correlationId: CORRELATION,
        authorizationHeader: null,
        query: { organizationId: "org-acme" },
      },
      createExampleMobileDashboardDependencies(),
    );

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.status).toBe(401);
    expect(result.body.error.code).toBe("unauthenticated");
    expect(result.body.error.correlationId).toBe(CORRELATION);
  });

  it("returns 403 when customer cannot access another organization", async () => {
    const result = await buildMobileDashboardResponse(
      authorizedInput({ organizationId: "org-beta", token: "token-customer-1" }),
      createExampleMobileDashboardDependencies(),
    );

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.status).toBe(403);
    expect(result.body.error.code).toBe("organization_access_denied");
  });

  it("uses authenticated customer identity rather than any client-supplied identity", async () => {
    const telemetry = new InMemoryMobileDashboardTelemetryEmitter();
    const result = await buildMobileDashboardResponse(authorizedInput(), {
      ...createExampleMobileDashboardDependencies(),
      telemetry,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.body.metadata.customerId).toBe("customer-1");
    expect(
      telemetry.events.some(
        (event) =>
          event.phase === "mobile_dashboard_authorized" && event.customerId === "customer-1",
      ),
    ).toBe(true);
  });

  it("ignores client team entitlements and uses server-resolved hired teams", async () => {
    const entitlements = new InMemoryActiveTeamEntitlementsLoader(
      new Map([["customer-1:org-acme", ["team-marketing"]]]),
    );

    const result = await buildMobileDashboardResponse(authorizedInput(), {
      ...createExampleMobileDashboardDependencies(),
      entitlements,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.body.metadata.availableTeams).toEqual(["team-marketing"]);
    expect(result.body.sections.some((section) => section.id === "sales")).toBe(false);
    expect(result.body.sections.some((section) => section.id === "cross_team")).toBe(false);
  });

  it("supports one-team and multi-team organizations", async () => {
    const oneTeam = await buildMobileDashboardResponse(
      authorizedInput({ token: "token-customer-2" }),
      createExampleMobileDashboardDependencies(),
    );
    const multiTeam = await buildMobileDashboardResponse(
      authorizedInput(),
      createExampleMobileDashboardDependencies(),
    );

    expect(oneTeam.ok).toBe(true);
    expect(multiTeam.ok).toBe(true);
    if (!oneTeam.ok || !multiTeam.ok) return;

    expect(oneTeam.body.metadata.availableTeams).toEqual(["team-marketing"]);
    expect(oneTeam.body.sections.some((section) => section.id === "cross_team")).toBe(false);
    expect(multiTeam.body.metadata.availableTeams).toEqual(["team-marketing", "team-sales"]);
    expect(multiTeam.body.sections.some((section) => section.id === "cross_team")).toBe(true);
  });

  it("rejects unsupported dashboard versions with supported versions listed", async () => {
    const result = await buildMobileDashboardResponse(
      authorizedInput({ dashboardVersion: "9.9.9" }),
      createExampleMobileDashboardDependencies(),
    );

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.status).toBe(400);
    expect(result.body.error.code).toBe("unsupported_dashboard_version");
    expect(result.body.error.supportedDashboardVersions).toContain("1.0.0");
  });

  it("rejects invalid locale and timezone safely", async () => {
    const invalidLocale = await buildMobileDashboardResponse(
      authorizedInput({ locale: "english" }),
      createExampleMobileDashboardDependencies(),
    );
    const invalidTimezone = await buildMobileDashboardResponse(
      authorizedInput({ timezone: "Not/A_Timezone" }),
      createExampleMobileDashboardDependencies(),
    );

    expect(invalidLocale.ok).toBe(false);
    expect(invalidTimezone.ok).toBe(false);
    if (invalidLocale.ok || invalidTimezone.ok) return;

    expect(invalidLocale.status).toBe(400);
    expect(invalidTimezone.status).toBe(400);
    expect(invalidLocale.body.error.message).not.toContain("stack");
    expect(invalidTimezone.body.error.message).not.toContain("specialist");
  });

  it("never exposes internal fields in serialized responses", async () => {
    const result = await buildMobileDashboardResponse(
      authorizedInput(),
      createExampleMobileDashboardDependencies(),
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const parsed = JSON.parse(result.serialized);
    expect(assertNoInternalFields(parsed)).toHaveLength(0);
    expect(result.serialized).not.toContain("specialistId");
    expect(result.serialized).not.toContain("teamLeadId");
    expect(result.serialized).not.toContain("operationsContextRef");
  });

  it("returns sanitized 409 when team report loader fails", async () => {
    const result = await buildMobileDashboardResponse(authorizedInput(), {
      ...createExampleMobileDashboardDependencies(),
      teamReports: new InMemoryTeamOperationalReportsLoader("org-acme"),
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.status).toBe(409);
    expect(result.body.error.code).toBe("dashboard_compose_failed");
    expect(result.body.error.message).not.toContain("loader failure");
  });

  it("continues without OIL when operations intelligence is absent", async () => {
    const operationsIntelligence = new InMemoryMobileOperationsIntelligenceLoader(
      new Map(),
      new Set(["org-acme"]),
    );

    const result = await buildMobileDashboardResponse(authorizedInput(), {
      ...createExampleMobileDashboardDependencies(),
      operationsIntelligence,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.body.sections.some((section) => section.id === "organization_overview")).toBe(
      true,
    );
    expect(result.body.metadata.organizationPublicName).toBeUndefined();
  });

  it("preserves deterministic serialization across repeated builds", async () => {
    const dependencies = createExampleMobileDashboardDependencies();
    const input = authorizedInput();

    const first = await buildMobileDashboardResponse(input, dependencies);
    const second = await buildMobileDashboardResponse(input, dependencies);

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    if (!first.ok || !second.ok) return;

    expect(first.serialized).toBe(second.serialized);
    expect(first.serialized).toBe(serializeDashboardResponse(second.body));
  });

  it("emits observability events without blocking the response", async () => {
    const telemetry = new InMemoryMobileDashboardTelemetryEmitter();
    const result = await buildMobileDashboardResponse(authorizedInput(), {
      ...createExampleMobileDashboardDependencies(),
      telemetry,
    });

    expect(result.ok).toBe(true);
    expect(telemetry.events.map((event) => event.phase)).toEqual([
      "mobile_dashboard_requested",
      "mobile_dashboard_authorized",
      "mobile_dashboard_built",
    ]);
    expect(telemetry.events.every((event) => event.correlationId === CORRELATION)).toBe(true);
  });

  it("returns 404 when organization is unavailable", async () => {
    const result = await buildMobileDashboardResponse(
      authorizedInput({ organizationId: "org-missing" }),
      createExampleMobileDashboardDependencies(),
    );

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.status).toBe(404);
    expect(result.body.error.code).toBe("organization_unavailable");
  });
});
