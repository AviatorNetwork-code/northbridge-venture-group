export type NavItem = {
  id: string;
  label: string;
  href: string;
  description: string;
};

export const navigationItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/operations",
    description: "Operational overview and system health",
  },
  {
    id: "digital-workforce",
    label: "Digital Workforce",
    href: "/operations/workforce",
    description: "AI agents and automated team members",
  },
  {
    id: "workflows",
    label: "Workflows",
    href: "/operations/workflows",
    description: "Automated processes and task pipelines",
  },
  {
    id: "communications",
    label: "Communications",
    href: "/operations/communications",
    description: "Messages, alerts, and client touchpoints",
  },
  {
    id: "connectors",
    label: "Connectors",
    href: "/operations/connectors",
    description: "Integrations and external service links",
  },
  {
    id: "onboarding",
    label: "Onboarding",
    href: "/operations/onboarding",
    description: "Client setup and deployment progress",
  },
  {
    id: "analytics",
    label: "Analytics",
    href: "/operations/analytics",
    description: "Performance metrics and reporting",
  },
  {
    id: "billing",
    label: "Billing",
    href: "/operations/billing",
    description: "Subscriptions, usage, and invoices",
  },
  {
    id: "settings",
    label: "Settings",
    href: "/operations/settings",
    description: "Account, team, and platform configuration",
  },
];

export type DashboardMetric = {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
};

export const dashboardMetrics: DashboardMetric[] = [
  {
    id: "active-agents",
    label: "Active Agents",
    value: "12",
    change: "+2 this week",
    trend: "up",
  },
  {
    id: "workflows-running",
    label: "Workflows Running",
    value: "8",
    change: "3 scheduled",
    trend: "neutral",
  },
  {
    id: "messages-today",
    label: "Messages Today",
    value: "47",
    change: "+18% vs yesterday",
    trend: "up",
  },
  {
    id: "connector-health",
    label: "Connector Health",
    value: "96%",
    change: "All systems nominal",
    trend: "up",
  },
];

export type ActivityItem = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "workflow" | "agent" | "connector" | "alert" | "billing";
};

export const activityFeed: ActivityItem[] = [
  {
    id: "act-1",
    title: "Onboarding workflow completed",
    description: "Acme Corp deployment checklist finished by Agent Nova.",
    timestamp: "2 min ago",
    type: "workflow",
  },
  {
    id: "act-2",
    title: "Slack connector synced",
    description: "12 new messages routed to Communications queue.",
    timestamp: "14 min ago",
    type: "connector",
  },
  {
    id: "act-3",
    title: "Agent Atlas deployed",
    description: "Digital Workforce agent assigned to support tier.",
    timestamp: "38 min ago",
    type: "agent",
  },
  {
    id: "act-4",
    title: "Usage threshold alert",
    description: "Workflow executions at 82% of monthly allocation.",
    timestamp: "1 hr ago",
    type: "alert",
  },
  {
    id: "act-5",
    title: "Invoice generated",
    description: "March billing cycle prepared for review.",
    timestamp: "3 hr ago",
    type: "billing",
  },
  {
    id: "act-6",
    title: "Client intake form received",
    description: "New onboarding request from Horizon Labs.",
    timestamp: "5 hr ago",
    type: "workflow",
  },
];

export type QuickAction = {
  id: string;
  label: string;
  description: string;
};

export const quickActions: QuickAction[] = [
  {
    id: "deploy-agent",
    label: "Deploy Agent",
    description: "Add a new digital workforce member",
  },
  {
    id: "create-workflow",
    label: "Create Workflow",
    description: "Build an automated process",
  },
  {
    id: "connect-service",
    label: "Connect Service",
    description: "Link an external integration",
  },
  {
    id: "view-reports",
    label: "View Reports",
    description: "Open analytics dashboard",
  },
];
