import StatusBadge from "@/components/operations/ui/StatusBadge";
import type { WorkItem } from "@/lib/neo/types";

const statusLabel: Record<WorkItem["status"], string> = {
  active: "Active",
  running: "Running",
  waiting_approval: "Waiting approval",
  escalated: "Escalated",
  completed: "Completed",
};

const statusLevel: Record<
  WorkItem["status"],
  "healthy" | "degraded" | "critical" | "unknown"
> = {
  active: "healthy",
  running: "healthy",
  waiting_approval: "degraded",
  escalated: "critical",
  completed: "unknown",
};

export default function WorkItemsList({ items }: { items: WorkItem[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-silver">No items in this queue.</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 border border-white/10 bg-slate/40 px-3 py-3"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{item.title}</p>
            <p className="text-xs text-silver mt-0.5">
              Updated {new Date(item.updatedAt).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge label={item.priority} level={statusLevel[item.status]} />
            <StatusBadge label={statusLabel[item.status]} level={statusLevel[item.status]} />
          </div>
        </li>
      ))}
    </ul>
  );
}
