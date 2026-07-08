import type {
  AnalyticsSnapshot,
  CommunicationsSnapshot,
  ConnectorCenterSnapshot,
  ExecutiveDashboard,
  OnboardingSnapshot,
  WorkforceSnapshot,
  WorkflowCenterSnapshot,
} from "../../types";
import type { ActivityItem } from "../../types/notifications";

const now = () => new Date().toISOString();

export const initialDashboard: ExecutiveDashboard = {
  kpis: [
    { id: "tasks", label: "Tasks Today", value: 142, trend: 12, format: "number" },
    { id: "automation", label: "Automation Rate", value: 68, unit: "%", trend: 4, format: "percent" },
    { id: "response", label: "Avg Response", value: 4.2, unit: "min", trend: -8, format: "duration" },
    { id: "satisfaction", label: "CSAT", value: 4.7, unit: "/5", trend: 2, format: "number" },
  ],
  activeSpecialists: 8,
  activeManagers: 3,
  runningWorkflows: 12,
  waitingApprovals: 4,
  connectedIntegrations: 9,
  customerConversations: 23,
  revenueMtd: 284500,
  revenueTrend: 18,
  systemHealth: "healthy",
  lastUpdated: now(),
};

export const initialWorkforce: WorkforceSnapshot = {
  members: [
    { id: "sp-1", name: "Aria Chen", role: "specialist", department: "Customer Service", status: "working", currentAssignment: "Resolve billing dispute #4821", queueSize: 5, tasksCompleted24h: 18, avgResponseMinutes: 3.1, utilizationPercent: 87, managerId: "mg-1" },
    { id: "sp-2", name: "Marcus Webb", role: "specialist", department: "Finance", status: "waiting", currentAssignment: "Awaiting QuickBooks sync", queueSize: 3, tasksCompleted24h: 11, avgResponseMinutes: 6.4, utilizationPercent: 72, managerId: "mg-2" },
    { id: "sp-3", name: "Sofia Reyes", role: "specialist", department: "Marketing", status: "working", currentAssignment: "Campaign performance report", queueSize: 2, tasksCompleted24h: 14, avgResponseMinutes: 5.2, utilizationPercent: 91, managerId: "mg-3" },
    { id: "sp-4", name: "James Okonkwo", role: "specialist", department: "Operations", status: "idle", queueSize: 0, tasksCompleted24h: 9, avgResponseMinutes: 4.8, utilizationPercent: 45, managerId: "mg-1" },
    { id: "sp-5", name: "Elena Park", role: "specialist", department: "Customer Service", status: "escalated", currentAssignment: "VIP refund escalation", queueSize: 7, tasksCompleted24h: 16, avgResponseMinutes: 2.9, utilizationPercent: 94, managerId: "mg-1" },
    { id: "sp-6", name: "David Kim", role: "specialist", department: "Sales", status: "working", currentAssignment: "Lead qualification batch", queueSize: 4, tasksCompleted24h: 22, avgResponseMinutes: 3.5, utilizationPercent: 88, managerId: "mg-3" },
    { id: "sp-7", name: "Nina Patel", role: "specialist", department: "Finance", status: "offline", queueSize: 0, tasksCompleted24h: 0, avgResponseMinutes: 0, utilizationPercent: 0, managerId: "mg-2" },
    { id: "sp-8", name: "Omar Hassan", role: "specialist", department: "Operations", status: "working", currentAssignment: "Inventory reconciliation", queueSize: 1, tasksCompleted24h: 7, avgResponseMinutes: 7.1, utilizationPercent: 65, managerId: "mg-1" },
    { id: "mg-1", name: "Rachel Torres", role: "manager", department: "Customer Service", status: "working", currentAssignment: "Reviewing escalations", queueSize: 2, tasksCompleted24h: 6, avgResponseMinutes: 8.2, utilizationPercent: 78 },
    { id: "mg-2", name: "Victor Lang", role: "manager", department: "Finance", status: "waiting", currentAssignment: "Approval queue review", queueSize: 4, tasksCompleted24h: 4, avgResponseMinutes: 12.1, utilizationPercent: 82 },
    { id: "mg-3", name: "Priya Sharma", role: "manager", department: "Growth", status: "working", currentAssignment: "Campaign oversight", queueSize: 1, tasksCompleted24h: 5, avgResponseMinutes: 9.4, utilizationPercent: 71 },
  ],
  orgChart: [
    { id: "ceo", name: "Executive AI", role: "CEO Agent", department: "Leadership", status: "working", children: ["mg-1", "mg-2", "mg-3"] },
    { id: "mg-1", name: "Rachel Torres", role: "Manager", department: "Customer Service", status: "working", children: ["sp-1", "sp-4", "sp-5", "sp-8"] },
    { id: "mg-2", name: "Victor Lang", role: "Manager", department: "Finance", status: "waiting", children: ["sp-2", "sp-7"] },
    { id: "mg-3", name: "Priya Sharma", role: "Manager", department: "Growth", status: "working", children: ["sp-3", "sp-6"] },
  ],
  lastUpdated: now(),
};

export const initialWorkflows: WorkflowCenterSnapshot = {
  workflows: [
    {
      id: "wf-1", name: "Customer Onboarding", status: "running", owner: "Aria Chen", startedAt: new Date(Date.now() - 3600000).toISOString(), progress: 65,
      tasks: [
        { id: "t-1", title: "Verify business profile", assignee: "Aria Chen", status: "completed", completedAt: new Date(Date.now() - 3000000).toISOString() },
        { id: "t-2", title: "Connect payment gateway", assignee: "Marcus Webb", status: "running", startedAt: new Date(Date.now() - 1800000).toISOString() },
        { id: "t-3", title: "Launch welcome sequence", assignee: "Sofia Reyes", status: "pending" },
      ],
      approvals: [{ id: "ap-1", title: "Payment terms approval", requestedBy: "Marcus Webb", waitingSince: new Date(Date.now() - 900000).toISOString(), priority: "high" }],
      escalations: [],
      history: [
        { id: "ev-1", type: "task_started", message: "Payment gateway connection started", timestamp: new Date(Date.now() - 1800000).toISOString(), workflowId: "wf-1" },
        { id: "ev-2", type: "approval_requested", message: "Payment terms require approval", timestamp: new Date(Date.now() - 900000).toISOString(), workflowId: "wf-1" },
      ],
    },
    {
      id: "wf-2", name: "Monthly Close", status: "waiting_approval", owner: "Victor Lang", startedAt: new Date(Date.now() - 7200000).toISOString(), progress: 80,
      tasks: [
        { id: "t-4", title: "Reconcile accounts", assignee: "Marcus Webb", status: "completed", completedAt: new Date(Date.now() - 5400000).toISOString() },
        { id: "t-5", title: "Generate P&L report", assignee: "Marcus Webb", status: "completed", completedAt: new Date(Date.now() - 3600000).toISOString() },
        { id: "t-6", title: "Executive sign-off", assignee: "Victor Lang", status: "blocked" },
      ],
      approvals: [{ id: "ap-2", title: "P&L executive approval", requestedBy: "Victor Lang", waitingSince: new Date(Date.now() - 2700000).toISOString(), priority: "medium" }],
      escalations: [],
      history: [
        { id: "ev-3", type: "task_completed", message: "P&L report generated", timestamp: new Date(Date.now() - 3600000).toISOString(), workflowId: "wf-2" },
      ],
    },
    {
      id: "wf-3", name: "Support Escalation", status: "escalated", owner: "Elena Park", startedAt: new Date(Date.now() - 1200000).toISOString(), progress: 40,
      tasks: [
        { id: "t-7", title: "Investigate refund request", assignee: "Elena Park", status: "running", startedAt: new Date(Date.now() - 600000).toISOString() },
      ],
      approvals: [],
      escalations: [{ id: "es-1", title: "VIP refund over limit", reason: "Refund exceeds specialist authority", escalatedAt: new Date(Date.now() - 300000).toISOString(), assignee: "Rachel Torres" }],
      history: [
        { id: "ev-4", type: "escalated", message: "Escalated to Customer Service manager", timestamp: new Date(Date.now() - 300000).toISOString(), workflowId: "wf-3" },
      ],
    },
  ],
  eventStream: [
    { id: "ev-4", type: "escalated", message: "Support Escalation escalated to manager", timestamp: new Date(Date.now() - 300000).toISOString(), workflowId: "wf-3" },
    { id: "ev-2", type: "approval_requested", message: "Payment terms approval requested", timestamp: new Date(Date.now() - 900000).toISOString(), workflowId: "wf-1" },
    { id: "ev-1", type: "task_started", message: "Customer Onboarding: payment gateway started", timestamp: new Date(Date.now() - 1800000).toISOString(), workflowId: "wf-1" },
  ],
  lastUpdated: now(),
};

export const initialCommunications: CommunicationsSnapshot = {
  conversations: [
    { id: "cv-1", channel: "whatsapp", subject: "Order #9281 delayed", preview: "Hi, my order hasn't arrived yet...", assignedSpecialist: "Aria Chen", status: "open", sentiment: "negative", sla: "at_risk", slaMinutesRemaining: 12, linkedWorkflowId: "wf-3", linkedWorkflowName: "Support Escalation", customer: { id: "cu-1", name: "Jordan Blake", phone: "+1 555-0142", tier: "growth", lifetimeValue: 12400 }, lastMessageAt: new Date(Date.now() - 180000).toISOString(), unreadCount: 2 },
    { id: "cv-2", channel: "email", subject: "Partnership inquiry", preview: "We're interested in integrating...", assignedSpecialist: "David Kim", status: "pending", sentiment: "positive", sla: "on_track", slaMinutesRemaining: 45, customer: { id: "cu-2", name: "TechFlow Inc", email: "ops@techflow.io", company: "TechFlow Inc", tier: "enterprise", lifetimeValue: 89000 }, lastMessageAt: new Date(Date.now() - 600000).toISOString(), unreadCount: 1 },
    { id: "cv-3", channel: "web_chat", subject: "Pricing question", preview: "What's included in the growth plan?", assignedSpecialist: "James Okonkwo", status: "open", sentiment: "neutral", sla: "on_track", slaMinutesRemaining: 28, customer: { id: "cu-3", name: "Sam Rivera", email: "sam@startup.co", tier: "starter", lifetimeValue: 0 }, lastMessageAt: new Date(Date.now() - 120000).toISOString(), unreadCount: 1 },
    { id: "cv-4", channel: "instagram", subject: "DM: Product demo request", preview: "Can I get a demo this week?", assignedSpecialist: "Sofia Reyes", status: "open", sentiment: "positive", sla: "on_track", slaMinutesRemaining: 60, customer: { id: "cu-4", name: "Maya Collins", tier: "starter", lifetimeValue: 2400 }, lastMessageAt: new Date(Date.now() - 900000).toISOString(), unreadCount: 0 },
    { id: "cv-5", channel: "sms", subject: "Appointment confirmation", preview: "Confirming Tuesday 2pm call", assignedSpecialist: "David Kim", status: "resolved", sentiment: "neutral", sla: "on_track", slaMinutesRemaining: 0, customer: { id: "cu-5", name: "Alex Morgan", phone: "+1 555-0198", tier: "growth", lifetimeValue: 15600 }, lastMessageAt: new Date(Date.now() - 3600000).toISOString(), unreadCount: 0 },
    { id: "cv-6", channel: "telegram", subject: "API integration help", preview: "Getting 401 on webhook...", assignedSpecialist: "Omar Hassan", status: "escalated", sentiment: "urgent", sla: "breached", slaMinutesRemaining: -5, linkedWorkflowId: "wf-1", linkedWorkflowName: "Customer Onboarding", customer: { id: "cu-6", name: "DevStack Labs", email: "eng@devstack.dev", company: "DevStack Labs", tier: "enterprise", lifetimeValue: 142000 }, lastMessageAt: new Date(Date.now() - 60000).toISOString(), unreadCount: 3 },
    { id: "cv-7", channel: "messenger", subject: "Refund status update", preview: "Any update on my refund?", assignedSpecialist: "Elena Park", status: "waiting", sentiment: "negative", sla: "at_risk", slaMinutesRemaining: 8, linkedWorkflowId: "wf-3", linkedWorkflowName: "Support Escalation", customer: { id: "cu-7", name: "Chris Nguyen", tier: "growth", lifetimeValue: 8200 }, lastMessageAt: new Date(Date.now() - 240000).toISOString(), unreadCount: 1 },
    { id: "cv-8", channel: "tiktok", subject: "Comment: How to sign up?", preview: "Saw your ad, how do I start?", assignedSpecialist: "Sofia Reyes", status: "open", sentiment: "positive", sla: "on_track", slaMinutesRemaining: 90, customer: { id: "cu-8", name: "Taylor Brooks", tier: "starter", lifetimeValue: 0 }, lastMessageAt: new Date(Date.now() - 1500000).toISOString(), unreadCount: 1 },
  ],
  channelCounts: { whatsapp: 4, email: 6, sms: 2, telegram: 1, messenger: 3, instagram: 2, tiktok: 1, web_chat: 4 },
  lastUpdated: now(),
};

export const initialConnectors: ConnectorCenterSnapshot = {
  connectors: [
    { id: "cn-1", name: "QuickBooks", category: "Finance", status: "authorization_required", oauthConnected: false, permissions: ["read_transactions", "write_invoices"], usageToday: 0, usageLimit: 500, healthScore: 45, refreshTokenAgeDays: 92, errorMessage: "OAuth token expired" },
    { id: "cn-2", name: "Stripe", category: "Payments", status: "healthy", oauthConnected: true, lastSyncAt: new Date(Date.now() - 120000).toISOString(), permissions: ["read_payments", "manage_subscriptions"], usageToday: 234, usageLimit: 1000, healthScore: 98, refreshTokenAgeDays: 12 },
    { id: "cn-3", name: "HubSpot", category: "CRM", status: "connected", oauthConnected: true, lastSyncAt: new Date(Date.now() - 300000).toISOString(), permissions: ["read_contacts", "write_deals"], usageToday: 156, usageLimit: 800, healthScore: 94, refreshTokenAgeDays: 28 },
    { id: "cn-4", name: "Slack", category: "Communication", status: "syncing", oauthConnected: true, lastSyncAt: new Date(Date.now() - 60000).toISOString(), permissions: ["read_channels", "post_messages"], usageToday: 89, usageLimit: 500, healthScore: 91, refreshTokenAgeDays: 45 },
    { id: "cn-5", name: "Shopify", category: "Commerce", status: "connected", oauthConnected: true, lastSyncAt: new Date(Date.now() - 480000).toISOString(), permissions: ["read_orders", "manage_inventory"], usageToday: 312, usageLimit: 600, healthScore: 96, refreshTokenAgeDays: 18 },
    { id: "cn-6", name: "Google Workspace", category: "Productivity", status: "healthy", oauthConnected: true, lastSyncAt: new Date(Date.now() - 900000).toISOString(), permissions: ["read_calendar", "send_email"], usageToday: 67, usageLimit: 400, healthScore: 99, refreshTokenAgeDays: 8 },
    { id: "cn-7", name: "Meta Business", category: "Social", status: "error", oauthConnected: true, lastSyncAt: new Date(Date.now() - 86400000).toISOString(), permissions: ["read_pages", "manage_ads"], usageToday: 12, usageLimit: 300, healthScore: 32, refreshTokenAgeDays: 67, errorMessage: "API rate limit exceeded" },
    { id: "cn-8", name: "Twilio", category: "Communication", status: "connected", oauthConnected: true, lastSyncAt: new Date(Date.now() - 200000).toISOString(), permissions: ["send_sms", "read_logs"], usageToday: 445, usageLimit: 1000, healthScore: 97, refreshTokenAgeDays: 22 },
    { id: "cn-9", name: "Xero", category: "Finance", status: "connecting", oauthConnected: false, permissions: ["read_accounts"], usageToday: 0, usageLimit: 400, healthScore: 60, refreshTokenAgeDays: 0 },
  ],
  lastUpdated: now(),
};

export const initialOnboarding: OnboardingSnapshot = {
  readinessPercent: 72,
  discoveryComplete: true,
  discoveryProgress: 100,
  launchReadiness: 58,
  estimatedSetupMinutes: 45,
  requirements: [
    { id: "r-1", label: "Business profile verified", completed: true, category: "discovery" },
    { id: "r-2", label: "Industry classification", completed: true, category: "discovery" },
    { id: "r-3", label: "Payment gateway connected", completed: false, category: "connector" },
    { id: "r-4", label: "CRM integration", completed: true, category: "connector" },
    { id: "r-5", label: "Customer Service specialist hired", completed: true, category: "workforce" },
    { id: "r-6", label: "Finance specialist hired", completed: false, category: "workforce" },
    { id: "r-7", label: "Welcome workflow configured", completed: false, category: "launch" },
    { id: "r-8", label: "SLA policies defined", completed: true, category: "launch" },
  ],
  connectorRecommendations: [
    { id: "rec-c-1", type: "connector", title: "Connect QuickBooks", description: "Unlock automated invoicing and monthly close workflows", impact: "high" },
    { id: "rec-c-2", type: "connector", title: "Connect Shopify", description: "Already connected — enable inventory sync for real-time updates", impact: "medium" },
  ],
  workforceRecommendations: [
    { id: "rec-w-1", type: "specialist", title: "Hire Finance Specialist", description: "Required for monthly close and payment reconciliation", impact: "high" },
    { id: "rec-w-2", type: "specialist", title: "Add Marketing Specialist", description: "Boost campaign automation and social channel coverage", impact: "medium" },
  ],
  lastUpdated: now(),
};

export const initialAnalytics: AnalyticsSnapshot = {
  workflowsPerDay: [
    { label: "Mon", value: 18 }, { label: "Tue", value: 22 }, { label: "Wed", value: 19 },
    { label: "Thu", value: 25 }, { label: "Fri", value: 28 }, { label: "Sat", value: 12 }, { label: "Sun", value: 8 },
  ],
  automationPercent: 68,
  avgResponseTimeMinutes: 4.2,
  tasksCompleted: [
    { label: "Mon", value: 89 }, { label: "Tue", value: 102 }, { label: "Wed", value: 95 },
    { label: "Thu", value: 118 }, { label: "Fri", value: 142 }, { label: "Sat", value: 45 }, { label: "Sun", value: 32 },
  ],
  specialistUtilization: [
    { label: "CS", value: 87 }, { label: "Finance", value: 72 }, { label: "Marketing", value: 91 },
    { label: "Sales", value: 88 }, { label: "Ops", value: 55 },
  ],
  connectorHealth: [
    { label: "Stripe", value: 98 }, { label: "HubSpot", value: 94 }, { label: "Shopify", value: 96 },
    { label: "QuickBooks", value: 45 }, { label: "Meta", value: 32 },
  ],
  conversationVolume: [
    { label: "Mon", value: 34 }, { label: "Tue", value: 41 }, { label: "Wed", value: 38 },
    { label: "Thu", value: 45 }, { label: "Fri", value: 52 }, { label: "Sat", value: 18 }, { label: "Sun", value: 12 },
  ],
  customerSatisfaction: 4.7,
  lastUpdated: now(),
};

export const initialActivity: ActivityItem[] = [
  { id: "act-1", message: "Support Escalation workflow escalated to Rachel Torres", domain: "workflows", severity: "warning", timestamp: new Date(Date.now() - 300000).toISOString() },
  { id: "act-2", message: "QuickBooks connector requires re-authorization", domain: "connectors", severity: "error", timestamp: new Date(Date.now() - 600000).toISOString() },
  { id: "act-3", message: "Aria Chen completed 3 tasks in Customer Service", domain: "workforce", severity: "success", timestamp: new Date(Date.now() - 900000).toISOString() },
  { id: "act-4", message: "New enterprise lead from TechFlow Inc", domain: "communications", severity: "info", timestamp: new Date(Date.now() - 1200000).toISOString() },
];

export function cloneState<T>(state: T): T {
  return JSON.parse(JSON.stringify(state)) as T;
}
