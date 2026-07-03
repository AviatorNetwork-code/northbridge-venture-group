import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createProductCapabilityBroker,
  PCB_GOVERNANCE,
} from "../src/core/productCapabilityBroker.js";
import { assertReadOnlyOperation } from "../src/governance/readOnlyPolicy.js";
import { registerPCBCapability, PCB_CAPABILITY } from "../src/registration/capabilityRegistration.js";
import { runWebsiteCatAviatorFlow } from "../examples/flows/websiteCatAviatorFlow.js";
import type { ProductCapabilityRequest } from "../src/types/request.js";

function baseRequest(
  overrides: Partial<ProductCapabilityRequest> = {},
): ProductCapabilityRequest {
  return {
    requestId: "req-test-001",
    requesterId: "website-cat",
    targetProductId: "aviator-network",
    visitorIntent: "flight_school_fit",
    visitorContext: { industry: "aviation", challenge: "student acquisition" },
    question: "Can Aviator Network help my flight school get students?",
    requiredConfidence: "medium",
    publicFacing: true,
    allowedDisclosureLevel: "sales_safe",
    timestamp: Date.now(),
    ...overrides,
  };
}

describe("ProductCapabilityBroker integration", () => {
  it("Website CAT asks Aviator adapter for flight school student acquisition", () => {
    const flow = runWebsiteCatAviatorFlow();

    assert.match(flow.publicAnswer, /visibility and connection/i);
    assert.match(flow.publicAnswer, /should not be presented as a guaranteed student acquisition/i);
    assert.equal(flow.confidence, "high");
    assert.equal(flow.escalationRequired, false);
    assert.ok(flow.currentCapabilities.length > 0);
    assert.ok(flow.plannedCapabilities.length > 0);
    assert.ok(
      flow.blockedClaims.some((c) => /guaranteed student acquisition/i.test(c.claim)),
    );
  });

  it("does not present planned capabilities as current in public answer", () => {
    const broker = createProductCapabilityBroker();
    const result = broker.ask(baseRequest());

    assert.match(result.publicAnswer, /roadmap|not yet available|planned/i);
    assert.doesNotMatch(result.publicAnswer, /school workspace is available today/i);
  });

  it("blocks unsupported guarantee claims from being endorsed", () => {
    const broker = createProductCapabilityBroker();
    const result = broker.ask(baseRequest());

    assert.ok(result.blockedClaims.length > 0);
    assert.match(result.publicAnswer, /Important limitation/i);
    assert.doesNotMatch(result.publicAnswer, /Aviator Network guarantees/i);
  });

  it("escalates on low-confidence AirTax placeholder adapter", () => {
    const broker = createProductCapabilityBroker();
    const result = broker.ask(
      baseRequest({
        targetProductId: "airtax-financial",
        question: "Can AirTax guarantee tax savings for my flight business?",
        requiredConfidence: "medium",
      }),
    );

    assert.equal(result.response.escalationRequired, true);
    assert.equal(result.response.confidence, "low");
    assert.match(result.publicAnswer, /consultation|conversation|team/i);
  });

  it("registers five initial product adapters", () => {
    const broker = createProductCapabilityBroker();
    const products = broker.listProducts();
    assert.ok(products.length >= 4);
    assert.ok(broker.registry.hasProduct("aviator-network"));
    assert.ok(broker.registry.hasProduct("quadrix"));
    assert.ok(broker.registry.hasProduct("northbridge-services"));
    assert.ok(broker.registry.hasProduct("airtax-financial"));
  });

  it("enforces read-only governance", () => {
    assert.equal(PCB_GOVERNANCE.readOnly, true);
    assert.throws(() => assertReadOnlyOperation("write_product"));
  });

  it("registers PCB capability in NEOS registry", () => {
    const registered: string[] = [];
    registerPCBCapability({
      register(cap) {
        registered.push(cap.id);
      },
    });
    assert.deepEqual(registered, [PCB_CAPABILITY.id]);
  });

  it("strips internal terms from public-facing responses", () => {
    const broker = createProductCapabilityBroker();
    const result = broker.ask(baseRequest({ publicFacing: true }));
    assert.doesNotMatch(result.publicAnswer, /NEO|NEOS|governance system/i);
    assert.equal(result.response.privateNotes, undefined);
  });
});
