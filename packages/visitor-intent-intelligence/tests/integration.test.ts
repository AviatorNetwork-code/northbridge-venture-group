import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { VisitorIntentIntelligence } from "../src/core/visitorIntentIntelligence.js";
import { assertReadOnlyOperation, VII_GOVERNANCE } from "../src/governance/readOnlyPolicy.js";
import { registerVIICapability, VII_CAPABILITY } from "../src/registration/capabilityRegistration.js";
import {
  aviatorNetworkAdapter,
  northbridgeWebsiteAdapter,
  quadrixAdapter,
} from "../examples/adapters/referenceAdapters.js";

describe("VisitorIntentIntelligence integration", () => {
  it("analyzes a Northbridge website session end-to-end", () => {
    const vii = new VisitorIntentIntelligence(northbridgeWebsiteAdapter);

    vii.ingestEvent({ type: "page_view", path: "/services", timestamp: 1000 });
    vii.ingestEvent({
      type: "cat_message_sent",
      timestamp: 2000,
      metadata: { content: "I run a flight school" },
    });
    vii.ingestEvent({
      type: "cat_cta_clicked",
      timestamp: 3000,
      metadata: { cta_id: "contact" },
    });

    const session = vii.analyzeSession();

    assert.equal(session.productId, "northbridge-website");
    assert.ok(session.intent.primaryIntent.id.length > 0);
    assert.ok(session.outcome.successScore > 0);
    assert.ok(session.journey.completedObjectives.includes("cta_engaged"));
  });

  it("generates executive report across adapters", () => {
    const website = new VisitorIntentIntelligence(northbridgeWebsiteAdapter);
    website.ingestEvent({ type: "page_view", path: "/about", timestamp: 1000 });

    const aviator = new VisitorIntentIntelligence(aviatorNetworkAdapter);
    aviator.ingestEvent({ type: "page_view", path: "/marketplace", timestamp: 1000 });
    aviator.ingestEvent({ type: "form_submit", timestamp: 2000 });

    const report = website.generateExecutiveReport([
      website.analyzeSession(),
      aviator.analyzeSession(),
    ]);

    assert.equal(report.sessionCount, 2);
    assert.ok(Object.keys(report.intentDistribution).length > 0);
    assert.ok(Array.isArray(report.recommendedCatImprovements));
  });

  it("supports Quadrix adapter without core product logic", () => {
    const vii = new VisitorIntentIntelligence(quadrixAdapter);
    vii.ingestEvent({ type: "page_view", path: "/assessment", timestamp: 1000 });

    const session = vii.analyzeSession();
    assert.equal(session.productId, "quadrix");
    assert.equal(session.outcome.classification, "started_onboarding");
  });

  it("enforces read-only governance", () => {
    assert.equal(VII_GOVERNANCE.readOnly, true);
    assert.throws(() => assertReadOnlyOperation("commit"));
  });

  it("registers NEOS capability", () => {
    const registered: string[] = [];
    registerVIICapability({
      register(cap) {
        registered.push(cap.id);
      },
    });

    assert.deepEqual(registered, [VII_CAPABILITY.id]);
  });
});
