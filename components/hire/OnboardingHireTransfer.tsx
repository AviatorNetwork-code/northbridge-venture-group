"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SectionPanel, StatusPill } from "@/components/operations/ModuleUI";
import { buildOnboardingTransferSummary, loadHireSelection } from "@/lib/workforce/storage";
import { formatCurrency } from "@/lib/workforce/pricing";
import { TIER_LABELS } from "@/lib/workforce/types";
import type { WorkforceTier } from "@/lib/workforce/types";

export default function OnboardingHireTransfer() {
  const searchParams = useSearchParams();
  const fromHire = searchParams.get("from") === "hire";
  const [summary, setSummary] = useState<ReturnType<typeof buildOnboardingTransferSummary> | null>(null);

  useEffect(() => {
    const selection = loadHireSelection();
    if (selection) {
      setSummary(buildOnboardingTransferSummary(selection));
    }
  }, []);

  if (!summary && !fromHire) return null;

  if (!summary) {
    return (
      <SectionPanel title="Workforce Transfer" subtitle="Awaiting hire selection">
        <p className="text-sm text-silver">
          No workforce selection found.{" "}
          <a href="/operations/hire" className="text-red hover:underline">
            Hire your workforce
          </a>{" "}
          to begin onboarding.
        </p>
      </SectionPanel>
    );
  }

  return (
    <SectionPanel title="Transferred Workforce" subtitle="From your hiring session">
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-white/10 bg-black/30 p-3">
          <p className="text-xs text-stone">Estimated Readiness</p>
          <p className="mt-1 text-2xl font-semibold text-white">{summary.estimatedReadiness}%</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/30 p-3">
          <p className="text-xs text-stone">Monthly Investment</p>
          <p className="mt-1 text-2xl font-semibold text-white">
            {formatCurrency(summary.monthlySubscription)}
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/30 p-3">
          <p className="text-xs text-stone">Team Tasks Included</p>
          <p className="mt-1 text-2xl font-semibold text-white">{summary.includedTeamTasks}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-red">
            Selected Specialists
          </h3>
          <ul className="space-y-2">
            {summary.specialists.map((specialist) => (
              <li
                key={`${specialist.name}-${specialist.tier}`}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-black/30 px-3 py-2"
              >
                <span className="text-sm text-white">{specialist.name}</span>
                <StatusPill
                  status={TIER_LABELS[specialist.tier as WorkforceTier]}
                  variant="info"
                />
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          {summary.teams.length > 0 ? (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-red">
                Selected Teams
              </h3>
              <ul className="space-y-2">
                {summary.teams.map((team) => (
                  <li
                    key={team}
                    className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
                  >
                    {team}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-red">
              Recommended Connectors
            </h3>
            <ul className="space-y-2">
              {summary.connectors.length > 0 ? (
                summary.connectors.map((connector) => (
                  <li
                    key={connector}
                    className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-silver"
                  >
                    {connector}
                  </li>
                ))
              ) : (
                <li className="text-sm text-stone">Google Calendar, Gmail</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-silver">
        Next recommended hire: {summary.recommendedNextHire}. Estimated {summary.estimatedHoursSaved}{" "}
        hours saved per month.
      </p>
    </SectionPanel>
  );
}
