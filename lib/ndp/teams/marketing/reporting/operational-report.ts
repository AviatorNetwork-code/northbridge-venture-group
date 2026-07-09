import type { OperationalMetric, TeamReport } from "@northbridge/workforce-contracts";
import type {
  TeamReportBuildInput,
  TeamReportBuilder,
} from "@northbridge/team-orchestrator";
import type { DelegationResult } from "@northbridge/team-orchestrator";
import type { MarketingRecommendation } from "../recommendations/engine.js";

export interface MarketingOperationalReport extends TeamReport {
  workCompleted: string[];
  specialistUtilization: Array<{
    specialistId: string;
    tasksCompleted: number;
    outcome: string;
  }>;
  confidenceLevels: Array<{ specialistId: string; level: string }>;
  escalations: string[];
  pendingWork: string[];
  recommendations: MarketingRecommendation[];
  kpis: OperationalMetric[];
}

export interface MarketingReportContext {
  delegationResults: DelegationResult[];
  recommendations: MarketingRecommendation[];
  pendingWork?: string[];
  escalations?: string[];
}

export class MarketingOperationalReportBuilder implements TeamReportBuilder {
  constructor(private readonly context: MarketingReportContext) {}

  build(input: TeamReportBuildInput): MarketingOperationalReport {
    const completed = this.context.delegationResults.filter(
      (result) => result.outcome === "complete",
    );

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
      workCompleted: completed.map(
        (result) => result.result?.summary ?? `Task ${result.taskId} completed`,
      ),
      specialistUtilization: this.context.delegationResults.map((result) => ({
        specialistId: result.specialistId,
        tasksCompleted: result.outcome === "complete" ? 1 : 0,
        outcome: result.outcome,
      })),
      confidenceLevels: completed.map((result) => ({
        specialistId: result.specialistId,
        level: result.result?.confidence?.level ?? "unknown",
      })),
      escalations: this.context.escalations ?? [],
      pendingWork: this.context.pendingWork ?? [],
      recommendations: this.context.recommendations,
      kpis: input.metrics ?? [],
    };
  }
}
