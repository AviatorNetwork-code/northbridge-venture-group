import { describe, expect, it } from "vitest";
import { createEmptyMemory } from "@/lib/nordi/conversation-memory";
import {
  canResumeNordiConversation,
  getNordiPublicCtaLabel,
} from "@/lib/nordi/public-conversation-state";

describe("public conversation state", () => {
  it("shows Talk to Nordi when no active conversation exists", () => {
    expect(getNordiPublicCtaLabel(null)).toBe("Talk to Nordi");
    expect(canResumeNordiConversation(null)).toBe(false);
  });

  it("shows Resume Nordi when the user has an in-progress conversation", () => {
    const memory = createEmptyMemory("session-1");
    memory.messages = [
      {
        id: "intro",
        role: "cat",
        content: "Hello.",
        timestamp: new Date().toISOString(),
      },
      {
        id: "browse-intro",
        role: "cat",
        content: "Every business is different.",
        timestamp: new Date().toISOString(),
      },
    ];

    expect(canResumeNordiConversation(memory)).toBe(true);
    expect(getNordiPublicCtaLabel(memory)).toBe("Resume Nordi");
  });

  it("shows Resume Nordi after the user has sent a message", () => {
    const memory = createEmptyMemory("session-2");
    memory.profile.userMessageCount = 1;

    expect(canResumeNordiConversation(memory)).toBe(true);
    expect(getNordiPublicCtaLabel(memory)).toBe("Resume Nordi");
  });
});
