"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  LEAD_STATUS_LABELS,
  LEAD_STATUS_VALUES,
  isValidLeadStatus,
  type LeadStatusValue,
} from "@/lib/admin-lead-filters";

type LeadStatusFormProps = {
  leadId: string;
  initialStatus: string;
};

export function LeadStatusForm({ leadId, initialStatus }: LeadStatusFormProps) {
  const router = useRouter();
  const normalizedInitial = isValidLeadStatus(initialStatus) ? initialStatus : "new";
  const [status, setStatus] = useState<LeadStatusValue>(normalizedInitial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch(`/api/admin/digital-leads/${leadId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Unable to update status.");
        setSaving(false);
        return;
      }

      setSaved(true);
      router.refresh();
      setSaving(false);
    } catch {
      setError("Unable to update status.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
      <div className="min-w-[200px] flex-1">
        <label htmlFor="lead-status" className="nb-label">
          Workflow status
        </label>
        <select
          id="lead-status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as LeadStatusValue);
            setSaved(false);
          }}
          className="nb-input"
        >
          {LEAD_STATUS_VALUES.map((value) => (
            <option key={value} value={value}>
              {LEAD_STATUS_LABELS[value]}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" disabled={saving} className="btn-primary">
        {saving ? "Saving…" : "Update status"}
      </button>
      {saved && <span className="text-sm text-white/60">Status saved.</span>}
      {error && <span className="text-sm text-northbridge-red">{error}</span>}
    </form>
  );
}
