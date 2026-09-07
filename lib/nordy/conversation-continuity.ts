import type { NordyConversationFacts } from "@/lib/nordy/types";

export function createEmptyFacts(): NordyConversationFacts {
  return {
    currentSystems: [],
    integrations: [],
    platforms: [],
    features: [],
  };
}

function uniquePush(list: string[], value: string): string[] {
  const normalized = value.trim();
  if (!normalized) return list;
  if (list.some((item) => item.toLowerCase() === normalized.toLowerCase())) {
    return list;
  }
  return [...list, normalized];
}

/**
 * Merge multi-turn facts without restarting intake.
 * Canonical conversation continuity — no separate Nordy memory database.
 */
export function mergeConversationFacts(
  previous: NordyConversationFacts,
  utterance: string,
): NordyConversationFacts {
  const text = utterance.trim();
  const lower = text.toLowerCase();
  const next: NordyConversationFacts = {
    ...previous,
    currentSystems: [...previous.currentSystems],
    integrations: [...previous.integrations],
    platforms: [...previous.platforms],
    features: [...previous.features],
  };

  if (/\bhvac\b/i.test(text)) next.industry = next.industry ?? "HVAC";
  if (/\brestaurant\b/i.test(text)) next.industry = next.industry ?? "restaurant";
  if (/\baviation\b|\bflight school\b/i.test(text)) {
    next.industry = next.industry ?? "aviation";
  }

  if (/\b(\d+)\s+employees?\b/i.test(text)) {
    const match = text.match(/\b(\d+)\s+employees?\b/i);
    if (match) next.employeeCount = match[1];
  }

  if (/\bapp\b|\bmobile\b|\bios\b|\bandroid\b/i.test(lower)) {
    next.needsMobile = true;
    next.requestedSolution = next.requestedSolution ?? "mobile app";
    next.platforms = uniquePush(next.platforms, "mobile");
  }
  if (/\bwebsite\b|\blanding\b/i.test(lower)) {
    next.needsWebsite = true;
    next.requestedSolution = next.requestedSolution ?? "website";
  }
  if (/\becommerce\b|\bshop\b|\bstore\b/i.test(lower)) {
    next.needsEcommerce = true;
  }
  if (/\bportal\b/i.test(lower)) next.needsPortal = true;
  if (/\bbook(ing|)\b|\bschedule\b/i.test(lower)) {
    next.needsBooking = true;
    next.features = uniquePush(next.features, "booking");
  }
  if (/\bpay(ment|ments|)\b|\bstripe\b/i.test(lower)) {
    next.needsPayments = true;
    next.features = uniquePush(next.features, "payments");
  }
  if (/\bauth\b|\blogin\b|\baccount\b|\bprofile\b/i.test(lower)) {
    next.needsAuth = true;
    next.features = uniquePush(next.features, "auth");
  }

  for (const system of ["crm", "email", "scheduling", "invoicing", "quickbooks", "hubspot"]) {
    if (lower.includes(system)) {
      next.currentSystems = uniquePush(next.currentSystems, system);
      next.integrations = uniquePush(next.integrations, system);
    }
  }

  if (/\bmanual\b|\bspreadsheet\b|\bcopy.?paste\b/i.test(lower)) {
    next.problem = next.problem ?? "manual operational work";
  }
  if (/\burgent\b|\basap\b|\bthis week\b/i.test(lower)) {
    next.urgency = "high";
  }
  if (/\bnext month\b|\bthis quarter\b/i.test(lower)) {
    next.timeline = next.timeline ?? text;
  }

  // Capture short company names when user answers "what does your business do?"
  if (!next.company && text.length > 1 && text.length < 48 && !/[?]/.test(text)) {
    if (/^(we are|i run|my company is|company[: ]|we're)\b/i.test(text)) {
      next.company = text.replace(/^(we are|i run|my company is|company[: ]|we're)\s*/i, "");
    }
  }

  if (/\bi need an? (app|website|portal|system)\b/i.test(lower)) {
    const match = lower.match(/\bi need an? (app|website|portal|system)\b/i);
    if (match) next.requestedSolution = match[1];
  }

  return next;
}

export function factsSummary(facts: NordyConversationFacts): string {
  const parts: string[] = [];
  if (facts.industry) parts.push(facts.industry);
  if (facts.requestedSolution) parts.push(facts.requestedSolution);
  if (facts.needsBooking) parts.push("booking");
  if (facts.needsPayments) parts.push("payments");
  if (facts.needsMobile) parts.push("mobile");
  if (facts.needsWebsite) parts.push("website");
  if (facts.currentSystems.length) parts.push(`systems: ${facts.currentSystems.join(", ")}`);
  if (facts.employeeCount) parts.push(`${facts.employeeCount} employees`);
  return parts.join(" · ");
}
