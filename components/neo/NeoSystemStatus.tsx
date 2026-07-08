"use client";

import { NEO_HEALTH_COLORS, NEO_HEALTH_LABELS } from "@/lib/neo/health";
import { useNeo } from "@/components/neo/NeoProvider";

const statusHeadline: Record<string, string> = {
  connected: "NEO connected",
  mock: "Mock mode active",
  degraded: "NEO degraded — mock fallback",
  unavailable: "NEO unavailable",
};

export default function NeoSystemStatus() {
  const { health, isCheckingHealth } = useNeo();

  if (!health) return null;

  const gatewayLabel = isCheckingHealth ? "Checking…" : NEO_HEALTH_LABELS[health.status];
  const gatewayColor = isCheckingHealth ? "text-silver" : NEO_HEALTH_COLORS[health.status];

  return (
    <section
      aria-labelledby="system-status-heading"
      className="rounded-xl border border-white/10 bg-slate/40 p-5 sm:p-6"
    >
      <h2
        id="system-status-heading"
        className="text-xs font-semibold uppercase tracking-wider text-red"
      >
        System Status
      </h2>
      <p className="mt-1 text-lg font-semibold text-white">
        {statusHeadline[health.status] ?? "System status"}
      </p>
      {health.message ? (
        <p className="mt-1 text-xs text-silver">{health.message}</p>
      ) : null}

      <ul className="mt-5 space-y-3">
        {[
          {
            label: "NEO Gateway",
            status: gatewayLabel,
            color: gatewayColor,
          },
          {
            label: "Agent Runtime",
            status: health.status === "unavailable" ? "Offline" : "Online",
            color: health.status === "unavailable" ? "text-red" : "text-emerald-400",
          },
          {
            label: "Workflow Engine",
            status: "Online",
            color: "text-emerald-400",
          },
          {
            label: "Connector Mesh",
            status: health.status === "unavailable" ? "Degraded" : "Online",
            color: health.status === "unavailable" ? "text-orange-400" : "text-emerald-400",
          },
        ].map((item) => (
          <li
            key={item.label}
            className="flex items-center justify-between rounded-lg border border-white/10 bg-black/30 px-3 py-2.5"
          >
            <span className="text-sm text-silver">{item.label}</span>
            <span className={`text-xs font-medium ${item.color}`}>{item.status}</span>
          </li>
        ))}
      </ul>

      {health.latencyMs !== undefined && health.status === "connected" ? (
        <p className="mt-3 text-[11px] text-stone">Latency: {health.latencyMs}ms</p>
      ) : null}
    </section>
  );
}
