import type {
  ActivityItem,
  AIRecommendation,
  AnalyticsSnapshot,
  AuditEntry,
  BusinessHealthSnapshot,
  CatCommandSuggestion,
  ConnectorApp,
  InboxMessage,
  OnboardingSnapshot,
  SystemHealthSnapshot,
  TeamNode,
  TimelineEvent,
  WorkItem,
  WorkforceMember,
} from "@/lib/neo/types";

export const mockWorkforceMembers: WorkforceMember[] = [
  {
    id: "wf-ops-01",
    name: "Ava Chen",
    role: "team_leader",
    title: "Operations Team Lead",
    teamId: "team-ops",
    status: "active",
    currentTask: "Review connector health alerts",
    performanceScore: 94,
    avatarInitials: "AC",
  },
  {
    id: "wf-ops-02",
    name: "Marcus Reid",
    role: "manager",
    title: "Workflow Manager",
    teamId: "team-ops",
    status: "busy",
    currentTask: "Approve onboarding stage 3",
    performanceScore: 88,
    avatarInitials: "MR",
  },
  {
    id: "wf-ops-03",
    name: "Sofia Nwosu",
    role: "specialist",
    title: "Connector Specialist",
    teamId: "team-integrations",
    status: "active",
    currentTask: "Sync HubSpot permissions",
    performanceScore: 91,
    avatarInitials: "SN",
  },
  {
    id: "wf-ops-04",
    name: "Eli Park",
    role: "specialist",
    title: "Communications Specialist",
    teamId: "team-comms",
    status: "idle",
    performanceScore: 86,
    avatarInitials: "EP",
  },
];

export const mockTeamHierarchy: TeamNode[] = [
  {
    id: "team-ops",
    name: "Operations",
    leadId: "wf-ops-01",
    memberIds: ["wf-ops-01", "wf-ops-02"],
    childTeamIds: ["team-integrations", "team-comms"],
  },
  {
    id: "team-integrations",
    name: "Integrations",
    leadId: "wf-ops-03",
    memberIds: ["wf-ops-03"],
    childTeamIds: [],
  },
  {
    id: "team-comms",
    name: "Communications",
    memberIds: ["wf-ops-04"],
    childTeamIds: [],
  },
];

export const mockConnectedApps: ConnectorApp[] = [
  {
    id: "hubspot",
    name: "HubSpot",
    category: "CRM",
    connected: true,
    health: "healthy",
    lastSyncAt: "2026-07-08T14:22:00Z",
    permissions: ["contacts.read", "deals.read", "workflows.write"],
  },
  {
    id: "slack",
    name: "Slack",
    category: "Collaboration",
    connected: true,
    health: "healthy",
    lastSyncAt: "2026-07-08T14:18:00Z",
    permissions: ["channels.read", "messages.write"],
  },
  {
    id: "google-workspace",
    name: "Google Workspace",
    category: "Productivity",
    connected: true,
    health: "degraded",
    lastSyncAt: "2026-07-08T13:05:00Z",
    permissions: ["calendar.read", "gmail.read"],
  },
];

export const mockAvailableApps: ConnectorApp[] = [
  {
    id: "salesforce",
    name: "Salesforce",
    category: "CRM",
    connected: false,
    health: "unknown",
    permissions: [],
  },
  {
    id: "whatsapp-business",
    name: "WhatsApp Business",
    category: "Messaging",
    connected: false,
    health: "unknown",
    permissions: [],
  },
  {
    id: "telegram",
    name: "Telegram",
    category: "Messaging",
    connected: false,
    health: "unknown",
    permissions: [],
  },
];

export const mockOnboarding: OnboardingSnapshot = {
  readinessScore: 72,
  stage: "Connector setup",
  checklist: [
    { id: "ob-1", label: "Complete business profile", completed: true, required: true },
    { id: "ob-2", label: "Assign operations team lead", completed: true, required: true },
    { id: "ob-3", label: "Connect primary CRM", completed: true, required: true },
    { id: "ob-4", label: "Enable messaging channels", completed: false, required: true },
    { id: "ob-5", label: "Launch first workflow", completed: false, required: true },
    { id: "ob-6", label: "Review AI recommendations", completed: false, required: false },
  ],
  recommendedConnectorIds: ["whatsapp-business", "salesforce"],
  recommendedSpecialistIds: ["wf-ops-03", "wf-ops-04"],
};

export const mockWorkItems: WorkItem[] = [
  {
    id: "wi-101",
    title: "Onboard Acme Corp messaging channels",
    status: "active",
    assigneeId: "wf-ops-04",
    priority: "high",
    updatedAt: "2026-07-08T14:10:00Z",
  },
  {
    id: "wi-102",
    title: "Renew HubSpot OAuth scopes",
    status: "waiting_approval",
    assigneeId: "wf-ops-03",
    priority: "medium",
    updatedAt: "2026-07-08T13:45:00Z",
  },
  {
    id: "wi-103",
    title: "Escalation: Google Workspace sync delay",
    status: "escalated",
    assigneeId: "wf-ops-01",
    priority: "urgent",
    updatedAt: "2026-07-08T12:30:00Z",
  },
];

export const mockTimeline: TimelineEvent[] = [
  {
    id: "tl-1",
    label: "Work item created",
    timestamp: "2026-07-08T09:00:00Z",
    actor: "System",
  },
  {
    id: "tl-2",
    label: "Assigned to Communications Specialist",
    timestamp: "2026-07-08T09:15:00Z",
    actor: "Ava Chen",
  },
  {
    id: "tl-3",
    label: "Connector health check passed",
    timestamp: "2026-07-08T11:00:00Z",
    actor: "NEO Connector Platform",
  },
];

export const mockAudit: AuditEntry[] = [
  {
    id: "au-1",
    action: "connector.permission.updated",
    actor: "Sofia Nwosu",
    timestamp: "2026-07-08T13:50:00Z",
    detail: "HubSpot workflows.write granted",
  },
  {
    id: "au-2",
    action: "workflow.approval.requested",
    actor: "Marcus Reid",
    timestamp: "2026-07-08T13:45:00Z",
    detail: "wi-102 awaiting manager approval",
  },
];

export const mockInbox: InboxMessage[] = [
  {
    id: "msg-1",
    channel: "email",
    from: "client@acmecorp.com",
    subject: "Onboarding timeline question",
    preview: "Can we enable WhatsApp this week?",
    receivedAt: "2026-07-08T14:05:00Z",
    unread: true,
  },
  {
    id: "msg-2",
    channel: "social",
    from: "Slack #ops-alerts",
    subject: "Connector degraded",
    preview: "Google Workspace sync latency elevated",
    receivedAt: "2026-07-08T13:10:00Z",
    unread: true,
  },
  {
    id: "msg-3",
    channel: "whatsapp",
    from: "+1 555-0142",
    subject: "Customer inquiry",
    preview: "Looking for workflow automation options",
    receivedAt: "2026-07-08T12:40:00Z",
    unread: false,
  },
];

export const mockRecommendations: AIRecommendation[] = [
  {
    id: "rec-1",
    title: "Enable WhatsApp Business connector",
    summary: "3 onboarding blockers relate to messaging channel gaps.",
    priority: "high",
    category: "onboarding",
  },
  {
    id: "rec-2",
    title: "Assign Connector Specialist to wi-103",
    summary: "Escalated Google Workspace sync needs integration expertise.",
    priority: "high",
    category: "workforce",
  },
  {
    id: "rec-3",
    title: "Automate CRM permission audits",
    summary: "Repeating approval pattern detected across 4 work items.",
    priority: "medium",
    category: "automation",
  },
];

export const mockActivity: ActivityItem[] = [
  {
    id: "act-1",
    label: "HubSpot sync completed",
    timestamp: "2026-07-08T14:22:00Z",
    type: "connector",
  },
  {
    id: "act-2",
    label: "Workflow approval requested",
    timestamp: "2026-07-08T13:45:00Z",
    type: "workflow",
  },
  {
    id: "act-3",
    label: "New inbox message (email)",
    timestamp: "2026-07-08T14:05:00Z",
    type: "messaging",
  },
];

export const mockBusinessHealth: BusinessHealthSnapshot = {
  score: 82,
  level: "healthy",
  summary: "Operations stable with one degraded connector.",
  connectedSystems: 3,
  activeWorkflows: 7,
};

export const mockAnalytics: AnalyticsSnapshot = {
  workforceUtilization: 78,
  connectorUptime: 96.4,
  automationsRun: 142,
  customerSatisfaction: 4.6,
  costSavingsUsd: 12400,
  hoursSaved: 186,
};

export const mockSystemHealth: SystemHealthSnapshot = {
  platform: "healthy",
  connectors: "degraded",
  workforce: "healthy",
  messaging: "healthy",
  lastCheckedAt: "2026-07-08T14:30:00Z",
};

export const mockCommandSuggestions: CatCommandSuggestion[] = [
  { id: "cmd-1", label: "Ask CAT", prompt: "What should I prioritize today?" },
  { id: "cmd-2", label: "Explain recommendations", prompt: "Explain the top AI recommendations" },
  { id: "cmd-3", label: "Create workflow", prompt: "Create a workflow for onboarding messaging" },
  { id: "cmd-4", label: "Hire specialist", prompt: "Recommend a specialist for connector escalations" },
  { id: "cmd-5", label: "Connect application", prompt: "Help me connect WhatsApp Business" },
  { id: "cmd-6", label: "System health", prompt: "Summarize platform and connector health" },
];
