"use client";

import OpsTopBar from "@/components/operations/shell/OpsTopBar";
import Panel from "@/components/operations/ui/Panel";
import LiveOnboardingPanel from "@/components/operations/widgets/LiveOnboardingPanel";
import { useNeoSelector } from "@/lib/neo/hooks/useNeoState";

export default function OnboardingView() {
  const onboarding = useNeoSelector((s) => s.onboarding);
  const workforce = useNeoSelector((s) => s.workforce);
  const connectors = useNeoSelector((s) => [
    ...s.connectedConnectors,
    ...s.availableConnectors,
  ]);

  const specialistNames = Object.fromEntries(
    workforce.map((m) => [m.id, m.name])
  );
  const connectorNames = Object.fromEntries(
    connectors.map((c) => [c.id, c.name])
  );

  return (
    <>
      <OpsTopBar
        title="Customer Onboarding"
        subtitle="Animated readiness progress and launch recommendations."
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <Panel title="Onboarding progress">
          <LiveOnboardingPanel
            snapshot={onboarding}
            specialistNames={specialistNames}
            connectorNames={connectorNames}
          />
        </Panel>
      </div>
    </>
  );
}
