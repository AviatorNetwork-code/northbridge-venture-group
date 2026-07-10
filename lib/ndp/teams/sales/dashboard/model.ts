import { MOCK_OUTPUTS } from "@/lib/ndp/domain/sales";
import type { SalesRecommendation } from "../recommendations/engine.js";

export type SalesDashboardCardId =
  | "new_leads"
  | "qualified_leads"
  | "follow_ups_due"
  | "proposals_sent"
  | "pipeline_status"
  | "conversion_rate"
  | "sales_recommendations"
  | "alerts";

export interface SalesDashboardCard<T = Record<string, unknown>> {
  id: SalesDashboardCardId;
  title: string;
  status: "healthy" | "warning" | "critical" | "info";
  data: T;
  updatedAt: string;
}

export interface SalesDashboardModel {
  teamId: string;
  cards: SalesDashboardCard[];
  generatedAt: string;
}

export interface BuildSalesDashboardInput {
  teamId: string;
  recommendations?: SalesRecommendation[];
  now?: string;
}

export function buildSalesDashboardModel(input: BuildSalesDashboardInput): SalesDashboardModel {
  const now = input.now ?? new Date().toISOString();
  const leadQualify = MOCK_OUTPUTS["lead.qualify"];
  const followUp = MOCK_OUTPUTS["followup.plan"];
  const proposal = MOCK_OUTPUTS["proposal.prepare"];
  const pipeline = MOCK_OUTPUTS["pipeline.review"];
  const salesAnalyze = MOCK_OUTPUTS["sales.analyze"];

  const cards: SalesDashboardCard[] = [
    {
      id: "new_leads",
      title: "New Leads",
      status: "healthy",
      data: {
        pendingQualification: leadQualify.metrics?.pendingQualification ?? 0,
        summary: leadQualify.summary,
      },
      updatedAt: now,
    },
    {
      id: "qualified_leads",
      title: "Qualified Leads",
      status: "healthy",
      data: {
        highIntentLeads: leadQualify.metrics?.highIntentLeads ?? 0,
        lowFitLeads: leadQualify.metrics?.lowFitLeads ?? 0,
      },
      updatedAt: now,
    },
    {
      id: "follow_ups_due",
      title: "Follow-ups Due",
      status: (followUp.metrics?.followUpsDueToday ?? 0) > 5 ? "warning" : "healthy",
      data: {
        dueToday: followUp.metrics?.followUpsDueToday ?? 0,
        dueThisWeek: followUp.metrics?.followUpsDueWeek ?? 0,
      },
      updatedAt: now,
    },
    {
      id: "proposals_sent",
      title: "Proposals Sent",
      status: "info",
      data: {
        proposalsDrafted: proposal.metrics?.proposalsDrafted ?? 0,
        avgProposalValue: proposal.metrics?.avgProposalValue,
      },
      updatedAt: now,
    },
    {
      id: "pipeline_status",
      title: "Pipeline Status",
      status: "info",
      data: {
        openDeals: pipeline.metrics?.openDeals ?? 0,
        weightedPipeline: pipeline.metrics?.weightedPipeline,
        summary: pipeline.summary,
      },
      updatedAt: now,
    },
    {
      id: "conversion_rate",
      title: "Conversion Rate",
      status: "healthy",
      data: {
        conversionRate: salesAnalyze.metrics?.conversionRate,
        winRate: pipeline.metrics?.winRate,
      },
      updatedAt: now,
    },
    {
      id: "sales_recommendations",
      title: "Sales Recommendations",
      status: "info",
      data: {
        items: (input.recommendations ?? []).map((entry) => ({
          id: entry.id,
          category: entry.category,
          summary: entry.summary,
          priority: entry.priority,
        })),
      },
      updatedAt: now,
    },
    {
      id: "alerts",
      title: "Alerts",
      status: pipeline.summary.includes("bottleneck") ? "warning" : "healthy",
      data: {
        alerts: pipeline.evidence.filter((entry) =>
          entry.toLowerCase().includes("bottleneck"),
        ),
      },
      updatedAt: now,
    },
  ];

  return {
    teamId: input.teamId,
    cards,
    generatedAt: now,
  };
}
