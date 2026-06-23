import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const ADMIN_SESSION_COOKIE = "nb_admin_session";

export function isAdminEnabled(): boolean {
  return Boolean(process.env.ADMIN_ACCESS_TOKEN?.trim());
}

export function isAdminSessionValid(sessionValue: string | undefined): boolean {
  const token = process.env.ADMIN_ACCESS_TOKEN?.trim();
  if (!token || !sessionValue) return false;
  return sessionValue === token;
}

export async function requireAdminSession(): Promise<boolean> {
  if (!isAdminEnabled()) return false;
  const cookieStore = await cookies();
  return isAdminSessionValid(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}

export function adminDisabledResponse(): NextResponse {
  return NextResponse.json({ error: "Admin access is not configured." }, { status: 503 });
}

export function adminUnauthorizedResponse(): NextResponse {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}
