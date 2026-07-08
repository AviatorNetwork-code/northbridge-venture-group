import type { Metadata } from "next";
import {
  MetricCard,
  ModuleContainer,
  ModuleHeader,
  ProgressBar,
  SectionPanel,
} from "@/components/operations/ModuleUI";
import {
  analyticsBreakdown,
  analyticsMetrics,
} from "@/components/operations/module-mock-data";

export const metadata: Metadata = {
  title: "Analytics | AI Operations Center",
  robots: { index: false, follow: false },
};

export default function AnalyticsPage() {
  const { teamTasks, timeSaved, utilization, responseTime } = analyticsMetrics;

  return (
    <ModuleContainer>
      <ModuleHeader
        eyebrow="Analytics"
        title="Performance & Utilization"
        description="Review team task volume, time saved, workforce utilization, and response time across operational teams."
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Team Tasks" value={teamTasks.value} detail={teamTasks.change} trend={teamTasks.trend} />
        <MetricCard label="Time Saved" value={timeSaved.value} detail={timeSaved.change} trend={timeSaved.trend} />
        <MetricCard label="Utilization" value={utilization.value} detail={utilization.change} trend={utilization.trend} />
        <MetricCard label="Response Time" value={responseTime.value} detail={responseTime.change} trend={responseTime.trend} />
      </div>

      <SectionPanel title="Team Breakdown" subtitle="Tasks, utilization & response time">
        <div className="space-y-3 md:hidden">
          {analyticsBreakdown.map((row) => (
            <article
              key={row.id}
              className="rounded-xl border border-white/10 bg-black/20 p-4"
            >
              <p className="text-sm font-semibold text-white">{row.team}</p>
              <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-stone">Tasks</dt>
                  <dd className="mt-1 text-silver">{row.tasks}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-stone">Response</dt>
                  <dd className="mt-1 text-silver">{row.response}</dd>
                </div>
              </dl>
              <div className="mt-3">
                <p className="mb-1 text-xs uppercase tracking-wider text-stone">Utilization</p>
                <ProgressBar value={row.utilization} />
              </div>
            </article>
          ))}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[540px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-stone">
                <th className="pb-3 pr-4 font-semibold">Team</th>
                <th className="pb-3 pr-4 font-semibold">Tasks</th>
                <th className="pb-3 pr-4 font-semibold">Utilization</th>
                <th className="pb-3 font-semibold">Avg Response</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {analyticsBreakdown.map((row) => (
                <tr key={row.id}>
                  <td className="py-3 pr-4 font-medium text-white">{row.team}</td>
                  <td className="py-3 pr-4 text-silver">{row.tasks}</td>
                  <td className="py-3 pr-4">
                    <div className="max-w-[140px]">
                      <ProgressBar value={row.utilization} />
                    </div>
                  </td>
                  <td className="py-3 text-silver">{row.response}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionPanel>
    </ModuleContainer>
  );
}
