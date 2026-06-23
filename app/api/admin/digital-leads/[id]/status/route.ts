import { NextResponse } from "next/server";
import { isValidLeadStatus } from "@/lib/admin-lead-filters";
import { adminUnauthorizedResponse, requireAdminSession } from "@/lib/admin-auth";
import { updateAssessmentLeadStatus } from "@/lib/digital-assessment-leads";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!(await requireAdminSession())) {
    return adminUnauthorizedResponse();
  }

  const body = await request.json().catch(() => null);
  const status = typeof body?.status === "string" ? body.status.trim() : "";

  if (!isValidLeadStatus(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const updated = await updateAssessmentLeadStatus(params.id, status);
  if (!updated) {
    return NextResponse.json({ error: "Unable to update status." }, { status: 502 });
  }

  return NextResponse.json({ success: true, status });
}
