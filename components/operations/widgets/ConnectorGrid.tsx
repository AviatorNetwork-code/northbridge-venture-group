import StatusBadge from "@/components/operations/ui/StatusBadge";
import type { ConnectorApp } from "@/lib/neo/types";

export default function ConnectorGrid({
  apps,
  showConnect,
}: {
  apps: ConnectorApp[];
  showConnect?: boolean;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {apps.map((app) => (
        <article
          key={app.id}
          className="border border-white/10 bg-slate/50 p-4 flex flex-col"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-medium text-white">{app.name}</h4>
              <p className="text-xs text-silver mt-0.5">{app.category}</p>
            </div>
            <StatusBadge label={app.health} level={app.health} />
          </div>
          <dl className="mt-3 space-y-1 text-xs text-silver flex-1">
            <div className="flex justify-between gap-2">
              <dt>Connected</dt>
              <dd className="text-white">{app.connected ? "Yes" : "No"}</dd>
            </div>
            {app.lastSyncAt && (
              <div className="flex justify-between gap-2">
                <dt>Last sync</dt>
                <dd className="text-white">
                  {new Date(app.lastSyncAt).toLocaleString()}
                </dd>
              </div>
            )}
            {app.permissions.length > 0 && (
              <div>
                <dt className="mb-1">Permissions</dt>
                <dd className="text-white">{app.permissions.join(", ")}</dd>
              </div>
            )}
          </dl>
          {showConnect && !app.connected && (
            <button
              type="button"
              className="mt-4 w-full py-2 text-xs font-medium bg-red text-white hover:bg-red-hover transition-colors"
            >
              Connect
            </button>
          )}
        </article>
      ))}
    </div>
  );
}
