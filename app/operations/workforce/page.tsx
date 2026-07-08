import OpsTopBar from "@/components/operations/shell/OpsTopBar";
import Panel from "@/components/operations/ui/Panel";
import SectionHeader from "@/components/operations/ui/SectionHeader";
import WorkforceTable from "@/components/operations/widgets/WorkforceTable";
import { getNeoPlatform } from "@/lib/neo/platform";

export default async function WorkforcePage() {
  const neo = getNeoPlatform();
  const [members, hierarchy] = await Promise.all([
    neo.workforce.listMembers(),
    neo.workforce.getTeamHierarchy(),
  ]);

  return (
    <>
      <OpsTopBar
        title="Digital Workforce"
        subtitle="Team hierarchy, specialists, managers, and performance."
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <SectionHeader
          title="Team hierarchy"
          description="Organizational structure from @neos/workforce."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {hierarchy.map((team) => (
            <article
              key={team.id}
              className="border border-white/10 bg-slate/50 p-4"
            >
              <h3 className="font-medium text-white">{team.name}</h3>
              <p className="text-xs text-silver mt-1">
                {team.memberIds.length} members
                {team.childTeamIds.length > 0 &&
                  ` · ${team.childTeamIds.length} sub-teams`}
              </p>
            </article>
          ))}
        </div>

        <Panel title="Workforce roster">
          <WorkforceTable members={members} />
        </Panel>
      </div>
    </>
  );
}
