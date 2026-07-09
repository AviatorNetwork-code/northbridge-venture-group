import type { OperationalMetric, TeamReport } from "@northbridge/workforce-contracts";
import type { TeamRequest } from "./request.js";
import type { TeamSynthesisResult } from "./synthesis.js";

export interface TeamReportBuildInput {
  reportId: string;
  request: TeamRequest;
  synthesis: TeamSynthesisResult;
  metrics?: OperationalMetric[];
  periodStart: string;
  periodEnd: string;
  now?: string;
}

export interface TeamReportBuilder {
  build(input: TeamReportBuildInput): TeamReport;
}

export class DefaultTeamReportBuilder implements TeamReportBuilder {
  build(input: TeamReportBuildInput): TeamReport {
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
