import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { correlateBusinessSignals, summarizeBusinessCorrelations } from "../src/engines/businessCorrelationEngine.js";
import { DEFAULT_INTENT_CATALOG } from "../src/adapters/adapterContract.js";

describe("businessCorrelationEngine", () => {
  it("correlates lead signals with intent", () => {
    const intent = {
      primaryIntent: DEFAULT_INTENT_CATALOG.find((i) => i.id === "become_customer")!,
      confidence: 0.8,
      supportingEvidence: [],
      conflictingEvidence: [],
      confidenceProgression: [],
    };

    const correlation = correlateBusinessSignals(
      intent,
      [{ type: "lead_generated", timestamp: Date.now(), value: 20 }],
      {
        classification: "requested_contact",
        successScore: 0.85,
        objectiveAchieved: true,
        partialCompletionReasons: [],
        nextBestActionTaken: true,
        summary: "Contact requested",
      },
    );

    assert.ok(correlation);
    assert.equal(correlation!.leadGenerated, true);
    assert.ok(correlation!.estimatedValueScore > 0);
  });

  it("summarizes highest value intent", () => {
    const summary = summarizeBusinessCorrelations([
      {
        intentId: "become_customer",
        signals: [],
        estimatedValueScore: 80,
        leadGenerated: true,
        activated: false,
        converted: true,
        summary: "",
      },
      {
        intentId: "general_research",
        signals: [],
        estimatedValueScore: 20,
        leadGenerated: false,
        activated: false,
        converted: false,
        summary: "",
      },
    ]);

    assert.equal(summary.highestValueIntentId, "become_customer");
  });
});
