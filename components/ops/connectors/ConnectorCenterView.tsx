"use client";

import { useNeo } from "@/lib/neo/context/NeoProvider";
import { StatusBadge } from "../shared/StatusBadge";

export default function ConnectorCenterView() {
  const { connectors, provider } = useNeo();

  if (!connectors) return <div className="p-8 text-silver">Loading connectors…</div>;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Connector Center</h1>
        <p className="text-sm text-silver mt-1">Integration health, OAuth status, and sync monitoring</p>
      </header>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {connectors.connectors.map((cn) => (
          <div key={cn.id} className="border border-white/10 bg-slate/60 p-4 animate-slide-in hover:border-white/20 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{cn.name}</h3>
                <p className="text-xs text-silver">{cn.category}</p>
              </div>
              <StatusBadge status={cn.status} variant="connector" />
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-silver">OAuth</span>
                <span className={cn.oauthConnected ? "text-emerald-400" : "text-amber-400"}>
                  {cn.oauthConnected ? "Connected" : "Required"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-silver">Last Sync</span>
                <span>{cn.lastSyncAt ? new Date(cn.lastSyncAt).toLocaleTimeString() : "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-silver">Health</span>
                <span>{cn.healthScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-silver">Token Age</span>
                <span>{cn.refreshTokenAgeDays}d</span>
              </div>
              <div className="flex justify-between">
                <span className="text-silver">Usage</span>
                <span>{cn.usageToday}/{cn.usageLimit}</span>
              </div>
            </div>

            <div className="mt-3 h-1 bg-white/10">
              <div
                className={`h-full transition-all duration-500 ${cn.healthScore > 80 ? "bg-emerald-500" : cn.healthScore > 50 ? "bg-amber-500" : "bg-red"}`}
                style={{ width: `${cn.healthScore}%` }}
              />
            </div>

            <p className="text-xs text-silver mt-2">Permissions: {cn.permissions.join(", ")}</p>

            {cn.errorMessage && (
              <p className="text-xs text-red mt-2">{cn.errorMessage}</p>
            )}

            {(cn.status === "authorization_required" || cn.status === "error") && (
              <button
                type="button"
                onClick={() => void provider.reconnectConnector(cn.id)}
                className="mt-4 w-full py-2 text-sm font-medium bg-red hover:bg-red-hover transition-colors"
              >
                Reconnect
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
