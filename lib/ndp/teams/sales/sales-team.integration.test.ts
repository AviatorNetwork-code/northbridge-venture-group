import { describe, expect, it } from "vitest";
import {
  createSalesCommunicationRouter,
  SALES_TEAM_ID,
} from "@/lib/ndp/teams/sales";

const ORG = "org-acme";
const CUSTOMER = "cust-1";
const NOW = "2026-07-09T22:30:00.000Z";

describe("Sales Team Nordi Integration", () => {
  it("routes converting leads through Communication Router to Sales Team", async () => {
    const router = createSalesCommunicationRouter({
      orgId: ORG,
      customerId: CUSTOMER,
      now: () => NOW,
    });

    const response = await router.handleRequest({
      request: {
        requestId: "req-nordi-sales-1",
        orgId: ORG,
        customerId: CUSTOMER,
        threadId: "thread-nordi-sales-1",
        channel: "nordi-thread",
        message: "I need help converting leads.",
        intentTags: ["intent:operational"],
        capabilityTags: ["capability:sales_pipeline"],
        receivedAt: NOW,
      },
    });

    expect(response.owner.type).toBe("team");
    expect(response.owner.id).toBe(SALES_TEAM_ID);
    expect(response.reply.length).toBeGreaterThan(0);
    expect(response.reply).not.toContain("sales-specialist");
    expect(response.reply).not.toContain("delegat");
    expect(response.metadata?.escalated).not.toBe(true);
  });

  it("returns one synthesized response for follow-up requests", async () => {
    const router = createSalesCommunicationRouter({
      orgId: ORG,
      customerId: CUSTOMER,
      now: () => NOW,
    });

    const response = await router.handleRequest({
      request: {
        requestId: "req-nordi-sales-2",
        orgId: ORG,
        customerId: CUSTOMER,
        threadId: "thread-nordi-sales-2",
        channel: "team-thread",
        teamId: SALES_TEAM_ID,
        message: "Can you follow up with prospects?",
        intentTags: ["intent:operational"],
        capabilityTags: ["capability:sales_pipeline"],
        receivedAt: NOW,
      },
    });

    expect(response.owner.id).toBe(SALES_TEAM_ID);
    expect(response.reply.length).toBeGreaterThan(0);
    expect(response.reply).not.toContain("follow-up-specialist");
  });
});
