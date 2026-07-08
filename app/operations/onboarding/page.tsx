import OpsTopBar from "@/components/operations/shell/OpsTopBar";
import Panel from "@/components/operations/ui/Panel";
import OnboardingPanel from "@/components/operations/widgets/OnboardingPanel";
import { getNeoPlatform } from "@/lib/neo/platform";

export default async function OnboardingPage() {
  const neo = getNeoPlatform();
  const [snapshot, members, connectors] = await Promise.all([
    neo.onboarding.getSnapshot(),
    neo.workforce.listMembers(),
    neo.connectors.listAvailable(),
  ]);

  const specialistNames = Object.fromEntries(
    members.map((m) => [m.id, m.name])
  );
  const connectorNames = Object.fromEntries(
    [...connectors].map((c) => [c.id, c.name])
  );

  return (
    <>
      <OpsTopBar
        title="Customer Onboarding"
        subtitle="Readiness score, launch checklist, and recommended next steps."
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <Panel title="Onboarding progress">
          <OnboardingPanel
            snapshot={snapshot}
            specialistNames={specialistNames}
            connectorNames={connectorNames}
          />
        </Panel>
      </div>
    </>
  );
}
