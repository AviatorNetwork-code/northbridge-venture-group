"use client";

import type { AnalyticsDataPoint } from "@/lib/neo/types";

export default function BarChart({
  data,
  color = "bg-red",
  height = 120,
}: {
  data: AnalyticsDataPoint[];
  color?: string;
  height?: number;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((point) => (
        <div key={point.label} className="flex-1 flex flex-col items-center gap-1">
          <div
            className={`w-full ${color} transition-all duration-700 ease-out rounded-t-sm min-h-[4px]`}
            style={{ height: `${(point.value / max) * 100}%` }}
            title={`${point.label}: ${point.value}`}
          />
          <span className="text-[10px] text-silver">{point.label}</span>
        </div>
      ))}
    </div>
  );
}
