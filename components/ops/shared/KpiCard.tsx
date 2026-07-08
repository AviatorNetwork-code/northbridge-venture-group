import type { KpiMetric } from "@/lib/neo/types";

function formatValue(metric: KpiMetric): string {
  if (metric.format === "currency" && typeof metric.value === "number") {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(metric.value);
  }
  if (metric.format === "percent") return `${metric.value}${metric.unit ?? "%"}`;
  if (metric.format === "duration") return `${metric.value}${metric.unit ? ` ${metric.unit}` : ""}`;
  return `${metric.value}${metric.unit ? metric.unit : ""}`;
}

export default function KpiCard({ metric }: { metric: KpiMetric }) {
  const trendUp = (metric.trend ?? 0) >= 0;

  return (
    <div className="border border-white/10 bg-slate/80 p-4 animate-slide-in hover:border-white/20 transition-colors">
      <p className="text-xs uppercase tracking-wider text-silver mb-2">{metric.label}</p>
      <p className="text-2xl font-semibold text-white tabular-nums">{formatValue(metric)}</p>
      {metric.trend !== undefined && (
        <p className={`text-xs mt-2 ${trendUp ? "text-emerald-400" : "text-red"}`}>
          {trendUp ? "↑" : "↓"} {Math.abs(metric.trend)}% {metric.trendLabel ?? "vs yesterday"}
        </p>
      )}
    </div>
  );
}
