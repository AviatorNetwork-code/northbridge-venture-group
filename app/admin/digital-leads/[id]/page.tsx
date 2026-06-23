import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CallPrepSection } from "@/components/admin/CallPrepSection";
import { InternalNotesForm } from "@/components/admin/InternalNotesForm";
import { LeadStatusForm } from "@/components/admin/LeadStatusForm";
import { LEAD_STATUS_LABELS, isValidLeadStatus } from "@/lib/admin-lead-filters";
import { requireAdminSession, isAdminEnabled } from "@/lib/admin-auth";
import { getAssessmentLeadById } from "@/lib/digital-assessment-leads";
import {
  AUTHORITY_OPTIONS,
  BUDGET_OPTIONS,
  BUSINESS_STAGE_OPTIONS,
  CURRENT_SYSTEMS_OPTIONS,
  EMPLOYEE_OPTIONS,
  MAIN_NEED_OPTIONS,
  PAIN_POINT_OPTIONS,
  TIMELINE_OPTIONS,
  labelForValue,
  type ScoringEvidence,
} from "@/lib/digital-assessment";

export const metadata: Metadata = {
  title: "Lead Detail | Admin",
  robots: { index: false, follow: false },
};

function formatDate(value: string): string {
  return new Date(value).toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  });
}

function EvidenceTable({ evidence }: { evidence: ScoringEvidence[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-white/60">
            <th className="py-2 pr-3 font-semibold">Rule</th>
            <th className="py-2 pr-3 font-semibold">Field</th>
            <th className="py-2 pr-3 font-semibold">Points</th>
            <th className="py-2 font-semibold">Rationale</th>
          </tr>
        </thead>
        <tbody>
          {evidence.map((item) => (
            <tr
              key={`${item.ruleId}-${item.inputField}-${item.rationale}`}
              className="border-b border-white/5"
            >
              <td className="py-3 pr-3 font-mono text-xs text-white/70">{item.ruleId}</td>
              <td className="py-3 pr-3 text-white/80">{item.inputField}</td>
              <td className="py-3 pr-3 text-white font-medium">
                {item.points > 0 ? `+${item.points}` : item.points}
              </td>
              <td className="py-3 text-white/65">{item.rationale}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function DigitalLeadDetailPage({
  params,
}: {
  params: { id: string };
}) {
  if (process.env.NODE_ENV === "production" && !isAdminEnabled()) {
    notFound();
  }

  if (!(await requireAdminSession())) {
    notFound();
  }

  const lead = await getAssessmentLeadById(params.id);
  if (!lead) {
    notFound();
  }

  const answers = lead.answers;
  const statusLabel = isValidLeadStatus(lead.status)
    ? LEAD_STATUS_LABELS[lead.status]
    : lead.status;

  return (
    <div className="nb-page">
      <Link
        href="/admin/digital-leads"
        className="text-sm font-semibold text-northbridge-red hover:underline"
      >
        ← All leads
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="nb-eyebrow">Lead review</p>
          <h1 className="mt-2 nb-h2">{lead.company || lead.name}</h1>
          <p className="mt-2 text-sm text-white/60">{formatDate(lead.created_at)}</p>
        </div>
        <div className="nb-card px-5 py-4 text-sm">
          <div className="text-white/55">Score</div>
          <div className="text-2xl font-bold text-white">{lead.total_score}</div>
          <div className="mt-2 text-white/80">{lead.lead_category}</div>
          <div className="mt-1 text-white/60">{statusLabel}</div>
        </div>
      </div>

      <div className="mt-8">
        <CallPrepSection lead={lead} />
      </div>

      <section className="mt-6 nb-card">
        <h2 className="text-lg font-bold text-white">Workflow status</h2>
        <div className="mt-4">
          <LeadStatusForm leadId={lead.id} initialStatus={lead.status} />
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="nb-card">
          <h2 className="text-lg font-bold text-white">Contact</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-white/55">Name</dt>
              <dd className="text-white">{lead.name}</dd>
            </div>
            <div>
              <dt className="text-white/55">Email</dt>
              <dd className="text-white">{lead.email}</dd>
            </div>
            <div>
              <dt className="text-white/55">Phone</dt>
              <dd className="text-white">{lead.phone || "—"}</dd>
            </div>
            <div>
              <dt className="text-white/55">Company</dt>
              <dd className="text-white">{lead.company || "—"}</dd>
            </div>
            <div>
              <dt className="text-white/55">Source</dt>
              <dd className="text-white">{lead.source_path || "—"}</dd>
            </div>
          </dl>
        </section>

        <section className="nb-card">
          <h2 className="text-lg font-bold text-white">Decision summary</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-white/55">Recommendation</dt>
              <dd className="text-white font-medium">{lead.recommended_solution}</dd>
            </div>
            <div>
              <dt className="text-white/55">Category</dt>
              <dd className="text-white">{lead.lead_category}</dd>
            </div>
          </dl>
        </section>
      </div>

      <section className="mt-6 nb-card">
        <h2 className="text-lg font-bold text-white">Assessment answers</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
          <div>
            <dt className="text-white/55">Industry</dt>
            <dd className="text-white">{answers.industry || "—"}</dd>
          </div>
          <div>
            <dt className="text-white/55">Employees</dt>
            <dd className="text-white">{labelForValue(EMPLOYEE_OPTIONS, answers.employees)}</dd>
          </div>
          <div>
            <dt className="text-white/55">Business stage</dt>
            <dd className="text-white">
              {labelForValue(BUSINESS_STAGE_OPTIONS, answers.businessStage)}
            </dd>
          </div>
          <div>
            <dt className="text-white/55">Main need</dt>
            <dd className="text-white">{labelForValue(MAIN_NEED_OPTIONS, answers.mainNeed)}</dd>
          </div>
          <div>
            <dt className="text-white/55">Budget</dt>
            <dd className="text-white">{labelForValue(BUDGET_OPTIONS, answers.budget)}</dd>
          </div>
          <div>
            <dt className="text-white/55">Timeline</dt>
            <dd className="text-white">{labelForValue(TIMELINE_OPTIONS, answers.timeline)}</dd>
          </div>
          <div>
            <dt className="text-white/55">Authority</dt>
            <dd className="text-white">{labelForValue(AUTHORITY_OPTIONS, answers.authority)}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-white/55">Pain points</dt>
            <dd className="text-white">
              {answers.painPoints.length > 0
                ? answers.painPoints
                    .map((value) => labelForValue(PAIN_POINT_OPTIONS, value))
                    .join(", ")
                : "—"}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-white/55">Current systems</dt>
            <dd className="text-white">
              {answers.currentSystems.length > 0
                ? answers.currentSystems
                    .map((value) => labelForValue(CURRENT_SYSTEMS_OPTIONS, value))
                    .join(", ")
                : "—"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-6 nb-card">
        <h2 className="text-lg font-bold text-white">Full scoring evidence</h2>
        <div className="mt-4">
          <EvidenceTable evidence={lead.evidence} />
        </div>
      </section>

      <section className="mt-6 nb-card">
        <h2 className="text-lg font-bold text-white">Internal notes</h2>
        <div className="mt-4">
          <InternalNotesForm leadId={lead.id} initialNotes={lead.internal_notes ?? ""} />
        </div>
      </section>
    </div>
  );
}
