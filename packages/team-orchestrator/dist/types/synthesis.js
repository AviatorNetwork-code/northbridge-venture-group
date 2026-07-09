export class DefaultTeamSynthesizer {
    async synthesize(input) {
        const successful = input.results.filter((result) => result.outcome === "complete");
        const summaries = successful
            .map((result) => result.result?.summary)
            .filter((value) => Boolean(value));
        return {
            summary: summaries.join(" ") || "No specialist results available.",
            evidence: successful.flatMap((result) => result.result?.evidence ?? []),
            contributingSpecialistIds: successful.map((result) => result.specialistId),
            conflictsResolved: input.conflicts,
            synthesizedAt: input.now ?? new Date().toISOString(),
        };
    }
}
