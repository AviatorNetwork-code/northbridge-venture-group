"use client";

import { useNeo } from "@/lib/neo/context/NeoProvider";
import type { AnalyticsDataPoint } from "@/lib/neo/types";

function BarChart({ data, title, color = "#B11226" }: { data: AnalyticsDataPoint[]; title: string; color?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="border border-white/10 bg-slate/60 p-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-silver mb-4">{title}</h3>
      <div className="flex items-end gap-2 h-40">
        {data.map((point) => (
          <div key={point.label} className="flex-1 flex flex-col items-center gap-1 group">
            <div className="w-full flex items-end justify-center h-32">
              <div
                className="w-full max-w-[32px] transition-all duration-700 hover:opacity-80"
                style={{
                  height: `${(point.value / max) * 100}%`,
                  backgroundColor: color,
                  minHeight: point.value > 0 ? "4px" : "0",
                }}
                title={`${point.label}: ${point.value}`}
              />
            </div>
            <span className="text-[10px] text-silver group-hover:text-white">{point.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricRing({ value, label, max = 100 }: { value: number; label: string; max?: number }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="border border-white/10 bg-slate/60 p-4 text-center">
      <div className="relative w-24 h-24 mx-auto">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="rgb(255 255 255 / 0.1)"
            strokeWidth="2"
          />
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#B11226"
            strokeWidth="2"
            strokeDasharray={`${pct}, 100`}
            className="transition-all duration-700"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold">{value}{max === 100 ? "%" : ""}</span>
      </div>
      <p className="text-xs text-silver mt-2 uppercase tracking-wider">{label}</p>
    </div>
  );
}

export default function AnalyticsView() {
  const { analytics } = useNeo();

  if (!analytics) return <div className="p-8 text-silver">Loading analytics…</div>;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-sm text-silver mt-1">Interactive operational metrics</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricRing value={analytics.automationPercent} label="Automation" />
        <div className="border border-white/10 bg-slate/60 p-4 text-center">
          <p className="text-3xl font-semibold">{analytics.avgResponseTimeMinutes}m</p>
          <p className="text-xs text-silver mt-2 uppercase">Avg Response</p>
        </div>
        <div className="border border-white/10 bg-slate/60 p-4 text-center">
          <p className="text-3xl font-semibold">{analytics.customerSatisfaction}</p>
          <p className="text-xs text-silver mt-2 uppercase">CSAT / 5</p>
        </div>
        <div className="border border-white/10 bg-slate/60 p-4 text-center">
          <p className="text-3xl font-semibold">{analytics.workflowsPerDay[analytics.workflowsPerDay.length - 1]?.value ?? 0}</p>
          <p className="text-xs text-silver mt-2 uppercase">Workflows Today</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <BarChart data={analytics.workflowsPerDay} title="Workflows / Day" />
        <BarChart data={analytics.tasksCompleted} title="Tasks Completed" color="#22c55e" />
        <BarChart data={analytics.conversationVolume} title="Conversation Volume" color="#06b6d4" />
        <BarChart data={analytics.specialistUtilization} title="Specialist Utilization %" color="#f59e0b" />
        <BarChart data={analytics.connectorHealth} title="Connector Health %" color="#8b5cf6" />
      </div>
    </div>
  );
}
