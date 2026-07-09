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
export declare class DefaultTeamReportBuilder implements TeamReportBuilder {
    build(input: TeamReportBuildInput): TeamReport;
}
