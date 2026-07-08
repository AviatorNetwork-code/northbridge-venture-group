import type { NeoEventBus } from "../../events";
import type {
  ConnectorStatus,
  WorkforceStatus,
  WorkflowEvent,
} from "../../types";
import type { ActivityItem, ToastNotification } from "../../types/notifications";
import {
  cloneState,
  initialActivity,
  initialAnalytics,
  initialCommunications,
  initialConnectors,
  initialDashboard,
  initialOnboarding,
  initialWorkforce,
  initialWorkflows,
} from "./initialState";

const STATUSES: WorkforceStatus[] = ["idle", "working", "waiting", "escalated", "offline"];
const CONNECTOR_STATUSES: ConnectorStatus[] = ["connected", "syncing", "healthy", "connected"];

let eventId = 100;
let activityId = 100;

function nextId(prefix: string): string {
  eventId += 1;
  return `${prefix}-${eventId}`;
}

export interface MockEngineState {
  dashboard: typeof initialDashboard;
  workforce: typeof initialWorkforce;
  workflows: typeof initialWorkflows;
  communications: typeof initialCommunications;
  connectors: typeof initialConnectors;
  onboarding: typeof initialOnboarding;
  analytics: typeof initialAnalytics;
  activity: ActivityItem[];
}

export function createMockEngineState(): MockEngineState {
  return {
    dashboard: cloneState(initialDashboard),
    workforce: cloneState(initialWorkforce),
    workflows: cloneState(initialWorkflows),
    communications: cloneState(initialCommunications),
    connectors: cloneState(initialConnectors),
    onboarding: cloneState(initialOnboarding),
    analytics: cloneState(initialAnalytics),
    activity: cloneState(initialActivity),
  };
}

function pushActivity(state: MockEngineState, item: Omit<ActivityItem, "id">): ActivityItem {
  activityId += 1;
  const entry: ActivityItem = { ...item, id: `act-${activityId}` };
  state.activity = [entry, ...state.activity].slice(0, 50);
  return entry;
}

function tickDashboard(state: MockEngineState, bus: NeoEventBus): void {
  const kpi = state.dashboard.kpis[0];
  if (typeof kpi.value === "number") {
    kpi.value += Math.floor(Math.random() * 3);
  }
  state.dashboard.customerConversations += Math.random() > 0.6 ? 1 : 0;
  state.dashboard.runningWorkflows += Math.random() > 0.85 ? 1 : 0;
  state.dashboard.revenueMtd += Math.floor(Math.random() * 500);
  state.dashboard.lastUpdated = new Date().toISOString();
  bus.emit({ type: "dashboard.updated", payload: cloneState(state.dashboard), timestamp: new Date().toISOString() });
}

function tickWorkforce(state: MockEngineState, bus: NeoEventBus): void {
  const specialists = state.workforce.members.filter((m) => m.role === "specialist" && m.status !== "offline");
  if (specialists.length === 0) return;

  const member = specialists[Math.floor(Math.random() * specialists.length)];
  const newStatus = STATUSES[Math.floor(Math.random() * STATUSES.length)];
  member.status = newStatus;
  if (newStatus === "working") {
    member.tasksCompleted24h += 1;
    member.utilizationPercent = Math.min(99, member.utilizationPercent + Math.floor(Math.random() * 5));
  }
  state.workforce.lastUpdated = new Date().toISOString();

  const orgNode = state.workforce.orgChart.find((n) => n.id === member.id);
  if (orgNode) orgNode.status = newStatus;

  state.dashboard.activeSpecialists = state.workforce.members.filter(
    (m) => m.role === "specialist" && (m.status === "working" || m.status === "waiting"),
  ).length;

  bus.emit({ type: "workforce.status_changed", payload: { memberId: member.id, status: newStatus }, timestamp: new Date().toISOString() });
  bus.emit({ type: "workforce.updated", payload: cloneState(state.workforce), timestamp: new Date().toISOString() });
  bus.emit({ type: "dashboard.updated", payload: cloneState(state.dashboard), timestamp: new Date().toISOString() });

  const activity = pushActivity(state, {
    message: `${member.name} is now ${newStatus}`,
    domain: "workforce",
    severity: newStatus === "escalated" ? "warning" : "info",
    timestamp: new Date().toISOString(),
  });
  bus.emit({ type: "activity.new", payload: activity, timestamp: new Date().toISOString() });
}

function tickWorkflow(state: MockEngineState, bus: NeoEventBus): void {
  const wf = state.workflows.workflows[Math.floor(Math.random() * state.workflows.workflows.length)];
  const event: WorkflowEvent = {
    id: nextId("ev"),
    type: Math.random() > 0.5 ? "task_completed" : "task_started",
    message: `${wf.name}: task progress updated`,
    timestamp: new Date().toISOString(),
    workflowId: wf.id,
  };
  wf.progress = Math.min(100, wf.progress + Math.floor(Math.random() * 8));
  wf.history.unshift(event);
  state.workflows.eventStream.unshift(event);
  state.workflows.lastUpdated = new Date().toISOString();

  bus.emit({ type: "workflows.event", payload: { eventId: event.id, workflowId: wf.id }, timestamp: new Date().toISOString() });
  bus.emit({ type: "workflows.updated", payload: cloneState(state.workflows), timestamp: new Date().toISOString() });

  const activity = pushActivity(state, {
    message: event.message,
    domain: "workflows",
    severity: "info",
    timestamp: event.timestamp,
  });
  bus.emit({ type: "activity.new", payload: activity, timestamp: event.timestamp });
}

function tickCommunications(state: MockEngineState, bus: NeoEventBus): void {
  const conv = state.communications.conversations[Math.floor(Math.random() * state.communications.conversations.length)];
  conv.unreadCount += 1;
  conv.lastMessageAt = new Date().toISOString();
  conv.slaMinutesRemaining -= Math.floor(Math.random() * 3);
  if (conv.slaMinutesRemaining <= 0) conv.sla = "breached";
  else if (conv.slaMinutesRemaining < 15) conv.sla = "at_risk";

  state.communications.lastUpdated = new Date().toISOString();
  state.dashboard.customerConversations = state.communications.conversations.filter((c) => c.status === "open" || c.status === "pending").length;

  bus.emit({ type: "communications.message", payload: { conversationId: conv.id }, timestamp: new Date().toISOString() });
  bus.emit({ type: "communications.updated", payload: cloneState(state.communications), timestamp: new Date().toISOString() });
  bus.emit({ type: "dashboard.updated", payload: cloneState(state.dashboard), timestamp: new Date().toISOString() });
}

function tickConnectors(state: MockEngineState, bus: NeoEventBus): void {
  const connector = state.connectors.connectors[Math.floor(Math.random() * state.connectors.connectors.length)];
  if (connector.status === "authorization_required" || connector.status === "error") return;

  connector.status = CONNECTOR_STATUSES[Math.floor(Math.random() * CONNECTOR_STATUSES.length)];
  connector.lastSyncAt = new Date().toISOString();
  connector.usageToday = Math.min(connector.usageLimit, connector.usageToday + Math.floor(Math.random() * 10));
  state.connectors.lastUpdated = new Date().toISOString();

  bus.emit({ type: "connectors.status_changed", payload: { connectorId: connector.id, status: connector.status }, timestamp: new Date().toISOString() });
  bus.emit({ type: "connectors.updated", payload: cloneState(state.connectors), timestamp: new Date().toISOString() });

  if (connector.status === "syncing") {
    const toast: ToastNotification = {
      id: nextId("toast"),
      title: `${connector.name} syncing`,
      message: "Data synchronization in progress",
      severity: "info",
      timestamp: new Date().toISOString(),
    };
    bus.emit({ type: "notification.toast", payload: toast, timestamp: toast.timestamp });
  }
}

function tickOnboarding(state: MockEngineState, bus: NeoEventBus): void {
  if (state.onboarding.readinessPercent >= 95) return;
  state.onboarding.readinessPercent = Math.min(95, state.onboarding.readinessPercent + 1);
  state.onboarding.launchReadiness = Math.min(90, state.onboarding.launchReadiness + 1);
  state.onboarding.estimatedSetupMinutes = Math.max(15, state.onboarding.estimatedSetupMinutes - 1);
  state.onboarding.lastUpdated = new Date().toISOString();
  bus.emit({ type: "onboarding.updated", payload: cloneState(state.onboarding), timestamp: new Date().toISOString() });
}

function tickAnalytics(state: MockEngineState, bus: NeoEventBus): void {
  const last = state.analytics.workflowsPerDay[state.analytics.workflowsPerDay.length - 1];
  last.value += Math.floor(Math.random() * 2);
  state.analytics.automationPercent = Math.min(85, state.analytics.automationPercent + (Math.random() > 0.7 ? 1 : 0));
  state.analytics.lastUpdated = new Date().toISOString();
  bus.emit({ type: "analytics.updated", payload: cloneState(state.analytics), timestamp: new Date().toISOString() });
}

export function startMockEventEngine(state: MockEngineState, bus: NeoEventBus): () => void {
  const timers: ReturnType<typeof setInterval>[] = [];

  timers.push(setInterval(() => tickDashboard(state, bus), 8000));
  timers.push(setInterval(() => tickWorkforce(state, bus), 6000));
  timers.push(setInterval(() => tickWorkflow(state, bus), 7000));
  timers.push(setInterval(() => tickCommunications(state, bus), 9000));
  timers.push(setInterval(() => tickConnectors(state, bus), 10000));
  timers.push(setInterval(() => tickOnboarding(state, bus), 12000));
  timers.push(setInterval(() => tickAnalytics(state, bus), 15000));

  return () => {
    for (const timer of timers) clearInterval(timer);
  };
}
