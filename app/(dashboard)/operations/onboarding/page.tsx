import type { Metadata } from "next";
import {
  DataRow,
  MetricCard,
  ModuleContainer,
  ModuleHeader,
  ProgressBar,
  SectionPanel,
  StatusPill,
} from "@/components/operations/ModuleUI";
import {
  onboardingChecklist,
  onboardingRecommendations,
} from "@/components/operations/module-mock-data";

export const metadata: Metadata = {
  title: "Onboarding | AI Operations Center",
  robots: { index: false, follow: false },
};

export default function OnboardingPage() {
  const completed = onboardingChecklist.filter((item) => item.complete).length;
  const readiness = Math.round((completed / onboardingChecklist.length) * 100);

  return (
    <ModuleContainer>
      <ModuleHeader
        eyebrow="Onboarding"
        title="Deployment Readiness"
        description="Track connector setup, workforce deployment, and recommended next steps to reach full operational readiness."
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Readiness Score" value={`${readiness}%`} detail={`${completed} of ${onboardingChecklist.length} complete`} trend="up" />
        <MetricCard label="Connectors" value="3/4" detail="HubSpot remaining" trend="neutral" />
        <MetricCard label="Workforce" value="4/5" detail="Support specialist pending" trend="neutral" />
        <MetricCard label="Est. Go-Live" value="3 days" detail="If checklist completed" trend="up" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionPanel title="Connector Checklist" subtitle="Required integrations">
          <div className="mb-5">
            <ProgressBar value={readiness} label="Overall readiness" />
          </div>
          <ul className="space-y-2">
            {onboardingChecklist.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-black/30 px-3 py-2.5"
              >
                <span className="text-sm text-silver">{item.item}</span>
                <StatusPill
                  status={item.complete ? "Complete" : "Pending"}
                  variant={item.complete ? "success" : "warning"}
                />
              </li>
            ))}
          </ul>
        </SectionPanel>

        <SectionPanel title="Workforce Recommendations" subtitle="Suggested deployments">
          <div className="space-y-3">
            {onboardingRecommendations.map((rec) => (
              <DataRow
                key={rec.id}
                primary={rec.title}
                secondary={rec.reason}
                status={rec.impact}
                statusVariant={rec.impact === "High" ? "danger" : "warning"}
              />
            ))}
          </div>
        </SectionPanel>
      </div>
    </ModuleContainer>
  );
}
