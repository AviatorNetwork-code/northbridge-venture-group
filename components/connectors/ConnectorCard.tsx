"use client";

import type { ConnectorInstance } from "@/lib/connectors/connector-types";
import { STATUS_LABELS } from "@/lib/connectors/connector-types";
import { ProgressBar, StatusPill } from "@/components/operations/ModuleUI";
import { useConnectors } from "@/components/connectors/ConnectorProvider";

type ConnectorCardProps = {
  connector: ConnectorInstance;
};

function statusVariant(status: ConnectorInstance["status"]) {
  if (status === "connected") return "success" as const;
  if (status === "syncing" || status === "authorization_required") return "warning" as const;
  if (status === "needs_attention") return "danger" as const;
  return "neutral" as const;
}

export default function ConnectorCard({ connector }: ConnectorCardProps) {
  const { connect, disconnect, setActiveConnectorId } = useConnectors();
  const isConnected = connector.status === "connected" || connector.status === "syncing";

  return (
    <article className="rounded-xl border border-white/10 bg-black/30 p-5 transition-colors hover:border-white/20">
      <div className="flex items-start gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white"
          style={{ backgroundColor: connector.logoColor }}
        >
          {connector.logoInitials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-white">{connector.name}</h3>
              <p className="mt-0.5 text-xs text-silver">{connector.description}</p>
            </div>
            <StatusPill status={STATUS_LABELS[connector.status]} variant={statusVariant(connector.status)} />
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-stone">Capabilities</p>
          <p className="text-xs text-silver">{connector.capabilities.slice(0, 3).join(" · ")}</p>
        </div>

        {isConnected ? (
          <>
            <ProgressBar value={connector.health} label="Health" />
            <div className="flex flex-wrap gap-3 text-[11px] text-stone">
              <span>Last sync: {connector.lastSync ?? "—"}</span>
              {connector.connectedWorkforce.length > 0 ? (
                <span>Workforce: {connector.connectedWorkforce.join(", ")}</span>
              ) : null}
            </div>
          </>
        ) : (
          <p className="text-[11px] text-stone">
            Permissions: {connector.permissions.slice(0, 2).join(", ")}
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {isConnected ? (
          <>
            <button
              type="button"
              onClick={() => setActiveConnectorId(connector.id)}
              className="inline-flex min-h-11 items-center rounded-lg border border-white/15 px-4 py-2.5 text-xs text-silver hover:text-white"
            >
              Details
            </button>
            <button
              type="button"
              onClick={() => disconnect(connector.id)}
              className="inline-flex min-h-11 items-center rounded-lg border border-white/15 px-4 py-2.5 text-xs text-stone hover:text-red"
            >
              Disconnect
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => connect(connector.id)}
            className="inline-flex min-h-11 items-center rounded-lg bg-red px-4 py-2.5 text-xs font-semibold text-white hover:bg-red-hover"
          >
            Connect
          </button>
        )}
        <button
          type="button"
          onClick={() => setActiveConnectorId(connector.id)}
          className="inline-flex min-h-11 items-center rounded-lg border border-white/15 px-4 py-2.5 text-xs text-silver hover:text-white"
        >
          Learn More
        </button>
      </div>
    </article>
  );
}
