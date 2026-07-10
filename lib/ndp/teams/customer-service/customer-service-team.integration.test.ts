import { describe, expect, it } from "vitest";
import {
  createCustomerServiceCommunicationRouter,
  CUSTOMER_SERVICE_TEAM_ID,
} from "@/lib/ndp/teams/customer-service";

const ORG = "org-acme";
const CUSTOMER = "cust-1";
const NOW = "2026-07-09T22:30:00.000Z";

describe("Customer Service Team Nordi Integration", () => {
  it("routes customer inquiries through Communication Router to Customer Service Team", async () => {
    const router = createCustomerServiceCommunicationRouter({
      orgId: ORG,
      customerId: CUSTOMER,
      now: () => NOW,
    });

    const response = await router.handleRequest({
      request: {
        requestId: "req-nordi-cs-1",
        orgId: ORG,
        customerId: CUSTOMER,
        threadId: "thread-nordi-cs-1",
        channel: "nordi-thread",
        message: "I need help with customer inquiries.",
        intentTags: ["intent:operational"],
        capabilityTags: ["capability:customer_service"],
        receivedAt: NOW,
      },
    });

    expect(response.owner.type).toBe("team");
    expect(response.owner.id).toBe(CUSTOMER_SERVICE_TEAM_ID);
    expect(response.reply.length).toBeGreaterThan(0);
    expect(response.reply).not.toContain("customer-service-specialist");
    expect(response.reply).not.toContain("delegat");
    expect(response.metadata?.escalated).not.toBe(true);
  });

  it("returns one synthesized response for scheduling requests", async () => {
    const router = createCustomerServiceCommunicationRouter({
      orgId: ORG,
      customerId: CUSTOMER,
      now: () => NOW,
    });

    const response = await router.handleRequest({
      request: {
        requestId: "req-nordi-cs-2",
        orgId: ORG,
        customerId: CUSTOMER,
        threadId: "thread-nordi-cs-2",
        channel: "team-thread",
        teamId: CUSTOMER_SERVICE_TEAM_ID,
        message: "Can you help me schedule an appointment?",
        intentTags: ["intent:operational"],
        capabilityTags: ["capability:scheduling"],
        receivedAt: NOW,
      },
    });

    expect(response.owner.id).toBe(CUSTOMER_SERVICE_TEAM_ID);
    expect(response.reply.length).toBeGreaterThan(0);
    expect(response.reply).not.toContain("appointment-specialist");
  });
});
