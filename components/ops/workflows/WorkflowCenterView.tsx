"use client";

import { useMemo, useState } from "react";
import { useNeo } from "@/lib/neo/context/NeoProvider";
import { StatusBadge } from "../shared/StatusBadge";

export default function WorkflowCenterView() {
  const { workflows, provider } = useNeo();
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!workflows) return [];
    let list = workflows.workflows;
    if (filter !== "all") list = list.filter((w) => w.status === filter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((w) => w.name.toLowerCase().includes(q) || w.owner.toLowerCase().includes(q));
    }
    return list;
  }, [workflows, filter, search]);

  if (!workflows) return <div className="p-8 text-silver">Loading workflows…</div>;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Workflow Center</h1>
        <p className="text-sm text-silver mt-1">Live timeline, tasks, approvals, and event stream</p>
      </header>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          placeholder="Search workflows…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-slate/80 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-white/25"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-slate/80 border border-white/10 px-4 py-2 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="running">Running</option>
          <option value="waiting_approval">Waiting approval</option>
          <option value="blocked">Blocked</option>
          <option value="escalated">Escalated</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {filtered.map((wf) => (
            <div key={wf.id} className="border border-white/10 bg-slate/60 p-4 animate-timeline-in">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{wf.name}</h3>
                  <p className="text-xs text-silver mt-1">Owner: {wf.owner}</p>
                </div>
                <StatusBadge status={wf.status === "running" ? "working" : wf.status === "waiting_approval" ? "waiting" : wf.status === "escalated" ? "escalated" : "idle"} variant="workforce" />
              </div>
              <div className="mt-3 h-1.5 bg-white/10 overflow-hidden">
                <div className="h-full bg-red transition-all duration-700" style={{ width: `${wf.progress}%` }} />
              </div>
              <p className="text-xs text-silver mt-1">{wf.progress}% complete</p>

              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase text-silver mb-2">Running Tasks</p>
                  <ul className="space-y-1">
                    {wf.tasks.map((t) => (
                      <li key={t.id} className="text-sm flex justify-between">
                        <span>{t.title}</span>
                        <span className="text-silver text-xs">{t.status}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs uppercase text-silver mb-2">Approvals</p>
                  {wf.approvals.length === 0 ? (
                    <p className="text-xs text-silver">None pending</p>
                  ) : (
                    <ul className="space-y-2">
                      {wf.approvals.map((a) => (
                        <li key={a.id} className="text-sm border border-amber-500/20 p-2">
                          <p>{a.title}</p>
                          <button
                            type="button"
                            onClick={() => void provider.approveWorkflow(a.id)}
                            className="text-xs text-amber-400 hover:text-amber-300 mt-1"
                          >
                            Approve
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {wf.escalations.length > 0 && (
                <div className="mt-4 border border-red/20 bg-red/5 p-3">
                  <p className="text-xs uppercase text-red mb-1">Escalations</p>
                  {wf.escalations.map((e) => (
                    <p key={e.id} className="text-sm">{e.title}: {e.reason}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="border border-white/10 bg-slate/40">
          <div className="px-4 py-3 border-b border-white/10">
            <h3 className="text-sm font-semibold">Event Stream</h3>
          </div>
          <ul className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
            {workflows.eventStream.map((ev) => (
              <li key={ev.id} className="px-4 py-3 text-sm animate-fade-in">
                <p className="text-white/90">{ev.message}</p>
                <p className="text-xs text-silver mt-1">{new Date(ev.timestamp).toLocaleTimeString()}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
