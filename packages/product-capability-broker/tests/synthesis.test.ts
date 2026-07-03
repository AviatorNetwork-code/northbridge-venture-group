import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { synthesizePublicAnswer } from "../src/engines/publicSafeSynthesis.js";
import type { ProductCapabilityRequest } from "../src/types/request.js";
import type { ProductCapabilityResponse } from "../src/types/response.js";

describe("publicSafeSynthesis", () => {
  it("includes limitations and next step in synthesized answer", () => {
    const request: ProductCapabilityRequest = {
      requestId: "req-1",
      requesterId: "website-cat",
      targetProductId: "aviator-network",
      visitorIntent: "student_acquisition",
      visitorContext: {},
      question: "Can you guarantee students?",
      requiredConfidence: "medium",
      publicFacing: true,
      allowedDisclosureLevel: "public",
      timestamp: Date.now(),
    };

    const response: ProductCapabilityResponse = {
      responseId: "resp-1",
      targetProductId: "aviator-network",
      answeredBy: "aviator-network-capability-adapter",
      currentCapabilities: [
        {
          id: "discovery",
          label: "Instructor discovery",
          description: "Find instructors",
          disclosureLevel: "public",
        },
      ],
      plannedCapabilities: [
        {
          id: "analytics",
          label: "Analytics",
          description: "School analytics",
          disclosureLevel: "public",
        },
      ],
      unsupportedClaims: [
        {
          claim: "guaranteed student acquisition",
          reason: "Not guaranteed",
        },
      ],
      recommendedPositioning: "Connection platform",
      recommendedCTA: "Explore Aviator Network",
      confidence: "high",
      evidence: [],
      escalationRequired: false,
      publicSafeSummary:
        "Aviator Network supports visibility and connection — not guaranteed enrollment.",
      lastUpdated: Date.now(),
    };

    const answer = synthesizePublicAnswer(request, response);
    assert.match(answer, /Important limitation/i);
    assert.match(answer, /Suggested next step/i);
    assert.match(answer, /roadmap|not yet available/i);
  });
});
