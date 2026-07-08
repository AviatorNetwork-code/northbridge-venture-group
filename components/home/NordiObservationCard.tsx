"use client";

import type { ObservationRow } from "@/lib/nordi/cards";

type NordiObservationCardProps = {
  title: string;
  rows: ObservationRow[];
};

function rowToneClass(tone?: ObservationRow["tone"]): string {
  switch (tone) {
    case "positive":
      return "text-green-300";
    case "muted":
      return "text-stone";
    default:
      return "text-white";
  }
}

export default function NordiObservationCard({ title, rows }: NordiObservationCardProps) {
  return (
    <div className="animate-nordi-card rounded-xl border border-white/10 bg-black/30 p-3">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-red">{title}</p>
      <dl className="space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 text-sm">
            <dt className="text-stone">{row.label}</dt>
            <dd className={`font-medium ${rowToneClass(row.tone)}`}>
              {row.tone === "positive" && row.value !== "—" ? `✓ ${row.value}` : row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
