import type { LaunchStatus } from "@/lib/launch/launch-types";
import type { OperationsSnapshot } from "@/lib/cat/operations-context";

export type WorkforceSnapshot = {
  specialistCount: number;
  teamCount: number;
  managerCount: number;
  avgWorkload: number;
  deploymentStatus: "none" | "queued" | "ready";
};

export type ConnectorsSnapshot = {
  total: number;
  connected: number;
  syncing: number;
  needsAttention: number;
  avgHealth: number;
  lastSyncLabel: string;
  readyToLaunch: boolean;
};

export type LaunchStatusSnapshot = {
  status: LaunchStatus;
  score: number;
  launched: boolean;
  blockerCount: number;
  estimatedGoLive: string;
};

export type NeoCapabilities = {
  workforce: boolean;
  connectors: boolean;
  launch: boolean;
  cat: boolean;
  billing: boolean;
  oauth: boolean;
  operationsSnapshot: boolean;
};

export type NeoSnapshotBundle = {
  workforce: WorkforceSnapshot;
  connectors: ConnectorsSnapshot;
  launch: LaunchStatusSnapshot;
  operations: OperationsSnapshot;
  capabilities: NeoCapabilities;
};
