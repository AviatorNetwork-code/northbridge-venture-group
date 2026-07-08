"use client";

export default function LiveMetricCard({
  label,
  value,
  hint,
  trend,
  pulse,
}: {
  label: string;
  value: string | number;
  hint?: string;
  trend?: string;
  pulse?: boolean;
}) {
  return (
    <div
      className={`border border-white/10 bg-slate p-4 sm:p-5 transition-all duration-500 ${
        pulse ? "animate-metric-pulse" : ""
      }`}
    >
      <p className="text-xs uppercase tracking-wider text-silver mb-2">{label}</p>
      <p className="text-2xl sm:text-3xl font-semibold text-white tabular-nums transition-all duration-300">
        {value}
      </p>
      {(hint || trend) && (
        <p className="mt-2 text-xs text-silver">
          {trend && <span className="text-emerald-400 mr-2">{trend}</span>}
          {hint}
        </p>
      )}
    </div>
  );
}
