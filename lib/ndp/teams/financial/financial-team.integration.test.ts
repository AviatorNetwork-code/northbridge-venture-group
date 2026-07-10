import { describe, expect, it } from "vitest";
import {
  createFinancialCommunicationRouter,
  FINANCIAL_TEAM_ID,
} from "@/lib/ndp/teams/financial";

const ORG = "org-acme";
const CUSTOMER = "cust-1";
const NOW = "2026-07-09T22:30:00.000Z";

describe("Financial Team Nordi Integration", () => {
  it("routes financial requests through Communication Router to Financial Team", async () => {
    const router = createFinancialCommunicationRouter({
      orgId: ORG,
      customerId: CUSTOMER,
      now: () => NOW,
    });

    const response = await router.handleRequest({
      request: {
        requestId: "req-nordi-fin-1",
        orgId: ORG,
        customerId: CUSTOMER,
        threadId: "thread-nordi-fin-1",
        channel: "nordi-thread",
        message: "I need help with our finances.",
        intentTags: ["intent:operational"],
        capabilityTags: ["capability:finance"],
        receivedAt: NOW,
      },
    });

    expect(response.owner.type).toBe("team");
    expect(response.owner.id).toBe(FINANCIAL_TEAM_ID);
    expect(response.reply.length).toBeGreaterThan(0);
    expect(response.reply).not.toContain("financial-specialist");
    expect(response.reply).not.toContain("delegat");
    expect(response.metadata?.escalated).not.toBe(true);
  });

  it("returns one synthesized response for receivables requests", async () => {
    const router = createFinancialCommunicationRouter({
      orgId: ORG,
      customerId: CUSTOMER,
      now: () => NOW,
    });

    const response = await router.handleRequest({
      request: {
        requestId: "req-nordi-fin-2",
        orgId: ORG,
        customerId: CUSTOMER,
        threadId: "thread-nordi-fin-2",
        channel: "team-thread",
        teamId: FINANCIAL_TEAM_ID,
        message: "Can you review our overdue invoices?",
        intentTags: ["intent:operational"],
        capabilityTags: ["capability:finance"],
        receivedAt: NOW,
      },
    });

    expect(response.owner.id).toBe(FINANCIAL_TEAM_ID);
    expect(response.reply.length).toBeGreaterThan(0);
    expect(response.reply).not.toContain("accounts-receivable-specialist");
  });
});
