import { describe, expect, it } from "vitest";
import { createRequestOwner } from "@northbridge/workforce-contracts";
import {
  createDefaultCompositeResolver,
  createWorkforceRouter,
  type RouteRuleSet,
} from "@northbridge/workforce-router";
import {
  CommunicationRouterError,
  createCommunicationRouter,
  createTestOrganization,
  DefaultOwnershipDecisionService,
  InMemoryOrganizationContextLoader,
  InMemorySubscriptionResolver,
  InMemoryTeamResolver,
  type CustomerRequest,
} from "@/lib/ndp/conversation-router";

const ORG = "org-acme";
const CUSTOMER = "cust-1";
const NOW = "2026-07-09T12:00:00.000Z";

function sampleRules(): RouteRuleSet {
  return {
    orgId: ORG,
    version: 1,
    rules: [
      {
        ruleId: "route-scheduling",
        priority: 10,
        match: { capabilityTags: ["capability:scheduling"] },
        routeTo: { ownerType: "team", ownerId: "team-scheduling" },
        enabled: true,
      },
      {
        ruleId: "route-acquisition",
        priority: 10,
        match: { capabilityTags: ["capability:customer_acquisition"] },
        routeTo: { ownerType: "team", ownerId: "team-growth" },
        enabled: true,
      },
    ],
  };
}

function baseRequest(overrides: Partial<CustomerRequest> = {}): CustomerRequest {
  return {
    requestId: "req-1",
    orgId: ORG,
    customerId: CUSTOMER,
    threadId: "thread-1",
    channel: "nordi-thread",
    message: "Hello",
    receivedAt: NOW,
    ...overrides,
  };
}

function createRouterFixture(options?: {
  subscriptionStatus?: "active" | "missing" | "suspended";
  entitledTeamIds?: string[];
  hiredTeamIds?: string[];
  activeConversations?: import("@/lib/ndp/conversation-router").ActiveConversation[];
}) {
  const orgLoader = new InMemoryOrganizationContextLoader(
    new Map([
      [
        ORG,
        {
          organization: createTestOrganization(ORG),
          permissions: ["conversation:read", "conversation:write"],
        },
      ],
    ]),
  );

  const subscriptionResolver = new InMemorySubscriptionResolver(
    new Map([
      [
        `${ORG}:${CUSTOMER}`,
        {
          orgId: ORG,
          customerId: CUSTOMER,
          status: options?.subscriptionStatus ?? "active",
          entitledTeamIds: options?.entitledTeamIds ?? ["team-scheduling", "team-growth"],
        },
      ],
    ]),
  );

  const teamResolver = new InMemoryTeamResolver(
    new Map([
      [
        `${ORG}:${CUSTOMER}`,
        {
          hiredTeamIds: options?.hiredTeamIds ?? ["team-scheduling", "team-growth"],
          activeConversations: options?.activeConversations ?? [],
        },
      ],
    ]),
  );

  const workforceRouter = createWorkforceRouter({
    resolver: createDefaultCompositeResolver(),
  });

  return createCommunicationRouter({
    organizationLoader: orgLoader,
    subscriptionResolver,
    teamResolver,
    ownershipDecision: new DefaultOwnershipDecisionService(workforceRouter),
    resolveRouteRules: async () => sampleRules(),
  });
}

describe("NDP Communication Router", () => {
  it("handles Nordi-owned platform questions", async () => {
    const router = createRouterFixture();

    const response = await router.handleRequest({
      request: baseRequest({
        intentTags: ["intent:billing"],
        message: "How does billing work?",
      }),
    });

    expect(response.owner.type).toBe("nordi");
    expect(response.metadata?.ownershipSource).toBe("nordi-policy");
    expect(response.reply).toContain("Nordi received");
  });

  it("routes operational requests to a team via Workforce Router", async () => {
    const router = createRouterFixture();

    const response = await router.handleRequest({
      request: baseRequest({
        intentTags: ["intent:operational"],
        capabilityTags: ["capability:scheduling"],
        message: "Move tomorrow's appointments",
      }),
    });

    expect(response.owner.type).toBe("team");
    expect(response.owner.id).toBe("team-scheduling");
    expect(response.reply).toContain("team-scheduling");
  });

  it("handles team-thread requests directly", async () => {
    const router = createRouterFixture();

    const response = await router.handleRequest({
      request: baseRequest({
        channel: "team-thread",
        teamId: "team-scheduling",
        message: "Reschedule appointment 42",
      }),
    });

    expect(response.owner).toEqual(createRequestOwner(ORG, "team", "team-scheduling"));
    expect(response.metadata?.ownershipSource).toBe("team-thread");
  });

  it("returns Nordi response when subscription is missing", async () => {
    const router = createRouterFixture({ subscriptionStatus: "missing", entitledTeamIds: [] });

    const response = await router.handleRequest({
      request: baseRequest({
        intentTags: ["intent:operational"],
        capabilityTags: ["capability:scheduling"],
      }),
    });

    expect(response.owner.type).toBe("nordi");
    expect(response.metadata?.ownershipSource).toBe("subscription-gap");
    expect(response.reply).toContain("subscription is not active");
  });

  it("throws when no matching team is entitled on team-thread", async () => {
    const router = createRouterFixture({ entitledTeamIds: ["team-other"] });

    await expect(
      router.handleRequest({
        request: baseRequest({
          channel: "team-thread",
          teamId: "team-scheduling",
        }),
      }),
    ).rejects.toMatchObject({ code: "team_not_entitled" });
  });

  it("throws when team is not hired", async () => {
    const router = createRouterFixture({ hiredTeamIds: [] });

    await expect(
      router.handleRequest({
        request: baseRequest({
          channel: "team-thread",
          teamId: "team-scheduling",
        }),
      }),
    ).rejects.toMatchObject({ code: "team_not_hired" });
  });

  it("handles routing failures with Nordi clarification", async () => {
    const router = createRouterFixture();

    const response = await router.handleRequest({
      request: baseRequest({
        intentTags: ["intent:operational"],
        capabilityTags: ["capability:unknown"],
        message: "Do the thing",
      }),
    });

    expect(response.owner.type).toBe("nordi");
    expect(response.metadata?.ownershipSource).toBe("routing-failure");
    expect(response.reply).toContain("I could not route");
  });

  it("preserves conversation continuity for active team threads", async () => {
    const router = createRouterFixture({
      activeConversations: [
        {
          threadId: "thread-continuity",
          ownerType: "team",
          teamId: "team-growth",
          lastMessageAt: NOW,
        },
      ],
    });

    const response = await router.handleRequest({
      request: baseRequest({
        threadId: "thread-continuity",
        channel: "nordi-thread",
        capabilityTags: ["capability:scheduling"],
        message: "Follow up on campaign",
      }),
    });

    expect(response.owner.id).toBe("team-growth");
    expect(response.metadata?.ownershipSource).toBe("continuity");
  });

  it("coordinates a single response envelope with session metadata", async () => {
    const router = createRouterFixture();

    const response = await router.handleRequest({
      request: baseRequest({
        channel: "team-thread",
        teamId: "team-scheduling",
        requestId: "req-session",
        threadId: "thread-session",
      }),
    });

    expect(response.requestId).toBe("req-session");
    expect(response.session.threadId).toBe("thread-session");
    expect(response.session.customerId).toBe(CUSTOMER);
    expect(response.session.owner.type).toBe("team");
  });

  it("supports multiple entitled teams and selects via routing rules", async () => {
    const router = createRouterFixture();

    const scheduling = await router.handleRequest({
      request: baseRequest({
        capabilityTags: ["capability:scheduling"],
        intentTags: ["intent:operational"],
      }),
    });

    const growth = await router.handleRequest({
      request: baseRequest({
        requestId: "req-2",
        capabilityTags: ["capability:customer_acquisition"],
        intentTags: ["intent:operational"],
      }),
    });

    expect(scheduling.owner.id).toBe("team-scheduling");
    expect(growth.owner.id).toBe("team-growth");
  });

  it("rejects future manager ownership at launch", async () => {
    const orgLoader = new InMemoryOrganizationContextLoader(
      new Map([
        [
          ORG,
          {
            organization: createTestOrganization(ORG, {
              featureFlags: {
                managersEnabled: true,
                directorsEnabled: false,
                vpsEnabled: false,
              },
            }),
          },
        ],
      ]),
    );

    const workforceRouter = createWorkforceRouter({
      resolver: createDefaultCompositeResolver(),
    });

    const router = createCommunicationRouter({
      organizationLoader: orgLoader,
      subscriptionResolver: new InMemorySubscriptionResolver(
        new Map([
          [
            `${ORG}:${CUSTOMER}`,
            {
              orgId: ORG,
              customerId: CUSTOMER,
              status: "active",
              entitledTeamIds: ["team-scheduling"],
            },
          ],
        ]),
      ),
      teamResolver: new InMemoryTeamResolver(new Map()),
      ownershipDecision: new DefaultOwnershipDecisionService(workforceRouter),
      resolveRouteRules: async () => ({
        orgId: ORG,
        version: 1,
        rules: [
          {
            ruleId: "manager-route",
            priority: 50,
            match: { intentTags: ["intent:escalation"] },
            routeTo: { ownerType: "manager", ownerId: "mgr-1" },
            enabled: true,
          },
        ],
      }),
    });

    await expect(
      router.handleRequest({
        request: baseRequest({
          intentTags: ["intent:operational", "intent:escalation"],
        }),
      }),
    ).rejects.toBeInstanceOf(CommunicationRouterError);
  });
});
