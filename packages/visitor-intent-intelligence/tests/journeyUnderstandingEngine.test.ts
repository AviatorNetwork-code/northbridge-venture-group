import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildJourneyUnderstanding } from "../src/engines/journeyUnderstandingEngine.js";
import type { JourneyEvent } from "../src/types/journey.js";

describe("journeyUnderstandingEngine", () => {
  it("tracks navigation sequence and CAT interactions", () => {
    const events: JourneyEvent[] = [
      { type: "page_view", timestamp: 1000, path: "/" },
      { type: "navigation", timestamp: 2000, path: "/services" },
      { type: "cat_opened", timestamp: 3000 },
      {
        type: "cat_message",
        timestamp: 4000,
        metadata: { role: "visitor", content: "What does Northbridge do?" },
      },
    ];

    const journey = buildJourneyUnderstanding(events, [], ["cta_engaged"]);

    assert.equal(journey.entryPoint, "/");
    assert.deepEqual(journey.navigationSequence, ["/", "/services"]);
    assert.equal(journey.catInteractionCount, 2);
    assert.deepEqual(journey.completedObjectives, ["cta_engaged"]);
    assert.ok(journey.unansweredQuestions.length > 0);
  });
});
