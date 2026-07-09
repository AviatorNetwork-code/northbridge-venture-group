import { MOCK_OUTPUTS } from "@/lib/ndp/domain/marketing";
import type { MarketingRecommendation } from "../recommendations/engine.js";

export type MarketingDashboardCardId =
  | "active_campaigns"
  | "campaign_status"
  | "scheduled_content"
  | "content_backlog"
  | "budget_utilization"
  | "lead_volume"
  | "marketing_kpis"
  | "recommendations"
  | "alerts";

export interface MarketingDashboardCard<T = Record<string, unknown>> {
  id: MarketingDashboardCardId;
  title: string;
  status: "healthy" | "warning" | "critical" | "info";
  data: T;
  updatedAt: string;
}

export interface MarketingDashboardModel {
  teamId: string;
  cards: MarketingDashboardCard[];
  generatedAt: string;
}

export interface BuildMarketingDashboardInput {
  teamId: string;
  recommendations?: MarketingRecommendation[];
  now?: string;
}

/**
 * Builds operational dashboard state from mock connector outputs and recommendations.
 */
export function buildMarketingDashboardModel(
  input: BuildMarketingDashboardInput,
): MarketingDashboardModel {
  const now = input.now ?? new Date().toISOString();
  const campaignReview = MOCK_OUTPUTS["campaign.review"];
  const contentCalendar = MOCK_OUTPUTS["content.calendar"];
  const analytics = MOCK_OUTPUTS["marketing.analyze"];
  const budget = MOCK_OUTPUTS["budget.review"];

  const cards: MarketingDashboardCard[] = [
    {
      id: "active_campaigns",
      title: "Active Campaigns",
      status: "healthy",
      data: {
        count: campaignReview.metrics?.activeCampaigns ?? 0,
        summary: campaignReview.summary,
      },
      updatedAt: now,
    },
    {
      id: "campaign_status",
      title: "Campaign Status",
      status: "info",
      data: {
        evidence: campaignReview.evidence,
        avgCtr: campaignReview.metrics?.avgCtr,
      },
      updatedAt: now,
    },
    {
      id: "scheduled_content",
      title: "Scheduled Content",
      status: "healthy",
      data: {
        scheduledPosts: contentCalendar.metrics?.scheduledPosts ?? 0,
        cadence: "Tue/Thu/Sat",
      },
      updatedAt: now,
    },
    {
      id: "content_backlog",
      title: "Content Backlog",
      status: "warning",
      data: {
        backlogItems: contentCalendar.metrics?.backlogItems ?? 0,
      },
      updatedAt: now,
    },
    {
      id: "budget_utilization",
      title: "Budget Utilization",
      status:
        (budget.metrics?.budgetUtilization ?? 0) > 0.85 ? "warning" : "healthy",
      data: {
        utilization: budget.metrics?.budgetUtilization,
        summary: budget.summary,
      },
      updatedAt: now,
    },
    {
      id: "lead_volume",
      title: "Lead Volume",
      status: "healthy",
      data: {
        leadVolume: analytics.metrics?.leadVolume,
        trend: "+14%",
      },
      updatedAt: now,
    },
    {
      id: "marketing_kpis",
      title: "Marketing KPIs",
      status: "info",
      data: {
        costPerLead: analytics.metrics?.costPerLead,
        conversionRate: analytics.metrics?.conversionRate,
        topChannel: "paid search",
      },
      updatedAt: now,
    },
    {
      id: "recommendations",
      title: "Recommendations",
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
      status: budget.summary.includes("underperforming") ? "warning" : "healthy",
      data: {
        alerts: budget.evidence.filter((entry) =>
          entry.toLowerCase().includes("below"),
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
