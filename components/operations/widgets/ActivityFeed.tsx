import type { ActivityItem } from "@/lib/neo/types";

export default function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0"
        >
          <span className="mt-1.5 h-2 w-2 shrink-0 bg-red" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="text-sm text-white truncate">{item.label}</p>
            <p className="text-xs text-silver">
              {new Date(item.timestamp).toLocaleString()} · {item.type}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
