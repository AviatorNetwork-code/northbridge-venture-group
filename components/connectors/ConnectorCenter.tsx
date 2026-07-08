"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCat } from "@/components/cat/CatProvider";
import ConnectorAuthModal from "@/components/connectors/ConnectorAuthModal";
import ConnectorCard from "@/components/connectors/ConnectorCard";
import ConnectorDetailPanel from "@/components/connectors/ConnectorDetailPanel";
import { useConnectors } from "@/components/connectors/ConnectorProvider";
import CatRecommendationPanel from "@/components/hire/CatRecommendationPanel";
import {
  MetricCard,
  ModuleContainer,
  ModuleHeader,
  SectionPanel,
} from "@/components/operations/ModuleUI";
import { connectorCategories } from "@/lib/connectors/connector-catalog";
import {
  buildOnboardingConnectorSummary,
  getCatConnectorMessages,
} from "@/lib/connectors/connector-recommendations";
import { CATEGORY_LABELS } from "@/lib/connectors/connector-types";
import type { ConnectorCategory } from "@/lib/connectors/connector-types";

export default function ConnectorCenter() {
  const { instances, health } = useConnectors();
  const { businessProfile } = useCat();
  const [activeCategory, setActiveCategory] = useState<ConnectorCategory | "all">("all");

  const onboarding = useMemo(
    () => buildOnboardingConnectorSummary(instances, businessProfile),
    [instances, businessProfile],
  );

  const catMessages = useMemo(
    () => getCatConnectorMessages(instances, businessProfile),
    [instances, businessProfile],
  );

  const filtered = useMemo(() => {
    if (activeCategory === "all") return instances;
    return instances.filter((item) => item.category === activeCategory);
  }, [instances, activeCategory]);

  const catSummary =
    catMessages.length > 0
      ? catMessages.join("\n\n")
      : `You have ${health.connected} services connected. Launch readiness is ${onboarding.launchReadinessPercent}%.`;

  return (
    <ModuleContainer>
      <ModuleHeader
        eyebrow="Connector Center"
        title="Connect Your Business Tools"
        description="One-click connections for the services your workforce needs. Click Connect, sign in, approve — done. No API configuration required."
      />

      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Link
          href="/operations/onboarding"
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/15 px-4 py-2 text-sm text-silver hover:text-white"
        >
          View Onboarding
        </Link>
        <Link
          href="/operations/hire"
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/15 px-4 py-2 text-sm text-silver hover:text-white"
        >
          Hire Workforce
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          label="Connected Services"
          value={String(health.connected)}
          detail={`${health.syncing} syncing`}
          trend="up"
        />
        <MetricCard label="Last Sync" value={health.lastSyncLabel} detail="Most recent activity" trend="neutral" />
        <MetricCard label="Connector Health" value={`${health.avgHealth}%`} detail="Across active connectors" trend="up" />
        <MetricCard
          label="Launch Readiness"
          value={`${onboarding.launchReadinessPercent}%`}
          detail={`${onboarding.missing} missing`}
          trend="neutral"
        />
        <MetricCard
          label="Ready To Launch"
          value={health.readyToLaunch ? "Yes" : "Not yet"}
          detail={health.readyToLaunch ? "Core connectors online" : "Connect core services"}
          trend={health.readyToLaunch ? "up" : "neutral"}
        />
      </div>

      <div className="mb-8">
        <CatRecommendationPanel summary={catSummary} />
      </div>

      <SectionPanel title="Onboarding Status" subtitle="Connected · Recommended · Optional · Missing">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <OnboardingStat label="Connected" value={onboarding.connected} />
          <OnboardingStat label="Recommended" value={onboarding.recommended} />
          <OnboardingStat label="Optional" value={onboarding.optional} />
          <OnboardingStat label="Missing" value={onboarding.missing} />
        </div>
      </SectionPanel>

      <div className="mb-4 mt-8 flex gap-2 overflow-x-auto pb-1">
        <CategoryButton
          label="All"
          active={activeCategory === "all"}
          onClick={() => setActiveCategory("all")}
        />
        {connectorCategories.map((category) => (
          <CategoryButton
            key={category}
            label={CATEGORY_LABELS[category]}
            active={activeCategory === category}
            onClick={() => setActiveCategory(category)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((connector) => (
          <ConnectorCard key={connector.id} connector={connector} />
        ))}
      </div>

      <ConnectorAuthModal />
      <ConnectorDetailPanel />
    </ModuleContainer>
  );
}

function CategoryButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex min-h-11 shrink-0 items-center rounded-full px-4 py-2.5 text-xs font-medium transition-colors",
        active
          ? "bg-red/20 text-white ring-1 ring-red/30"
          : "border border-white/15 text-silver hover:text-white",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function OnboardingStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/30 p-3 text-center">
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="mt-0.5 text-xs text-stone">{label}</p>
    </div>
  );
}
