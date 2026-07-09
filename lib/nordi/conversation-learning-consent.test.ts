import { describe, expect, it, beforeEach, vi } from "vitest";
import {
  CONSENT_VERSION,
  acceptLearningConsent,
  appendConsentAudit,
  createDefaultConsent,
  createDefaultFounderLearningSettings,
  declineLearningConsent,
  markConsentPromptShown,
  resolveLearningEligible,
  shouldAskForConsent,
  updateLearningConsentFromSettings,
} from "@/lib/nordi/conversation-learning-consent";

describe("conversation learning consent", () => {
  it("asks only when consent is missing or version changed", () => {
    expect(shouldAskForConsent(null)).toBe(true);
    expect(shouldAskForConsent(createDefaultConsent())).toBe(true);

    const asked = markConsentPromptShown(null).consent;
    expect(shouldAskForConsent(asked)).toBe(false);

    expect(
      shouldAskForConsent({
        ...asked,
        consentVersion: CONSENT_VERSION + 1,
      }),
    ).toBe(true);
  });

  it("records allow and decline with audit metadata", () => {
    const accepted = acceptLearningConsent(null, "conversation_prompt");
    expect(accepted.consent.enabled).toBe(true);
    expect(accepted.consent.acceptedAt).toBeTruthy();
    expect(accepted.audit.source).toBe("conversation_prompt");

    const declined = declineLearningConsent(null, "conversation_prompt");
    expect(declined.consent.enabled).toBe(false);
    expect(declined.consent.declinedAt).toBeTruthy();
    expect(declined.audit.enabled).toBe(false);
  });

  it("updates from privacy settings without storing personal data", () => {
    const updated = updateLearningConsentFromSettings(null, true);
    expect(updated.consent.enabled).toBe(true);
    expect(updated.audit.source).toBe("privacy_settings");
    expect(Object.keys(updated.audit)).toEqual(["consentVersion", "timestamp", "source", "enabled"]);
  });

  it("resolves learning eligibility from consent and founder settings", () => {
    const consent = acceptLearningConsent(null, "conversation_prompt").consent;
    expect(resolveLearningEligible(consent)).toBe(true);
    expect(resolveLearningEligible(declineLearningConsent(null, "conversation_prompt").consent)).toBe(
      false,
    );

    const founderSettings = createDefaultFounderLearningSettings();
    expect(resolveLearningEligible(null, founderSettings)).toBe(true);

    founderSettings.alwaysAllow = false;
    expect(resolveLearningEligible(null, founderSettings)).toBe(false);
  });

  it("keeps a bounded consent audit log", () => {
    let log = appendConsentAudit([], {
      consentVersion: CONSENT_VERSION,
      timestamp: "2026-01-01T00:00:00.000Z",
      source: "privacy_settings",
      enabled: true,
    });

    for (let index = 0; index < 25; index += 1) {
      log = appendConsentAudit(log, {
        consentVersion: CONSENT_VERSION,
        timestamp: `2026-01-${String(index + 1).padStart(2, "0")}T00:00:00.000Z`,
        source: "privacy_settings",
        enabled: index % 2 === 0,
      });
    }

    expect(log).toHaveLength(20);
  });
});

describe("founder identity", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_NORDI_FOUNDER_EMAILS", "founder@northbridge.com");
  });

  it("detects founder emails from env configuration", async () => {
    const { isFounderIdentity } = await import("@/lib/nordi/conversation-learning-consent");
    expect(
      isFounderIdentity({
        method: "email",
        email: "founder@northbridge.com",
        verified: true,
        savedAt: new Date().toISOString(),
      }),
    ).toBe(true);
    expect(
      isFounderIdentity({
        method: "email",
        email: "user@example.com",
        verified: false,
        savedAt: new Date().toISOString(),
      }),
    ).toBe(false);
  });
});
