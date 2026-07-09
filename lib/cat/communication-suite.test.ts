import { describe, expect, it } from "vitest";
import { classifyMessageKind } from "@northbridge/core-conversation";
import { decideConversationTurn } from "@northbridge/conversation-engine";
import { createConversationState } from "@northbridge/conversation-state";
import { composeInteractionTurn } from "@northbridge/interaction-engine";
import { COMMUNICATION_PACKAGES } from "./communication-suite";

describe("NEOS communication suite (Nordi)", () => {
  it("lists installed communication packages", () => {
    expect(COMMUNICATION_PACKAGES.length).toBeGreaterThanOrEqual(10);
    expect(COMMUNICATION_PACKAGES.some((pkg) => pkg.id === "@northbridge/neo-bridge")).toBe(true);
  });

  it("resolves core-conversation exports", () => {
    const result = classifyMessageKind({ message: "hello", workspace: "general" });
    expect(result.kind).toBe("greeting");
  });

  it("resolves conversation-engine exports", () => {
    const decision = decideConversationTurn({
      asyncInFlight: false,
      workflowComplete: false,
      requiresConfirmation: false,
      toolReady: false,
      hasPendingQuestions: true,
      canAnswerDirectly: false,
      message: "What kind of business is it?",
    });
    expect(decision.action).toBe("ask");
  });

  it("resolves interaction-engine exports", () => {
    const envelope = composeInteractionTurn({
      conversation: {
        message: "hello",
        asyncInFlight: false,
        workflowComplete: false,
        requiresConfirmation: false,
        toolReady: false,
        hasPendingQuestions: false,
        canAnswerDirectly: true,
      },
      state: createConversationState("nordi-comm-suite"),
      presentation: {
        intentType: "greeting",
        confidence: 0.9,
        requiresConfirmation: false,
        hasStructuredData: false,
        channel: "desktop",
      },
    });
    expect(envelope.schemaVersion).toBe("1.0");
    expect(envelope.turn.action).toBe("answer");
  });
});
