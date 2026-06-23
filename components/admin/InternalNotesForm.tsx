"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type InternalNotesFormProps = {
  leadId: string;
  initialNotes: string;
};

export function InternalNotesForm({ leadId, initialNotes }: InternalNotesFormProps) {
  const router = useRouter();
  const [notes, setNotes] = useState(initialNotes);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError(null);

    try {
      const res = await fetch(`/api/admin/digital-leads/${leadId}/notes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internal_notes: notes }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setError(typeof data.error === "string" ? data.error : "Unable to save notes.");
        return;
      }

      setStatus("saved");
      router.refresh();
    } catch {
      setStatus("error");
      setError("Unable to save notes.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label htmlFor="internal-notes" className="nb-label">
        Internal notes
      </label>
      <textarea
        id="internal-notes"
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value);
          if (status === "saved") setStatus("idle");
        }}
        rows={6}
        maxLength={4000}
        className="nb-input"
        placeholder="Follow-up context, call outcomes, disqualification reasons…"
      />
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={status === "saving"} className="btn-primary">
          {status === "saving" ? "Saving…" : "Save notes"}
        </button>
        {status === "saved" && (
          <span className="text-sm text-white/60">Notes saved.</span>
        )}
        {status === "error" && error && (
          <span className="text-sm text-northbridge-red">{error}</span>
        )}
      </div>
    </form>
  );
}
