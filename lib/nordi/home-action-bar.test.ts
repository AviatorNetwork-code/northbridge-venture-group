import { describe, expect, it } from "vitest";
import {
  shouldOfferSavePrompt,
  shouldShowSaveButton,
} from "@/lib/nordi/home-conversation-flow";

describe("Nordi action bar progressive disclosure", () => {
  it("shows explore first without save or call actions", () => {
    expect(shouldShowSaveButton({ userMessageCount: 1 }, false)).toBe(false);
    expect(shouldOfferSavePrompt({ userMessageCount: 2 })).toBe(false);
  });

  it("offers save later after meaningful context", () => {
    expect(
      shouldOfferSavePrompt({
        userMessageCount: 3,
        industry: "professional-services",
        employeeCount: 2,
        communicationChannels: ["phone"],
      }),
    ).toBe(true);
  });
});
