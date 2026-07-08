import type { NeoPlatformServices } from "@/lib/neo/contracts";
import {
  mockActivity,
  mockAnalytics,
  mockAudit,
  mockAvailableApps,
  mockBusinessHealth,
  mockCommandSuggestions,
  mockConnectedApps,
  mockInbox,
  mockOnboarding,
  mockRecommendations,
  mockSystemHealth,
  mockTeamHierarchy,
  mockTimeline,
  mockWorkforceMembers,
  mockWorkItems,
} from "@/lib/neo/mocks/data";

/** Mock provider — swap for live NEO package bindings via neo install manifest. */
export const mockNeoPlatform: NeoPlatformServices = {
  workforce: {
    listMembers: async () => mockWorkforceMembers,
    getTeamHierarchy: async () => mockTeamHierarchy,
  },
  collaboration: {
    listTodayActivity: async () => mockActivity,
  },
  workItems: {
    listActive: async () => mockWorkItems.filter((w) => w.status === "active"),
    listWaitingApprovals: async () =>
      mockWorkItems.filter((w) => w.status === "waiting_approval"),
    listEscalations: async () =>
      mockWorkItems.filter((w) => w.status === "escalated"),
    getTimeline: async () => mockTimeline,
    getAuditHistory: async () => mockAudit,
  },
  connectors: {
    listConnected: async () => mockConnectedApps,
    listAvailable: async () => mockAvailableApps,
  },
  onboarding: {
    getSnapshot: async () => mockOnboarding,
  },
  messaging: {
    listInbox: async () => mockInbox,
    listChannels: async () => [
      "email",
      "sms",
      "whatsapp",
      "telegram",
      "social",
    ],
  },
  learning: {
    listRecommendations: async () => mockRecommendations,
  },
  executive: {
    getBusinessHealth: async () => mockBusinessHealth,
    getTodayActivity: async () => mockActivity,
    getRecommendations: async () => mockRecommendations,
  },
  analytics: {
    getSnapshot: async () => mockAnalytics,
  },
  command: {
    getSystemHealth: async () => mockSystemHealth,
    listCommandSuggestions: async () => mockCommandSuggestions,
  },
};
