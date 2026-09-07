import { createMockCompletionPort } from "@northbridge/platform-ai";
import type { NordyAiGapClass } from "@/lib/nordy/types";

export type NordyAiRequest = {
  prompt: string;
  contextSummary: string;
  entryPath: string;
  gapClass: NordyAiGapClass;
};

export type NordyAiResponse = {
  text: string;
  usedAi: true;
  gapClass: NordyAiGapClass;
  provider: "platform-ai-mock" | "platform-ai" | "unavailable";
};

/**
 * Canonical AI boundary for Nordy — uses @northbridge/platform-ai.
 * No second AI gateway. Live provider wiring remains environment-gated.
 */
export async function escalateToNeoAi(
  request: NordyAiRequest,
): Promise<NordyAiResponse> {
  try {
    const port = createMockCompletionPort(
      [
        "I do not have a fully verified answer for that yet.",
        "Based on what you shared, the safest next step is a short project review with the Northbridge team so we do not guess.",
        request.contextSummary
          ? `I am carrying forward: ${request.contextSummary}.`
          : "",
        "Would you like me to prepare a summary for human follow-up?",
      ]
        .filter(Boolean)
        .join(" "),
    );

    const response = await port.complete({
      model: "nordy-fallback",
      system:
        "You are Nordi for Northbridge Venture Group. Never invent pricing, clients, or secrets.",
      user: `${request.entryPath}\n${request.gapClass}\n${request.prompt}`,
    });

    return {
      text: response.text,
      usedAi: true,
      gapClass: request.gapClass,
      provider: "platform-ai-mock",
    };
  } catch {
    return {
      text: "I could not reach the AI fallback just now. I can still take notes and connect you with the Northbridge team — or you can use the contact page.",
      usedAi: true,
      gapClass: request.gapClass,
      provider: "unavailable",
    };
  }
}
