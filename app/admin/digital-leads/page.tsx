import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { LeadFilters } from "@/components/admin/LeadFilters";
import { LEAD_STATUS_LABELS, isValidLeadStatus, parseLeadListFilters } from "@/lib/admin-lead-filters";
import { requireAdminSession, isAdminEnabled } from "@/lib/admin-auth";
import { listAssessmentLeads } from "@/lib/digital-assessment-leads";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Digital Leads | Admin",
  robots: { index: false, follow: false },
};

function formatDate(value: string): string {
  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatStatus(status: string): string {
  return isValidLeadStatus(status) ? LEAD_STATUS_LABELS[status] : status;
}

type DigitalLeadsPageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function DigitalLeadsPage({ searchParams }: DigitalLeadsPageProps) {
  if (process.env.NODE_ENV === "production" && !isAdminEnabled()) {
    notFound();
  }

  if (!(await requireAdminSession())) {
    notFound();
  }

  const filters = parseLeadListFilters(searchParams);
  const leads = await listAssessmentLeads(filters);
  const dbConfigured = isSupabaseConfigured();
  const hasActiveFilters = Boolean(
    filters.status || filters.lead_category || filters.recommended_solution || filters.q
  );

  return (
    <div className="nb-page">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="nb-eyebrow">Admin</p>
          <h1 className="mt-2 nb-h2">Digital assessment leads</h1>
          <p className="mt-2 text-sm text-white/60">
            Internal review only. Scores and evidence are not shown to prospects.
          </p>
        </div>
      </div>

      {!dbConfigured && (
        <div className="mt-8 nb-card border-northbridge-red/30">
          <p className="font-semibold text-white">Database not configured</p>
          <p className="mt-2 text-sm text-white/65">
            Set <code className="text-white/80">SUPABASE_URL</code> and{" "}
            <code className="text-white/80">SUPABASE_SERVICE_ROLE_KEY</code>, then apply migrations in{" "}
            <code className="text-white/80">supabase/migrations/</code>. See{" "}
            <code className="text-white/80">docs/infrastructure/STACK-4-PRODUCTION-CHECKLIST.md</code>.
          </p>
        </div>
      )}

      <div className="mt-8">
        <Suspense fallback={<div className="nb-card p-6 text-sm text-white/60">Loading filters…</div>}>
          <LeadFilters />
        </Suspense>
      </div>

      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-white/60">
              <th className="py-3 pr-4 font-semibold">Created</th>
              <th className="py-3 pr-4 font-semibold">Company / Name</th>
              <th className="py-3 pr-4 font-semibold">Category</th>
              <th className="py-3 pr-4 font-semibold">Recommendation</th>
              <th className="py-3 pr-4 font-semibold">Status</th>
              <th className="py-3 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-white/50">
                  {hasActiveFilters ? "No leads match the current filters." : "No leads stored yet."}
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="border-b border-white/5">
                  <td className="py-4 pr-4 text-white/70 whitespace-nowrap">
                    {formatDate(lead.created_at)}
                  </td>
                  <td className="py-4 pr-4">
                    <div className="font-medium text-white">{lead.company || "—"}</div>
                    <div className="text-white/55">{lead.name}</div>
                    <div className="text-white/45 text-xs">{lead.email}</div>
                  </td>
                  <td className="py-4 pr-4 text-white/80">{lead.lead_category}</td>
                  <td className="py-4 pr-4 text-white/80">{lead.recommended_solution}</td>
                  <td className="py-4 pr-4 text-white/70">{formatStatus(lead.status)}</td>
                  <td className="py-4 text-right">
                    <Link
                      href={`/admin/digital-leads/${lead.id}`}
                      className="text-northbridge-red font-semibold hover:underline"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
