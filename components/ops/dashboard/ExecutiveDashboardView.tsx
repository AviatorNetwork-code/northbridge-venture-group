"use client";

import { useNeo } from "@/lib/neo/context/NeoProvider";
import KpiCard from "../shared/KpiCard";
import ActivityFeed from "../shared/ActivityFeed";
import { StatusBadge } from "../shared/StatusBadge";

function StatTile({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="border border-white/10 bg-slate/60 p-4 animate-slide-in">
      <p className="text-xs uppercase tracking-wider text-silver">{label}</p>
      <p className="text-3xl font-semibold mt-1 tabular-nums">{value}</p>
      {sub && <p className="text-xs text-silver mt-1">{sub}</p>}
    </div>
  );
}

export default function ExecutiveDashboardView() {
  const { dashboard } = useNeo();

  if (!dashboard) {
    return <div className="p-8 text-silver animate-pulse">Loading operations data…</div>;
  }

  const revenue = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(dashboard.revenueMtd);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Executive Dashboard</h1>
          <p className="text-sm text-silver mt-1">Real-time view of your AI company at work</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={dashboard.systemHealth} variant="health" />
          <span className="text-xs text-silver">Updated {new Date(dashboard.lastUpdated).toLocaleTimeString()}</span>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboard.kpis.map((kpi) => (
          <KpiCard key={kpi.id} metric={kpi} />
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Active Specialists" value={dashboard.activeSpecialists} />
        <StatTile label="Active Managers" value={dashboard.activeManagers} />
        <StatTile label="Running Workflows" value={dashboard.runningWorkflows} />
        <StatTile label="Waiting Approvals" value={dashboard.waitingApprovals} />
        <StatTile label="Connected Integrations" value={dashboard.connectedIntegrations} />
        <StatTile label="Customer Conversations" value={dashboard.customerConversations} />
        <StatTile label="Revenue MTD" value={revenue} sub={`↑ ${dashboard.revenueTrend}% vs last month`} />
        <StatTile label="System Health" value={dashboard.systemHealth} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border border-white/10 bg-slate/40 p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-silver mb-4">Operations Pulse</h2>
          <div className="grid sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 border border-emerald-500/20 bg-emerald-500/5">
              <p className="text-2xl font-bold text-emerald-400">{dashboard.activeSpecialists}</p>
              <p className="text-xs text-silver mt-1">Specialists Working</p>
            </div>
            <div className="p-4 border border-amber-500/20 bg-amber-500/5">
              <p className="text-2xl font-bold text-amber-400">{dashboard.waitingApprovals}</p>
              <p className="text-xs text-silver mt-1">Needs Your Attention</p>
            </div>
            <div className="p-4 border border-cyan-500/20 bg-cyan-500/5">
              <p className="text-2xl font-bold text-cyan-400">{dashboard.customerConversations}</p>
              <p className="text-xs text-silver mt-1">Live Conversations</p>
            </div>
          </div>
        </div>
        <ActivityFeed limit={6} />
      </div>
    </div>
  );
}
