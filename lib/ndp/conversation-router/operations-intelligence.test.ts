import { describe, expect, it } from "vitest";
import {
  createExampleOperationsIntelligenceLoader,
  resolveOrganizationContextRef,
} from "@/lib/ndp/operations-context";
import {
  createCommunicationRouter,
  createTestOrganization,
  DefaultConversationContextBuilder,
  DefaultOwnershipDecisionService,
  InMemoryOrganizationContextLoader,
  InMemorySubscriptionResolver,
  InMemoryTeamResolver,
} from "@/lib/ndp/conversation-router";
import {
  createDefaultCompositeResolver,
  createWorkforceRouter,
} from "@northbridge/workforce-router";
import { buildMarketingRouteRules } from "@/lib/ndp/teams/marketing/wiring/communication-router";
import { MARKETING_TEAM_ID } from "@/lib/ndp/teams/marketing";

const ORG = "org-acme";
const CUSTOMER = "cust-1";
const NOW = "2026-07-09T23:30:00.000Z";

describe("Communication Router Operations Intelligence wiring", () => {
  it("includes operations intelligence on conversation context when loader is provided", async () => {
    let capturedContext: import("@/lib/ndp/conversation-router").ConversationContext | undefined;

    const router = createCommunicationRouter({
      organizationLoader: new InMemoryOrganizationContextLoader(
        new Map([
          [
            ORG,
            {
              organization: createTestOrganization(ORG),
            },
          ],
        ]),
      ),
      operationsIntelligenceLoader: createExampleOperationsIntelligenceLoader([ORG], {
        now: () => NOW,
      }),
      subscriptionResolver: new InMemorySubscriptionResolver(
        new Map([
          [
            `${ORG}:${CUSTOMER}`,
            {
              orgId: ORG,
              customerId: CUSTOMER,
              status: "active",
              entitledTeamIds: [MARKETING_TEAM_ID],
            },
          ],
        ]),
      ),
      teamResolver: new InMemoryTeamResolver(
        new Map([
          [
            `${ORG}:${CUSTOMER}`,
            {
              hiredTeamIds: [MARKETING_TEAM_ID],
              activeConversations: [],
            },
          ],
        ]),
      ),
      ownershipDecision: new DefaultOwnershipDecisionService(
        createWorkforceRouter({ resolver: createDefaultCompositeResolver() }),
      ),
      contextBuilder: {
        build(input) {
          capturedContext = new DefaultConversationContextBuilder().build(input);
          return capturedContext;
        },
      },
      resolveRouteRules: async () => buildMarketingRouteRules(ORG),
    });

    await router.handleRequest({
      request: {
        requestId: "req-oil-1",
        orgId: ORG,
        customerId: CUSTOMER,
        threadId: "thread-oil-1",
        channel: "nordi-thread",
        message: "I want more customers.",
        capabilityTags: ["capability:customer_acquisition"],
        receivedAt: NOW,
      },
    });

    expect(capturedContext?.operationsIntelligence?.organizationId).toBe(ORG);
    expect(capturedContext?.operationsIntelligence?.profile.publicName.length).toBeGreaterThan(0);
    expect(
      resolveOrganizationContextRef({
        organizationId: ORG,
        contextVersion: capturedContext?.operationsIntelligence?.contextVersion,
      }),
    ).toContain("operations-intelligence:org-acme");
  });
});
