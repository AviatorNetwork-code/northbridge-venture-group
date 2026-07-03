import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getGreetingResponse,
  respondToVisitorInput,
} from "./websiteAssistant";

describe("websiteAssistant", () => {
  it("returns greeting without internal terms", () => {
    const greeting = getGreetingResponse();
    assert.match(greeting.message, /Northbridge/i);
    assert.doesNotMatch(greeting.message, /NEO|NEOS|governance|package architecture/i);
  });

  it("matches northbridge overview questions", () => {
    const response = respondToVisitorInput("What does Northbridge do?");
    assert.equal(response.matchedTopic, "northbridge-overview");
    assert.ok(response.ctas.length > 0);
  });

  it("matches flight school intent", () => {
    const response = respondToVisitorInput("I run a flight school");
    assert.equal(response.matchedTopic, "flight-school");
    assert.equal(response.recommendation?.action, "contact");
  });

  it("matches aviator network questions", () => {
    const response = respondToVisitorInput("What is Aviator Network?");
    assert.equal(response.matchedTopic, "aviator-network");
    assert.ok(
      response.ctas.some((cta) => cta.href.includes("aviatornetwork.com")),
    );
  });

  it("matches quadrix questions", () => {
    const response = respondToVisitorInput("What is Quadrix?");
    assert.equal(response.matchedTopic, "quadrix");
    assert.doesNotMatch(response.message, /NEO|NEOS|internal/i);
  });

  it("returns fallback for unknown input", () => {
    const response = respondToVisitorInput("xyzzy plugh");
    assert.equal(response.matchedTopic, undefined);
    assert.ok(response.ctas.length >= 3);
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
