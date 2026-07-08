import type { DiscoveryProfile, WebsiteAnalysisResult, WebsiteSignal } from "@/lib/cat/discovery-types";

const APPOINTMENT_PROVIDERS: Record<string, string> = {
  calendly: "Calendly",
  acuity: "Acuity Scheduling",
  squareup: "Square Appointments",
  mindbody: "Mindbody",
  zocdoc: "Zocdoc",
  booksy: "Booksy",
  schedulicity: "Schedulicity",
};

const TECH_SIGNATURES: Record<string, string> = {
  "wp-content": "WordPress",
  shopify: "Shopify",
  wix: "Wix",
  squarespace: "Squarespace",
  webflow: "Webflow",
  hubspot: "HubSpot",
  "google-analytics": "Google Analytics",
  stripe: "Stripe",
};

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTitle(html: string): string | undefined {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match?.[1]?.trim();
}

function extractMetaDescription(html: string): string | undefined {
  const match = html.match(
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
  );
  return match?.[1]?.trim();
}

function extractHeadings(html: string): string[] {
  const headings: string[] = [];
  const pattern = /<h[1-3][^>]*>([^<]+)<\/h[1-3]>/gi;
  let match = pattern.exec(html);
  while (match && headings.length < 8) {
    const text = match[1].replace(/\s+/g, " ").trim();
    if (text.length > 2 && text.length < 80) headings.push(text);
    match = pattern.exec(html);
  }
  return headings;
}

function detectCategory(text: string, title?: string): string | undefined {
  const combined = `${title ?? ""} ${text}`.toLowerCase();
  const map: Record<string, string[]> = {
    dental: ["dental", "dentist", "orthodont", "oral"],
    healthcare: ["clinic", "medical", "physician", "patient", "hospital"],
    hvac: ["hvac", "heating", "air conditioning", "furnace", "cooling"],
    aviation: ["flight school", "aviation", "pilot training", "flying school", "cfi"],
    hospitality: ["restaurant", "cafe", "hotel", "dining", "menu", "bar"],
    retail: ["shop", "store", "retail", "boutique"],
    fitness: ["gym", "fitness", "yoga", "pilates", "training"],
    salon: ["salon", "spa", "beauty", "hair", "nails"],
    "professional-services": ["law", "legal", "accounting", "consulting", "agency"],
  };

  for (const [category, keywords] of Object.entries(map)) {
    if (keywords.some((keyword) => combined.includes(keyword))) return category;
  }

  return undefined;
}

function detectContactMethods(html: string, text: string): string[] {
  const methods: string[] = [];
  if (/href=["']tel:/i.test(html) || /\(\d{3}\)\s*\d{3}/.test(text)) methods.push("phone");
  if (/href=["']mailto:/i.test(html)) methods.push("email");
  if (/<form[\s>]/i.test(html)) methods.push("contact form");
  if (/whatsapp|wa\.me/i.test(html)) methods.push("WhatsApp");
  if (/instagram\.com/i.test(html)) methods.push("Instagram");
  return Array.from(new Set(methods));
}

function detectAppointmentSystem(html: string): { has: boolean; provider?: string } {
  const lower = html.toLowerCase();
  for (const [signature, label] of Object.entries(APPOINTMENT_PROVIDERS)) {
    if (lower.includes(signature)) return { has: true, provider: label };
  }
  if (/book (now|online|appointment)|schedule (now|online|appointment)/i.test(lower)) {
    return { has: true };
  }
  return { has: false };
}

function detectTechnologies(html: string): string[] {
  const lower = html.toLowerCase();
  return Object.entries(TECH_SIGNATURES)
    .filter(([signature]) => lower.includes(signature))
    .map(([, label]) => label);
}

function detectBusinessHours(text: string): boolean {
  return /(mon|tue|wed|thu|fri|sat|sun).{0,20}\d{1,2}(:\d{2})?\s*(am|pm)/i.test(text)
    || /hours of operation|business hours|open (daily|today)/i.test(text);
}

function detectEmergencyMessaging(text: string): boolean {
  return /emergency|urgent care|after.?hours|24\/7/i.test(text);
}

function phoneProminent(html: string): boolean {
  const headerMatch = html.match(/<header[\s\S]*?<\/header>/i)?.[0] ?? html.slice(0, 4000);
  return /href=["']tel:/i.test(headerMatch) || /call (us|now)|phone/i.test(headerMatch);
}

function detectGoogleBusinessLink(html: string): boolean {
  return /google\.com\/maps|g\.page|business\.google|google business/i.test(html);
}

function buildSignals(analysis: Omit<WebsiteAnalysisResult, "signals" | "analyzedAt" | "hasGoogleBusinessProfile">): WebsiteSignal[] {
  const signals: WebsiteSignal[] = [];

  if (analysis.hasAppointmentSystem) {
    signals.push({
      id: "booking-present",
      category: "appointments",
      observation: "Online booking appears available",
      evidence: analysis.appointmentProvider
        ? `Detected ${analysis.appointmentProvider} on the public site`
        : "Found booking language or scheduling links on the homepage",
      confidence: analysis.appointmentProvider ? "high" : "medium",
    });
  } else if (analysis.category === "dental" || analysis.category === "healthcare") {
    signals.push({
      id: "booking-missing",
      category: "appointments",
      observation: "No obvious online booking flow on the homepage",
      evidence: "Did not detect common scheduling tools or book-now flows on the public page",
      confidence: "medium",
    });
  }

  if (analysis.hasEmergencyMessaging && !analysis.phoneProminent) {
    signals.push({
      id: "emergency-phone",
      category: "contact",
      observation: "Emergency services are mentioned, but a phone number is not prominent near the top",
      evidence: "Emergency/urgent language appears on the site without a clear tel: link in the header area",
      confidence: "medium",
    });
  }

  if (analysis.hasAppointmentSystem && !/reminder|confirm/i.test(analysis.services.join(" "))) {
    signals.push({
      id: "reminder-gap",
      category: "operations",
      observation: "Booking looks straightforward, but automated reminders are not evident",
      evidence: "Scheduling is visible on the site; no public mention of appointment reminders or confirmations",
      confidence: "medium",
    });
  }

  if (analysis.hasContactForm && !analysis.contactMethods.includes("phone")) {
    signals.push({
      id: "form-only-contact",
      category: "contact",
      observation: "Contact relies on a form without an obvious phone option",
      evidence: "A contact form is present; a direct phone line was not detected on the public page",
      confidence: "medium",
    });
  }

  if (analysis.services.length >= 3 && !analysis.hasAppointmentSystem) {
    signals.push({
      id: "services-without-booking",
      category: "operations",
      observation: "Multiple services are listed, but scheduling is not immediately clear",
      evidence: `Services such as ${analysis.services.slice(0, 3).join(", ")} are visible without a clear booking path`,
      confidence: "medium",
    });
  }

  if (analysis.hasBusinessHours && !analysis.hasAppointmentSystem) {
    signals.push({
      id: "hours-no-booking",
      category: "operations",
      observation: "Business hours are published, but online booking is not obvious",
      evidence: "Hours of operation appear on the site without a detected scheduling integration",
      confidence: "medium",
    });
  }

  return signals;
}

export function normalizeWebsiteUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withProtocol);
    if (!url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function extractWebsiteUrl(text: string): string | null {
  const urlMatch = text.match(/https?:\/\/[^\s]+|(?:www\.)?[a-z0-9-]+(?:\.[a-z]{2,})+[^\s]*/i);
  if (!urlMatch) return null;
  return normalizeWebsiteUrl(urlMatch[0].replace(/[.,;:!?)]+$/, ""));
}

export function analyzeWebsiteHtml(url: string, html: string): WebsiteAnalysisResult {
  const text = stripHtml(html);
  const title = extractTitle(html);
  const description = extractMetaDescription(html);
  const headings = extractHeadings(html);
  const category = detectCategory(`${text} ${description ?? ""}`, title);
  const contactMethods = detectContactMethods(html, text);
  const appointment = detectAppointmentSystem(html);
  const technologies = detectTechnologies(html);
  const services = headings.filter((heading) => !/about|contact|home|welcome/i.test(heading)).slice(0, 6);

  const base = {
    url,
    title,
    category,
    services,
    contactMethods,
    hasBookingFlow: appointment.has || /book|schedule/i.test(text),
    hasAppointmentSystem: appointment.has,
    appointmentProvider: appointment.provider,
    hasBusinessHours: detectBusinessHours(text),
    hasContactForm: /<form[\s>]/i.test(html),
    hasEmergencyMessaging: detectEmergencyMessaging(text),
    phoneProminent: phoneProminent(html),
    technologies,
    hasGoogleBusinessProfile: detectGoogleBusinessLink(html),
  };

  const signals = buildSignals(base);

  return {
    ...base,
    signals,
    analyzedAt: new Date().toISOString(),
  };
}

export function formatWebsiteFindings(analysis: WebsiteAnalysisResult): string {
  const bullets: string[] = [];

  if (analysis.services.length > 0) {
    bullets.push(`• ${analysis.services.length} public service${analysis.services.length === 1 ? "" : "s"} listed`);
  }

  if (analysis.hasContactForm) {
    bullets.push("• Contact form available");
  }

  if (analysis.hasAppointmentSystem) {
    bullets.push(
      `• Online appointment booking detected${analysis.appointmentProvider ? ` (${analysis.appointmentProvider})` : ""}`,
    );
  } else {
    bullets.push("• No online appointment booking detected");
  }

  const hasReminderMention = analysis.signals.some((signal) => signal.id === "reminder-gap");
  if (hasReminderMention || !analysis.hasAppointmentSystem) {
    bullets.push("• No automated reminder workflow detected");
  }

  if (analysis.hasGoogleBusinessProfile) {
    bullets.push("• Google Business profile linked");
  }

  if (analysis.hasEmergencyMessaging) {
    bullets.push("• Emergency or urgent service messaging present");
  }

  if (analysis.hasBusinessHours) {
    bullets.push("• Business hours published on the site");
  }

  if (bullets.length === 0) {
    bullets.push("• Public website reviewed — limited structured signals detected");
  }

  return [
    "I've finished reviewing your website.",
    "",
    "I found:",
    "",
    ...bullets,
    "",
    "These are observations only — we'll keep learning as we talk.",
  ].join("\n");
}

export function generateFirstInsight(
  analysis: WebsiteAnalysisResult,
  profile: DiscoveryProfile,
): string | null {
  const industry = profile.industry ?? analysis.category;
  const signal = analysis.signals[0];
  if (!signal) return null;

  const industryLabel =
    industry === "dental"
      ? "practices like yours"
      : industry === "healthcare"
        ? "clinics like yours"
        : industry === "hospitality"
          ? "businesses like yours"
          : "operations like yours";

  if (signal.id === "reminder-gap") {
    return [
      "You make booking appointments very easy.",
      "",
      "One thing I noticed is that I couldn't find an automated reminder process on your public site.",
      "",
      `${industryLabel.charAt(0).toUpperCase() + industryLabel.slice(1)} often see measurable improvements when patients receive reminders before appointments.`,
      "",
      "We'll come back to that later.",
      "",
      "For now, I'd like to learn a little more about how your business operates day to day.",
    ].join("\n");
  }

  if (signal.id === "emergency-phone") {
    return [
      "I noticed your site emphasizes emergency or urgent care.",
      "",
      "However, an emergency phone number doesn't appear particularly prominent near the top — especially on mobile.",
      "",
      "That might be something worth reviewing.",
      "",
      "We'll come back to it later.",
      "",
      "For now, tell me a bit more about how customers usually reach you when something is urgent.",
    ].join("\n");
  }

  if (signal.id === "form-only-contact") {
    return [
      "Your site makes it easy to send a message through a contact form.",
      "",
      "What I didn't see right away is a direct phone line for customers who want an immediate answer.",
      "",
      "Many businesses in your category find that mixing a form with a visible phone option reduces missed opportunities.",
      "",
      "We'll come back to that later.",
      "",
      "For now, how do you typically handle inbound inquiries today?",
    ].join("\n");
  }

  if (signal.id === "services-without-booking" || signal.id === "hours-no-booking") {
    return [
      "You present your services clearly.",
      "",
      "What wasn't immediately obvious is how a new customer would schedule with you online.",
      "",
      "Businesses with multiple services often benefit when the booking path is unmistakable from the homepage.",
      "",
      "We'll come back to that later.",
      "",
      "For now, walk me through what happens when someone wants to become a customer.",
    ].join("\n");
  }

  if (signal.id === "booking-missing") {
    return [
      "Your site communicates what you do well.",
      "",
      "I didn't spot an obvious way for someone to book online from the homepage.",
      "",
      `${industryLabel.charAt(0).toUpperCase() + industryLabel.slice(1)} frequently reduce phone tag when scheduling is visible upfront.`,
      "",
      "We'll come back to that later.",
      "",
      "For now, how are appointments or consultations usually scheduled today?",
    ].join("\n");
  }

  return [
    "I took a quick look at your public site while we talked.",
    "",
    signal.observation + ".",
    "",
    "We'll come back to that later.",
    "",
    "For now, I'd like to understand a bit more about how your team operates day to day.",
  ].join("\n");
}

export async function fetchAndAnalyzeWebsite(url: string): Promise<WebsiteAnalysisResult> {
  const response = await fetch(url, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent": "NorthbridgeDiscoveryBot/1.0 (+https://northbridge.digital)",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`Unable to reach ${url}`);
  }

  const html = await response.text();
  return analyzeWebsiteHtml(url, html);
}
