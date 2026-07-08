import {
  workforceManagers,
  workforceSpecialists,
  workforceTeams,
} from "@/components/operations/module-mock-data";
import { buildOperationsSnapshot } from "@/lib/cat/operations-context";
import { mergeConnectorInstances, summarizeConnectorHealth } from "@/lib/connectors/connector-health";
import { loadConnectorState } from "@/lib/connectors/connector-storage";
import { buildLaunchAssessment, getDefaultWorkforceIfEmpty } from "@/lib/launch/launch-engine";
import { loadLaunchState } from "@/lib/launch/launch-storage";
import { createHealthSnapshot } from "@/lib/neo/health";
import { mockNeoClient } from "@/lib/neo/mock-client";
import { mockNeoConnectorApi } from "@/lib/neo/connector-api";
import { mockNeoLaunchApi } from "@/lib/neo/launch-api";
import { mockNeoWorkforceApi } from "@/lib/neo/workforce-api";
import type { NeoProviderBundle } from "@/lib/neo/providers/types";
import type {
  ConnectorsSnapshot,
  LaunchStatusSnapshot,
  NeoCapabilities,
  WorkforceSnapshot,
} from "@/lib/neo/snapshots";
import { loadHireSelection } from "@/lib/workforce/storage";

function buildMockWorkforceSnapshot(): WorkforceSnapshot {
  const avgWorkload = workforceSpecialists.length
    ? Math.round(
        workforceSpecialists.reduce((sum, specialist) => sum + specialist.workload, 0) /
          workforceSpecialists.length,
      )
    : 0;

  const hireSelection = typeof window !== "undefined" ? loadHireSelection() : null;

  return {
    specialistCount: hireSelection?.specialists.length ?? workforceSpecialists.length,
    teamCount: hireSelection?.teams.length ?? workforceTeams.length,
    managerCount: hireSelection?.managers.length ?? workforceManagers.length,
    avgWorkload,
    deploymentStatus: hireSelection ? "queued" : "none",
  };
}

function buildMockConnectorsSnapshot(): ConnectorsSnapshot {
  const runtime = typeof window !== "undefined" ? loadConnectorState() : {};
  const instances = mergeConnectorInstances(runtime);
  const health = summarizeConnectorHealth(instances);

  return {
    total: health.total,
    connected: health.connected,
    syncing: health.syncing,
    needsAttention: health.needsAttention,
    avgHealth: health.avgHealth,
    lastSyncLabel: health.lastSyncLabel,
    readyToLaunch: health.readyToLaunch,
  };
}

function buildMockLaunchStatusSnapshot(): LaunchStatusSnapshot {
  const launchState = typeof window !== "undefined" ? loadLaunchState() : { launched: false };
  const hireSelection =
    typeof window !== "undefined" ? loadHireSelection() : getDefaultWorkforceIfEmpty(null, {});
  const connectorInstances = mergeConnectorInstances(
    typeof window !== "undefined" ? loadConnectorState() : {},
  );

  const assessment = buildLaunchAssessment({
    profile: hireSelection?.businessProfile ?? {},
    hireSelection,
    connectorInstances,
  });

  return {
    status: assessment.status,
    score: assessment.scores.overall,
    launched: launchState.launched,
    blockerCount: assessment.blockers.length,
    estimatedGoLive: assessment.estimatedGoLive,
  };
}

function buildMockCapabilities(): NeoCapabilities {
  return {
    workforce: true,
    connectors: true,
    launch: true,
    cat: true,
    billing: false,
    oauth: false,
    operationsSnapshot: true,
  };
}

export function createMockProvider(): NeoProviderBundle {
  return {
    mode: "mock",
    workforce: mockNeoWorkforceApi,
    connectors: mockNeoConnectorApi,
    launch: mockNeoLaunchApi,
    cat: mockNeoClient,
    getWorkforce: async () => buildMockWorkforceSnapshot(),
    getConnectors: async () => buildMockConnectorsSnapshot(),
    getLaunchStatus: async () => buildMockLaunchStatusSnapshot(),
    getOperationsSnapshot: async (currentModule) => buildOperationsSnapshot(currentModule),
    getCapabilities: async () => buildMockCapabilities(),
    ping: async () => ({ ok: true, latencyMs: 0 }),
    health: async () =>
      createHealthSnapshot({
        status: "mock",
        configuredProvider: "mock",
        activeProvider: "mock",
        message: "Running with mock NEO provider",
      }),
  };
}
