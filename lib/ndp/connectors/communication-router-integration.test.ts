import { describe, expect, it } from "vitest";
import {
  createDefaultCompositeResolver,
  createWorkforceRouter,
} from "@northbridge/workforce-router";
import {
  CapabilityResolver,
  createNdpConnectorRegistry,
  registerDefaultSchedulingConnectors,
} from "@/lib/ndp/connectors";
import {
  createCommunicationRouter,
  createTestOrganization,
  DefaultOwnershipDecisionService,
  InMemoryOrganizationContextLoader,
  InMemorySubscriptionResolver,
  InMemoryTeamResolver,
} from "@/lib/ndp/conversation-router";

const ORG = "org-acme";
const CUSTOMER = "cust-1";

function createRouterFixture() {
  const registry = createNdpConnectorRegistry();
  registerDefaultSchedulingConnectors(registry, ORG);

  const capabilityResolver = new CapabilityResolver({ registry });

  return createCommunicationRouter({
    organizationLoader: new InMemoryOrganizationContextLoader(
      new Map([
        [
          ORG,
          {
            organization: createTestOrganization(ORG),
            permissions: ["conversation:read", "conversation:write"],
          },
        ],
      ]),
    ),
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
    teamResolver: new InMemoryTeamResolver(
      new Map([
        [
          `${ORG}:${CUSTOMER}`,
          {
            hiredTeamIds: ["team-scheduling"],
            activeConversations: [],
          },
        ],
      ]),
    ),
    ownershipDecision: new DefaultOwnershipDecisionService(
      createWorkforceRouter({ resolver: createDefaultCompositeResolver() }),
    ),
    resolveRouteRules: async () => ({ orgId: ORG, version: 1, rules: [] }),
    capabilityResolver,
  });
}

describe("Communication Router connector integration", () => {
  it("exposes available capabilities for an organization without executing connectors", () => {
    const router = createRouterFixture();

    const availability = router.resolveAvailableCapabilities({
      orgId: ORG,
      capabilityIds: ["schedule.create", "schedule.cancel", "crm.contact.create"],
    });

    expect(availability.orgId).toBe(ORG);
    expect(availability.capabilities).toHaveLength(3);

    const scheduling = availability.capabilities.filter((entry) =>
      entry.capabilityId.startsWith("schedule."),
    );
    expect(scheduling.every((entry) => entry.available)).toBe(true);
    expect(scheduling[0]?.providerId).toBe("provider:google-calendar");

    const crm = availability.capabilities.find(
      (entry) => entry.capabilityId === "crm.contact.create",
    );
    expect(crm?.available).toBe(false);
  });

  it("returns empty availability when capability resolver is not configured", () => {
    const router = createCommunicationRouter({
      organizationLoader: new InMemoryOrganizationContextLoader(
        new Map([
          [
            ORG,
            {
              organization: createTestOrganization(ORG),
              permissions: ["conversation:read", "conversation:write"],
            },
          ],
        ]),
      ),
      subscriptionResolver: new InMemorySubscriptionResolver(new Map()),
      teamResolver: new InMemoryTeamResolver(new Map()),
      ownershipDecision: new DefaultOwnershipDecisionService(
        createWorkforceRouter({ resolver: createDefaultCompositeResolver() }),
      ),
      resolveRouteRules: async () => ({ orgId: ORG, version: 1, rules: [] }),
    });

    const availability = router.resolveAvailableCapabilities({ orgId: ORG });
    expect(availability.capabilities).toEqual([]);
  });

  it("does not change customer-facing request handling when resolver is wired", async () => {
    const router = createRouterFixture();

    const response = await router.handleRequest({
      request: {
        requestId: "req-1",
        orgId: ORG,
        customerId: CUSTOMER,
        threadId: "thread-1",
        channel: "nordi-thread",
        message: "Hello",
        receivedAt: "2026-07-09T12:00:00.000Z",
        intentTags: ["intent:billing"],
      },
    });

    expect(response.owner.type).toBe("nordi");
    expect(response.reply).toContain("Nordi received");
  });
});
