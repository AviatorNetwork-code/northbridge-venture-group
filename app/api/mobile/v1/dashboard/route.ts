import { NextResponse } from "next/server";
import {
  buildMobileDashboardResponse,
  createDefaultMobileDashboardDependencies,
  parseMobileDashboardQuery,
} from "@/lib/ndp/mobile-bff/dashboard-service";

export const runtime = "nodejs";

const mobileDashboardDependencies = createDefaultMobileDashboardDependencies();

export async function GET(request: Request) {
  const correlationId =
    request.headers.get("x-correlation-id") ??
    request.headers.get("x-request-id") ??
    crypto.randomUUID();

  const url = new URL(request.url);
  const query = parseMobileDashboardQuery(url.searchParams);

  const result = await buildMobileDashboardResponse(
    {
      correlationId,
      authorizationHeader: request.headers.get("authorization"),
      query,
    },
    mobileDashboardDependencies,
  );

  if (result.ok) {
    return NextResponse.json(JSON.parse(result.serialized), { status: result.status });
  }

  return NextResponse.json(result.body, { status: result.status });
}
