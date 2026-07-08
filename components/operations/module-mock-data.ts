export const workforceSpecialists = [
  {
    id: "sp-1",
    name: "Agent Nova",
    role: "Client Onboarding Specialist",
    status: "Active",
    workload: 72,
    tasks: 14,
    team: "Client Success",
  },
  {
    id: "sp-2",
    name: "Agent Atlas",
    role: "Support Specialist",
    status: "Active",
    workload: 58,
    tasks: 9,
    team: "Support",
  },
  {
    id: "sp-3",
    name: "Agent Lyra",
    role: "Billing Specialist",
    status: "Idle",
    workload: 24,
    tasks: 3,
    team: "Finance Ops",
  },
  {
    id: "sp-4",
    name: "Agent Orion",
    role: "Workflow Specialist",
    status: "Active",
    workload: 81,
    tasks: 18,
    team: "Automation",
  },
];

export const workforceTeams = [
  { id: "team-1", name: "Client Success", members: 4, activeTasks: 22, health: "Healthy" },
  { id: "team-2", name: "Support", members: 3, activeTasks: 15, health: "Healthy" },
  { id: "team-3", name: "Finance Ops", members: 2, activeTasks: 7, health: "Stable" },
  { id: "team-4", name: "Automation", members: 3, activeTasks: 19, health: "At Capacity" },
];

export const workforceManagers = [
  {
    id: "mgr-1",
    name: "Manager Echo",
    scope: "Client Success + Support",
    specialists: 7,
    escalations: 2,
    status: "Monitoring",
  },
  {
    id: "mgr-2",
    name: "Manager Vega",
    scope: "Automation + Finance Ops",
    specialists: 5,
    escalations: 1,
    status: "Active",
  },
];

export const workflowItems = [
  {
    id: "wf-1",
    title: "New client provisioning",
    owner: "Agent Nova",
    priority: "High",
    status: "In Progress",
    due: "Today, 4:00 PM",
  },
  {
    id: "wf-2",
    title: "Invoice reconciliation batch",
    owner: "Agent Lyra",
    priority: "Medium",
    status: "Awaiting Approval",
    due: "Tomorrow, 10:00 AM",
  },
  {
    id: "wf-3",
    title: "Support escalation triage",
    owner: "Agent Atlas",
    priority: "High",
    status: "Escalated",
    due: "Today, 2:30 PM",
  },
  {
    id: "wf-4",
    title: "Connector health sweep",
    owner: "Agent Orion",
    priority: "Low",
    status: "Scheduled",
    due: "Friday, 9:00 AM",
  },
];

export const workflowApprovals = [
  {
    id: "ap-1",
    request: "Deploy WhatsApp auto-reply workflow",
    requester: "Manager Echo",
    age: "18 min ago",
  },
  {
    id: "ap-2",
    request: "Increase Atlas support queue capacity",
    requester: "Manager Vega",
    age: "1 hr ago",
  },
];

export const workflowTimeline = [
  { id: "tl-1", time: "1:42 PM", event: "Support escalation routed to Manager Echo", type: "escalation" },
  { id: "tl-2", time: "1:18 PM", event: "Invoice reconciliation workflow started", type: "workflow" },
  { id: "tl-3", time: "12:55 PM", event: "Client provisioning checklist 80% complete", type: "progress" },
  { id: "tl-4", time: "12:30 PM", event: "Connector health sweep scheduled", type: "schedule" },
];

export const communicationsInbox = [
  {
    id: "msg-1",
    channel: "WhatsApp",
    from: "Sarah Chen — Horizon Labs",
    preview: "Can we move the onboarding call to Thursday?",
    time: "12 min ago",
    unread: true,
  },
  {
    id: "msg-2",
    channel: "Email",
    from: "billing@acmecorp.com",
    preview: "RE: March invoice line items",
    time: "34 min ago",
    unread: true,
  },
  {
    id: "msg-3",
    channel: "SMS",
    from: "+1 (415) 555-0182",
    preview: "Received — team will review the deployment checklist.",
    time: "1 hr ago",
    unread: false,
  },
  {
    id: "msg-4",
    channel: "Instagram",
    from: "@northbridge.digital",
    preview: "DM: Interested in your automation services",
    time: "2 hr ago",
    unread: true,
  },
  {
    id: "msg-5",
    channel: "Email",
    from: "ops@aviatornetwork.com",
    preview: "Weekly connector status summary attached",
    time: "3 hr ago",
    unread: false,
  },
];

export const connectors = [
  { id: "c-1", name: "Google", service: "Workspace & Calendar", status: "Connected", health: 99 },
  { id: "c-2", name: "Gmail", service: "Inbound + outbound mail", status: "Connected", health: 98 },
  { id: "c-3", name: "Stripe", service: "Billing & payments", status: "Connected", health: 100 },
  { id: "c-4", name: "WhatsApp", service: "Business messaging", status: "Connected", health: 94 },
  { id: "c-5", name: "HubSpot", service: "CRM & pipeline", status: "Syncing", health: 91 },
  { id: "c-6", name: "Vercel", service: "Deployments", status: "Connected", health: 100 },
  { id: "c-7", name: "GitHub", service: "Repositories & actions", status: "Connected", health: 97 },
];

export const onboardingChecklist = [
  { id: "ob-1", item: "Connect Gmail", complete: true },
  { id: "ob-2", item: "Connect Stripe", complete: true },
  { id: "ob-3", item: "Connect WhatsApp", complete: true },
  { id: "ob-4", item: "Connect HubSpot", complete: false },
  { id: "ob-5", item: "Deploy support specialist", complete: false },
  { id: "ob-6", item: "Configure CAT preferences", complete: false },
];

export const onboardingRecommendations = [
  {
    id: "rec-1",
    title: "Deploy Support Specialist",
    reason: "Response time trending above target for WhatsApp channel.",
    impact: "High",
  },
  {
    id: "rec-2",
    title: "Finish HubSpot connector",
    reason: "CRM sync required before onboarding workflow can complete.",
    impact: "High",
  },
  {
    id: "rec-3",
    title: "Enable billing workflow",
    reason: "Stripe is connected but invoice automation is not active.",
    impact: "Medium",
  },
];

export const analyticsMetrics = {
  teamTasks: { value: "1,284", change: "+12% vs last month", trend: "up" as const },
  timeSaved: { value: "186 hrs", change: "+24 hrs this week", trend: "up" as const },
  utilization: { value: "78%", change: "Target: 75%", trend: "neutral" as const },
  responseTime: { value: "4.2 min", change: "-18% vs last week", trend: "up" as const },
};

export const analyticsBreakdown = [
  { id: "an-1", team: "Client Success", tasks: 412, utilization: 82, response: "3.8 min" },
  { id: "an-2", team: "Support", tasks: 356, utilization: 79, response: "4.1 min" },
  { id: "an-3", team: "Automation", tasks: 298, utilization: 74, response: "5.0 min" },
  { id: "an-4", team: "Finance Ops", tasks: 218, utilization: 68, response: "6.2 min" },
];

export const billingPlan = {
  name: "Operations Pro",
  price: "$2,400",
  cycle: "Monthly",
  renewal: "April 1, 2026",
  seats: 12,
};

export const billingUsage = [
  { id: "bu-1", label: "Team Tasks", used: 1284, limit: 2000, unit: "tasks" },
  { id: "bu-2", label: "Workflow Executions", used: 842, limit: 1000, unit: "runs" },
  { id: "bu-3", label: "Messages Routed", used: 3640, limit: 5000, unit: "messages" },
  { id: "bu-4", label: "Active Specialists", used: 12, limit: 15, unit: "agents" },
];

export const billingInvoices = [
  { id: "inv-1", date: "Mar 1, 2026", amount: "$2,400.00", status: "Paid" },
  { id: "inv-2", date: "Feb 1, 2026", amount: "$2,400.00", status: "Paid" },
  { id: "inv-3", date: "Jan 1, 2026", amount: "$2,400.00", status: "Paid" },
  { id: "inv-4", date: "Apr 1, 2026", amount: "$2,400.00", status: "Upcoming" },
];

export const settingsOrganization = {
  name: "Northbridge Venture Group",
  workspace: "northbridge-ops",
  timezone: "America/New_York",
  plan: "Operations Pro",
};

export const settingsUsers = [
  { id: "u-1", name: "Alex Morgan", email: "alex@northbridge.com", role: "Owner" },
  { id: "u-2", name: "Jordan Lee", email: "jordan@northbridge.com", role: "Admin" },
  { id: "u-3", name: "Sam Rivera", email: "sam@northbridge.com", role: "Operator" },
  { id: "u-4", name: "Casey Kim", email: "casey@northbridge.com", role: "Viewer" },
];

export const settingsPermissions = [
  { id: "p-1", area: "Digital Workforce", access: "Admin" },
  { id: "p-2", area: "Workflows", access: "Admin" },
  { id: "p-3", area: "Billing", access: "Restricted" },
  { id: "p-4", area: "Connectors", access: "Admin" },
];

export const catPreferences = [
  { id: "cat-1", label: "Voice activation", enabled: false },
  { id: "cat-2", label: "Proactive suggestions", enabled: true },
  { id: "cat-3", label: "Auto-summarize inbox", enabled: true },
  { id: "cat-4", label: "Escalation alerts", enabled: true },
];
