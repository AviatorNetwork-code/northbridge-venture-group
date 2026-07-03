import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getGreetingResponse,
  respondToVisitorInput,
} from "./websiteAssistant";

describe("websiteAssistant", () => {
  it("returns consultant greeting without internal terms", () => {
    const greeting = getGreetingResponse();
    assert.match(greeting.message, /Northbridge/i);
    assert.match(greeting.message, /consultant/i);
    assert.doesNotMatch(greeting.message, /NEO|NEOS|governance|package architecture/i);
  });

  it("matches northbridge overview questions", () => {
    const response = respondToVisitorInput("What does Northbridge do?");
    assert.ok(response.matchedTopic);
    assert.ok(response.ctas.length > 0);
    assert.ok(response.stage);
  });

  it("does not immediately recommend on flight school opener", () => {
    const response = respondToVisitorInput("I run a flight school");
    assert.ok(response.message.length > 0);
    assert.ok(
      response.stage === "discover" ||
        response.stage === "clarify" ||
        !response.productRecommendation,
    );
  });

  it("matches aviator network questions", () => {
    const response = respondToVisitorInput("What is Aviator Network?");
    assert.ok(
      response.message.includes("Aviator Network") ||
        response.productRecommendation?.productName.includes("Aviator"),
    );
  });

  it("handles quadrix questions without internal exposure", () => {
    const response = respondToVisitorInput("What is Quadrix?");
    assert.doesNotMatch(response.message, /NEO|NEOS|internal/i);
  });

  it("returns guided fallback for unknown input", () => {
    const response = respondToVisitorInput("xyzzy plugh");
    assert.ok(response.message.length > 0);
    assert.ok(response.followUpQuestion || response.stage === "discover");
  });

  it("never exposes internal architecture in responses", () => {
    const prompts = [
      "What does Northbridge do?",
      "Which product is right for me?",
      "I want AI for my business",
      "What is Quadrix?",
      "How do I contact Northbridge?",
    ];

    for (const prompt of prompts) {
      const response = respondToVisitorInput(prompt);
      const combined = `${response.message} ${response.ctas.map((c) => c.label).join(" ")}`;
      assert.doesNotMatch(combined, /NEO|NEOS|governance system|package architecture|engineering doctrine/i);
    }
  });
});
