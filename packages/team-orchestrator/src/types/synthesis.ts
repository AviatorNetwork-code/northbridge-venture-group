import type { TeamConflict } from "./conflict.js";
import type { DelegationResult } from "./delegation.js";
import type { TeamRequest } from "./request.js";

export interface TeamSynthesisInput {
  request: TeamRequest;
  results: DelegationResult[];
  conflicts: TeamConflict[];
  now?: string;
}

export interface TeamSynthesisResult {
  summary: string;
  evidence: string[];
  contributingSpecialistIds: string[];
  conflictsResolved: TeamConflict[];
  synthesizedAt: string;
}

export interface TeamSynthesizer {
  synthesize(input: TeamSynthesisInput): Promise<TeamSynthesisResult>;
}

export class DefaultTeamSynthesizer implements TeamSynthesizer {
  async synthesize(input: TeamSynthesisInput): Promise<TeamSynthesisResult> {
    const successful = input.results.filter((result) => result.outcome === "complete");
    const summaries = successful
      .map((result) => result.result?.summary)
      .filter((value): value is string => Boolean(value));

    return {
      summary: summaries.join(" ") || "No specialist results available.",
      evidence: successful.flatMap((result) => result.result?.evidence ?? []),
      contributingSpecialistIds: successful.map((result) => result.specialistId),
      conflictsResolved: input.conflicts,
      synthesizedAt: input.now ?? new Date().toISOString(),
    };
  }
}
