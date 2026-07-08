import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { validateCapabilityResponse } from "../src/engines/capabilityResponseValidator.js";
import type { ProductCapabilityResponse } from "../src/types/response.js";

function sampleResponse(
  overrides: Partial<ProductCapabilityResponse> = {},
): ProductCapabilityResponse {
  return {
    responseId: "resp-1",
    targetProductId: "aviator-network",
    answeredBy: "aviator-network-capability-adapter",
    currentCapabilities: [
      {
        id: "profiles",
        label: "Profiles",
        description: "Pilot profiles",
        disclosureLevel: "public",
      },
    ],
    plannedCapabilities: [],
    unsupportedClaims: [],
    recommendedPositioning: "Test positioning",
    recommendedCTA: "Learn more",
    confidence: "high",
    evidence: [{ source: "test", detail: "test evidence" }],
    escalationRequired: false,
    publicSafeSummary: "Safe summary without guarantees.",
    lastUpdated: Date.now(),
    ...overrides,
  };
}

describe("capabilityResponseValidator", () => {
  it("accepts valid high-confidence response", () => {
    const result = validateCapabilityResponse(sampleResponse(), "medium");
    assert.equal(result.valid, true);
  });

  it("rejects planned/current overlap", () => {
    const result = validateCapabilityResponse(
      sampleResponse({
        plannedCapabilities: [
          {
            id: "profiles",
            label: "Profiles planned",
            description: "Duplicate",
            disclosureLevel: "public",
          },
        ],
      }),
      "medium",
    );
    assert.equal(result.valid, false);
    assert.match(result.errors.join(" "), /overlap/i);
  });

  it("requires escalation when confidence below required", () => {
    const result = validateCapabilityResponse(
      sampleResponse({ confidence: "low", escalationRequired: false }),
      "high",
    );
    assert.equal(result.valid, false);
  });
});
