import OpsTopBar from "@/components/operations/shell/OpsTopBar";
import Panel from "@/components/operations/ui/Panel";
import SectionHeader from "@/components/operations/ui/SectionHeader";
import SystemHealthPanel from "@/components/operations/widgets/SystemHealthPanel";
import RecommendationsList from "@/components/operations/widgets/RecommendationsList";
import { getNeoPlatform } from "@/lib/neo/platform";

export default async function CommandCenterPage() {
  const neo = getNeoPlatform();
  const [health, commands, recommendations] = await Promise.all([
    neo.command.getSystemHealth(),
    neo.command.listCommandSuggestions(),
    neo.learning.listRecommendations(),
  ]);

  return (
    <>
      <OpsTopBar
        title="AI Command Center"
        subtitle="Ask CAT, explain recommendations, and operate the platform."
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <section>
          <SectionHeader
            title="Quick commands"
            description="CAT command entry points — wired to NEO intelligence when live."
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {commands.map((cmd) => (
              <button
                key={cmd.id}
                type="button"
                className="text-left border border-white/10 bg-slate/50 p-4 hover:border-red/40 hover:bg-slate transition-colors"
              >
                <p className="text-sm font-medium text-white">{cmd.label}</p>
                <p className="mt-1 text-xs text-silver line-clamp-2">
                  {cmd.prompt}
                </p>
              </button>
            ))}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="System health">
            <SystemHealthPanel health={health} />
          </Panel>
          <Panel title="Explain recommendations">
            <RecommendationsList items={recommendations} />
          </Panel>
        </div>

        <Panel title="CAT interface">
          <div className="border border-white/10 bg-black p-4">
            <p className="text-sm text-silver mb-3">
              Ask CAT about your operations, workforce, or connectors.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask CAT anything about your operations…"
                className="flex-1 bg-slate border border-white/10 px-3 py-2 text-sm text-white placeholder:text-stone focus:outline-none focus:border-red/50"
                disabled
                aria-label="CAT prompt"
              />
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium bg-red text-white opacity-60 cursor-not-allowed"
                disabled
              >
                Ask
              </button>
            </div>
            <p className="mt-2 text-[10px] text-silver">
              Live CAT runtime connects via NEO — input disabled in mock mode.
            </p>
          </div>
        </Panel>
      </div>
    </>
  );
}
