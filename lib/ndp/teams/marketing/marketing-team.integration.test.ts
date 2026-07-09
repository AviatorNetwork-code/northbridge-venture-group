import { describe, expect, it } from "vitest";
import {
  createMarketingCommunicationRouter,
  MARKETING_TEAM_ID,
} from "@/lib/ndp/teams/marketing";

const ORG = "org-acme";
const CUSTOMER = "cust-1";
const NOW = "2026-07-09T22:30:00.000Z";

describe("Marketing Team Nordi Integration", () => {
  it("routes I want more customers through Communication Router to Marketing Team", async () => {
    const router = createMarketingCommunicationRouter({
      orgId: ORG,
      customerId: CUSTOMER,
      now: () => NOW,
    });

    const response = await router.handleRequest({
      request: {
        requestId: "req-nordi-1",
        orgId: ORG,
        customerId: CUSTOMER,
        threadId: "thread-nordi-1",
        channel: "nordi-thread",
        message: "I want more customers.",
        intentTags: ["intent:operational"],
        capabilityTags: ["capability:customer_acquisition"],
        receivedAt: NOW,
      },
    });

    expect(response.owner.type).toBe("team");
    expect(response.owner.id).toBe(MARKETING_TEAM_ID);
    expect(response.reply.length).toBeGreaterThan(0);
    expect(response.reply).not.toContain("marketing-campaign-specialist");
    expect(response.reply).not.toContain("delegat");
    expect(response.metadata?.escalated).not.toBe(true);
  });

  it("returns one synthesized response for content marketing requests", async () => {
    const router = createMarketingCommunicationRouter({
      orgId: ORG,
      customerId: CUSTOMER,
      now: () => NOW,
    });

    const response = await router.handleRequest({
      request: {
        requestId: "req-nordi-2",
        orgId: ORG,
        customerId: CUSTOMER,
        threadId: "thread-nordi-2",
        channel: "team-thread",
        teamId: MARKETING_TEAM_ID,
        message: "Plan our social content for next month.",
        intentTags: ["intent:operational"],
        capabilityTags: ["capability:content_marketing"],
        receivedAt: NOW,
      },
    });

    expect(response.owner.id).toBe(MARKETING_TEAM_ID);
    expect(response.reply.length).toBeGreaterThan(0);
  });
});
