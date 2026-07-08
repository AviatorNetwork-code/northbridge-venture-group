import type { HealthLevel } from "@/lib/neo/types";

const styles: Record<HealthLevel, string> = {
  healthy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  degraded: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  critical: "bg-red/15 text-red border-red/30",
  unknown: "bg-white/5 text-silver border-white/10",
};

export default function StatusBadge({
  label,
  level,
}: {
  label: string;
  level: HealthLevel;
}) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium border ${styles[level]}`}
    >
      {label}
    </span>
  );
}
