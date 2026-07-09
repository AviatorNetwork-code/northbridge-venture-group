export class DefaultTeamReportBuilder {
    build(input) {
        return {
            id: input.reportId,
            orgId: input.request.orgId,
            teamId: input.request.teamId,
            teamLeadId: input.request.teamLeadId,
            periodStart: input.periodStart,
            periodEnd: input.periodEnd,
            summary: input.synthesis.summary,
            metrics: input.metrics ?? [],
            generatedAt: input.now ?? new Date().toISOString(),
        };
    }
}
