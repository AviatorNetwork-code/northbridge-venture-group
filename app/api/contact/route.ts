import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name : "";
    const email = typeof body.email === "string" ? body.email : "";
    const message = typeof body.message === "string" ? body.message : "";

    if (!name.trim() || !email.trim() || !message.trim()) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // TODO: Wire to your email provider (e.g. Resend, SendGrid) so submissions
    // arrive at contact@northbridgeventuregroup.com. For now we acknowledge receipt.
    // Example with Resend: await resend.emails.send({ from, to, subject, html });
    console.info("[Contact form]", { name, email, message: message.slice(0, 100) });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
