import type { NeoPlatformServices } from "@/lib/neo/contracts";
import {
  resolveCatPrompt,
  startLiveMockEngine,
} from "@/lib/neo/engine/live-mock";
import { neoEventBus } from "@/lib/neo/events";
import { neoStateStore } from "@/lib/neo/state/store";
import type { CatMessage, CatResponse } from "@/lib/neo/types";
import type { NeoPlatformState } from "@/lib/neo/state/seed";

function fromState<T>(selector: (s: NeoPlatformState) => T): Promise<T> {
  return Promise.resolve(selector(neoStateStore.getState()));
}

export const liveMockNeoPlatform: NeoPlatformServices = {
  workforce: {
    listMembers: () => fromState((s) => s.workforce),
    getTeamHierarchy: () => fromState((s) => s.teamHierarchy),
  },
  collaboration: {
    listTodayActivity: () => fromState((s) => s.activity),
  },
  workItems: {
    listActive: () =>
      fromState((s) =>
        s.workItems.filter(
          (w) => w.status === "active" || w.status === "running"
        )
      ),
    listWaitingApprovals: () =>
      fromState((s) =>
        s.workItems.filter((w) => w.status === "waiting_approval")
      ),
    listEscalations: () =>
      fromState((s) => s.workItems.filter((w) => w.status === "escalated")),
    getTimeline: () => fromState((s) => s.timeline),
    getAuditHistory: () => fromState((s) => s.audit),
    listWorkflowEvents: () => fromState((s) => s.workflowEvents),
  },
  connectors: {
    listConnected: () => fromState((s) => s.connectedConnectors),
    listAvailable: () => fromState((s) => s.availableConnectors),
    reconnect: async (connectorId: string) => {
      neoStateStore.patch((s) => {
        const c = [...s.connectedConnectors, ...s.availableConnectors].find(
          (x) => x.id === connectorId
        );
        if (c) {
          c.lifecycle = "connecting";
          c.oauthStatus = "valid";
          c.errorMessage = undefined;
        }
      }, {
        type: "connector.status_changed",
        payload: { connectorId },
        message: `Reconnecting ${connectorId}`,
      });
    },
  },
  onboarding: {
    getSnapshot: () => fromState((s) => s.onboarding),
  },
  messaging: {
    listInbox: () =>
      fromState((s) =>
        s.conversations.map((c) => ({
          id: c.id,
          channel: c.channel,
          from: c.customer.name,
          subject: c.subject,
          preview: c.preview,
          receivedAt: c.receivedAt,
          unread: c.unread,
        }))
      ),
    listChannels: () =>
      Promise.resolve([
        "whatsapp",
        "email",
        "sms",
        "telegram",
        "messenger",
        "instagram",
        "tiktok",
        "webchat",
      ]),
    listConversations: () => fromState((s) => s.conversations),
  },
  learning: {
    listRecommendations: () => fromState((s) => s.recommendations),
  },
  executive: {
    getBusinessHealth: () =>
      fromState((s) => ({
        score: s.executive.businessHealthScore,
        level: s.executive.level,
        summary: s.executive.summary,
        connectedSystems: s.executive.connectedIntegrations,
        activeWorkflows: s.executive.runningWorkflows,
      })),
    getKPIs: () => fromState((s) => s.executive),
    getTodayActivity: () => fromState((s) => s.activity),
    getRecommendations: () => fromState((s) => s.recommendations),
  },
  analytics: {
    getSnapshot: () => fromState((s) => s.analytics),
    getTimeSeries: () => fromState((s) => s.analyticsSeries),
  },
  command: {
    getSystemHealth: () => fromState((s) => s.systemHealth),
    listCommandSuggestions: () =>
      Promise.resolve([
        { id: "cmd-1", label: "Connect QuickBooks", prompt: "Connect QuickBooks" },
        {
          id: "cmd-2",
          label: "Hire Marketing Specialist",
          prompt: "Hire Marketing Specialist",
        },
        {
          id: "cmd-3",
          label: "Create onboarding workflow",
          prompt: "Create onboarding workflow",
        },
        {
          id: "cmd-4",
          label: "Show blocked tasks",
          prompt: "Show blocked tasks",
        },
        {
          id: "cmd-5",
          label: "Explain Finance overload",
          prompt: "Explain why Finance is overloaded",
        },
        {
          id: "cmd-6",
          label: "Customer Service wait",
          prompt: "Why is Customer Service waiting?",
        },
      ]),
    askCat: async (prompt: string, history: CatMessage[]): Promise<CatResponse> => {
      const message = resolveCatPrompt(prompt);
      return {
        message,
        suggestions: [
          "Connect QuickBooks",
          "Show blocked tasks",
          "System health",
        ],
      };
    },
  },
  realtime: {
    subscribe: (handler) => neoEventBus.subscribe(handler),
    subscribeState: (listener) => neoStateStore.subscribe(listener),
    getState: () => neoStateStore.getState(),
    getVersion: () => neoStateStore.getVersion(),
    start: () => startLiveMockEngine(),
  },
};
