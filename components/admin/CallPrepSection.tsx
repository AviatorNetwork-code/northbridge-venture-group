import { CopyCallOpeningButton } from "@/components/admin/CopyCallOpeningButton";
import { getTopEvidenceFactors } from "@/lib/admin-call-prep";
import {
  AUTHORITY_OPTIONS,
  BUDGET_OPTIONS,
  CURRENT_SYSTEMS_OPTIONS,
  PAIN_POINT_OPTIONS,
  TIMELINE_OPTIONS,
  labelForValue,
  type AssessmentPayload,
  type ScoringEvidence,
} from "@/lib/digital-assessment";
import type { DigitalAssessmentLeadRow } from "@/lib/digital-assessment-leads";

type CallPrepSectionProps = {
  lead: DigitalAssessmentLeadRow;
};

function formatEvidencePoints(points: number): string {
  return points > 0 ? `+${points}` : String(points);
}

function TopEvidenceList({ items }: { items: ScoringEvidence[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-white/55">No scoring evidence recorded.</p>;
  }

  return (
    <ol className="space-y-3 list-decimal list-inside text-sm">
      {items.map((item) => (
        <li key={`${item.ruleId}-${item.rationale}`} className="text-white/80">
          <span className="font-medium text-white">{formatEvidencePoints(item.points)}</span>
          {" — "}
          {item.rationale}
        </li>
      ))}
    </ol>
  );
}

function formatAnswerList(
  values: string[],
  options: readonly { value: string; label: string }[]
): string {
  if (values.length === 0) return "—";
  return values.map((value) => labelForValue(options, value)).join(", ");
}

export function CallPrepSection({ lead }: CallPrepSectionProps) {
  const answers: AssessmentPayload = lead.answers;
  const topEvidence = getTopEvidenceFactors(lead.evidence, 3);

  return (
    <section className="nb-card border-northbridge-red/25">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="nb-eyebrow">Call prep</p>
          <h2 className="mt-2 text-xl font-bold text-white">Before the strategy call</h2>
        </div>
        <CopyCallOpeningButton text={lead.suggested_call_opening} />
      </div>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2 text-sm">
        <div>
          <dt className="text-white/55">Lead category</dt>
          <dd className="text-white font-medium">{lead.lead_category}</dd>
        </div>
        <div>
          <dt className="text-white/55">Recommended solution</dt>
          <dd className="text-white font-medium">{lead.recommended_solution}</dd>
        </div>
        <div>
          <dt className="text-white/55">Budget</dt>
          <dd className="text-white">{labelForValue(BUDGET_OPTIONS, answers.budget)}</dd>
        </div>
        <div>
          <dt className="text-white/55">Timeline</dt>
          <dd className="text-white">{labelForValue(TIMELINE_OPTIONS, answers.timeline)}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-white/55">Authority</dt>
          <dd className="text-white">{labelForValue(AUTHORITY_OPTIONS, answers.authority)}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-white/55">Pain points</dt>
          <dd className="text-white">{formatAnswerList(answers.painPoints, PAIN_POINT_OPTIONS)}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-white/55">Current systems</dt>
          <dd className="text-white">
            {formatAnswerList(answers.currentSystems, CURRENT_SYSTEMS_OPTIONS)}
          </dd>
        </div>
      </dl>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-white">Top evidence factors</h3>
        <div className="mt-3">
          <TopEvidenceList items={topEvidence} />
        </div>
      </div>

      <div className="mt-6 border-t border-white/10 pt-6">
        <h3 className="text-sm font-semibold text-white">Suggested opening</h3>
        <p className="mt-3 text-sm text-white/75 leading-relaxed">{lead.suggested_call_opening}</p>
      </div>
    </section>
  );
}
