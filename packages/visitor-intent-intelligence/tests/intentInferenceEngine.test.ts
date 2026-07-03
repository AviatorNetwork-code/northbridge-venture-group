import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { inferIntent, buildEvidenceFromKeywords } from "../src/engines/intentInferenceEngine.js";
import { DEFAULT_INTENT_CATALOG } from "../src/adapters/adapterContract.js";

describe("intentInferenceEngine", () => {
  it("infers flight school intent from CAT message evidence", () => {
    const evidence = buildEvidenceFromKeywords(
      "I run a flight school and need help",
      "cat",
      Date.now(),
      DEFAULT_INTENT_CATALOG,
    );

    const result = inferIntent(DEFAULT_INTENT_CATALOG, evidence, [Date.now()]);

    assert.equal(result.primaryIntent.id, "flight_training");
    assert.ok(result.confidence > 0);
  });

  it("returns unknown intent when no evidence matches", () => {
    const result = inferIntent(DEFAULT_INTENT_CATALOG, [], [Date.now()]);
    assert.equal(result.primaryIntent.id, "unknown_intent");
  });
});
