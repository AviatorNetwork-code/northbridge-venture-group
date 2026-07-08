"use client";

import { confidenceToneClass } from "@/lib/nordi/confidence";
import type { ConfidenceLevel } from "@/lib/nordi/confidence";

type NordiInsightCardProps = {
  title: string;
  observation: string;
  confidence: string;
  reason: string;
};

export default function NordiInsightCard({
  title,
  observation,
  confidence,
  reason,
}: NordiInsightCardProps) {
  const tone = confidenceToneClass(confidence as ConfidenceLevel);

  return (
    <div className="animate-nordi-card rounded-xl border border-white/10 bg-black/30 p-3">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-red">{title}</p>
      <p className="text-sm leading-relaxed text-white">{observation}</p>
      <div className="mt-3 border-t border-white/10 pt-3">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-stone">Confidence</span>
          <span className={`font-medium ${tone}`}>{confidence}</span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-stone">
          <span className="font-medium text-silver">Why? </span>
          {reason}
        </p>
      </div>
    </div>
  );
}
