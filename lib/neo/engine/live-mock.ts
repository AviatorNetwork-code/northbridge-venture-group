import { neoEventBus } from "@/lib/neo/events";
import { neoStateStore } from "@/lib/neo/state/store";
import type {
  LiveWorkforceStatus,
  WorkforceMember,
} from "@/lib/neo/types";

const LIVE_STATUSES: LiveWorkforceStatus[] = [
  "idle",
  "working",
  "waiting",
  "escalated",
];

const TASKS = [
  "Review SLA dashboard",
  "Sync connector permissions",
  "Approve workflow step",
  "Respond to customer thread",
  "Audit automation rules",
  "Prepare onboarding brief",
];

const ACTIVITY_LABELS = [
  "Connector sync completed",
  "New customer conversation opened",
  "Workflow step completed",
  "Specialist assignment updated",
  "Approval granted",
  "KPI threshold recalculated",
];

let engineInterval: ReturnType<typeof setInterval> | null = null;
let started = false;

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function recomputeExecutive(s: import("@/lib/neo/state/seed").NeoPlatformState) {
  const specialists = s.workforce.filter((m) => m.role === "specialist");
  const managers = s.workforce.filter((m) => m.role === "manager");

  s.executive.activeSpecialists = specialists.filter(
    (m) => m.liveStatus === "working"
  ).length;
  s.executive.activeManagers = managers.filter(
    (m) => m.liveStatus !== "offline"
  ).length;
  s.executive.runningWorkflows = s.workItems.filter(
    (w) => w.status === "running" || w.status === "active"
  ).length;
  s.executive.waitingApprovals = s.workItems.filter(
    (w) => w.status === "waiting_approval"
  ).length;
  s.executive.openConversations = s.conversations.filter(
    (c) => c.status !== "resolved"
  ).length;
  s.executive.connectedIntegrations = s.connectedConnectors.filter(
    (c) => c.connected
  ).length;
}

function tickWorkforce() {
  neoStateStore.patch(
    (s) => {
      const member = pick(s.workforce);
      member.liveStatus = pick(LIVE_STATUSES);
      member.currentTask =
        member.liveStatus === "idle" ? undefined : pick(TASKS);
      member.queueSize = Math.max(
        0,
        member.queueSize + (Math.random() > 0.5 ? 1 : -1)
      );
      if (member.liveStatus === "working") {
        member.tasksCompletedToday += 1;
      }
      recomputeExecutive(s);
    },
    {
      type: "workforce.status_changed",
      payload: {},
      message: "Workforce status updated",
      notification: {
        id: `n-${Date.now()}`,
        title: "Workforce update",
        message: "A specialist changed operational status",
        level: "info",
        timestamp: new Date().toISOString(),
      },
    }
  );
}

function tickConnector() {
  neoStateStore.patch(
    (s) => {
      const connector = pick(s.connectedConnectors);
      connector.lifecycle = Math.random() > 0.7 ? "syncing" : "healthy";
      connector.lastSyncAt = new Date().toISOString();
      connector.usagePercent = Math.min(
        100,
        connector.usagePercent + Math.floor(Math.random() * 5)
      );
      if (connector.id === "google-workspace") {
        connector.health = Math.random() > 0.5 ? "degraded" : "healthy";
      }
      s.systemHealth.connectors =
        s.connectedConnectors.some((c) => c.health === "critical")
          ? "critical"
          : s.connectedConnectors.some((c) => c.health === "degraded")
            ? "degraded"
            : "healthy";
      s.systemHealth.lastCheckedAt = new Date().toISOString();
      recomputeExecutive(s);
    },
    {
      type: "connector.sync",
      payload: {},
      message: "Connector sync completed",
      notification: {
        id: `n-${Date.now()}`,
        title: "Connector sync",
        message: "Integration finished synchronizing",
        level: "success",
        timestamp: new Date().toISOString(),
      },
    }
  );
}

function tickConversation() {
  neoStateStore.patch(
    (s) => {
      const conv = pick(s.conversations.filter((c) => c.status !== "resolved"));
      conv.unread = true;
      conv.receivedAt = new Date().toISOString();
      conv.slaMinutesRemaining = Math.max(-30, conv.slaMinutesRemaining - 1);
      conv.slaBreached = conv.slaMinutesRemaining < 0;
      conv.preview = pick([
        "Following up on our last message",
        "Can someone help with connector setup?",
        "Urgent — workflow blocked",
        "Thanks for the quick response",
      ]);
      s.analytics.conversationVolume += 1;
      s.activity.unshift({
        id: `act-${Date.now()}`,
        label: `New ${conv.channel} message — ${conv.customer.company}`,
        timestamp: new Date().toISOString(),
        type: "messaging",
      });
      s.activity = s.activity.slice(0, 20);
      recomputeExecutive(s);
    },
    {
      type: "conversation.received",
      payload: {},
      message: "New customer conversation activity",
      notification: {
        id: `n-${Date.now()}`,
        title: "New conversation",
        message: "Customer message received in unified inbox",
        level: "info",
        timestamp: new Date().toISOString(),
      },
    }
  );
}

function tickWorkflow() {
  neoStateStore.patch(
    (s) => {
      const item = pick(s.workItems);
      item.updatedAt = new Date().toISOString();
      const event = {
        id: `wse-${Date.now()}`,
        workItemId: item.id,
        label: pick([
          "Step completed",
          "Awaiting approval",
          "Dependency resolved",
          "Automation triggered",
        ]),
        timestamp: new Date().toISOString(),
        actor: pick(["NEO Work Items", "Marcus Reid", "Ava Chen", "System"]),
        kind: pick(["progress", "approval", "started"] as const),
      };
      s.workflowEvents.unshift(event);
      s.workflowEvents = s.workflowEvents.slice(0, 30);
      s.analytics.workflowsPerDay += Math.random() > 0.8 ? 1 : 0;
      s.activity.unshift({
        id: `act-${Date.now()}`,
        label: `Workflow: ${event.label}`,
        timestamp: event.timestamp,
        type: "workflow",
      });
      s.activity = s.activity.slice(0, 20);
      recomputeExecutive(s);
    },
    {
      type: "workflow.event",
      payload: {},
      message: "Workflow event recorded",
    }
  );
}

function tickKpi() {
  neoStateStore.patch(
    (s) => {
      s.executive.businessHealthScore = Math.min(
        100,
        Math.max(
          60,
          s.executive.businessHealthScore + (Math.random() > 0.5 ? 1 : -1)
        )
      );
      s.executive.revenueMtdUsd += Math.floor(Math.random() * 800);
      s.analytics.workforceUtilization = Math.min(
        100,
        Math.max(50, s.analytics.workforceUtilization + (Math.random() > 0.5 ? 1 : -1))
      );
      s.analytics.tasksCompleted += Math.random() > 0.6 ? 1 : 0;
      s.onboarding.readinessScore = Math.min(
        100,
        s.onboarding.readinessScore + (Math.random() > 0.85 ? 1 : 0)
      );
    },
    {
      type: "kpi.updated",
      payload: {},
    }
  );
}

function tickActivity() {
  neoStateStore.patch((s) => {
    s.activity.unshift({
      id: `act-${Date.now()}`,
      label: pick(ACTIVITY_LABELS),
      timestamp: new Date().toISOString(),
      type: pick(["connector", "workflow", "messaging", "workforce"]),
    });
    s.activity = s.activity.slice(0, 20);
  }, {
    type: "activity.new",
    payload: {},
  });
}

const tickers = [
  tickWorkforce,
  tickConnector,
  tickConversation,
  tickWorkflow,
  tickKpi,
  tickActivity,
];

export function startLiveMockEngine(): void {
  if (started || typeof window === "undefined") return;
  started = true;

  engineInterval = setInterval(() => {
    pick(tickers)();
  }, 4000);
}

export function stopLiveMockEngine(): void {
  if (engineInterval) clearInterval(engineInterval);
  engineInterval = null;
  started = false;
}

export function getWorkforceMemberById(id: string): WorkforceMember | undefined {
  return neoStateStore.getState().workforce.find((m) => m.id === id);
}

/** CAT operator responses via NEO contracts — no duplicated reasoning engine */
export function resolveCatPrompt(prompt: string): string {
  const s = neoStateStore.getState();
  const lower = prompt.toLowerCase();

  if (lower.includes("quickbooks") || lower.includes("connect")) {
    const qb = s.connectedConnectors.find((c) => c.id === "quickbooks");
    if (qb?.oauthStatus === "expired") {
      return "QuickBooks OAuth expired 120 days ago. Finance Specialist Jordan Blake is escalated on wi-104. I recommend reconnecting QuickBooks from Connector Center — this should clear the Finance queue overload.";
    }
    return "I can initiate the QuickBooks connection flow via NEO Connector Platform. Sofia Nwosu (Connector Specialist) is available with queue size 1.";
  }

  if (lower.includes("hire") && lower.includes("marketing")) {
    return "Social channel volume is up 24% this week (Instagram, TikTok). Recommend hiring a Marketing Specialist — current Communications queue has 3 open threads and Eli Park is idle.";
  }

  if (lower.includes("onboarding") && lower.includes("workflow")) {
    return `I can create an onboarding workflow template. Current readiness is ${s.onboarding.readinessScore}% with missing items: ${s.onboarding.missingRequirements.join(", ")}. Marcus Reid can approve once CRM and messaging connectors are live.`;
  }

  if (lower.includes("blocked") || lower.includes("block")) {
    const blocked = s.workItems.filter(
      (w) => w.status === "escalated" || w.status === "waiting_approval"
    );
    return `There are ${blocked.length} blocked work items: ${blocked.map((w) => w.title).join("; ")}.`;
  }

  if (lower.includes("finance") && lower.includes("overload")) {
    const finance = s.workforce.find((m) => m.teamId === "team-finance");
    return `Finance is overloaded because QuickBooks OAuth expired. Jordan Blake is ${finance?.liveStatus} with queue size ${finance?.queueSize}. wi-104 is escalated. Reconnect QuickBooks to restore sync.`;
  }

  if (lower.includes("customer service") && lower.includes("waiting")) {
    const waiting = s.conversations.filter((c) => c.status === "waiting");
    return `Customer Service has ${waiting.length} conversations waiting. Riley Santos is monitoring SLAs — ${s.conversations.filter((c) => c.slaBreached).length} SLA breaches active. Web chat from Doyle Dental is highest priority (8 min remaining).`;
  }

  if (lower.includes("health") || lower.includes("system")) {
    return `Platform: ${s.systemHealth.platform}. Connectors: ${s.systemHealth.connectors}. Workforce: ${s.systemHealth.workforce}. Messaging: ${s.systemHealth.messaging}. QuickBooks needs reconnect; Google Workspace token expiring.`;
  }

  if (lower.includes("recommend")) {
    return s.recommendations
      .map((r) => `• ${r.title}: ${r.summary}`)
      .join("\n");
  }

  return `Operations snapshot: ${s.executive.activeSpecialists} specialists working, ${s.executive.runningWorkflows} workflows running, ${s.executive.openConversations} open conversations. Business health ${s.executive.businessHealthScore}%. What would you like to act on?`;
}
