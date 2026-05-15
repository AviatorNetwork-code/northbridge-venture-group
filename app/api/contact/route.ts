import { NextResponse } from "next/server";

type ContactPayload = {
  name: string;
  company: string;
  email: string;
  phone: string;
  projectType: string;
  budgetRange: string;
  message: string;
};

function parsePayload(body: unknown): ContactPayload | null {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;
  return {
    name: typeof data.name === "string" ? data.name.trim() : "",
    company: typeof data.company === "string" ? data.company.trim() : "",
    email: typeof data.email === "string" ? data.email.trim() : "",
    phone: typeof data.phone === "string" ? data.phone.trim() : "",
    projectType: typeof data.projectType === "string" ? data.projectType.trim() : "",
    budgetRange: typeof data.budgetRange === "string" ? data.budgetRange.trim() : "",
    message: typeof data.message === "string" ? data.message.trim() : "",
  };
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buildEmailHtml(payload: ContactPayload): string {
  const rows = [
    ["Full name", payload.name],
    ["Company", payload.company || "—"],
    ["Email", payload.email],
    ["Phone", payload.phone || "—"],
    ["Project type", payload.projectType],
    ["Budget range", payload.budgetRange || "—"],
    ["Message", payload.message.replace(/\n/g, "<br />")],
  ];

  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px 8px 0;font-weight:600;vertical-align:top;color:#000;">${label}</td><td style="padding:8px 0;color:#333;">${value}</td></tr>`
    )
    .join("");

  return `
    <div style="font-family:system-ui,sans-serif;max-width:560px;">
      <h2 style="color:#B11226;margin:0 0 16px;">New project inquiry</h2>
      <table style="border-collapse:collapse;width:100%;">${tableRows}</table>
    </div>
  `;
}

async function sendWithResend(payload: ContactPayload): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim() ?? "contact@northbridgeventuregroup.com";

  if (!apiKey || !from) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: payload.email,
      subject: `Project inquiry: ${payload.name}${payload.company ? ` — ${payload.company}` : ""}`,
      html: buildEmailHtml(payload),
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("[Contact form] Resend error:", response.status, errorBody);
    return false;
  }

  return true;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = parsePayload(body);

    if (!payload) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    if (!payload.name || !payload.email || !payload.projectType || !payload.message) {
      return NextResponse.json(
        { error: "Full name, email, project type, and message are required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(payload.email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    const resendConfigured = Boolean(
      process.env.RESEND_API_KEY?.trim() && process.env.RESEND_FROM_EMAIL?.trim()
    );

    if (resendConfigured) {
      const sent = await sendWithResend(payload);
      if (!sent) {
        return NextResponse.json(
          { error: "Unable to send your inquiry right now. Please try again shortly." },
          { status: 502 }
        );
      }
    } else {
      console.info("[Contact form] Submission received (Resend not configured):", payload);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
