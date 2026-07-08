"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCat } from "@/components/cat/CatProvider";
import CatRecommendationPanel from "@/components/hire/CatRecommendationPanel";
import GrowthTimeline from "@/components/hire/GrowthTimeline";
import {
  ModuleContainer,
  ModuleHeader,
  SectionPanel,
  StatusPill,
} from "@/components/operations/ModuleUI";
import {
  getManagerById,
  getSpecialistById,
  getTeamById,
  managerCatalog,
  specialistCatalog,
  teamCatalog,
} from "@/lib/workforce/catalog";
import {
  buildPricingSummary,
  formatCurrency,
  getSpecialistPrice,
  getSpecialistTasks,
  upgradeTier,
} from "@/lib/workforce/pricing";
import {
  getHireRecommendations,
  recommendationsToSelection,
} from "@/lib/workforce/recommendations";
import { saveHireSelection } from "@/lib/workforce/storage";
import { useNeo } from "@/components/neo/NeoProvider";
import type { BusinessProfile } from "@/lib/cat/types";
import type { GrowthStage, SelectedSpecialist, WorkforceTier } from "@/lib/workforce/types";
import { TIER_LABELS, TIER_ORDER } from "@/lib/workforce/types";

type HireStep = "landing" | "discovery" | "recommend" | "review" | "customize" | "pricing";

const discoveryPresets = [
  { label: "I own a dental clinic", profile: { industry: "dental", employeeCount: 8 } },
  { label: "Restaurant with 15 staff", profile: { industry: "restaurant", employeeCount: 15 } },
  { label: "Small retail shop", profile: { industry: "retail", employeeCount: 6 } },
  { label: "Professional services firm", profile: { industry: "professional-services", employeeCount: 12 } },
];

export default function HireExperience() {
  const router = useRouter();
  const { client: neoClient } = useNeo();
  const { businessProfile, sendMessage, openCat } = useCat();

  const [step, setStep] = useState<HireStep>("landing");
  const [localProfile, setLocalProfile] = useState<BusinessProfile>({});
  const [selectedSpecialists, setSelectedSpecialists] = useState<SelectedSpecialist[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedManagers, setSelectedManagers] = useState<string[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);

  const mergedProfile = useMemo(
    () => ({ ...businessProfile, ...localProfile }),
    [businessProfile, localProfile],
  );

  const recommendations = useMemo(
    () => getHireRecommendations(mergedProfile),
    [mergedProfile],
  );

  const pricing = useMemo(
    () =>
      buildPricingSummary({
        specialists: selectedSpecialists,
        teams: selectedTeams,
        managers: selectedManagers,
      }),
    [selectedSpecialists, selectedTeams, selectedManagers],
  );

  const growthStage: GrowthStage = useMemo(() => {
    if (step === "landing" || step === "discovery") return "start";
    if (selectedManagers.length > 0) return "manager";
    if (selectedTeams.length > 0) return "team";
    if (selectedSpecialists.length > 0) return "specialists";
    return "start";
  }, [step, selectedManagers.length, selectedTeams.length, selectedSpecialists.length]);

  const applyRecommendations = () => {
    setSelectedSpecialists(recommendationsToSelection(recommendations));
    setSelectedTeams(recommendations.teamId ? [recommendations.teamId] : []);
    setSelectedManagers([]);
    setStep("review");
  };

  const toggleSpecialist = (catalogId: string) => {
    setSelectedSpecialists((current) => {
      const exists = current.find((item) => item.catalogId === catalogId);
      if (exists) {
        return current.filter((item) => item.catalogId !== catalogId);
      }
      return [...current, { catalogId, tier: "essential" }];
    });
  };

  const setSpecialistTier = (catalogId: string, tier: WorkforceTier) => {
    setSelectedSpecialists((current) =>
      current.map((item) => (item.catalogId === catalogId ? { ...item, tier } : item)),
    );
  };

  const handleStartOnboarding = async () => {
    setIsDeploying(true);
    try {
      const selection = saveHireSelection({
        specialists: selectedSpecialists,
        teams: selectedTeams,
        managers: selectedManagers,
        connectors: recommendations.connectorNames,
        businessProfile: mergedProfile,
      });

      await neoClient.workforce.deployWorkforce({
        selection,
        businessProfile: mergedProfile,
      });

      router.push("/operations/onboarding?from=hire");
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <ModuleContainer>
      <ModuleHeader
        eyebrow="Digital Workforce"
        title="Hire Your AI Employees"
        description="Build your workforce like hiring employees — not configuring software. CAT recommends the minimum you need. Customize, review pricing, and start onboarding."
      />

      <div className="mb-8">
        <GrowthTimeline currentStage={growthStage} />
      </div>

      {step === "landing" ? (
        <SectionPanel title="Welcome" subtitle="Hire AI employees for your business">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-silver">
                Northbridge Digital Workforce members handle real operational work — scheduling,
                customer service, billing, and more. CAT helps you hire the right people at the
                right time.
              </p>
              <ul className="space-y-2 text-sm text-silver">
                <li>• Specialists — your first AI employees</li>
                <li>• Teams — coordinated units for your industry</li>
                <li>• Managers — oversight when scale justifies it</li>
              </ul>
              <button
                type="button"
                onClick={() => setStep("discovery")}
                className="rounded-xl bg-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-hover"
              >
                Hire Workforce
              </button>
            </div>
            <CatRecommendationPanel summary="Tell me about your business and I'll recommend the smallest workforce that solves your problem. We can always grow later." />
          </div>
        </SectionPanel>
      ) : null}

      {step === "discovery" ? (
        <SectionPanel title="Business Discovery" subtitle="Help CAT understand your business">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <p className="text-sm text-silver">
                Adaptive questions only — pick a preset or chat with CAT for a tailored recommendation.
              </p>
              <div className="flex flex-wrap gap-2">
                {discoveryPresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setLocalProfile((current) => ({ ...current, ...preset.profile }));
                      void sendMessage(preset.label);
                    }}
                    className="rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-xs text-silver hover:border-red/30 hover:text-white"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-xs text-stone">Industry</span>
                  <input
                    value={localProfile.industry ?? mergedProfile.industry ?? ""}
                    onChange={(event) =>
                      setLocalProfile((current) => ({ ...current, industry: event.target.value }))
                    }
                    placeholder="e.g. dental"
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs text-stone">Employees</span>
                  <input
                    type="number"
                    min={1}
                    value={localProfile.employeeCount ?? mergedProfile.employeeCount ?? ""}
                    onChange={(event) =>
                      setLocalProfile((current) => ({
                        ...current,
                        employeeCount: Number(event.target.value) || undefined,
                      }))
                    }
                    placeholder="e.g. 8"
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
                  />
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={openCat}
                  className="rounded-lg border border-white/15 px-4 py-2 text-sm text-silver hover:border-white/30 hover:text-white"
                >
                  Chat with CAT
                </button>
                <button
                  type="button"
                  onClick={() => setStep("recommend")}
                  className="rounded-lg bg-red px-4 py-2 text-sm font-semibold text-white hover:bg-red-hover"
                >
                  See Recommendations
                </button>
              </div>
            </div>
            <CatRecommendationPanel summary={recommendations.catSummary} />
          </div>
        </SectionPanel>
      ) : null}

      {step === "recommend" ? (
        <div className="space-y-6">
          <CatRecommendationPanel summary={recommendations.catSummary} />
          <SectionPanel title="Recommended Workforce" subtitle="Minimum viable hire">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {recommendations.specialistIds.map((id) => {
                const specialist = getSpecialistById(id);
                if (!specialist) return null;
                return (
                  <article
                    key={id}
                    className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4"
                  >
                    <StatusPill status="Recommended" variant="success" />
                    <h3 className="mt-2 text-sm font-semibold text-white">{specialist.name}</h3>
                    <p className="mt-1 text-xs text-silver">
                      {formatCurrency(specialist.essentialPrice)}/mo · {specialist.essentialTasks} Team Tasks
                    </p>
                  </article>
                );
              })}
              {recommendations.deferredItems.map((item) => (
                <article
                  key={item.name}
                  className="rounded-xl border border-white/10 bg-black/20 p-4 opacity-70"
                >
                  <StatusPill status="Not yet" variant="neutral" />
                  <h3 className="mt-2 text-sm font-semibold text-white">{item.name}</h3>
                  <p className="mt-1 text-xs text-silver">{item.reason}</p>
                </article>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={applyRecommendations}
                className="rounded-lg bg-red px-4 py-2 text-sm font-semibold text-white hover:bg-red-hover"
              >
                Review Team
              </button>
              <button
                type="button"
                onClick={() => setStep("customize")}
                className="rounded-lg border border-white/15 px-4 py-2 text-sm text-silver hover:text-white"
              >
                Customize
              </button>
            </div>
          </SectionPanel>
        </div>
      ) : null}

      {(step === "review" || step === "customize") && (
        <div className="space-y-6">
          <SectionPanel
            title={step === "review" ? "Review Team" : "Customize Workforce"}
            subtitle="Add, remove, or upgrade your hires"
          >
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <SummaryStat label="Monthly" value={formatCurrency(pricing.monthlySubscription)} />
              <SummaryStat label="Team Tasks" value={String(pricing.includedTeamTasks)} />
              <SummaryStat label="Est. Hours Saved" value={`${pricing.estimatedHoursSaved} hrs`} />
            </div>

            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-red">
              Specialists
            </h3>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {specialistCatalog.map((specialist) => {
                const selected = selectedSpecialists.find((item) => item.catalogId === specialist.id);
                const isSelected = Boolean(selected);

                return (
                  <article
                    key={specialist.id}
                    className={[
                      "rounded-xl border p-4 transition-colors",
                      isSelected
                        ? "border-red/30 bg-red/5"
                        : "border-white/10 bg-black/30 hover:border-white/20",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-semibold text-white">{specialist.name}</h4>
                        <p className="mt-1 text-xs text-silver">
                          {formatCurrency(getSpecialistPrice(specialist.id, selected?.tier ?? "essential"))}/mo
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleSpecialist(specialist.id)}
                        className={[
                          "rounded-full px-3 py-1 text-xs font-medium",
                          isSelected
                            ? "bg-red text-white"
                            : "border border-white/15 text-silver hover:text-white",
                        ].join(" ")}
                      >
                        {isSelected ? "Hired" : "Hire"}
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-stone">{specialist.responsibilities.join(" · ")}</p>
                    {isSelected && selected ? (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {TIER_ORDER.map((tier) => (
                          <button
                            key={tier}
                            type="button"
                            onClick={() => setSpecialistTier(specialist.id, tier)}
                            className={[
                              "rounded-full px-2.5 py-1 text-[11px] font-medium",
                              selected.tier === tier
                                ? "bg-red/20 text-white ring-1 ring-red/40"
                                : "border border-white/10 text-stone hover:text-white",
                            ].join(" ")}
                          >
                            {TIER_LABELS[tier]}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() =>
                            setSpecialistTier(specialist.id, upgradeTier(selected.tier))
                          }
                          className="text-[11px] text-red hover:underline"
                        >
                          Upgrade
                        </button>
                        <span className="text-[11px] text-stone">
                          {getSpecialistTasks(specialist.id, selected.tier)} tasks
                        </span>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>

            <h3 className="mb-3 mt-8 text-xs font-semibold uppercase tracking-wider text-red">Teams</h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {teamCatalog.map((team) => {
                const isSelected = selectedTeams.includes(team.id);
                return (
                  <article
                    key={team.id}
                    className={[
                      "rounded-xl border p-4",
                      isSelected ? "border-red/30 bg-red/5" : "border-white/10 bg-black/30",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-semibold text-white">{team.name}</h4>
                        <p className="mt-1 text-xs text-silver">
                          {formatCurrency(team.monthlyPrice)}/mo · ROI {team.estimatedRoi}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedTeams((current) =>
                            isSelected
                              ? current.filter((id) => id !== team.id)
                              : [...current, team.id],
                          )
                        }
                        className="rounded-full border border-white/15 px-3 py-1 text-xs text-silver hover:text-white"
                      >
                        {isSelected ? "Remove" : "Add"}
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-stone">
                      Includes: {team.includedSpecialists.join(", ")}
                    </p>
                    <p className="mt-1 text-xs text-stone">Leader: {team.teamLeader}</p>
                  </article>
                );
              })}
            </div>

            <h3 className="mb-3 mt-8 text-xs font-semibold uppercase tracking-wider text-red">Managers</h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {managerCatalog.map((manager) => {
                const isSelected = selectedManagers.includes(manager.id);
                const notRecommended = selectedSpecialists.length < manager.minSpecialists;

                return (
                  <article
                    key={manager.id}
                    className={[
                      "rounded-xl border p-4",
                      notRecommended
                        ? "border-white/10 bg-black/20 opacity-60"
                        : isSelected
                          ? "border-red/30 bg-red/5"
                          : "border-white/10 bg-black/30",
                    ].join(" ")}
                  >
                    <h4 className="text-sm font-semibold text-white">{manager.name}</h4>
                    <p className="mt-1 text-xs text-silver">
                      {formatCurrency(manager.monthlyPrice)}/mo
                    </p>
                    {notRecommended ? (
                      <p className="mt-2 text-xs text-amber-300">
                        CAT recommends waiting — need {manager.minSpecialists}+ Specialists first.
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedManagers((current) =>
                            isSelected
                              ? current.filter((id) => id !== manager.id)
                              : [...current, manager.id],
                          )
                        }
                        className="mt-3 rounded-full border border-white/15 px-3 py-1 text-xs text-silver hover:text-white"
                      >
                        {isSelected ? "Remove" : "Add"}
                      </button>
                    )}
                  </article>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setStep("pricing")}
                disabled={selectedSpecialists.length === 0}
                className="rounded-lg bg-red px-4 py-2 text-sm font-semibold text-white hover:bg-red-hover disabled:opacity-50"
              >
                View Pricing
              </button>
              {step === "review" ? (
                <button
                  type="button"
                  onClick={() => setStep("customize")}
                  className="rounded-lg border border-white/15 px-4 py-2 text-sm text-silver hover:text-white"
                >
                  Customize
                </button>
              ) : null}
            </div>
          </SectionPanel>

          {step === "customize" ? (
            <SectionPanel title="Comparison" subtitle="Specialist tiers at a glance">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-stone">
                      <th className="pb-3 pr-4">Specialist</th>
                      <th className="pb-3 pr-4">Essential</th>
                      <th className="pb-3 pr-4">Pro</th>
                      <th className="pb-3 pr-4">Elite</th>
                      <th className="pb-3">Team Tasks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {specialistCatalog.map((specialist) => (
                      <tr key={specialist.id}>
                        <td className="py-3 pr-4 font-medium text-white">{specialist.name}</td>
                        <td className="py-3 pr-4 text-silver">{formatCurrency(specialist.essentialPrice)}</td>
                        <td className="py-3 pr-4 text-silver">{formatCurrency(specialist.proPrice)}</td>
                        <td className="py-3 pr-4 text-silver">{formatCurrency(specialist.elitePrice)}</td>
                        <td className="py-3 text-silver">
                          {specialist.essentialTasks} / {specialist.proTasks} / {specialist.eliteTasks}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionPanel>
          ) : null}
        </div>
      )}

      {step === "pricing" ? (
        <div className="space-y-6">
          <SectionPanel title="Pricing Summary" subtitle="Estimated monthly investment">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <SummaryStat label="Monthly Subscription" value={formatCurrency(pricing.monthlySubscription)} />
              <SummaryStat label="Included Team Tasks" value={String(pricing.includedTeamTasks)} />
              <SummaryStat
                label="Additional Task Pricing"
                value={`${formatCurrency(pricing.additionalTaskPrice)} / task`}
              />
              <SummaryStat label="Estimated Hours Saved" value={`${pricing.estimatedHoursSaved} hrs/mo`} />
              <SummaryStat label="Estimated ROI" value={pricing.estimatedRoi} />
              <SummaryStat label="Recommended Next Hire" value={pricing.recommendedNextHire} />
            </div>

            <div className="mt-6 rounded-xl border border-white/10 bg-black/30 p-4">
              <h3 className="text-sm font-semibold text-white">Your Hires</h3>
              <ul className="mt-3 space-y-2 text-sm text-silver">
                {selectedSpecialists.map((selected) => {
                  const specialist = getSpecialistById(selected.catalogId);
                  return (
                    <li key={selected.catalogId}>
                      {specialist?.name} — {TIER_LABELS[selected.tier]} —{" "}
                      {formatCurrency(getSpecialistPrice(selected.catalogId, selected.tier))}/mo
                    </li>
                  );
                })}
                {selectedTeams.map((teamId) => {
                  const team = getTeamById(teamId);
                  return (
                    <li key={teamId}>
                      {team?.name} — {formatCurrency(team?.monthlyPrice ?? 0)}/mo
                    </li>
                  );
                })}
                {selectedManagers.map((managerId) => {
                  const manager = getManagerById(managerId);
                  return (
                    <li key={managerId}>
                      {manager?.name} — {formatCurrency(manager?.monthlyPrice ?? 0)}/mo
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleStartOnboarding}
                disabled={isDeploying || selectedSpecialists.length === 0}
                className="rounded-lg bg-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-hover disabled:opacity-50"
              >
                {isDeploying ? "Preparing..." : "Start Onboarding"}
              </button>
              <button
                type="button"
                onClick={() => setStep("customize")}
                className="rounded-lg border border-white/15 px-4 py-2 text-sm text-silver hover:text-white"
              >
                Back to Customize
              </button>
            </div>
          </SectionPanel>

          <CatRecommendationPanel
            summary={`You're hiring ${selectedSpecialists.length} Specialist${selectedSpecialists.length === 1 ? "" : "s"} at ${formatCurrency(pricing.monthlySubscription)}/mo. ${pricing.recommendedNextHire}.`}
          />
        </div>
      ) : null}

      {step !== "landing" ? (
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              const order: HireStep[] = ["landing", "discovery", "recommend", "review", "customize", "pricing"];
              const index = order.indexOf(step);
              if (index > 0) setStep(order[index - 1]);
            }}
            className="text-sm text-stone hover:text-white"
          >
            ← Back
          </button>
          <Link href="/operations/workforce" className="text-sm text-stone hover:text-white">
            View Current Workforce
          </Link>
        </div>
      ) : null}
    </ModuleContainer>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate/60 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-stone">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
