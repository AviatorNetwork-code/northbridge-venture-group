"use client";

import { useMemo, useState } from "react";
import type { ConnectorApp, ConnectorLifecycle } from "@/lib/neo/types";
import StatusBadge from "@/components/operations/ui/StatusBadge";
import { getNeoPlatform } from "@/lib/neo/platform";

const lifecycleLabel: Record<ConnectorLifecycle, string> = {
  connected: "Connected",
  connecting: "Connecting",
  authorization_required: "Authorization Required",
  error: "Error",
  syncing: "Syncing",
  healthy: "Healthy",
};

const lifecycleLevel: Record<
  ConnectorLifecycle,
  "healthy" | "degraded" | "critical" | "unknown"
> = {
  connected: "healthy",
  connecting: "degraded",
  authorization_required: "degraded",
  error: "critical",
  syncing: "degraded",
  healthy: "healthy",
};

export default function LiveConnectorGrid({
  connected,
  available,
}: {
  connected: ConnectorApp[];
  available: ConnectorApp[];
}) {
  const [reconnecting, setReconnecting] = useState<string | null>(null);

  const all = useMemo(
    () => [...connected, ...available],
    [connected, available]
  );

  async function handleReconnect(id: string) {
    setReconnecting(id);
    const neo = getNeoPlatform();
    await neo.connectors.reconnect?.(id);
    setTimeout(() => setReconnecting(null), 2000);
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {all.map((app) => (
        <article
          key={app.id}
          className={`border bg-slate/50 p-4 flex flex-col transition-all duration-500 ${
            app.lifecycle === "syncing" ? "border-red/30 animate-metric-pulse" : "border-white/10"
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-medium text-white">{app.name}</h4>
              <p className="text-xs text-silver mt-0.5">{app.category}</p>
            </div>
            <StatusBadge
              label={lifecycleLabel[app.lifecycle]}
              level={lifecycleLevel[app.lifecycle]}
            />
          </div>

          {app.errorMessage && (
            <p className="mt-2 text-xs text-red">{app.errorMessage}</p>
          )}

          <dl className="mt-3 space-y-1.5 text-xs text-silver flex-1">
            <div className="flex justify-between gap-2">
              <dt>OAuth</dt>
              <dd className="text-white capitalize">{app.oauthStatus}</dd>
            </div>
            {app.lastSyncAt && (
              <div className="flex justify-between gap-2">
                <dt>Last sync</dt>
                <dd className="text-white">
                  {new Date(app.lastSyncAt).toLocaleTimeString()}
                </dd>
              </div>
            )}
            <div className="flex justify-between gap-2">
              <dt>Token age</dt>
              <dd className="text-white">{app.refreshTokenAgeDays}d</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt>Usage</dt>
              <dd className="text-white">{app.usagePercent}%</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt>Health</dt>
              <dd>
                <StatusBadge label={app.health} level={app.health} />
              </dd>
            </div>
            {app.permissions.length > 0 && (
              <div>
                <dt className="mb-1">Permissions</dt>
                <dd className="text-white">{app.permissions.join(", ")}</dd>
              </div>
            )}
          </dl>

          {(app.lifecycle === "error" ||
            app.lifecycle === "authorization_required" ||
            app.oauthStatus === "expired") && (
            <button
              type="button"
              disabled={reconnecting === app.id}
              onClick={() => handleReconnect(app.id)}
              className="mt-4 w-full py-2 text-xs font-medium bg-red text-white hover:bg-red-hover transition-colors disabled:opacity-50"
            >
              {reconnecting === app.id ? "Reconnecting…" : "Reconnect"}
            </button>
          )}
          {!app.connected &&
            app.lifecycle !== "error" &&
            app.lifecycle !== "authorization_required" && (
              <button
                type="button"
                className="mt-4 w-full py-2 text-xs font-medium border border-white/20 text-white hover:border-red transition-colors"
              >
                Connect
              </button>
            )}
        </article>
      ))}
    </div>
  );
}
