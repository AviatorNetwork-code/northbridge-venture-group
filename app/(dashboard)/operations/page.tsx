import Link from "next/link";
import ConnectorDashboardSummary from "@/components/connectors/ConnectorDashboardSummary";
import LaunchStatusBanner from "@/components/launch/LaunchStatusBanner";
import NeoSystemStatus from "@/components/neo/NeoSystemStatus";
import {
  dashboardMetrics,
  quickActions,
} from "@/components/operations/mock-data";

const trendStyles = {
  up: "text-emerald-400",
  down: "text-red",
  neutral: "text-silver",
} as const;

export default function OperationsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 sm:mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-red">Dashboard</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            AI Operations Center
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-silver sm:text-base">
            Operational overview for your digital workforce, workflows, and connected
            systems. NEO connects when available and falls back to mock data gracefully.
          </p>
          <Link
            href="/operations/hire"
            className="mt-4 inline-flex rounded-xl bg-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-hover"
          >
            Hire Workforce
          </Link>
          <Link
            href="/operations/launch"
            className="ml-3 mt-4 inline-flex rounded-xl border border-red/40 bg-red/10 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red/20"
          >
            Launch Readiness
          </Link>
        </header>

        <LaunchStatusBanner />

        <section aria-labelledby="metrics-heading" className="mb-8 mt-8">
          <h2 id="metrics-heading" className="sr-only">
            Key metrics
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {dashboardMetrics.map((metric) => (
              <article
                key={metric.id}
                className="rounded-xl border border-white/10 bg-slate/60 p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-stone">
                  {metric.label}
                </p>
                <p className="mt-2 text-3xl font-semibold text-white">{metric.value}</p>
                <p className={`mt-1 text-xs ${trendStyles[metric.trend]}`}>{metric.change}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <ConnectorDashboardSummary />

          <section
            aria-labelledby="quick-actions-heading"
            className="rounded-xl border border-white/10 bg-slate/40 p-5 sm:p-6 lg:col-span-2"
          >
            <h2
              id="quick-actions-heading"
              className="text-xs font-semibold uppercase tracking-wider text-red"
            >
              Quick Actions
            </h2>
            <p className="mt-1 text-lg font-semibold text-white">Start something new</p>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  className="rounded-lg border border-white/10 bg-black/30 p-4 text-left transition-colors hover:border-red/30 hover:bg-red/5"
                >
                  <p className="text-sm font-medium text-white">{action.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-silver">
                    {action.description}
                  </p>
                </button>
              ))}
            </div>
          </section>

          <NeoSystemStatus />
        </div>

        <section
          aria-labelledby="modules-heading"
          className="mt-8 rounded-xl border border-white/10 bg-slate/40 p-5 sm:p-6"
        >
          <h2
            id="modules-heading"
            className="text-xs font-semibold uppercase tracking-wider text-red"
          >
            Application Modules
          </h2>
          <p className="mt-1 text-lg font-semibold text-white">
            Navigation destinations preview
          </p>
          <p className="mt-2 text-sm text-silver">
            Navigate to any module below to explore the operations center.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                href: "/operations/workforce",
                title: "Digital Workforce",
                copy: "Manage AI agents, roles, and deployment status.",
              },
              {
                href: "/operations/workflows",
                title: "Workflows",
                copy: "Design and monitor automated business processes.",
              },
              {
                href: "/operations/communications",
                title: "Communications",
                copy: "Centralize alerts, messages, and client updates.",
              },
              {
                href: "/operations/connectors",
                title: "Connectors",
                copy: "Configure integrations with external platforms.",
              },
              {
                href: "/operations/onboarding",
                title: "Onboarding",
                copy: "Track client setup and deployment milestones.",
              },
              {
                href: "/operations/analytics",
                title: "Analytics",
                copy: "Review usage, performance, and operational KPIs.",
              },
              {
                href: "/operations/billing",
                title: "Billing",
                copy: "View subscriptions, usage, and invoices.",
              },
              {
                href: "/operations/settings",
                title: "Settings",
                copy: "Configure team access and platform preferences.",
              },
            ].map((module) => (
              <Link
                key={module.href}
                href={module.href}
                className="rounded-lg border border-white/10 bg-black/30 p-4 transition-colors hover:border-red/30 hover:bg-red/5"
              >
                <p className="text-sm font-medium text-white">{module.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-silver">{module.copy}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
