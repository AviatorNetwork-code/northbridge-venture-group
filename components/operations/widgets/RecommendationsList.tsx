import StatusBadge from "@/components/operations/ui/StatusBadge";
import type { AIRecommendation } from "@/lib/neo/types";

export default function RecommendationsList({
  items,
}: {
  items: AIRecommendation[];
}) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item.id}
          className="border border-white/10 bg-slate/50 p-3 sm:p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-white">{item.title}</p>
              <p className="mt-1 text-xs text-silver">{item.summary}</p>
            </div>
            <StatusBadge
              label={item.priority}
              level={
                item.priority === "high"
                  ? "critical"
                  : item.priority === "medium"
                    ? "degraded"
                    : "healthy"
              }
            />
          </div>
          <p className="mt-2 text-[10px] uppercase tracking-wider text-silver">
            {item.category}
          </p>
        </li>
      ))}
    </ul>
  );
}
