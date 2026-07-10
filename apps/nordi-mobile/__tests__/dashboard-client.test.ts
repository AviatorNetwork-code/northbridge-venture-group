import { buildDashboardUrl, MobileDashboardApiClient } from "@/api/dashboard-client";
import { DashboardApiError } from "@/api/errors";
import { sampleDashboardResponse } from "@/test-fixtures/dashboard-response";

describe("dashboard API client", () => {
  it("constructs requests without client-supplied customer identity or team entitlements", () => {
    const url = buildDashboardUrl({
      organizationId: "org-acme",
      accessToken: "token-customer-1",
      locale: "en-US",
      timezone: "America/New_York",
      appVersion: "1.0.0",
      dashboardVersion: "1.0.0",
    });

    expect(url).toContain("organizationId=org-acme");
    expect(url).toContain("locale=en-US");
    expect(url).toContain("timezone=America%2FNew_York");
    expect(url).not.toContain("customerId");
    expect(url).not.toContain("activeTeamIds");
  });

  it("includes bearer authorization and validates dashboard responses", async () => {
    const fetchImpl = jest.fn(async () =>
      Response.json(sampleDashboardResponse, { status: 200 }),
    ) as unknown as typeof fetch;

    const client = new MobileDashboardApiClient(fetchImpl);
    const response = await client.fetchDashboard({
      organizationId: "org-acme",
      accessToken: "token-customer-1",
    });

    expect(response.metadata.organizationId).toBe("org-acme");
    const [, init] = (fetchImpl as jest.Mock).mock.calls[0];
    expect(init.headers.Authorization).toBe("Bearer token-customer-1");
  });

  it("maps unauthorized responses to stable error codes", async () => {
    const fetchImpl = jest.fn(async () =>
      Response.json(
        {
          error: {
            code: "unauthenticated",
            message: "Authentication required.",
            correlationId: "corr-1",
          },
        },
        { status: 401 },
      ),
    ) as unknown as typeof fetch;

    const client = new MobileDashboardApiClient(fetchImpl);

    await expect(
      client.fetchDashboard({
        organizationId: "org-acme",
        accessToken: "invalid",
      }),
    ).rejects.toMatchObject({
      code: "unauthenticated",
      status: 401,
    });
  });

  it("maps forbidden organization responses", async () => {
    const fetchImpl = jest.fn(async () =>
      Response.json(
        {
          error: {
            code: "organization_access_denied",
            message: "You do not have access to this organization.",
            correlationId: "corr-2",
          },
        },
        { status: 403 },
      ),
    ) as unknown as typeof fetch;

    const client = new MobileDashboardApiClient(fetchImpl);

    await expect(
      client.fetchDashboard({
        organizationId: "org-beta",
        accessToken: "token-customer-1",
      }),
    ).rejects.toBeInstanceOf(DashboardApiError);
  });

  it("maps unsupported dashboard versions", async () => {
    const fetchImpl = jest.fn(async () =>
      Response.json(
        {
          error: {
            code: "unsupported_dashboard_version",
            message: "Requested dashboard version is not supported.",
            correlationId: "corr-3",
            supportedDashboardVersions: ["1.0.0"],
          },
        },
        { status: 400 },
      ),
    ) as unknown as typeof fetch;

    const client = new MobileDashboardApiClient(fetchImpl);

    await expect(
      client.fetchDashboard({
        organizationId: "org-acme",
        accessToken: "token-customer-1",
        dashboardVersion: "9.9.9",
      }),
    ).rejects.toMatchObject({
      code: "unsupported_dashboard_version",
    });
  });

  it("handles network failures safely", async () => {
    const fetchImpl = jest.fn(async () => {
      throw new Error("network down");
    }) as unknown as typeof fetch;

    const client = new MobileDashboardApiClient(fetchImpl);

    await expect(
      client.fetchDashboard({
        organizationId: "org-acme",
        accessToken: "token-customer-1",
      }),
    ).rejects.toMatchObject({
      code: "network_unavailable",
    });
  });

  it("rejects responses containing internal fields", async () => {
    const fetchImpl = jest.fn(async () =>
      Response.json(
        {
          ...sampleDashboardResponse,
          sections: [
            {
              ...sampleDashboardResponse.sections[0],
              cards: [
                {
                  ...sampleDashboardResponse.sections[0]!.cards[0]!,
                  payload: { specialistId: "hidden" },
                },
              ],
            },
          ],
        },
        { status: 200 },
      ),
    ) as unknown as typeof fetch;

    const client = new MobileDashboardApiClient(fetchImpl);

    await expect(
      client.fetchDashboard({
        organizationId: "org-acme",
        accessToken: "token-customer-1",
      }),
    ).rejects.toMatchObject({
      code: "internal_error",
    });
  });
});
