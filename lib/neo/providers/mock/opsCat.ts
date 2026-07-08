import type { CatOpsResponse } from "../../contracts";
import type { MockEngineState } from "./eventEngine";
import { cloneState } from "./initialState";

interface CatCommand {
  patterns: string[];
  respond: (state: MockEngineState) => CatOpsResponse;
}

const COMMANDS: CatCommand[] = [
  {
    patterns: ["connect quickbooks", "quickbooks", "reconnect quickbooks"],
    respond: () => ({
      message:
        "QuickBooks requires re-authorization. OAuth token expired 92 days ago. I can initiate reconnect — this will restore invoicing and monthly close workflows.",
      actions: [
        { label: "Reconnect QuickBooks", command: "reconnect:cn-1" },
        { label: "View Connector Center", href: "/ops/connectors" },
      ],
      data: { connectorId: "cn-1", status: "authorization_required" },
    }),
  },
  {
    patterns: ["hire marketing", "marketing specialist", "hire marketing specialist"],
    respond: (state) => ({
      message: `Marketing coverage is at ${state.workforce.members.find((m) => m.department === "Marketing")?.utilizationPercent ?? 0}% utilization. Hiring a Marketing Specialist would reduce Sofia Reyes's queue and enable campaign automation.`,
      actions: [
        { label: "View Workforce", href: "/ops/workforce" },
        { label: "Onboarding Recommendations", href: "/ops/onboarding" },
      ],
    }),
  },
  {
    patterns: ["onboarding workflow", "create onboarding", "welcome workflow"],
    respond: () => ({
      message:
        "Welcome workflow is not yet configured — it's a launch requirement at 58% readiness. I recommend completing QuickBooks connection and hiring a Finance Specialist first.",
      actions: [
        { label: "Customer Onboarding", href: "/ops/onboarding" },
        { label: "Workflow Center", href: "/ops/workflows" },
      ],
    }),
  },
  {
    patterns: ["blocked tasks", "show blocked", "blocked"],
    respond: (state) => {
      const blocked = state.workflows.workflows.flatMap((wf) =>
        wf.tasks.filter((t) => t.status === "blocked").map((t) => ({ workflow: wf.name, task: t.title })),
      );
      return {
        message:
          blocked.length > 0
            ? `Found ${blocked.length} blocked task(s): ${blocked.map((b) => `${b.task} in ${b.workflow}`).join("; ")}.`
            : "No blocked tasks right now. One workflow is waiting executive sign-off on P&L approval.",
        actions: [{ label: "Workflow Center", href: "/ops/workflows" }],
        data: { blocked },
      };
    },
  },
  {
    patterns: ["finance overloaded", "finance is overloaded", "why finance"],
    respond: (state) => {
      const finance = state.workforce.members.filter((m) => m.department === "Finance");
      const avgUtil = Math.round(
        finance.reduce((s, m) => s + m.utilizationPercent, 0) / Math.max(finance.length, 1),
      );
      return {
        message: `Finance is at ${avgUtil}% average utilization. Marcus Webb is waiting on QuickBooks sync, and Nina Patel is offline. Victor Lang has 4 items in his approval queue.`,
        actions: [
          { label: "Digital Workforce", href: "/ops/workforce" },
          { label: "Connect QuickBooks", command: "reconnect:cn-1" },
        ],
        data: { department: "Finance", utilization: avgUtil, members: cloneState(finance) },
      };
    },
  },
  {
    patterns: ["customer service waiting", "why is customer service", "cs waiting"],
    respond: (state) => {
      const waiting = state.workforce.members.filter(
        (m) => m.department === "Customer Service" && (m.status === "waiting" || m.status === "escalated"),
      );
      return {
        message: `${waiting.length} Customer Service agent(s) are waiting or escalated. Elena Park is handling a VIP refund escalation. 2 conversations are at SLA risk.`,
        actions: [
          { label: "Communications", href: "/ops/communications" },
          { label: "Workflow Center", href: "/ops/workflows" },
        ],
        data: { waiting: cloneState(waiting) },
      };
    },
  },
  {
    patterns: ["status", "overview", "dashboard", "how are we doing"],
    respond: (state) => ({
      message: `Operations snapshot: ${state.dashboard.activeSpecialists} specialists active, ${state.dashboard.runningWorkflows} workflows running, ${state.dashboard.waitingApprovals} approvals pending, system health is ${state.dashboard.systemHealth}.`,
      actions: [{ label: "Executive Dashboard", href: "/ops" }],
      data: { dashboard: cloneState(state.dashboard) },
    }),
  },
];

function normalize(input: string): string {
  return input.trim().toLowerCase();
}

export function queryOpsCat(command: string, state: MockEngineState): CatOpsResponse {
  const normalized = normalize(command);
  if (!normalized) {
    return {
      message:
        "I'm CAT, your AI Operations operator. Ask me to connect integrations, hire specialists, explain bottlenecks, or show blocked work.",
      actions: [
        { label: "Connect QuickBooks", command: "connect quickbooks" },
        { label: "Show blocked tasks", command: "show blocked tasks" },
        { label: "Finance status", command: "why is finance overloaded" },
      ],
    };
  }

  for (const cmd of COMMANDS) {
    if (cmd.patterns.some((p) => normalized.includes(p))) {
      return cmd.respond(state);
    }
  }

  return {
    message:
      "I can help with connector setup, workforce allocation, workflow blockers, and department load. Try: \"Connect QuickBooks\", \"Show blocked tasks\", or \"Why is Customer Service waiting?\"",
    actions: [
      { label: "Workflow Center", href: "/ops/workflows" },
      { label: "Connector Center", href: "/ops/connectors" },
    ],
  };
}
