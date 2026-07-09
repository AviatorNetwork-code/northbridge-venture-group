import type {
  TeamSynthesisInput,
  TeamSynthesisResult,
  TeamSynthesizer,
} from "@northbridge/team-orchestrator";
import { generateMarketingRecommendations } from "../recommendations/engine.js";

/**
 * Synthesizes specialist outputs into a single Team Lead customer-facing response.
 * Does not expose internal delegation or specialist identities.
 */
export class MarketingTeamSynthesizer implements TeamSynthesizer {
  async synthesize(input: TeamSynthesisInput): Promise<TeamSynthesisResult> {
    const successful = input.results.filter((result) => result.outcome === "complete");
    const insights = successful
      .map((result) => result.result?.summary)
      .filter((value): value is string => Boolean(value));

    const evidence = successful.flatMap((result) => result.result?.evidence ?? []);
    const recommendations = generateMarketingRecommendations({
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
        : "We reviewed your marketing request and are preparing next steps.";

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
