import { NextResponse } from "next/server";
import { FIELD_LIMITS, PROJECT_TYPES } from "@/lib/contact";

type ContactPayload = {
  name: string;
  company: string;
  email: string;
  phone: string;
  projectType: string;
  budgetRange: string;
  message: string;
};

const PROJECT_TYPE_SET = new Set<string>(PROJECT_TYPES);
const FALLBACK_TO_EMAIL = "hello@northbridgeventuregroup.com";
const SLACK_MESSAGE_PREVIEW_LENGTH = 200;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeSlackMrkdwn(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

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
  return email.length <= FIELD_LIMITS.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function exceedsLimit(value: string, limit: number): boolean {
  return value.length > limit;
}

function validatePayload(payload: ContactPayload): string | null {
  if (!payload.name) return "Full name is required.";
  if (!payload.email) return "Email is required.";
  if (!payload.projectType) return "Project type is required.";
  if (!payload.message) return "Message is required.";

  if (exceedsLimit(payload.name, FIELD_LIMITS.name)) {
    return "Full name is too long.";
  }
  if (exceedsLimit(payload.company, FIELD_LIMITS.company)) {
    return "Company name is too long.";
  }
  if (exceedsLimit(payload.email, FIELD_LIMITS.email)) {
    return "Email is too long.";
  }
  if (exceedsLimit(payload.phone, FIELD_LIMITS.phone)) {
    return "Phone number is too long.";
  }
  if (exceedsLimit(payload.projectType, FIELD_LIMITS.projectType)) {
    return "Project type is too long.";
  }
  if (exceedsLimit(payload.budgetRange, FIELD_LIMITS.budgetRange)) {
    return "Budget range is too long.";
  }
  if (exceedsLimit(payload.message, FIELD_LIMITS.message)) {
    return "Message is too long.";
  }

  if (!isValidEmail(payload.email)) {
    return "Enter a valid email address.";
  }

  if (!PROJECT_TYPE_SET.has(payload.projectType)) {
    return "Select a valid project type.";
  }

  return null;
}

function buildEmailHtml(payload: ContactPayload): string {
  const rows: [string, string][] = [
    ["Full name", payload.name],
    ["Company", payload.company || "—"],
    ["Email", payload.email],
    ["Phone", payload.phone || "—"],
    ["Project type", payload.projectType],
    ["Budget range", payload.budgetRange || "—"],
    ["Message", payload.message],
  ];

  const tableRows = rows
    .map(([label, value]) => {
      const safeLabel = escapeHtml(label);
      const safeValue = escapeHtml(value).replace(/\n/g, "<br />");
      return `<tr><td style="padding:8px 12px 8px 0;font-weight:600;vertical-align:top;color:#000;">${safeLabel}</td><td style="padding:8px 0;color:#333;">${safeValue}</td></tr>`;
    })
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
  const to = process.env.CONTACT_TO_EMAIL?.trim() || FALLBACK_TO_EMAIL;

  if (!apiKey || !from) return false;

  const subjectCompany = payload.company ? ` — ${payload.company}` : "";

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
      subject: `Project inquiry: ${payload.name}${subjectCompany}`,
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

async function sendSlackNotification(payload: ContactPayload): Promise<boolean> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    console.warn("[Contact form] SLACK_WEBHOOK_URL not configured; skipping Slack notification.");
    return false;
  }

  const preview =
    payload.message.length > SLACK_MESSAGE_PREVIEW_LENGTH
      ? `${payload.message.slice(0, SLACK_MESSAGE_PREVIEW_LENGTH)}…`
      : payload.message;

  const timestamp = new Date().toISOString();

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      blocks: [
        {
          type: "header",
          text: { type: "plain_text", text: "New contact form submission", emoji: true },
        },
        {
          type: "section",
          fields: [
            { type: "mrkdwn", text: `*Name:*\n${escapeSlackMrkdwn(payload.name)}` },
            { type: "mrkdwn", text: `*Email:*\n${escapeSlackMrkdwn(payload.email)}` },
            { type: "mrkdwn", text: `*Project type:*\n${escapeSlackMrkdwn(payload.projectType)}` },
            { type: "mrkdwn", text: `*Submitted:*\n${timestamp}` },
          ],
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Message preview:*\n${escapeSlackMrkdwn(preview)}`,
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("[Contact form] Slack webhook error:", response.status, errorBody);
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

    const validationError = validatePayload(payload);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const resendConfigured = Boolean(
      process.env.RESEND_API_KEY?.trim() && process.env.RESEND_FROM_EMAIL?.trim()
    );

    if (!resendConfigured) {
      console.error("[Contact form] Resend is not configured.");
      return NextResponse.json(
        { error: "Unable to send your inquiry right now. Please try again shortly." },
        { status: 503 }
      );
    }

    const sent = await sendWithResend(payload);
    if (!sent) {
      return NextResponse.json(
        { error: "Unable to send your inquiry right now. Please try again shortly." },
        { status: 502 }
      );
    }

    const slackSent = await sendSlackNotification(payload);
    if (!slackSent) {
      console.error("[Contact form] Email sent but Slack notification failed.");
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
