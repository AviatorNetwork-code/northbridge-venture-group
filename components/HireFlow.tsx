"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  industries,
  pricingRegions,
  workforceCatalog,
  type CatalogItem,
  type WorkforceLevel,
} from "@/lib/workforce";
import type { AdvisorRecommendation, Region, Volume } from "@/lib/workforceAdvisor";
import {
  onboardingChecklist,
  type Connector,
  type ConnectorId,
} from "@/lib/neo/connectors";

const TIER_ORDER: WorkforceLevel[] = [
  "Specialist",
  "Team",
  "Manager",
  "Regional Manager",
];

const STEPS = ["Discover", "Recommendation", "Onboarding", "Hire"] as const;

function priceFor(tier: WorkforceLevel, region: Region): string {
  const regionName = region === "CO" ? "Colombia" : "United States";
  const r = pricingRegions.find((p) => p.region === regionName);
  return r?.rows.find((row) => row.tier === tier)?.price ?? "contact us";
}

type HireResult = {
  reference: string;
  message: string;
  intent: string;
};

export default function HireFlow() {
  const [step, setStep] = useState(0);

  // Step 1 — discovery
  const [industry, setIndustry] = useState<string>("");
  const [volume, setVolume] = useState<Volume>("medium");
  const [locations, setLocations] = useState<number>(1);
  const [region, setRegion] = useState<Region>("US");

  // Step 2 — recommendation + selection
  const [rec, setRec] = useState<AdvisorRecommendation | null>(null);
  const [loadingRec, setLoadingRec] = useState(false);
  const [selected, setSelected] = useState<CatalogItem | null>(null);

  // Step 3 — connectors (mock connect state)
  const [connected, setConnected] = useState<ConnectorId[]>([]);

  // Step 4 — hire
  const [hiring, setHiring] = useState(false);
  const [result, setResult] = useState<HireResult | null>(null);

  const checklist = useMemo(() => onboardingChecklist(industry || undefined), [industry]);
  const requiredIds = checklist.required.map((c) => c.id);
  const allRequiredConnected = requiredIds.every((id) => connected.includes(id));

  const fetchRecommendation = useCallback(async () => {
    setLoadingRec(true);
    try {
      const res = await fetch("/api/cat/workforce-advisor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ industry, volume, locations, region }),
      });
      const data = (await res.json()) as { recommendation: AdvisorRecommendation };
      setRec(data.recommendation);
      const preset =
        workforceCatalog.find((c) => c.tier === data.recommendation.recommendedPlan) ??
        null;
      setSelected(preset);
    } catch {
      setRec(null);
    } finally {
      setLoadingRec(false);
    }
  }, [industry, volume, locations, region]);

  async function goToRecommendation() {
    setStep(1);
    await fetchRecommendation();
  }

  function toggleConnector(id: ConnectorId) {
    setConnected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  }

  async function submitHire(intent: "start-setup" | "early-access") {
    setHiring(true);
    try {
      const res = await fetch("/api/workforce/hire", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          plan: selected?.tier ?? rec?.recommendedPlan,
          role: selected?.name,
          industry,
          region,
          connectors: connected,
          intent,
        }),
      });
      const data = (await res.json()) as HireResult;
      setResult({ reference: data.reference, message: data.message, intent });
      setStep(4);
    } catch {
      setResult({
        reference: "unavailable",
        message:
          "We couldn't reach the setup service just now. Please try again, or contact our team.",
        intent,
      });
      setStep(4);
    } finally {
      setHiring(false);
    }
  }

  const selectedTier = selected?.tier ?? rec?.recommendedPlan ?? "Specialist";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress */}
      <ol className="flex items-center gap-2 sm:gap-3 mb-8 sm:mb-12 text-[11px] sm:text-xs">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-2 sm:gap-3">
            <span
              className={`inline-flex items-center gap-2 ${
                i === step
                  ? "text-white"
                  : i < step
                    ? "text-red"
                    : "text-silver/50"
              }`}
            >
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-semibold ${
                  i === step
                    ? "border-red bg-red text-white"
                    : i < step
                      ? "border-red text-red"
                      : "border-white/20 text-silver/50"
                }`}
              >
                {i + 1}
              </span>
              <span className="hidden sm:inline font-medium uppercase tracking-wider">
                {label}
              </span>
            </span>
            {i < STEPS.length - 1 && (
              <span className="w-4 sm:w-8 h-px bg-white/15" aria-hidden />
            )}
          </li>
        ))}
      </ol>

      {/* Step 1 — Discovery */}
      {step === 0 && (
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-3">
            Let&apos;s find your workforce.
          </h1>
          <p className="text-silver text-sm sm:text-base mb-8 leading-relaxed">
            A few quick questions. CAT will recommend the smallest useful
            solution — and won&apos;t push you to hire more than you need.
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                What kind of business do you run?
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-black border border-white/15 rounded-none px-4 py-3 text-sm text-white focus:outline-none focus:border-red/60"
              >
                <option value="">Select an industry…</option>
                {industries.map((i) => (
                  <option key={i.name} value={i.name}>
                    {i.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="block text-sm font-medium text-white mb-2">
                How busy is the work you want covered?
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    ["low", "Just starting"],
                    ["medium", "Steady"],
                    ["high", "Slammed"],
                  ] as [Volume, string][]
                ).map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setVolume(val)}
                    aria-pressed={volume === val}
                    className={`px-3 py-3 text-sm border transition-colors ${
                      volume === val
                        ? "border-red bg-red/10 text-white"
                        : "border-white/15 text-silver hover:border-white/30"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  How many locations?
                </label>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={locations}
                  onChange={(e) =>
                    setLocations(Math.max(1, Math.min(99, Number(e.target.value) || 1)))
                  }
                  className="w-full bg-black border border-white/15 px-4 py-3 text-sm text-white focus:outline-none focus:border-red/60"
                />
              </div>
              <div>
                <span className="block text-sm font-medium text-white mb-2">
                  Pricing region
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      ["CO", "Colombia"],
                      ["US", "United States"],
                    ] as [Region, string][]
                  ).map(([val, label]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setRegion(val)}
                      aria-pressed={region === val}
                      className={`px-3 py-3 text-sm border transition-colors ${
                        region === val
                          ? "border-red bg-red/10 text-white"
                          : "border-white/15 text-silver hover:border-white/30"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={goToRecommendation}
            disabled={!industry}
            className="mt-8 w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium bg-red text-white hover:bg-red-hover transition-colors disabled:opacity-50"
          >
            See my recommendation →
          </button>
        </div>
      )}

      {/* Step 2 — Recommendation + Catalog + Pricing */}
      {step === 1 && (
        <div>
          {loadingRec && <p className="text-silver text-sm">CAT is thinking…</p>}
          {!loadingRec && rec && (
            <>
              <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-2">
                CAT recommends: {rec.recommendedPlan}
              </h2>
              <p className="text-silver text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
                {rec.why}
              </p>

              {/* Growth path */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <div className="p-4 border border-red bg-red/10">
                  <p className="text-[11px] uppercase tracking-wider text-red font-semibold">
                    Start now
                  </p>
                  <p className="text-white font-semibold mt-1">{rec.recommendedPlan}</p>
                  <p className="text-white text-sm mt-1">
                    {priceFor(rec.recommendedPlan, region)}
                  </p>
                </div>
                <div className="p-4 border border-white/15">
                  <p className="text-[11px] uppercase tracking-wider text-silver/70 font-semibold">
                    Grow into
                  </p>
                  <p className="text-white font-semibold mt-1">
                    {TIER_ORDER[
                      Math.min(
                        TIER_ORDER.indexOf(rec.recommendedPlan) + 1,
                        TIER_ORDER.length - 1,
                      )
                    ]}
                  </p>
                  <p className="text-silver text-sm mt-1">when volume grows</p>
                </div>
                <div className="p-4 border border-white/10 bg-white/[0.02]">
                  <p className="text-[11px] uppercase tracking-wider text-silver/70 font-semibold">
                    Not needed yet
                  </p>
                  <p className="text-silver font-semibold mt-1">Manager</p>
                  <p className="text-silver/70 text-sm mt-1">no upfront upsell</p>
                </div>
              </div>

              <div className="rounded-lg bg-white/[0.04] border border-white/10 px-4 py-3 mb-4">
                <p className="text-[11px] uppercase tracking-wider text-silver/70 mb-0.5">
                  CAT won&apos;t oversell
                </p>
                <p className="text-silver text-sm">{rec.notRecommended}</p>
              </div>
              <p className="text-xs text-silver/70 mb-8">
                Estimated capacity: {rec.estimatedTeamTasks}
              </p>

              {/* Catalog */}
              <h3 className="text-lg font-semibold text-white mb-1">
                Choose from the workforce catalog
              </h3>
              <p className="text-silver text-sm mb-4">
                Your recommended tier is highlighted. You can start anywhere.
              </p>
              <div className="space-y-6 mb-8">
                {(["Specialist", "Team", "Manager"] as WorkforceLevel[]).map((tier) => (
                  <div key={tier}>
                    <p className="text-[11px] uppercase tracking-wider text-red/90 mb-2">
                      {tier === "Manager" ? "Managers" : `${tier}s`}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {workforceCatalog
                        .filter((c) =>
                          tier === "Manager"
                            ? c.tier === "Manager" || c.tier === "Regional Manager"
                            : c.tier === tier,
                        )
                        .map((item) => {
                          const isSelected = selected?.name === item.name;
                          const isRecommendedTier = item.tier === rec.recommendedPlan;
                          return (
                            <button
                              key={item.name}
                              type="button"
                              onClick={() => setSelected(item)}
                              className={`text-left p-4 border transition-colors ${
                                isSelected
                                  ? "border-red bg-red/10"
                                  : isRecommendedTier
                                    ? "border-red/40 hover:border-red/70"
                                    : "border-white/10 hover:border-white/25"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-white font-medium text-sm">
                                  {item.name}
                                </span>
                                <span className="text-xs text-silver whitespace-nowrap">
                                  {priceFor(item.tier, region)}
                                </span>
                              </div>
                              <p className="text-silver text-xs mt-1 leading-relaxed">
                                {item.role}
                              </p>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing preview */}
              <h3 className="text-lg font-semibold text-white mb-3">Pricing preview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                {pricingRegions.map((r) => {
                  const active = r.region === (region === "CO" ? "Colombia" : "United States");
                  return (
                    <div
                      key={r.region}
                      className={`p-5 border ${active ? "border-red" : "border-white/10"} bg-black`}
                    >
                      <div className="flex items-baseline justify-between mb-3">
                        <span className="text-white font-semibold">{r.region}</span>
                        <span className="text-[11px] uppercase tracking-wider text-red font-semibold">
                          {r.note}
                        </span>
                      </div>
                      <ul className="divide-y divide-white/10">
                        {r.rows.map((row) => (
                          <li
                            key={row.tier}
                            className="flex items-center justify-between py-2 text-sm"
                          >
                            <span className="text-silver">{row.tier}</span>
                            <span className="text-white tabular-nums">{row.price}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium bg-red text-white hover:bg-red-hover transition-colors"
                >
                  Continue to onboarding →
                </button>
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium border border-white/25 text-white hover:border-white/50 transition-colors"
                >
                  ← Back
                </button>
              </div>
            </>
          )}
          {!loadingRec && !rec && (
            <div>
              <p className="text-silver text-sm mb-4">
                We couldn&apos;t reach the advisor service. Please try again.
              </p>
              <button
                type="button"
                onClick={fetchRecommendation}
                className="px-6 py-3 text-sm font-medium bg-red text-white hover:bg-red-hover transition-colors"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 3 — Onboarding / connectors */}
      {step === 2 && (
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-2">
            Connect your tools
          </h2>
          <p className="text-silver text-sm sm:text-base mb-2 leading-relaxed max-w-2xl">
            Your {selectedTier} works inside the tools you already use. Connecting
            is mocked here — no live sign-in, and no data leaves your browser.
          </p>
          <p className="text-xs text-silver/70 mb-8">
            {connected.filter((id) => requiredIds.includes(id)).length} of{" "}
            {requiredIds.length} required connectors linked
          </p>

          {(
            [
              ["Required", checklist.required],
              ["Recommended", checklist.recommended],
              ["Optional", checklist.optional],
            ] as [string, Connector[]][]
          ).map(([label, list]) =>
            list.length === 0 ? null : (
              <div key={label} className="mb-6">
                <p className="text-[11px] uppercase tracking-wider text-red/90 mb-2">
                  {label}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {list.map((c) => {
                    const isConnected = connected.includes(c.id);
                    return (
                      <div
                        key={c.id}
                        className="flex items-center justify-between gap-3 p-4 border border-white/10 bg-black"
                      >
                        <div className="min-w-0">
                          <p className="text-white text-sm font-medium">{c.name}</p>
                          <p className="text-silver text-xs">{c.blurb}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleConnector(c.id)}
                          aria-pressed={isConnected}
                          className={`shrink-0 px-4 py-2 text-xs font-medium border transition-colors ${
                            isConnected
                              ? "border-red bg-red/10 text-white"
                              : "border-white/25 text-white hover:border-red/60"
                          }`}
                        >
                          {isConnected ? "✓ Connected" : "Connect"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ),
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium bg-red text-white hover:bg-red-hover transition-colors"
            >
              {allRequiredConnected ? "Continue →" : "Skip for now →"}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium border border-white/25 text-white hover:border-white/50 transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>
      )}

      {/* Step 4 — Hire / confirmation */}
      {step === 3 && (
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-6">
            Review &amp; start
          </h2>
          <div className="border border-white/10 bg-black p-5 sm:p-6 mb-6 space-y-3 text-sm">
            <Row label="Workforce" value={selected?.name ?? selectedTier} />
            <Row label="Tier" value={selectedTier} />
            <Row label="Industry" value={industry || "—"} />
            <Row
              label="Region"
              value={region === "CO" ? "Colombia" : "United States"}
            />
            <Row label="Starting price" value={priceFor(selectedTier, region)} />
            <Row
              label="Connectors linked"
              value={connected.length ? `${connected.length}` : "none yet"}
            />
          </div>
          <p className="text-xs text-silver/70 mb-6">
            No payment is taken and nothing is provisioned yet. This starts an
            early-access setup request.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              disabled={hiring}
              onClick={() => submitHire("start-setup")}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium bg-red text-white hover:bg-red-hover transition-colors disabled:opacity-50"
            >
              {hiring ? "Starting…" : "Start setup"}
            </button>
            <button
              type="button"
              disabled={hiring}
              onClick={() => submitHire("early-access")}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium border border-white/25 text-white hover:border-white/50 transition-colors disabled:opacity-50"
            >
              Request early access
            </button>
          </div>
          <button
            type="button"
            onClick={() => setStep(2)}
            className="mt-4 text-sm text-silver hover:text-white transition-colors"
          >
            ← Back
          </button>
        </div>
      )}

      {/* Step 5 — Confirmation */}
      {step === 4 && result && (
        <div className="max-w-xl">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red/15 border border-red mb-5">
            <span className="text-red text-xl" aria-hidden>
              ✓
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-3">
            You&apos;re on the early access list.
          </h2>
          <p className="text-silver text-sm sm:text-base leading-relaxed mb-5">
            {result.message}
          </p>
          <div className="border border-white/10 bg-black p-4 mb-6">
            <p className="text-[11px] uppercase tracking-wider text-silver/70">
              Reference
            </p>
            <p className="text-white font-mono text-lg">{result.reference}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium bg-red text-white hover:bg-red-hover transition-colors"
            >
              Talk to our team
            </Link>
            <button
              type="button"
              onClick={() => {
                setStep(0);
                setRec(null);
                setSelected(null);
                setConnected([]);
                setResult(null);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium border border-white/25 text-white hover:border-white/50 transition-colors"
            >
              Start over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 last:border-0 last:pb-0">
      <span className="text-silver">{label}</span>
      <span className="text-white text-right">{value}</span>
    </div>
  );
}
