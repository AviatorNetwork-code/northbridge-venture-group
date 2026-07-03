import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assessConfidence } from "../src/engines/confidenceEngine.js";
import type { JourneyEvent } from "../src/types/journey.js";

describe("confidenceEngine", () => {
  it("detects successful completion signal", () => {
    const events: JourneyEvent[] = [
      { type: "entry", timestamp: 1000, path: "/" },
      { type: "objective_completed", timestamp: 5000, label: "reached_contact" },
    ];

    const result = assessConfidence(events, 0.6);

    assert.ok(result.currentScore >= 0.85);
    assert.equal(result.dominantSignal, "successful_completion");
  });

  it("detects disengagement when CAT closes early", () => {
    const events: JourneyEvent[] = [
      { type: "cat_opened", timestamp: 1000 },
      { type: "cat_closed", timestamp: 2000 },
    ];

    const result = assessConfidence(events, 0.5);
    assert.ok(result.signals.some((s) => s.type === "disengagement"));
  });
});
