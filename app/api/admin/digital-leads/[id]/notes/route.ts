import { NextResponse } from "next/server";
import {
  adminUnauthorizedResponse,
  requireAdminSession,
} from "@/lib/admin-auth";
import { updateAssessmentLeadNotes } from "@/lib/digital-assessment-leads";

const NOTES_LIMIT = 4000;

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!(await requireAdminSession())) {
    return adminUnauthorizedResponse();
  }

  const body = await request.json().catch(() => null);
  const internalNotes =
    typeof body?.internal_notes === "string" ? body.internal_notes.trim() : null;

  if (internalNotes === null) {
    return NextResponse.json({ error: "internal_notes is required." }, { status: 400 });
  }

  if (internalNotes.length > NOTES_LIMIT) {
    return NextResponse.json({ error: "Internal notes are too long." }, { status: 400 });
  }

  const updated = await updateAssessmentLeadNotes(params.id, internalNotes);
  if (!updated) {
    return NextResponse.json({ error: "Unable to save notes." }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
