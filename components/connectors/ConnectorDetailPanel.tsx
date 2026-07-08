"use client";

import type { ConnectorInstance } from "@/lib/connectors/connector-types";
import { STATUS_LABELS } from "@/lib/connectors/connector-types";
import { getConnectorById } from "@/lib/connectors/connector-catalog";
import { useConnectors } from "@/components/connectors/ConnectorProvider";
import { ProgressBar, StatusPill } from "@/components/operations/ModuleUI";
import { IconClose } from "@/components/operations/icons";

export default function ConnectorDetailPanel() {
  const { activeConnectorId, setActiveConnectorId, instances } = useConnectors();

  if (!activeConnectorId) return null;

  const connector: ConnectorInstance | undefined =
    instances.find((item) => item.id === activeConnectorId) ??
    (() => {
      const catalog = getConnectorById(activeConnectorId);
      if (!catalog) return undefined;
      return {
        ...catalog,
        status: "available" as const,
        health: 0,
        lastSync: null,
        connectedWorkforce: [],
        permissionStatus: "none" as const,
        syncHistory: [],
        connectedAt: null,
      };
    })();

  if (!connector) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Close connector details"
        className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm"
        onClick={() => setActiveConnectorId(null)}
      />
      <aside
        role="dialog"
        aria-label={`${connector.name} details`}
        className="fixed inset-y-0 right-0 z-[56] flex w-full max-w-md flex-col border-l border-white/10 bg-charcoal shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-white/10 p-5">
          <div className="flex items-center gap-3">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-xl text-xs font-bold text-white"
              style={{ backgroundColor: connector.logoColor }}
            >
              {connector.logoInitials}
            </span>
            <div>
              <h2 className="text-lg font-semibold text-white">{connector.name}</h2>
              <p className="text-xs text-silver">{connector.provider}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveConnectorId(null)}
            className="rounded-md p-2 text-silver hover:text-white"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <StatusPill
            status={STATUS_LABELS[connector.status]}
            variant={connector.status === "connected" ? "success" : "warning"}
          />

          <section className="mt-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-red">Purpose</h3>
            <p className="mt-2 text-sm text-silver">{connector.description}</p>
          </section>

          <section className="mt-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-red">Capabilities</h3>
            <ul className="mt-2 space-y-1">
              {connector.capabilities.map((item) => (
                <li key={item} className="text-sm text-silver">• {item}</li>
              ))}
            </ul>
          </section>

          <section className="mt-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-red">Used By</h3>
            <p className="mt-2 text-sm text-white">Specialists</p>
            <p className="text-sm text-silver">{connector.usedBySpecialists.join(", ") || "—"}</p>
            {connector.usedByTeams.length > 0 ? (
              <>
                <p className="mt-2 text-sm text-white">Teams</p>
                <p className="text-sm text-silver">{connector.usedByTeams.join(", ")}</p>
              </>
            ) : null}
          </section>

          <section className="mt-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-red">Required For</h3>
            <ul className="mt-2 space-y-1">
              {connector.requiredFor.map((item) => (
                <li key={item} className="text-sm text-silver">• {item}</li>
              ))}
            </ul>
          </section>

          <section className="mt-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-red">Permissions</h3>
            <ul className="mt-2 space-y-1">
              {connector.permissions.map((item) => (
                <li key={item} className="text-sm text-silver">• {item}</li>
              ))}
            </ul>
          </section>

          {connector.status !== "available" ? (
            <>
              <section className="mt-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-red">Health</h3>
                <div className="mt-2">
                  <ProgressBar value={connector.health} label={`${connector.health}%`} />
                </div>
              </section>

              <section className="mt-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-red">Sync History</h3>
                <ul className="mt-2 space-y-2">
                  {connector.syncHistory.map((event) => (
                    <li
                      key={event.id}
                      className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-silver"
                    >
                      <span className="text-stone">{event.timestamp}</span> — {event.message}
                    </li>
                  ))}
                </ul>
              </section>
            </>
          ) : null}

          <section className="mt-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-red">Recommended Workflows</h3>
            <ul className="mt-2 space-y-1">
              {connector.recommendedWorkflows.map((item) => (
                <li key={item} className="text-sm text-silver">• {item}</li>
              ))}
            </ul>
          </section>

          {connector.relatedConnectors.length > 0 ? (
            <section className="mt-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-red">Related Connectors</h3>
              <p className="mt-2 text-sm text-silver">
                {connector.relatedConnectors
                  .map((id) => getConnectorById(id)?.name ?? id)
                  .join(", ")}
              </p>
            </section>
          ) : null}
        </div>
      </aside>
    </>
  );
}
