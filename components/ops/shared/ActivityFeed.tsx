"use client";

import { useNeo } from "@/lib/neo/context/NeoProvider";
import { StatusBadge } from "./StatusBadge";

export default function ActivityFeed({ limit = 8 }: { limit?: number }) {
  const { activity } = useNeo();
  const items = activity.slice(0, limit);

  return (
    <div className="border border-white/10 bg-slate/60">
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wide">Activity Feed</h3>
        <span className="text-xs text-silver">Live</span>
      </div>
      <ul className="divide-y divide-white/5 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <li key={item.id} className="px-4 py-3 text-sm animate-fade-in">
            <div className="flex items-start justify-between gap-2">
              <p className="text-white/90">{item.message}</p>
              <StatusBadge
                status={item.severity === "error" ? "escalated" : item.severity === "warning" ? "waiting" : item.severity === "success" ? "working" : "idle"}
                variant="workforce"
              />
            </div>
            <p className="text-xs text-silver mt-1">
              {item.domain} · {new Date(item.timestamp).toLocaleTimeString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
