import type { OperationsSnapshot } from "@/lib/cat/operations-context";
import { getNeoConfig } from "@/lib/neo/config";
import type { NeoHealth } from "@/lib/neo/health";
import { createHealthSnapshot } from "@/lib/neo/health";
import type { NeoClient } from "@/lib/neo/types";
import type { NeoConnectorApi } from "@/lib/neo/connector-api";
import type { NeoLaunchApi } from "@/lib/neo/launch-api";
import type { NeoWorkforceApi } from "@/lib/neo/workforce-api";
import { createLocalProvider } from "@/lib/neo/providers/local-provider";
import { createMockProvider } from "@/lib/neo/providers/mock-provider";
import type { NeoProviderBundle } from "@/lib/neo/providers/types";
import type {
  ConnectorsSnapshot,
  LaunchStatusSnapshot,
  NeoCapabilities,
  WorkforceSnapshot,
} from "@/lib/neo/snapshots";

export type NeoClientApi = {
  readonly workforce: NeoWorkforceApi;
  readonly connectors: NeoConnectorApi;
  readonly launch: NeoLaunchApi;
  readonly cat: NeoClient;
  getWorkforce(): Promise<WorkforceSnapshot>;
  getConnectors(): Promise<ConnectorsSnapshot>;
  getLaunchStatus(): Promise<LaunchStatusSnapshot>;
  getOperationsSnapshot(currentModule?: string): Promise<OperationsSnapshot>;
  getCapabilities(): Promise<NeoCapabilities>;
  health(): Promise<NeoHealth>;
  refreshHealth(): Promise<NeoHealth>;
};

function wrapProvider(primary: NeoProviderBundle): NeoClientApi {
  let cachedHealth: NeoHealth | null = null;

  const refreshHealth = async (): Promise<NeoHealth> => {
    const health = await primary.health();
    cachedHealth = health;
    return health;
  };

  return {
    workforce: primary.workforce,
    connectors: primary.connectors,
    launch: primary.launch,
    cat: primary.cat,
    getWorkforce: () => primary.getWorkforce(),
    getConnectors: () => primary.getConnectors(),
    getLaunchStatus: () => primary.getLaunchStatus(),
    getOperationsSnapshot: (currentModule = "dashboard") =>
      primary.getOperationsSnapshot(currentModule),
    getCapabilities: () => primary.getCapabilities(),
    health: async () => {
      if (cachedHealth) return cachedHealth;
      return refreshHealth();
    },
    refreshHealth,
  };
}

function createFallbackProvider(local: NeoProviderBundle, mock: NeoProviderBundle): NeoProviderBundle {
  return {
    mode: "local",
    workforce: local.workforce,
    connectors: local.connectors,
    launch: local.launch,
    cat: local.cat,
    getWorkforce: async () => {
      try {
        return await local.getWorkforce();
      } catch {
        return mock.getWorkforce();
      }
    },
    getConnectors: async () => {
      try {
        return await local.getConnectors();
      } catch {
        return mock.getConnectors();
      }
    },
    getLaunchStatus: async () => {
      try {
        return await local.getLaunchStatus();
      } catch {
        return mock.getLaunchStatus();
      }
    },
    getOperationsSnapshot: async (currentModule) => {
      try {
        return await local.getOperationsSnapshot(currentModule);
      } catch {
        return mock.getOperationsSnapshot(currentModule);
      }
    },
    getCapabilities: async () => {
      try {
        return await local.getCapabilities();
      } catch {
        return mock.getCapabilities();
      }
    },
    ping: () => local.ping(),
    health: async () => {
      const ping = await local.ping();

      if (ping.ok) {
        return createHealthSnapshot({
          status: "connected",
          configuredProvider: "local",
          activeProvider: "local",
          baseUrl: getNeoConfig().baseUrl,
          latencyMs: ping.latencyMs,
          message: "Connected to local NEO service",
        });
      }

      const mockHealth = await mock.health();
      return createHealthSnapshot({
        status: "degraded",
        configuredProvider: "local",
        activeProvider: "mock",
        baseUrl: getNeoConfig().baseUrl,
        latencyMs: ping.latencyMs,
        message: mockHealth.message ?? "Local NEO unavailable — using mock fallback",
      });
    },
  };
}

export function createNeoClient(): NeoClientApi {
  const config = getNeoConfig();
  const mock = createMockProvider();

  if (config.provider === "mock") {
    return wrapProvider(mock);
  }

  const local = createLocalProvider(config.baseUrl);
  const withFallback = createFallbackProvider(local, mock);
  return wrapProvider(withFallback);
}

let singletonClient: NeoClientApi | null = null;

export function getNeoClient(): NeoClientApi {
  if (!singletonClient) {
    singletonClient = createNeoClient();
  }

  return singletonClient;
}

export function resetNeoClientForTests() {
  singletonClient = null;
}
