import type { NeoPlatformServices } from "@/lib/neo/contracts";
import { neoEventBus } from "@/lib/neo/events";
import { createInitialNeoState } from "@/lib/neo/state/seed";
import { neoStateStore } from "@/lib/neo/state/store";

const seed = createInitialNeoState();

function fromSeed<T>(selector: (s: typeof seed) => T): Promise<T> {
  return Promise.resolve(selector(seed));
}

/** Static mock provider — no live events. Used when live engine is disabled. */
export const mockNeoPlatform: NeoPlatformServices = {
  workforce: {
    listMembers: () => fromSeed((s) => s.workforce),
    getTeamHierarchy: () => fromSeed((s) => s.teamHierarchy),
  },
  collaboration: {
    listTodayActivity: () => fromSeed((s) => s.activity),
  },
  workItems: {
    listActive: () =>
      fromSeed((s) =>
        s.workItems.filter(
          (w) => w.status === "active" || w.status === "running"
        )
      ),
    listWaitingApprovals: () =>
      fromSeed((s) =>
        s.workItems.filter((w) => w.status === "waiting_approval")
      ),
    listEscalations: () =>
      fromSeed((s) => s.workItems.filter((w) => w.status === "escalated")),
    getTimeline: () => fromSeed((s) => s.timeline),
    getAuditHistory: () => fromSeed((s) => s.audit),
    listWorkflowEvents: () => fromSeed((s) => s.workflowEvents),
  },
  connectors: {
    listConnected: () => fromSeed((s) => s.connectedConnectors),
    listAvailable: () => fromSeed((s) => s.availableConnectors),
  },
  onboarding: {
    getSnapshot: () => fromSeed((s) => s.onboarding),
  },
  messaging: {
    listInbox: () =>
      fromSeed((s) =>
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
    listConversations: () => fromSeed((s) => s.conversations),
  },
  learning: {
    listRecommendations: () => fromSeed((s) => s.recommendations),
  },
  executive: {
    getBusinessHealth: () =>
      fromSeed((s) => ({
        score: s.executive.businessHealthScore,
        level: s.executive.level,
        summary: s.executive.summary,
        connectedSystems: s.executive.connectedIntegrations,
        activeWorkflows: s.executive.runningWorkflows,
      })),
    getKPIs: () => fromSeed((s) => s.executive),
    getTodayActivity: () => fromSeed((s) => s.activity),
    getRecommendations: () => fromSeed((s) => s.recommendations),
  },
  analytics: {
    getSnapshot: () => fromSeed((s) => s.analytics),
    getTimeSeries: () => fromSeed((s) => s.analyticsSeries),
  },
  command: {
    getSystemHealth: () => fromSeed((s) => s.systemHealth),
    listCommandSuggestions: () =>
      Promise.resolve([
        { id: "cmd-1", label: "Ask CAT", prompt: "What should I prioritize today?" },
      ]),
    askCat: async (prompt) => ({
      message: `Static mock mode — live engine disabled. You asked: "${prompt}"`,
    }),
  },
  realtime: {
    subscribe: (handler) => neoEventBus.subscribe(handler),
    subscribeState: (listener) => neoStateStore.subscribe(listener),
    getState: () => seed,
    getVersion: () => 0,
    start: () => undefined,
  },
};
