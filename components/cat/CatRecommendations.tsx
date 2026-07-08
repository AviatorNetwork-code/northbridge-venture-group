"use client";

import type { CatRecommendation } from "@/lib/cat/types";
import { groupRecommendations } from "@/lib/cat/engine";

type CatRecommendationsProps = {
  recommendations: CatRecommendation[];
};

const tierLabels: Record<CatRecommendation["tier"], string> = {
  specialist: "Specialist",
  team: "Team",
  manager: "Manager",
  "regional-manager": "Regional Manager",
  connector: "Connector",
};

const statusStyles: Record<CatRecommendation["status"], string> = {
  recommended: "border-emerald-500/30 bg-emerald-500/5",
  optional: "border-amber-500/30 bg-amber-500/5",
  "not-recommended": "border-white/10 bg-black/20",
};

export default function CatRecommendations({ recommendations }: CatRecommendationsProps) {
  const grouped = groupRecommendations(recommendations);

  if (recommendations.length === 0) return null;

  return (
    <div className="mt-3 space-y-3 rounded-lg border border-white/10 bg-black/30 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-red">
        Recommendations
      </p>

      {grouped.recommended.length > 0 ? (
        <div>
          <p className="mb-1.5 text-xs font-medium text-emerald-300">Start with</p>
          <div className="space-y-2">
            {grouped.recommended.map((item) => (
              <RecommendationCard key={`${item.tier}-${item.name}`} item={item} />
            ))}
          </div>
        </div>
      ) : null}

      {grouped.optional.length > 0 ? (
        <div>
          <p className="mb-1.5 text-xs font-medium text-amber-300">Optional</p>
          <div className="space-y-2">
            {grouped.optional.map((item) => (
              <RecommendationCard key={`${item.tier}-${item.name}`} item={item} />
            ))}
          </div>
        </div>
      ) : null}

      {grouped.notRecommended.length > 0 ? (
        <div>
          <p className="mb-1.5 text-xs font-medium text-stone">Not yet</p>
          <div className="space-y-2">
            {grouped.notRecommended.map((item) => (
              <RecommendationCard key={`${item.tier}-${item.name}`} item={item} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function RecommendationCard({ item }: { item: CatRecommendation }) {
  return (
    <div className={`rounded-lg border p-2.5 ${statusStyles[item.status]}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-white">{item.name}</p>
        <span className="text-[10px] uppercase tracking-wide text-stone">
          {tierLabels[item.tier]}
        </span>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-silver">{item.reason}</p>
    </div>
  );
}
