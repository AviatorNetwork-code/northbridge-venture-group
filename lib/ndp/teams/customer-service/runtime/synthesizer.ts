import type {
  TeamSynthesisInput,
  TeamSynthesisResult,
  TeamSynthesizer,
} from "@northbridge/team-orchestrator";
import { generateCustomerServiceRecommendations } from "../recommendations/engine.js";

/**
 * Synthesizes specialist outputs into a single Customer Service Team Lead customer-facing response.
 */
export class CustomerServiceTeamSynthesizer implements TeamSynthesizer {
  async synthesize(input: TeamSynthesisInput): Promise<TeamSynthesisResult> {
    const successful = input.results.filter((result) => result.outcome === "complete");
    const insights = successful
      .map((result) => result.result?.summary)
      .filter((value): value is string => Boolean(value));

    const evidence = successful.flatMap((result) => result.result?.evidence ?? []);
    const recommendations = generateCustomerServiceRecommendations({
      evidence,
      message:
        typeof input.request.payload.message === "string"
          ? input.request.payload.message
          : "",
    });

    const recommendationText =
      recommendations.length > 0
        ? `\n\nRecommendations:\n${recommendations.map((entry) => `- ${entry.summary}`).join("\n")}`
        : "";

    const body =
      insights.length > 0
        ? insights.join(" ")
        : "We reviewed your customer service request and are preparing next steps.";

    const summary = `${body}${recommendationText}`.trim();

    return {
      summary,
      evidence,
      contributingSpecialistIds: successful.map((result) => result.specialistId),
      conflictsResolved: input.conflicts,
      synthesizedAt: input.now ?? new Date().toISOString(),
    };
  }
}
