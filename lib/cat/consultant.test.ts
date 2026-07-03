import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { runConsultantTurn, getConsultantGreeting } from "./consultantStrategy";
import { recommendProduct } from "./productRecommendationEngine";
import { buildNeoExportPayload } from "./neoIntegration";
import { createInitialSessionState } from "./consultantTypes";
import { getGreetingResponse, respondToVisitorInput } from "./websiteAssistant";

describe("consultantStrategy", () => {
  it("opens with consultant greeting focused on understanding", () => {
    const greeting = getConsultantGreeting();
    assert.match(greeting.message, /consultant/i);
    assert.match(greeting.message, /what brings you here/i);
    assert.equal(greeting.stage, "understand");
    assert.ok(greeting.followUpQuestion);
  });

  it("progresses from understand to product recommendation for aviation operator", () => {
    const turn1 = runConsultantTurn("I run a flight school and need better digital tools", {
      session: getConsultantGreeting().session,
    });

    assert.ok(
      ["understand", "educate", "discover_fit", "build_trust", "recommend", "convert"].includes(
        turn1.stage!,
      ),
    );
    assert.ok(turn1.productRecommendation || turn1.session?.recommendedProductId);

    const turn2 = runConsultantTurn("Yes, please recommend the best fit", {
      session: turn1.session,
    });
    assert.ok(turn2.productRecommendation || turn2.session?.recommendedProductId);
    const productName =
      turn2.productRecommendation?.productName ??
      turn1.productRecommendation?.productName ??
      "";
    assert.match(productName, /Aviator Network|Northbridge/i);
  });

  it("recommends AI solutions for automation intent", () => {
    const response = runConsultantTurn(
      "I want AI and automation for my business workflows",
      { session: createInitialSessionState() },
    );
    const rec = response.productRecommendation;
    assert.ok(rec);
    assert.match(rec!.productName, /AI|Northbridge/i);
  });

  it("builds trust without internal terms", () => {
    const response = runConsultantTurn("Why should I trust Northbridge?", {
      session: createInitialSessionState(),
    });
    assert.match(response.message, /trust|transparent|practical|real|platforms/i);
    assert.doesNotMatch(response.message, /NEO|NEOS|governance system/i);
  });

  it("tracks session score improvements over turns", () => {
    const response = runConsultantTurn("I need a business website with lead capture", {
      session: createInitialSessionState(),
    });
    assert.ok(response.sessionScoreDelta);
    assert.ok(response.sessionScoreDelta!.after.productUnderstanding >= response.sessionScoreDelta!.before.productUnderstanding);
  });

  it("flags qualified lead on buying signals", () => {
    const session = createInitialSessionState();
    session.profile.urgency = "high";
    session.profile.budgetMentioned = true;
    const response = runConsultantTurn("I'd like pricing and a consultation meeting", { session });
    assert.equal(response.qualifiedLead, true);
  });
});

describe("productRecommendationEngine", () => {
  it("matches flight school to Aviator Network", () => {
    const rec = recommendProduct(
      {
        visitorType: "operator",
        industry: "aviation",
        problems: ["flight school"],
        goals: ["connect instructors"],
        signals: ["flight school"],
      },
      "I run a flight school",
    );
    assert.equal(rec.productId, "aviator-network");
    assert.ok(rec.fitScore > 0.4);
  });

  it("honestly reports weak fit with insufficient context", () => {
    const rec = recommendProduct(
      { visitorType: "unknown", problems: [], goals: [], signals: [] },
      "hello",
    );
    assert.equal(rec.honestNoFit, true);
  });
});

describe("neoIntegration", () => {
  it("exports anonymous session payload for NEO capabilities", () => {
    const session = createInitialSessionState();
    session.turnCount = 3;
    session.stage = "recommend";
    session.recommendedProductId = "northbridge-services";

    const payload = buildNeoExportPayload(session);
    assert.equal(payload.governance.anonymous, true);
    assert.equal(payload.governance.noPii, true);
    assert.ok(payload.sessionSummary.metrics.productUnderstandingScore >= 0);
  });
});

describe("websiteAssistant v2 compatibility", () => {
  it("getGreetingResponse uses consultant mode", () => {
    const greeting = getGreetingResponse();
    assert.match(greeting.message, /consultant/i);
  });

  it("respondToVisitorInput delegates to consultant", () => {
    const response = respondToVisitorInput("What is Aviator Network?");
    assert.ok(response.message.length > 0);
    assert.doesNotMatch(response.message, /NEO|NEOS/i);
  });
});
