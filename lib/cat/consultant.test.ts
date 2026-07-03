import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { runConsultantTurn, getConsultantGreeting } from "./consultantStrategy";
import { recommendProduct } from "./productRecommendationEngine";
import { buildNeoExportPayload } from "./neoIntegration";
import { createInitialSessionState } from "./consultantTypes";
import { detectObjection } from "./objectionHandling";
import { getGreetingResponse, respondToVisitorInput } from "./websiteAssistant";

describe("consultantStrategy consultative flow", () => {
  it("opens with discover-stage greeting focused on understanding", () => {
    const greeting = getConsultantGreeting();
    assert.match(greeting.message, /consultant/i);
    assert.match(greeting.message, /what brings you here/i);
    assert.equal(greeting.stage, "discover");
    assert.ok(greeting.followUpQuestion);
    assert.doesNotMatch(greeting.message, /Aviator Network/i);
  });

  it("does not pitch Aviator Network on first flight-school message", () => {
    const turn1 = runConsultantTurn("I'm thinking about starting a flight school", {
      session: getConsultantGreeting().session,
    });

    assert.equal(turn1.stage, "discover");
    assert.match(turn1.message, /launching a new school|modernizing|exploring/i);
    assert.equal(turn1.productRecommendation, undefined);
    assert.doesNotMatch(turn1.message, /Aviator Network is likely the best fit/i);
  });

  it("asks challenge question after launch context is clarified", () => {
    const turn1 = runConsultantTurn("I'm thinking about starting a flight school", {
      session: getConsultantGreeting().session,
    });

    const turn2 = runConsultantTurn("Launching a new school", {
      session: turn1.session,
    });

    assert.equal(turn2.stage, "clarify");
    assert.match(turn2.message, /biggest challenge|student acquisition|scheduling/i);
    assert.equal(turn2.productRecommendation, undefined);
  });

  it("recommends Aviator Network after discovery and clarification", () => {
    let session = getConsultantGreeting().session;

    const turn1 = runConsultantTurn("I'm thinking about starting a flight school", { session });
    session = turn1.session!;

    const turn2 = runConsultantTurn("Launching a new school", { session });
    session = turn2.session!;

    const turn3 = runConsultantTurn("Student acquisition is our biggest challenge", { session });

    assert.equal(turn3.stage, "recommend");
    assert.match(turn3.message, /Aviator Network is likely the best fit/i);
    assert.ok(turn3.productRecommendation);
    assert.equal(turn3.productRecommendation!.productId, "aviator-network");
    assert.ok(turn3.salesAnalyticsEvents?.includes("product_fit_detected"));
  });

  it("detects and handles price objections without hard selling", () => {
    let session = createInitialSessionState();
    session.profile.industry = "aviation";
    session.sales.launchContext = "new";
    session.sales.primaryChallenge = "student acquisition";
    session.sales.clarificationComplete = true;
    session.recommendedProductId = "aviator-network";
    session.turnCount = 3;
    session.stage = "recommend";

    const response = runConsultantTurn("This sounds too expensive for us right now", { session });

    assert.equal(response.stage, "handle_objections");
    assert.match(response.message, /budget|fair|without pressure/i);
    assert.ok(response.salesAnalyticsEvents?.includes("objection_detected"));
    assert.doesNotMatch(response.message, /limited time|act now|don't miss/i);
  });

  it("recommends AI solutions after consultative turns for automation intent", () => {
    let session = createInitialSessionState();
    session.profile.industry = "technology";
    session.profile.problems = ["need automation"];
    session.sales.discoveryComplete = true;
    session.sales.clarificationComplete = true;
    session.sales.primaryChallenge = "automation";
    session.turnCount = 3;

    const response = runConsultantTurn("We need AI workflow automation for our business", { session });
    assert.ok(response.productRecommendation || response.session?.recommendedProductId);
    const productName = response.productRecommendation?.productName ?? "";
    assert.match(productName, /AI|Northbridge/i);
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
    assert.ok(
      response.sessionScoreDelta!.after.productUnderstanding >=
        response.sessionScoreDelta!.before.productUnderstanding,
    );
  });

  it("flags qualified lead on buying signals", () => {
    const session = createInitialSessionState();
    session.profile.urgency = "high";
    session.profile.budgetMentioned = true;
    session.sales.clarificationComplete = true;
    session.sales.primaryChallenge = "lead generation";
    session.turnCount = 2;

    const response = runConsultantTurn("I'd like pricing and a consultation meeting", { session });
    assert.equal(response.qualifiedLead, true);
    assert.ok(response.salesAnalyticsEvents?.includes("qualified_lead_detected"));
  });

  it("fires discovery_started analytics when discovery begins", () => {
    const response = runConsultantTurn("I'm exploring options for our charter operation", {
      session: getConsultantGreeting().session,
    });
    assert.ok(response.salesAnalyticsEvents?.includes("discovery_started"));
  });
});

describe("objectionHandling", () => {
  it("detects price objections", () => {
    const objection = detectObjection("This is too expensive for our budget");
    assert.equal(objection?.type, "price");
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
