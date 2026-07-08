import StatusBadge from "@/components/operations/ui/StatusBadge";
import type { SystemHealthSnapshot } from "@/lib/neo/types";

export default function SystemHealthPanel({
  health,
}: {
  health: SystemHealthSnapshot;
}) {
  const rows: { label: string; level: SystemHealthSnapshot["platform"] }[] = [
    { label: "NEO Platform", level: health.platform },
    { label: "Connectors", level: health.connectors },
    { label: "Workforce", level: health.workforce },
    { label: "Messaging", level: health.messaging },
  ];

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-center justify-between border border-white/10 px-3 py-2.5"
        >
          <span className="text-sm text-white">{row.label}</span>
          <StatusBadge label={row.level} level={row.level} />
        </div>
      ))}
      <p className="text-xs text-silver pt-1">
        Last checked {new Date(health.lastCheckedAt).toLocaleString()}
      </p>
    </div>
  );
}
