import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  adminDisabledResponse,
  adminUnauthorizedResponse,
  isAdminEnabled,
  isAdminSessionValid,
} from "@/lib/admin-auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminApiRoute = pathname.startsWith("/api/admin");
  if (!isAdminRoute && !isAdminApiRoute) {
    return NextResponse.next();
  }

  if (pathname === "/admin/login" || pathname === "/api/admin/auth") {
    return NextResponse.next();
  }

  // TODO(Stack 3): Replace shared-token cookie auth with SSO or Supabase Auth before broad production use.
  if (!isAdminEnabled()) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.redirect(new URL("/admin/login?error=not_configured", request.url));
  }

  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!isAdminSessionValid(session)) {
    if (isAdminApiRoute) {
      return adminUnauthorizedResponse();
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
