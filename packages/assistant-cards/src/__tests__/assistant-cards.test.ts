import { describe, expect, it } from "vitest";
import {
  assertAssistantRichCard,
  confirmationRequestCardFixture,
  confirmationWithoutActionsFixture,
  createAssistantCardValidationError,
  createSafeInvalidCardFallback,
  errorCardFixture,
  errorWithoutSeverityFixture,
  explanationCardFixture,
  missingTitleCardFixture,
  recommendationCardFixture,
  toolResultCardFixture,
  unknownTypeCardFixture,
  validateAssistantRichCard,
  validateAssistantRichCards,
  validateNormalizedPlannerCards,
  warningCardFixture,
  warningWithoutSeverityFixture,
} from "../index.js";
import {
  createExampleContext,
  createInMemoryToolExecutor,
  createSimpleResponsePlanner,
  EXAMPLE_READ_TOOL,
} from "@northbridge/assistant-router";

describe("validateAssistantRichCard", () => {
  it("accepts valid explanation card", () => {
    const result = validateAssistantRichCard(explanationCardFixture);
    expect(result.valid).toBe(true);
    expect(result.card?.type).toBe("explanation");
  });

  it("accepts valid recommendation card", () => {
    const result = validateAssistantRichCard(recommendationCardFixture);
    expect(result.valid).toBe(true);
    expect(result.card?.type).toBe("recommendation");
  });

  it("accepts valid confirmation_request card with actions", () => {
    const result = validateAssistantRichCard(confirmationRequestCardFixture);
    expect(result.valid).toBe(true);
    expect(result.card?.actions).toHaveLength(2);
  });

  it("rejects card missing title", () => {
    const result = validateAssistantRichCard(missingTitleCardFixture);
    expect(result.valid).toBe(false);
    expect(result.issues.some((issue) => issue.path === "title")).toBe(true);
  });

  it("rejects unknown card type", () => {
    const result = validateAssistantRichCard(unknownTypeCardFixture);
    expect(result.valid).toBe(false);
    expect(result.issues.some((issue) => issue.code === "UNKNOWN_TYPE")).toBe(
      true,
    );
  });

  it("rejects confirmation_request with no actions", () => {
    const result = validateAssistantRichCard(confirmationWithoutActionsFixture);
    expect(result.valid).toBe(false);
    expect(result.issues.some((issue) => issue.path === "actions")).toBe(true);
  });

  it("rejects warning card without severity", () => {
    const result = validateAssistantRichCard(warningWithoutSeverityFixture);
    expect(result.valid).toBe(false);
    expect(result.issues.some((issue) => issue.path === "severity")).toBe(true);
  });

  it("rejects error card without severity", () => {
    const result = validateAssistantRichCard(errorWithoutSeverityFixture);
    expect(result.valid).toBe(false);
    expect(result.issues.some((issue) => issue.path === "severity")).toBe(true);
  });
});

describe("validateAssistantRichCards batch", () => {
  it("validates multiple cards and collects validCards", () => {
    const batch = validateAssistantRichCards([
      explanationCardFixture,
      toolResultCardFixture,
      warningCardFixture,
      errorCardFixture,
    ]);
    expect(batch.valid).toBe(true);
    expect(batch.validCards).toHaveLength(4);
  });

  it("fails batch when any card is invalid", () => {
    const batch = validateAssistantRichCards([
      recommendationCardFixture,
      missingTitleCardFixture,
    ]);
    expect(batch.valid).toBe(false);
    expect(batch.validCards).toHaveLength(1);
    expect(batch.issues.length).toBeGreaterThan(0);
  });
});

describe("assertAssistantRichCard and safe errors", () => {
  it("throws AssistantCardValidationError on invalid card", () => {
    expect(() => assertAssistantRichCard(missingTitleCardFixture)).toThrowError(
      "AssistantRichCard validation failed.",
    );
  });

  it("creates validation error with issues", () => {
    const result = validateAssistantRichCard(unknownTypeCardFixture);
    const error = createAssistantCardValidationError(
      "Invalid card",
      result.issues,
    );
    expect(error.name).toBe("AssistantCardValidationError");
    expect(error.issues.length).toBeGreaterThan(0);
  });

  it("creates safe invalid card fallback without exposing raw payload", () => {
    const result = validateAssistantRichCard(missingTitleCardFixture);
    const fallback = createSafeInvalidCardFallback(result.issues);
    expect(fallback.type).toBe("error");
    expect(fallback.severity).toBe("error");
    expect(fallback.body).not.toContain("undefined");
  });
});

describe("router planner output validation", () => {
  it("validates normalized @northbridge/assistant-router planner cards", async () => {
    const executor = createInMemoryToolExecutor({
      handlers: {
        [EXAMPLE_READ_TOOL.tool_id]: () => ({
          tool_id: EXAMPLE_READ_TOOL.tool_id,
          status: "success",
          data: { entity_name: "Example Entity" },
        }),
      },
    });

    const planner = createSimpleResponsePlanner();
    const toolResult = await executor.execute(
      EXAMPLE_READ_TOOL.tool_id,
      {},
      createExampleContext(),
    );

    const contractCards = await planner.plan({
      routePlan: {
        intent: {
          intent_type: "inform",
          domain: "example-product",
          required_tool_ids: [],
          confirmation_requirement: "none",
          missing_data_fields: [],
          classification_confidence: "high",
        },
        selected_tool_ids: [EXAMPLE_READ_TOOL.tool_id],
        requires_confirmation: false,
      },
      toolResults: [toolResult],
    });

    const validation = validateNormalizedPlannerCards(contractCards);
    expect(validation.valid).toBe(true);
    expect(validation.validCards[0]?.type).toBe("tool_result");
  });
});
