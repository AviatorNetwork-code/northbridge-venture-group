"use client";

import { useMemo, useState } from "react";
import type { WorkItem, WorkflowStreamEvent } from "@/lib/neo/types";
import WorkItemsList from "@/components/operations/widgets/WorkItemsList";
import Panel from "@/components/operations/ui/Panel";

export default function WorkflowMonitor({
  workItems,
  events,
  audit,
}: {
  workItems: WorkItem[];
  events: WorkflowStreamEvent[];
  audit: { id: string; action: string; actor: string; timestamp: string; detail: string }[];
}) {
  const [filter, setFilter] = useState<
    "all" | "active" | "waiting_approval" | "escalated" | "running"
  >("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let items = workItems;
    if (filter !== "all") {
      items = items.filter((w) => w.status === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter((w) => w.title.toLowerCase().includes(q));
    }
    return items;
  }, [workItems, filter, search]);

  const running = workItems.filter(
    (w) => w.status === "running" || w.status === "active"
  );
  const approvals = workItems.filter((w) => w.status === "waiting_approval");
  const escalations = workItems.filter((w) => w.status === "escalated");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          placeholder="Search work items…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-slate border border-white/10 px-3 py-2 text-sm text-white placeholder:text-stone focus:outline-none focus:border-red/50"
        />
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["all", "All"],
              ["running", "Running"],
              ["waiting_approval", "Approvals"],
              ["escalated", "Escalations"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider border transition-colors ${
                filter === key
                  ? "border-red bg-red/10 text-white"
                  : "border-white/10 text-silver hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Running tasks">
          <WorkItemsList items={running} />
        </Panel>
        <Panel title="Approvals">
          <WorkItemsList items={approvals} />
        </Panel>
        <Panel title="Escalations">
          <WorkItemsList items={escalations} />
        </Panel>
      </div>

      <Panel title="Filtered work items">
        <WorkItemsList items={filtered} />
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Live event stream">
          <ul className="space-y-2 max-h-80 overflow-y-auto">
            {events.map((e) => (
              <li
                key={e.id}
                className="border-l-2 border-red pl-3 py-1 animate-timeline-in"
              >
                <p className="text-sm text-white">{e.label}</p>
                <p className="text-xs text-silver">
                  {e.actor} · {new Date(e.timestamp).toLocaleTimeString()} ·{" "}
                  {e.kind}
                </p>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Audit history">
          <ul className="space-y-2 max-h-80 overflow-y-auto text-sm">
            {audit.map((entry) => (
              <li key={entry.id} className="border-b border-white/5 pb-2">
                <p className="text-white font-medium">{entry.action}</p>
                <p className="text-xs text-silver">
                  {entry.actor} · {new Date(entry.timestamp).toLocaleString()}
                </p>
                <p className="text-xs text-silver mt-1">{entry.detail}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
