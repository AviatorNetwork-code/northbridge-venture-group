import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyDisclosureGuardrails,
  enforceRoadmapDisclosureRules,
} from "../src/engines/disclosureGuardrails.js";
import type { ProductCapabilityResponse } from "../src/types/response.js";

describe("disclosureGuardrails", () => {
  it("blocks partner_safe items from public disclosure level", () => {
    const response: ProductCapabilityResponse = {
      responseId: "r1",
      targetProductId: "aviator-network",
      answeredBy: "test",
      currentCapabilities: [
        {
          id: "internal",
          label: "Internal feature",
          description: "Partner only",
          disclosureLevel: "partner_safe",
        },
      ],
      plannedCapabilities: [],
      unsupportedClaims: [],
      recommendedPositioning: "Test",
      recommendedCTA: "Contact",
      confidence: "medium",
      evidence: [],
      escalationRequired: false,
      publicSafeSummary: "Summary",
      lastUpdated: Date.now(),
    };

    const result = applyDisclosureGuardrails(response, "public", true);
    assert.equal(result.response.currentCapabilities.length, 0);
    assert.ok(result.warnings.length > 0);
  });

  it("labels planned capabilities explicitly", () => {
    const response: ProductCapabilityResponse = {
      responseId: "r1",
      targetProductId: "quadrix",
      answeredBy: "test",
      currentCapabilities: [],
      plannedCapabilities: [
        {
          id: "retention",
          label: "Retention systems",
          description: "Retention tooling in a later release",
          disclosureLevel: "sales_safe",
        },
      ],
      unsupportedClaims: [],
      recommendedPositioning: "Test",
      recommendedCTA: "Contact",
      confidence: "medium",
      evidence: [],
      escalationRequired: false,
      publicSafeSummary: "Summary without planned mention.",
      lastUpdated: Date.now(),
    };

    const result = enforceRoadmapDisclosureRules(response);
    assert.match(result.plannedCapabilities[0]!.label, /Planned:/i);
    assert.match(result.plannedCapabilities[0]!.description, /not yet available|Planned/i);
  });
});
