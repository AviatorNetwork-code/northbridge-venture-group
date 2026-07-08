import { buildOperationsSnapshot } from "@/lib/cat/operations-context";
import { adaptCapabilities, adaptNeoResponse } from "@/lib/neo/adapters/cat-adapter";
import { adaptConnectorsSnapshot } from "@/lib/neo/adapters/connector-adapter";
import { adaptLaunchStatusSnapshot } from "@/lib/neo/adapters/launch-adapter";
import { adaptOperationsSnapshot } from "@/lib/neo/adapters/operations-adapter";
import { adaptWorkforceSnapshot } from "@/lib/neo/adapters/workforce-adapter";
import { createHealthSnapshot } from "@/lib/neo/health";
import type { NeoConnectorApi } from "@/lib/neo/connector-api";
import type { NeoLaunchApi } from "@/lib/neo/launch-api";
import type { NeoWorkforceApi } from "@/lib/neo/workforce-api";
import type { NeoProviderBundle } from "@/lib/neo/providers/types";
import { createMockProvider } from "@/lib/neo/providers/mock-provider";
import type {
  NeoClient,
  NeoConnectionStatus,
  NeoRequest,
  NeoResponse,
  NeoSendOptions,
} from "@/lib/neo/types";

const REQUEST_TIMEOUT_MS = 5000;

async function fetchJson<T>(
  baseUrl: string,
  path: string,
  init?: RequestInit,
): Promise<{ data: T | null; latencyMs: number; ok: boolean }> {
  const started = Date.now();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(init?.headers ?? {}),
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return { data: null, latencyMs: Date.now() - started, ok: false };
    }

    const data = (await response.json()) as T;
    return { data, latencyMs: Date.now() - started, ok: true };
  } catch {
    return { data: null, latencyMs: Date.now() - started, ok: false };
  }
}

function createLocalCatClient(baseUrl: string, fallback: NeoClient): NeoClient {
  let status: NeoConnectionStatus = "disconnected";

  return {
    get status() {
      return status;
    },
    async connect() {
      const ping = await fetchJson<{ status?: string }>(baseUrl, "/health");
      status = ping.ok ? "connected" : "disconnected";
    },
    async disconnect() {
      status = "disconnected";
    },
    async send(request: NeoRequest, options: NeoSendOptions): Promise<NeoResponse> {
      if (options.currentModule === "homepage") {
        return fallback.send(request, options);
      }

      const result = await fetchJson<unknown>(baseUrl, "/api/cat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request, options }),
      });

      const adapted = adaptNeoResponse(result.data);
      if (adapted) {
        return {
          ...adapted,
          metadata: { ...adapted.metadata, source: "local-neo" },
        };
      }

      return fallback.send(request, options);
    },
  };
}

function createLocalWorkforceApi(baseUrl: string, fallback: NeoWorkforceApi): NeoWorkforceApi {
  return {
    async getRecommendations(profile) {
      const result = await fetchJson<unknown>(baseUrl, "/api/workforce/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });

      if (result.ok && result.data) {
        return result.data as Awaited<ReturnType<NeoWorkforceApi["getRecommendations"]>>;
      }

      return fallback.getRecommendations(profile);
    },
    async deployWorkforce(request) {
      const result = await fetchJson<unknown>(baseUrl, "/api/workforce/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (result.ok && result.data) {
        return result.data as Awaited<ReturnType<NeoWorkforceApi["deployWorkforce"]>>;
      }

      return fallback.deployWorkforce(request);
    },
  };
}

function createLocalConnectorApi(baseUrl: string, fallback: NeoConnectorApi): NeoConnectorApi {
  return {
    async authorize(connectorId) {
      const result = await fetchJson<unknown>(baseUrl, `/api/connectors/${connectorId}/authorize`, {
        method: "POST",
      });

      if (result.ok && result.data) {
        return result.data as Awaited<ReturnType<NeoConnectorApi["authorize"]>>;
      }

      return fallback.authorize(connectorId);
    },
    async completeAuthorization(connectorId) {
      const result = await fetchJson<unknown>(
        baseUrl,
        `/api/connectors/${connectorId}/complete`,
        { method: "POST" },
      );

      if (result.ok && result.data) {
        return result.data as Awaited<ReturnType<NeoConnectorApi["completeAuthorization"]>>;
      }

      return fallback.completeAuthorization(connectorId);
    },
    async runHealthCheck(connectorId) {
      const result = await fetchJson<unknown>(
        baseUrl,
        `/api/connectors/${connectorId}/health`,
        { method: "POST" },
      );

      if (result.ok && result.data) {
        return result.data as Awaited<ReturnType<NeoConnectorApi["runHealthCheck"]>>;
      }

      return fallback.runHealthCheck(connectorId);
    },
    async disconnect(connectorId) {
      const result = await fetchJson<unknown>(baseUrl, `/api/connectors/${connectorId}`, {
        method: "DELETE",
      });

      if (result.ok) return;
      return fallback.disconnect(connectorId);
    },
    async getState() {
      const result = await fetchJson<unknown>(baseUrl, "/api/connectors/state");
      if (result.ok && result.data) {
        return result.data as Awaited<ReturnType<NeoConnectorApi["getState"]>>;
      }

      return fallback.getState();
    },
  };
}

function createLocalLaunchApi(baseUrl: string, fallback: NeoLaunchApi): NeoLaunchApi {
  return {
    async assess(input) {
      const result = await fetchJson<unknown>(baseUrl, "/api/launch/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (result.ok && result.data) {
        return result.data as Awaited<ReturnType<NeoLaunchApi["assess"]>>;
      }

      return fallback.assess(input);
    },
    async launchWorkforce(input) {
      const result = await fetchJson<unknown>(baseUrl, "/api/launch/workforce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (result.ok && result.data) {
        return result.data as Awaited<ReturnType<NeoLaunchApi["launchWorkforce"]>>;
      }

      return fallback.launchWorkforce(input);
    },
    async saveProgress() {
      const result = await fetchJson<unknown>(baseUrl, "/api/launch/progress", {
        method: "POST",
      });

      if (result.ok && result.data) {
        return result.data as Awaited<ReturnType<NeoLaunchApi["saveProgress"]>>;
      }

      return fallback.saveProgress();
    },
  };
}

export function createLocalProvider(baseUrl: string): NeoProviderBundle {
  const fallback = createMockProvider();

  const workforce = createLocalWorkforceApi(baseUrl, fallback.workforce);
  const connectors = createLocalConnectorApi(baseUrl, fallback.connectors);
  const launch = createLocalLaunchApi(baseUrl, fallback.launch);
  const cat = createLocalCatClient(baseUrl, fallback.cat);

  return {
    mode: "local",
    workforce,
    connectors,
    launch,
    cat,
    getWorkforce: async () => {
      const result = await fetchJson<unknown>(baseUrl, "/api/workforce");
      const adapted = adaptWorkforceSnapshot(result.data);
      if (adapted) return adapted;
      return fallback.getWorkforce();
    },
    getConnectors: async () => {
      const result = await fetchJson<unknown>(baseUrl, "/api/connectors");
      const adapted = adaptConnectorsSnapshot(result.data);
      if (adapted) return adapted;
      return fallback.getConnectors();
    },
    getLaunchStatus: async () => {
      const result = await fetchJson<unknown>(baseUrl, "/api/launch");
      const adapted = adaptLaunchStatusSnapshot(result.data);
      if (adapted) return adapted;
      return fallback.getLaunchStatus();
    },
    getOperationsSnapshot: async (currentModule) => {
      const result = await fetchJson<unknown>(
        baseUrl,
        `/api/operations/snapshot?module=${encodeURIComponent(currentModule)}`,
      );
      const adapted = adaptOperationsSnapshot(result.data);
      if (adapted) return adapted;
      return buildOperationsSnapshot(currentModule);
    },
    getCapabilities: async () => {
      const result = await fetchJson<unknown>(baseUrl, "/api/capabilities");
      const adapted = adaptCapabilities(result.data);
      if (adapted) return adapted;
      return fallback.getCapabilities();
    },
    ping: async () => {
      const result = await fetchJson<{ status?: string }>(baseUrl, "/health");
      return { ok: result.ok, latencyMs: result.latencyMs };
    },
    health: async () => {
      const ping = await fetchJson<{ status?: string }>(baseUrl, "/health");

      if (ping.ok) {
        return createHealthSnapshot({
          status: "connected",
          configuredProvider: "local",
          activeProvider: "local",
          baseUrl,
          latencyMs: ping.latencyMs,
          message: "Connected to local NEO service",
        });
      }

      return createHealthSnapshot({
        status: "degraded",
        configuredProvider: "local",
        activeProvider: "mock",
        baseUrl,
        latencyMs: ping.latencyMs,
        message: "Local NEO unavailable — using mock fallback",
      });
    },
  };
}
