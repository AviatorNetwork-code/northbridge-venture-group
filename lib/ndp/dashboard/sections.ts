import { buildCustomerServiceDashboardModel } from "@/lib/ndp/teams/customer-service";
import { buildFinancialDashboardModel } from "@/lib/ndp/teams/financial";
import { buildMarketingDashboardModel } from "@/lib/ndp/teams/marketing";
import { buildSalesDashboardModel } from "@/lib/ndp/teams/sales";
import type { MultiTeamOperationsView, NormalizedTeamReport } from "@/lib/ndp/operations-view";
import type { DashboardCard, DashboardSection, DashboardSectionId } from "./types.js";

const TEAM_CARD_GROUPS: Record<
  string,
  Array<{ groupTitle: string; cardIds: string[] }>
> = {
  "team-marketing": [
    { groupTitle: "Campaigns", cardIds: ["active_campaigns", "campaign_status"] },
    { groupTitle: "Content", cardIds: ["scheduled_content", "content_backlog"] },
    { groupTitle: "Analytics", cardIds: ["marketing_kpis", "lead_volume"] },
    { groupTitle: "Budget", cardIds: ["budget_utilization"] },
    { groupTitle: "Recommendations", cardIds: ["recommendations"] },
  ],
  "team-sales": [
    { groupTitle: "Leads", cardIds: ["new_leads", "qualified_leads"] },
    { groupTitle: "Pipeline", cardIds: ["pipeline_status", "proposals_sent"] },
    { groupTitle: "Follow-ups", cardIds: ["follow_ups_due"] },
    { groupTitle: "Conversion", cardIds: ["conversion_rate"] },
    { groupTitle: "Recommendations", cardIds: ["sales_recommendations"] },
  ],
  "team-customer-service": [
    { groupTitle: "Open Requests", cardIds: ["open_inquiries", "response_time"] },
    { groupTitle: "Appointments", cardIds: ["appointments_requested"] },
    { groupTitle: "Reminders", cardIds: ["reminders_due"] },
    { groupTitle: "Satisfaction", cardIds: ["customer_satisfaction"] },
    { groupTitle: "Recommendations", cardIds: ["recommendations"] },
  ],
  "team-financial": [
    { groupTitle: "Revenue", cardIds: ["revenue_snapshot"] },
    { groupTitle: "Billing", cardIds: ["billing_activity", "outstanding_invoices"] },
    { groupTitle: "Receivables", cardIds: ["accounts_receivable"] },
    { groupTitle: "Reports", cardIds: ["cash_flow_signals"] },
    { groupTitle: "Recommendations", cardIds: ["financial_recommendations"] },
  ],
};

const SECTION_BY_TEAM: Record<string, DashboardSectionId> = {
  "team-marketing": "marketing",
  "team-sales": "sales",
  "team-customer-service": "customer_service",
  "team-financial": "financial",
};

function buildTeamDashboard(teamId: string, now: string) {
  switch (teamId) {
    case "team-marketing":
      return buildMarketingDashboardModel({ teamId, now });
    case "team-sales":
      return buildSalesDashboardModel({ teamId, now });
    case "team-customer-service":
      return buildCustomerServiceDashboardModel({ teamId, now });
    case "team-financial":
      return buildFinancialDashboardModel({ teamId, now });
    default:
      return null;
  }
}

export function buildTeamSection(
  teamId: string,
  sectionId: DashboardSectionId,
  title: string,
  now: string,
): DashboardSection | null {
  const dashboard = buildTeamDashboard(teamId, now);
  if (!dashboard) return null;

  const groups = TEAM_CARD_GROUPS[teamId] ?? [];
  const cards: DashboardCard[] = [];

  for (const group of groups) {
    for (const cardId of group.cardIds) {
      const card = dashboard.cards.find((entry) => entry.id === cardId);
      if (!card) continue;
      cards.push({
        id: `${teamId}-${card.id}`,
        title: `${group.groupTitle}: ${card.title}`,
        sectionId,
        sourceTeamId: teamId,
        status: card.status,
        data: { ...card.data, group: group.groupTitle },
        updatedAt: card.updatedAt,
      });
    }
  }

  return {
    id: sectionId,
    title,
    available: true,
    cards,
  };
}

export function buildCrossTeamSection(
  operationsView: MultiTeamOperationsView,
  now: string,
): DashboardSection | null {
  if (operationsView.hiredTeamIds.length <= 1) {
    return null;
  }

  const cards: DashboardCard[] = [
    {
      id: "cross-team-opportunities",
      title: "Cross-Team Opportunities",
      sectionId: "cross_team",
      status: "info",
      data: { opportunities: operationsView.snapshot.crossTeamOpportunities },
      updatedAt: now,
    },
    {
      id: "cross-team-risks",
      title: "Risks",
      sectionId: "cross_team",
      status: operationsView.crossTeamSignals.some((entry) => entry.severity === "critical")
        ? "critical"
        : "warning",
      data: { signals: operationsView.crossTeamSignals },
      updatedAt: now,
    },
    {
      id: "cross-team-pending-decisions",
      title: "Pending Decisions",
      sectionId: "cross_team",
      status: "warning",
      data: {
        pendingApprovals: operationsView.snapshot.pendingApprovals,
        signalsRequiringReview: operationsView.crossTeamSignals.filter(
          (entry) => entry.requiresCustomerReview,
        ),
      },
      updatedAt: now,
    },
    {
      id: "cross-team-dependencies",
      title: "Dependencies",
      sectionId: "cross_team",
      status: "info",
      data: { dependencies: operationsView.snapshot.crossTeamDependencies },
      updatedAt: now,
    },
    {
      id: "cross-team-recommendation-conflicts",
      title: "Recommendation Conflicts",
      sectionId: "cross_team",
      status:
        operationsView.snapshot.conflictingRecommendations.length > 0 ? "warning" : "healthy",
      data: { conflicts: operationsView.snapshot.conflictingRecommendations },
      updatedAt: now,
    },
  ];

  return {
    id: "cross_team",
    title: "Cross-Team",
    available: true,
    cards,
  };
}

export function buildAlwaysAvailableSections(input: {
  activeTeamIds: string[];
  reports: NormalizedTeamReport[];
  operationsView: MultiTeamOperationsView;
  organizationPublicName?: string;
  now: string;
}): DashboardSection[] {
  const recentActivity = input.reports.flatMap((report) =>
    report.workCompleted.map((entry) => ({
      teamId: report.teamId,
      activity: entry,
      generatedAt: report.generatedAt,
    })),
  );

  return [
    {
      id: "organization_overview",
      title: "Organization Overview",
      available: true,
      cards: [
        {
          id: "org-overview",
          title: "Organization Overview",
          sectionId: "organization_overview",
          status: "info",
          data: {
            organizationPublicName: input.organizationPublicName,
            activeTeamCount: input.activeTeamIds.length,
            openEscalations: input.operationsView.snapshot.openEscalations.length,
            businessWideAlerts: input.operationsView.snapshot.businessWideAlerts,
          },
          updatedAt: input.now,
        },
      ],
    },
    {
      id: "active_digital_teams",
      title: "Active Digital Teams",
      available: true,
      cards: input.operationsView.snapshot.teamHealthSummaries.map((team) => ({
        id: `active-team-${team.teamId}`,
        title: team.teamName,
        sectionId: "active_digital_teams",
        sourceTeamId: team.teamId,
        status: team.status === "unknown" ? "info" : team.status,
        data: {
          summary: team.summary,
          pendingCount: team.pendingCount,
          escalationCount: team.escalationCount,
          reportFreshness: team.reportFreshness,
        },
        updatedAt: input.now,
      })),
    },
    {
      id: "recent_activity",
      title: "Recent Activity",
      available: true,
      cards: recentActivity.map((entry, index) => ({
        id: `recent-activity-${index + 1}`,
        title: "Recent Activity",
        sectionId: "recent_activity",
        sourceTeamId: entry.teamId,
        status: "info" as const,
        data: { activity: entry.activity },
        updatedAt: entry.generatedAt,
      })),
    },
  ];
}

export function buildFuturePlaceholderSections(): DashboardSection[] {
  return [
    { id: "manager", title: "Manager", available: false, placeholder: true, cards: [] },
    { id: "director", title: "Director", available: false, placeholder: true, cards: [] },
    { id: "executive", title: "Executive", available: false, placeholder: true, cards: [] },
    { id: "ai_insights", title: "AI Insights", available: false, placeholder: true, cards: [] },
  ];
}

export const TEAM_SECTION_TITLES: Record<string, string> = {
  "team-marketing": "Marketing",
  "team-sales": "Sales",
  "team-customer-service": "Customer Service",
  "team-financial": "Financial",
};

export function resolveTeamSection(teamId: string): DashboardSectionId | undefined {
  return SECTION_BY_TEAM[teamId];
}
