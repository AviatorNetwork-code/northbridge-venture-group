"use client";

import CatMessageContent from "@/components/cat/CatMessageContent";

type CatRecommendationPanelProps = {
  summary: string;
};

export default function CatRecommendationPanel({ summary }: CatRecommendationPanelProps) {
  return (
    <aside className="rounded-xl border border-red/20 bg-red/5 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red text-sm font-bold text-white">
          CAT
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-red">
            Workforce Advisor
          </p>
          <p className="mt-0.5 text-sm font-medium text-white">
            Minimum solution first — never oversell
          </p>
          <div className="mt-3">
            <CatMessageContent content={summary} />
          </div>
        </div>
      </div>
    </aside>
  );
}
