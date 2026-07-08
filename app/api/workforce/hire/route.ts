import { NextResponse } from "next/server";

// Mock onboarding intake for the Digital Workforce hiring MVP.
// NO real billing, NO persistence, NO live provisioning. It validates and
// echoes the selection and returns an "early access requested" confirmation
// with a reference id. In NEO this maps to the Customer Onboarding package
// kicking off a (dry-run/preflight) workforce setup.
export const dynamic = "force-dynamic";

type HireBody = {
  plan?: string;
  role?: string;
  industry?: string;
  region?: string;
  connectors?: string[];
  intent?: "start-setup" | "early-access";
};

function reference(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-6);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `NDW-${stamp}-${rand}`;
}

export async function POST(request: Request) {
  let body: HireBody = {};
  try {
    body = (await request.json()) as HireBody;
  } catch {
    body = {};
  }

  const plan = typeof body.plan === "string" ? body.plan.slice(0, 60) : "Specialist";
  const intent = body.intent === "start-setup" ? "start-setup" : "early-access";
  const connectorsConnected = Array.isArray(body.connectors)
    ? body.connectors.filter((c) => typeof c === "string").slice(0, 20)
    : [];

  return NextResponse.json({
    ok: true,
    status: "early-access-requested",
    reference: reference(),
    intent,
    summary: {
      plan,
      role: typeof body.role === "string" ? body.role.slice(0, 80) : null,
      industry: typeof body.industry === "string" ? body.industry.slice(0, 80) : null,
      region: body.region === "CO" ? "CO" : "US",
      connectorsConnected,
    },
    message:
      "Thanks — your Digital Workforce setup request is in. No payment was taken and nothing was provisioned yet. Our team will reach out to activate your workforce.",
    disclaimer:
      "Mock onboarding intake (NB-NDP-001). No real billing, OAuth, or provisioning is performed.",
  });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "workforce-hire-intake",
    description:
      "Mock onboarding intake — POST a workforce selection to receive an early-access confirmation. No billing or provisioning.",
    accepts: {
      plan: "string",
      role: "string",
      industry: "string",
      region: ["CO", "US"],
      connectors: "string[]",
      intent: ["start-setup", "early-access"],
    },
  });
}
