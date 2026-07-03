export type ObjectionType =
  | "price"
  | "uncertainty"
  | "competitor"
  | "timing"
  | "authority"
  | "need";

export interface DetectedObjection {
  type: ObjectionType;
  phrase: string;
}

export interface ObjectionResponse {
  acknowledgment: string;
  response: string;
  trustNote: string;
}

const OBJECTION_PATTERNS: Array<{ type: ObjectionType; patterns: RegExp[] }> = [
  {
    type: "price",
    patterns: [/too expensive/i, /can't afford/i, /out of budget/i, /cost too much/i],
  },
  {
    type: "uncertainty",
    patterns: [/not sure/i, /don't know if/i, /need to think/i, /maybe later/i],
  },
  {
    type: "competitor",
    patterns: [/competitor/i, /another vendor/i, /already using/i, /shopify/i, /wix/i],
  },
  {
    type: "timing",
    patterns: [/not ready/i, /too early/i, /next year/i, /no rush/i],
  },
  {
    type: "authority",
    patterns: [/need to ask/i, /talk to my/i, /boss|partner|team decides/i],
  },
  {
    type: "need",
    patterns: [/don't need/i, /not for us/i, /doesn't apply/i],
  },
];

const RESPONSE_TEMPLATES: Record<ObjectionType, ObjectionResponse> = {
  price: {
    acknowledgment: "Budget is a fair and important consideration.",
    response:
      "Northbridge scopes work in structured tiers so you know timeline and cost upfront. A brief consultation can clarify whether a starter engagement or platform build is appropriate—without pressure to commit.",
    trustNote: "I won't suggest spending beyond what fits your situation.",
  },
  uncertainty: {
    acknowledgment: "It makes sense to want clarity before moving forward.",
    response:
      "We can narrow options based on your specific challenge. If helpful, a short conversation with Northbridge can confirm fit before any commitment.",
    trustNote: "There's no obligation from exploring options.",
  },
  competitor: {
    acknowledgment: "You're right to compare alternatives carefully.",
    response:
      "Northbridge differentiates by building and operating full platforms—not just brochure sites. If your need is simpler, we'll say so honestly.",
    trustNote: "I'll only recommend Northbridge when it's genuinely the better fit.",
  },
  timing: {
    acknowledgment: "Timing matters, and rushing rarely helps.",
    response:
      "Exploring now can still help you plan scope and budget. You can continue browsing resources and reconnect when the timing is right.",
    trustNote: "No fake urgency—proceed when it makes sense for you.",
  },
  authority: {
    acknowledgment: "Decisions often involve other stakeholders.",
    response:
      "Northbridge can provide a concise overview your team can review. The contact page is the best place to request materials for a shared conversation.",
    trustNote: "Happy to keep this informational until your team is ready.",
  },
  need: {
    acknowledgment: "Not every offering fits every situation—and that's okay.",
    response:
      "If Northbridge isn't the right match, I'll tell you directly. You may still find public resources useful, or another path may be better.",
    trustNote: "Honest fit matters more than a sale.",
  },
};

export function detectObjection(input: string): DetectedObjection | null {
  for (const entry of OBJECTION_PATTERNS) {
    for (const pattern of entry.patterns) {
      const match = input.match(pattern);
      if (match) {
        return { type: entry.type, phrase: match[0] };
      }
    }
  }
  return null;
}

export function buildObjectionResponse(objection: DetectedObjection): ObjectionResponse {
  return RESPONSE_TEMPLATES[objection.type];
}

export function formatObjectionMessage(objection: DetectedObjection): string {
  const template = buildObjectionResponse(objection);
  return [template.acknowledgment, template.response, template.trustNote].join("\n\n");
}
