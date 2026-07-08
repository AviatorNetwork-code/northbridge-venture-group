import type { CatOpsResponse, NeoOperationsProvider } from "../../contracts";
import { createEventBus, type NeoEventBus } from "../../events";
import type { NeoEventHandler } from "../../types";
import {
  createMockEngineState,
  startMockEventEngine,
  type MockEngineState,
} from "./eventEngine";
import { cloneState } from "./initialState";
import { queryOpsCat } from "./opsCat";

export function createMockNeoProvider(): NeoOperationsProvider {
  const bus = createEventBus();
  const state = createMockEngineState();
  let stopEngine: (() => void) | null = null;

  const provider: NeoOperationsProvider = {
    mode: "mock",

    async getDashboard() {
      return cloneState(state.dashboard);
    },
    async getWorkforce() {
      return cloneState(state.workforce);
    },
    async getWorkflows() {
      return cloneState(state.workflows);
    },
    async getCommunications() {
      return cloneState(state.communications);
    },
    async getConnectors() {
      return cloneState(state.connectors);
    },
    async getOnboarding() {
      return cloneState(state.onboarding);
    },
    async getAnalytics() {
      return cloneState(state.analytics);
    },
    async getActivityFeed() {
      return cloneState(state.activity);
    },

    subscribe(handler: NeoEventHandler) {
      return bus.subscribe("*", handler);
    },

    async reconnectConnector(connectorId: string) {
      const connector = state.connectors.connectors.find((c) => c.id === connectorId);
      if (!connector) return;

      connector.status = "connecting";
      connector.oauthConnected = false;
      connector.errorMessage = undefined;
      state.connectors.lastUpdated = new Date().toISOString();
      bus.emit({
        type: "connectors.updated",
        payload: cloneState(state.connectors),
        timestamp: new Date().toISOString(),
      });

      setTimeout(() => {
        connector.status = "connected";
        connector.oauthConnected = true;
        connector.lastSyncAt = new Date().toISOString();
        connector.healthScore = Math.min(100, connector.healthScore + 20);
        connector.refreshTokenAgeDays = 0;
        state.connectors.lastUpdated = new Date().toISOString();
        state.dashboard.connectedIntegrations = state.connectors.connectors.filter(
          (c) => c.status === "connected" || c.status === "healthy",
        ).length;
        bus.emit({
          type: "connectors.status_changed",
          payload: { connectorId, status: "connected" },
          timestamp: new Date().toISOString(),
        });
        bus.emit({
          type: "connectors.updated",
          payload: cloneState(state.connectors),
          timestamp: new Date().toISOString(),
        });
        bus.emit({
          type: "dashboard.updated",
          payload: cloneState(state.dashboard),
          timestamp: new Date().toISOString(),
        });
      }, 2500);
    },

    async approveWorkflow(approvalId: string) {
      for (const wf of state.workflows.workflows) {
        const idx = wf.approvals.findIndex((a) => a.id === approvalId);
        if (idx >= 0) {
          wf.approvals.splice(idx, 1);
          state.dashboard.waitingApprovals = Math.max(0, state.dashboard.waitingApprovals - 1);
          wf.progress = Math.min(100, wf.progress + 10);
          state.workflows.lastUpdated = new Date().toISOString();
          bus.emit({
            type: "workflows.updated",
            payload: cloneState(state.workflows),
            timestamp: new Date().toISOString(),
          });
          bus.emit({
            type: "dashboard.updated",
            payload: cloneState(state.dashboard),
            timestamp: new Date().toISOString(),
          });
          break;
        }
      }
    },

    async queryCat(command: string): Promise<CatOpsResponse> {
      return queryOpsCat(command, state);
    },

    connectTransport() {
      if (stopEngine) stopEngine();
      stopEngine = startMockEventEngine(state, bus);
      return () => {
        provider.disconnectTransport?.();
      };
    },

    disconnectTransport() {
      if (stopEngine) {
        stopEngine();
        stopEngine = null;
      }
    },
  };

  provider.connectTransport?.();

  return provider;
}

export type { MockEngineState, NeoEventBus };
