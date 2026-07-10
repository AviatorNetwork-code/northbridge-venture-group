import type { DashboardResponse } from "@/types/dashboard";

export const sampleDashboardResponse: DashboardResponse = {
  schemaVersion: "1.0.0",
  apiVersion: "1.0.0",
  metadata: {
    organizationId: "org-acme",
    customerId: "customer-1",
    dashboardVersion: "1.0.0",
    apiVersion: "1.0.0",
    generatedAt: "2026-07-09T23:00:00.000Z",
    availableTeams: ["team-marketing", "team-sales"],
    activeSections: ["organization_overview", "marketing", "sales", "cross_team"],
    missingSections: ["customer_service", "financial"],
    organizationPublicName: "Acme Co",
  },
  sections: [
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
          payload: { activeTeamCount: 2 },
          updatedAt: "2026-07-09T23:00:00.000Z",
        },
      ],
    },
    {
      id: "marketing",
      title: "Marketing",
      available: true,
      cards: [
        {
          id: "team-marketing-active_campaigns",
          title: "Campaigns: Active Campaigns",
          sectionId: "marketing",
          sourceTeamId: "team-marketing",
          status: "healthy",
          payload: { count: 2 },
          updatedAt: "2026-07-09T23:00:00.000Z",
        },
      ],
    },
    {
      id: "sales",
      title: "Sales",
      available: true,
      cards: [],
    },
    {
      id: "cross_team",
      title: "Cross-Team",
      available: true,
      cards: [],
    },
  ],
  alerts: [
    {
      id: "team-sales-alert-1",
      severity: "warning",
      sourceTeamId: "team-sales",
      category: "follow_up",
      message: "Pipeline converting but follow-up bottleneck detected.",
      timestamp: "2026-07-09T23:00:00.000Z",
    },
  ],
  recommendations: [
    {
      id: "m-rec-1",
      recommendation: "Increase campaign spend on high-performing channels.",
      sourceTeamId: "team-marketing",
      confidence: "high",
      approvalRequired: true,
      evidenceAvailable: true,
      category: "budget_reallocation",
      priority: "high",
    },
  ],
  freshness: [
    { teamId: "team-marketing", status: "fresh", generatedAt: "2026-07-09T23:00:00.000Z" },
    { teamId: "team-sales", status: "stale", generatedAt: "2026-07-07T23:00:00.000Z" },
  ],
  confidence: {
    organizationLevel: "high",
    byTeam: [
      { teamId: "team-marketing", level: "high" },
      { teamId: "team-sales", level: "high" },
    ],
  },
  supportedActions: [
    {
      id: "refresh-dashboard",
      type: "refresh_dashboard",
      label: "Refresh dashboard",
    },
    {
      id: "approve-m-rec-1",
      type: "approve_recommendation",
      label: "Approve recommendation",
      sourceTeamId: "team-marketing",
      targetId: "m-rec-1",
      requiresApproval: true,
    },
  ],
  teamSummaries: [
    {
      teamId: "team-marketing",
      teamName: "Marketing",
      status: "healthy",
      summary: "Lead volume is increasing from campaigns.",
      pendingCount: 1,
      escalationCount: 0,
      reportFreshness: "fresh",
    },
  ],
  offlineSync: { enabled: false, reserved: true },
  pagination: { enabled: false, reserved: true },
  widgetRefresh: { enabled: false, reserved: true },
  deltaUpdates: { enabled: false, reserved: true },
  liveSubscriptions: { enabled: false, reserved: true },
};
