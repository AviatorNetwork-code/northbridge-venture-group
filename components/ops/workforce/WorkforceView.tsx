"use client";

import { useState } from "react";
import { useNeo } from "@/lib/neo/context/NeoProvider";
import type { WorkforceMember } from "@/lib/neo/types";
import { StatusBadge } from "../shared/StatusBadge";

function SpecialistDrawer({ member, onClose }: { member: WorkforceMember; onClose: () => void }) {
  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-charcoal border-l border-white/10 z-50 animate-slide-in overflow-y-auto">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">{member.name}</h2>
            <p className="text-sm text-silver">{member.department} · {member.role}</p>
          </div>
          <button type="button" onClick={onClose} className="text-silver hover:text-white">✕</button>
        </div>
        <div className="mt-4">
          <StatusBadge status={member.status} variant="workforce" />
        </div>
        {member.currentAssignment && (
          <div className="mt-6">
            <p className="text-xs uppercase tracking-wider text-silver">Current Assignment</p>
            <p className="mt-1 text-sm">{member.currentAssignment}</p>
          </div>
        )}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="border border-white/10 p-3">
            <p className="text-xs text-silver">Queue Size</p>
            <p className="text-xl font-semibold">{member.queueSize}</p>
          </div>
          <div className="border border-white/10 p-3">
            <p className="text-xs text-silver">Tasks (24h)</p>
            <p className="text-xl font-semibold">{member.tasksCompleted24h}</p>
          </div>
          <div className="border border-white/10 p-3">
            <p className="text-xs text-silver">Avg Response</p>
            <p className="text-xl font-semibold">{member.avgResponseMinutes}m</p>
          </div>
          <div className="border border-white/10 p-3">
            <p className="text-xs text-silver">Utilization</p>
            <p className="text-xl font-semibold">{member.utilizationPercent}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorkforceView() {
  const { workforce } = useNeo();
  const [selected, setSelected] = useState<WorkforceMember | null>(null);

  if (!workforce) return <div className="p-8 text-silver">Loading workforce…</div>;

  const specialists = workforce.members.filter((m) => m.role === "specialist");
  const managers = workforce.members.filter((m) => m.role === "manager");

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Digital Workforce</h1>
        <p className="text-sm text-silver mt-1">Organization chart and live specialist status</p>
      </header>

      <div className="border border-white/10 bg-slate/40 p-6 overflow-x-auto">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-silver mb-4">Organization Chart</h2>
        <div className="flex flex-col items-center gap-6 min-w-[600px]">
          {workforce.orgChart.filter((n) => n.id === "ceo").map((ceo) => (
            <div key={ceo.id} className="text-center">
              <div className="inline-block border border-red/30 bg-red/10 px-6 py-3">
                <p className="font-semibold">{ceo.name}</p>
                <p className="text-xs text-silver">{ceo.role}</p>
                <div className="mt-2"><StatusBadge status={ceo.status} variant="workforce" /></div>
              </div>
              <div className="flex justify-center gap-8 mt-6">
                {workforce.orgChart.filter((n) => ceo.children.includes(n.id)).map((mgr) => (
                  <div key={mgr.id} className="text-center">
                    <div className="border border-white/15 bg-slate/80 px-4 py-3">
                      <p className="font-medium text-sm">{mgr.name}</p>
                      <p className="text-xs text-silver">{mgr.department}</p>
                      <div className="mt-2"><StatusBadge status={mgr.status} variant="workforce" /></div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-xs">
                      {workforce.orgChart.filter((n) => mgr.children.includes(n.id)).map((sp) => {
                        const member = workforce.members.find((m) => m.id === sp.id);
                        if (!member) return null;
                        return (
                          <button
                            key={sp.id}
                            type="button"
                            onClick={() => setSelected(member)}
                            className="border border-white/10 bg-black/40 px-3 py-2 text-left hover:border-white/25 transition-colors"
                          >
                            <p className="text-xs font-medium">{sp.name}</p>
                            <StatusBadge status={sp.status} variant="workforce" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-silver mb-3">Active Specialists</h2>
          <div className="space-y-2">
            {specialists.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelected(m)}
                className="w-full border border-white/10 bg-slate/60 p-4 text-left hover:border-white/20 transition-colors animate-slide-in"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{m.name}</p>
                    <p className="text-xs text-silver">{m.department}</p>
                  </div>
                  <StatusBadge status={m.status} variant="workforce" />
                </div>
                {m.currentAssignment && <p className="text-xs text-silver mt-2 truncate">{m.currentAssignment}</p>}
                <div className="flex gap-4 mt-2 text-xs text-silver">
                  <span>Queue: {m.queueSize}</span>
                  <span>Util: {m.utilizationPercent}%</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-silver mb-3">Managers</h2>
          <div className="space-y-2">
            {managers.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelected(m)}
                className="w-full border border-white/10 bg-slate/60 p-4 text-left hover:border-white/20 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{m.name}</p>
                    <p className="text-xs text-silver">{m.department}</p>
                  </div>
                  <StatusBadge status={m.status} variant="workforce" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {selected && <SpecialistDrawer member={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
