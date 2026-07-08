import type { WorkforceStatus, ConnectorStatus, SystemHealth, SlaStatus, Sentiment } from "@/lib/neo/types";

const workforceColors: Record<WorkforceStatus, string> = {
  idle: "bg-stone/30 text-silver border-stone/50",
  working: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  waiting: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  escalated: "bg-red/15 text-red border-red/30",
  offline: "bg-white/5 text-white/40 border-white/10",
};

const connectorColors: Record<ConnectorStatus, string> = {
  connected: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  connecting: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  authorization_required: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  error: "bg-red/15 text-red border-red/30",
  syncing: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  healthy: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
};

const healthColors: Record<SystemHealth, string> = {
  healthy: "text-emerald-400",
  degraded: "text-amber-400",
  critical: "text-red",
};

const slaColors: Record<SlaStatus, string> = {
  on_track: "text-emerald-400",
  at_risk: "text-amber-400",
  breached: "text-red",
};

const sentimentColors: Record<Sentiment, string> = {
  positive: "text-emerald-400",
  neutral: "text-silver",
  negative: "text-amber-400",
  urgent: "text-red",
};

export function StatusBadge({
  status,
  variant = "workforce",
}: {
  status: string;
  variant?: "workforce" | "connector" | "health" | "sla" | "sentiment";
}) {
  const palette =
    variant === "connector"
      ? connectorColors[status as ConnectorStatus] ?? "bg-white/5 text-silver border-white/10"
      : variant === "health"
        ? `${healthColors[status as SystemHealth] ?? "text-silver"} border-current/30 bg-current/10`
        : variant === "sla"
          ? `${slaColors[status as SlaStatus] ?? "text-silver"} border-current/30 bg-current/10`
          : variant === "sentiment"
            ? `${sentimentColors[status as Sentiment] ?? "text-silver"} border-current/30 bg-current/10`
            : workforceColors[status as WorkforceStatus] ?? "bg-white/5 text-silver border-white/10";

  const label = status.replace(/_/g, " ");

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium uppercase tracking-wide border ${palette}`}>
      {(variant === "workforce" || variant === "connector") && status !== "offline" && (
        <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse-slow" />
      )}
      {label}
    </span>
  );
}

export function PulseDot({ color = "emerald" }: { color?: "emerald" | "amber" | "red" | "cyan" }) {
  const colors = {
    emerald: "bg-emerald-400",
    amber: "bg-amber-400",
    red: "bg-red",
    cyan: "bg-cyan-400",
  };
  return (
    <span className="relative flex h-2 w-2">
      <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${colors[color]}`} />
      <span className={`relative inline-flex h-2 w-2 rounded-full ${colors[color]}`} />
    </span>
  );
}
