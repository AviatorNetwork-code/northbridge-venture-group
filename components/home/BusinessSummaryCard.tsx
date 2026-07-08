"use client";

import type { DiscoveryProfile } from "@/lib/cat/discovery-types";
import { getBusinessSummaryFields } from "@/lib/cat/profile-confidence";
import { formatKnownSince, formatLastUpdated } from "@/lib/nordi/relationship";

type BusinessSummaryCardProps = {
  profile: DiscoveryProfile;
  knownSince: string;
  lastUpdated: string;
};

export default function BusinessSummaryCard({
  profile,
  knownSince,
  lastUpdated,
}: BusinessSummaryCardProps) {
  const fields = getBusinessSummaryFields(
    profile,
    knownSince,
    lastUpdated,
    formatKnownSince,
    formatLastUpdated,
  );
  const visible = Boolean(profile.industry || (profile.userMessageCount ?? 0) > 0);

  if (!visible) return null;

  return (
    <aside
      className="mb-4 animate-fade-slide-up rounded-xl border border-white/10 bg-slate/40 p-4"
      aria-label="Business summary"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-red">
        Business Summary
      </p>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-[11px] uppercase tracking-wider text-stone">Business</dt>
          <dd className="mt-0.5 font-medium text-white">{fields.business}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wider text-stone">Employees</dt>
          <dd className="mt-0.5 font-medium text-white">{fields.employees}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wider text-stone">Locations</dt>
          <dd className="mt-0.5 font-medium text-white">{fields.locations}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wider text-stone">Website</dt>
          <dd className="mt-0.5 font-medium text-white">{fields.website}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wider text-stone">Known Since</dt>
          <dd className="mt-0.5 font-medium text-white">{fields.knownSince}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wider text-stone">Conversation Confidence</dt>
          <dd className="mt-0.5 font-medium text-white">{fields.confidence}</dd>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <dt className="text-[11px] uppercase tracking-wider text-stone">Last Updated</dt>
          <dd className="mt-0.5 font-medium text-white">{fields.lastUpdated}</dd>
        </div>
      </dl>
    </aside>
  );
}
