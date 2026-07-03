import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { evaluateConversation } from "../src/engines/conversationEvaluator.js";
import { inferIntent } from "../src/engines/intentInferenceEngine.js";
import { DEFAULT_INTENT_CATALOG } from "../src/adapters/adapterContract.js";
import type { JourneyUnderstanding } from "../src/types/journey.js";

describe("conversationEvaluator", () => {
  it("scores CAT guidance and produces improvements", () => {
    const intent = inferIntent(
      DEFAULT_INTENT_CATALOG,
      [
        {
          source: "cat",
          signal: "flight school",
          weight: 2,
          timestamp: Date.now(),
          supports: "flight_training",
        },
      ],
      [Date.now()],
    );

    const journey: JourneyUnderstanding = {
      discoveryPath: ["/services"],
      catInteractionCount: 3,
      navigationSequence: ["/services"],
      abandonedPages: [],
      completedObjectives: [],
      unansweredQuestions: ["How much does a website cost?"],
      decisionPoints: [],
      frictionEvents: [],
    };

    const evaluation = evaluateConversation(
      [
        { timestamp: 1, role: "visitor", content: "I run a flight school" },
        { timestamp: 2, role: "cat", content: "Northbridge supports aviation...", matchedTopic: "flight-school" },
      ],
      intent,
      journey,
    );

    assert.ok(evaluation);
    assert.ok(evaluation!.catGuidanceScore > 0);
    assert.ok(evaluation!.improvementRecommendations.length > 0);
  });
});
