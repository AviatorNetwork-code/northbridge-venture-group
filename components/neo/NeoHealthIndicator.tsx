"use client";

import { NEO_HEALTH_COLORS, NEO_HEALTH_LABELS } from "@/lib/neo/health";
import { useNeoOptional } from "@/components/neo/NeoProvider";

export default function NeoHealthIndicator() {
  const neo = useNeoOptional();

  if (!neo?.health) return null;

  const { health, isCheckingHealth } = neo;
  const label = isCheckingHealth ? "NEO…" : NEO_HEALTH_LABELS[health.status];
  const color = isCheckingHealth ? "text-stone" : NEO_HEALTH_COLORS[health.status];

  return (
    <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-slate/60 px-2 py-1.5 lg:flex">
      <span
        className={`h-2 w-2 rounded-full ${
          health.status === "connected"
            ? "bg-emerald-400"
            : health.status === "mock"
              ? "bg-amber-400"
              : health.status === "degraded"
                ? "bg-orange-400"
                : "bg-red"
        }`}
        aria-hidden="true"
      />
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-stone">NEO</p>
        <p className={`text-xs font-medium ${color}`}>{label}</p>
      </div>
    </div>
  );
}
