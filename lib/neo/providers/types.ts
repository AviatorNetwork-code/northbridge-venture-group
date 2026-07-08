import type { NeoProviderMode } from "@/lib/neo/config";
import type { NeoHealth } from "@/lib/neo/health";
import type {
  ConnectorsSnapshot,
  LaunchStatusSnapshot,
  NeoCapabilities,
  WorkforceSnapshot,
} from "@/lib/neo/snapshots";
import type { NeoClient } from "@/lib/neo/types";
import type { NeoConnectorApi } from "@/lib/neo/connector-api";
import type { NeoLaunchApi } from "@/lib/neo/launch-api";
import type { NeoWorkforceApi } from "@/lib/neo/workforce-api";
import type { OperationsSnapshot } from "@/lib/cat/operations-context";

export type NeoProviderBundle = {
  mode: NeoProviderMode;
  workforce: NeoWorkforceApi;
  connectors: NeoConnectorApi;
  launch: NeoLaunchApi;
  cat: NeoClient;
  getWorkforce: () => Promise<WorkforceSnapshot>;
  getConnectors: () => Promise<ConnectorsSnapshot>;
  getLaunchStatus: () => Promise<LaunchStatusSnapshot>;
  getOperationsSnapshot: (currentModule: string) => Promise<OperationsSnapshot>;
  getCapabilities: () => Promise<NeoCapabilities>;
  ping: () => Promise<{ ok: boolean; latencyMs: number }>;
  health: () => Promise<NeoHealth>;
};
