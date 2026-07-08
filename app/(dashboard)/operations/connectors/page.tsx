import type { Metadata } from "next";
import {
  MetricCard,
  ModuleContainer,
  ModuleHeader,
  ProgressBar,
  SectionPanel,
  StatusPill,
} from "@/components/operations/ModuleUI";
import { connectors } from "@/components/operations/module-mock-data";

export const metadata: Metadata = {
  title: "Connectors | AI Operations Center",
  robots: { index: false, follow: false },
};

function statusVariant(status: string) {
  if (status === "Connected") return "success" as const;
  if (status === "Syncing") return "warning" as const;
  return "neutral" as const;
}

export default function ConnectorsPage() {
  const connected = connectors.filter((c) => c.status === "Connected").length;
  const avgHealth = Math.round(
    connectors.reduce((sum, c) => sum + c.health, 0) / connectors.length,
  );

  return (
    <ModuleContainer>
      <ModuleHeader
        eyebrow="Connectors"
        title="Integration Status"
        description="Monitor connection health for Google, Gmail, Stripe, WhatsApp, HubSpot, Vercel, and GitHub. Status cards use mock data only."
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Connected" value={`${connected}/7`} detail="1 syncing" trend="up" />
        <MetricCard label="Avg Health" value={`${avgHealth}%`} detail="Across all connectors" trend="up" />
        <MetricCard label="Last Sync" value="2 min" detail="WhatsApp queue" trend="neutral" />
        <MetricCard label="Alerts" value="0" detail="No failures detected" trend="up" />
      </div>

      <SectionPanel title="Service Connectors" subtitle="Platform integrations">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {connectors.map((connector) => (
            <article
              key={connector.id}
              className="rounded-xl border border-white/10 bg-black/30 p-5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-base font-semibold text-white">{connector.name}</p>
                  <p className="mt-0.5 text-xs text-silver">{connector.service}</p>
                </div>
                <StatusPill status={connector.status} variant={statusVariant(connector.status)} />
              </div>
              <div className="mt-4">
                <ProgressBar value={connector.health} label="Health" />
              </div>
              <p className="mt-3 text-[11px] text-stone">
                OAuth not connected — mock status for shell preview
              </p>
            </article>
          ))}
        </div>
      </SectionPanel>
    </ModuleContainer>
  );
}
