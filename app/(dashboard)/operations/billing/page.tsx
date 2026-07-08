import type { Metadata } from "next";
import {
  DataRow,
  MetricCard,
  ModuleContainer,
  ModuleHeader,
  ProgressBar,
  SectionPanel,
} from "@/components/operations/ModuleUI";
import {
  billingInvoices,
  billingPlan,
  billingUsage,
} from "@/components/operations/module-mock-data";

export const metadata: Metadata = {
  title: "Billing | AI Operations Center",
  robots: { index: false, follow: false },
};

export default function BillingPage() {
  const teamTasksUsage = billingUsage.find((u) => u.label === "Team Tasks");

  return (
    <ModuleContainer>
      <ModuleHeader
        eyebrow="Billing"
        title="Plan, Usage & Invoices"
        description="Current subscription, usage against limits, team task allocation, and invoice history. Mock billing data only."
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Current Plan" value={billingPlan.name} detail={billingPlan.price + "/mo"} trend="neutral" />
        <MetricCard label="Team Tasks" value={teamTasksUsage ? String(teamTasksUsage.used) : "—"} detail={teamTasksUsage ? `of ${teamTasksUsage.limit} included` : undefined} trend="up" />
        <MetricCard label="Renewal" value="Apr 1" detail="2026 billing cycle" trend="neutral" />
        <MetricCard label="Seats" value={String(billingPlan.seats)} detail="Active users" trend="neutral" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionPanel title="Subscription" subtitle={billingPlan.name}>
          <dl className="space-y-3 text-sm">
            <div className="flex flex-col gap-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
              <dt className="text-silver">Price</dt>
              <dd className="font-medium text-white">{billingPlan.price} {billingPlan.cycle}</dd>
            </div>
            <div className="flex flex-col gap-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
              <dt className="text-silver">Renewal Date</dt>
              <dd className="font-medium text-white">{billingPlan.renewal}</dd>
            </div>
            <div className="flex flex-col gap-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
              <dt className="text-silver">Included Seats</dt>
              <dd className="font-medium text-white">{billingPlan.seats}</dd>
            </div>
          </dl>
        </SectionPanel>

        <SectionPanel title="Usage" subtitle="Current billing period">
          <div className="space-y-4">
            {billingUsage.map((item) => {
              const pct = Math.round((item.used / item.limit) * 100);
              return (
                <div key={item.id}>
                  <ProgressBar value={pct} label={`${item.label} (${item.used} / ${item.limit} ${item.unit})`} />
                </div>
              );
            })}
          </div>
        </SectionPanel>
      </div>

      <SectionPanel title="Invoices" subtitle="Billing history" className="mt-6">
        <div className="space-y-2">
          {billingInvoices.map((invoice) => (
            <DataRow
              key={invoice.id}
              primary={invoice.date}
              secondary={invoice.amount}
              status={invoice.status}
              statusVariant={invoice.status === "Paid" ? "success" : "info"}
            />
          ))}
        </div>
      </SectionPanel>
    </ModuleContainer>
  );
}
