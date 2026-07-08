export default function MetricCard({
  label,
  value,
  hint,
  trend,
}: {
  label: string;
  value: string | number;
  hint?: string;
  trend?: string;
}) {
  return (
    <div className="border border-white/10 bg-slate p-4 sm:p-5">
      <p className="text-xs uppercase tracking-wider text-silver mb-2">{label}</p>
      <p className="text-2xl sm:text-3xl font-semibold text-white tabular-nums">
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
