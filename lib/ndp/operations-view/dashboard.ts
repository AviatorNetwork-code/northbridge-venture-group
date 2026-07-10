import type {
  CrossTeamSignal,
  MultiTeamOperationsView,
  NormalizedTeamRecommendation,
  NormalizedTeamReport,
  OperationsDashboardModel,
  OperationsSnapshot,
  RecommendationConflict,
} from "./types.js";

const DEFAULT_TEAM_NAMES: Record<string, string> = {
  "team-marketing": "Marketing Team",
  "team-sales": "Sales Team",
  "team-customer-service": "Customer Service Team",
  "team-financial": "Financial Team",
};

export function buildOperationsDashboardModel(input: {
  organizationId: string;
  hiredTeamIds: string[];
  snapshot: OperationsSnapshot;
  reports: NormalizedTeamReport[];
  aggregatedRecommendations: NormalizedTeamRecommendation[];
  crossTeamSignals: CrossTeamSignal[];
  conflicts: RecommendationConflict[];
  now?: string;
}): OperationsDashboardModel {
  const now = input.now ?? new Date().toISOString();

  return {
    organizationId: input.organizationId,
    hiredTeamIds: input.hiredTeamIds,
    generatedAt: now,
    sections: [
      {
        id: "business_overview",
        title: "Business Overview",
        data: {
          activeTeams: input.snapshot.activeTeamIds.length,
          openEscalations: input.snapshot.openEscalations.length,
          businessWideAlerts: input.snapshot.businessWideAlerts,
        },
      },
      {
        id: "team_performance",
        title: "Team Performance",
        data: {
          teams: input.snapshot.teamHealthSummaries,
        },
      },
      {
        id: "priorities",
        title: "Priorities",
        data: {
          pendingApprovals: input.snapshot.pendingApprovals,
        },
      },
      {
        id: "pending_decisions",
        title: "Pending Decisions",
        data: {
          conflicts: input.conflicts,
          signalsRequiringReview: input.crossTeamSignals.filter(
            (entry) => entry.requiresCustomerReview,
          ),
        },
      },
      {
        id: "cross_team_risks",
        title: "Cross-Team Risks",
        data: {
          signals: input.crossTeamSignals,
          dependencies: input.snapshot.crossTeamDependencies,
        },
      },
      {
        id: "cross_team_opportunities",
        title: "Cross-Team Opportunities",
        data: {
          opportunities: input.snapshot.crossTeamOpportunities,
        },
      },
      {
        id: "recommendations",
        title: "Recommendations",
        data: {
          items: input.aggregatedRecommendations,
        },
      },
      {
        id: "alerts",
        title: "Alerts",
        data: {
          alerts: input.snapshot.businessWideAlerts,
        },
      },
      {
        id: "report_freshness",
        title: "Report Freshness",
        data: {
          reports: input.snapshot.reportFreshness,
        },
      },
    ],
  };
}

export function resolveTeamDisplayName(teamId: string, teamNames?: Record<string, string>): string {
  return teamNames?.[teamId] ?? DEFAULT_TEAM_NAMES[teamId] ?? teamId;
}

export function extractDashboardSummary(view: MultiTeamOperationsView): Record<string, unknown> {
  return {
    organizationId: view.organizationId,
    hiredTeamIds: view.hiredTeamIds,
    activeTeams: view.snapshot.activeTeamIds,
    crossTeamSignalCount: view.crossTeamSignals.length,
    conflictCount: view.snapshot.conflictingRecommendations.length,
    recommendationCount: view.aggregatedRecommendations.length,
    managerEvidenceStatus: view.managerEvidence.status,
  };
}
