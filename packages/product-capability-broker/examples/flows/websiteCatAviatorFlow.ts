/**
 * Example broker flow — Website CAT asks Aviator product adapter.
 * Reference only; not imported by PCB core.
 */
import { createProductCapabilityBroker } from "../../src/core/productCapabilityBroker.js";
import type { ProductCapabilityRequest } from "../../src/types/request.js";

export function runWebsiteCatAviatorFlow() {
  const broker = createProductCapabilityBroker();

  const request: ProductCapabilityRequest = {
    requestId: "req-website-cat-001",
    requesterId: "website-cat",
    targetProductId: "aviator-network",
    visitorIntent: "flight_school_student_acquisition",
    visitorContext: {
      industry: "aviation",
      visitorType: "operator",
      challenge: "student acquisition",
      launchContext: "new",
    },
    question: "Can Aviator Network help my flight school get students?",
    requiredConfidence: "medium",
    publicFacing: true,
    allowedDisclosureLevel: "sales_safe",
    timestamp: Date.now(),
  };

  const result = broker.ask(request);

  return {
    request,
    publicAnswer: result.publicAnswer,
    confidence: result.response.confidence,
    blockedClaims: result.blockedClaims,
    currentCapabilities: result.response.currentCapabilities.map((c) => c.label),
    plannedCapabilities: result.response.plannedCapabilities.map((c) => c.label),
    escalationRequired: result.response.escalationRequired,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(JSON.stringify(runWebsiteCatAviatorFlow(), null, 2));
}
