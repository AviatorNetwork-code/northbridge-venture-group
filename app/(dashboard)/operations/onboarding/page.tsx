import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import OnboardingHireTransfer from "@/components/hire/OnboardingHireTransfer";
import OnboardingConnectorChecklist from "@/components/connectors/OnboardingConnectorChecklist";
import {
  DataRow,
  ModuleContainer,
  ModuleHeader,
  SectionPanel,
} from "@/components/operations/ModuleUI";
import { onboardingRecommendations } from "@/components/operations/module-mock-data";
import OnboardingMetrics from "@/components/connectors/OnboardingMetrics";

export const metadata: Metadata = {
  title: "Onboarding | AI Operations Center",
  robots: { index: false, follow: false },
};

export default function OnboardingPage() {
  return (
    <ModuleContainer>
      <ModuleHeader
        eyebrow="Onboarding"
        title="Deployment Readiness"
        description="Track connector setup, workforce deployment, and recommended next steps to reach full operational readiness."
      />

      <OnboardingMetrics />

      <div className="mb-6">
        <Link
          href="/operations/launch"
          className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-hover sm:w-auto"
        >
          Open Launch Command Center
        </Link>
      </div>

      <Suspense fallback={null}>
        <div className="mb-8">
          <OnboardingHireTransfer />
        </div>
      </Suspense>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <OnboardingConnectorChecklist />

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
