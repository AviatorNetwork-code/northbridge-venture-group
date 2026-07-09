const OPTIONAL_ACKNOWLEDGMENTS = [
  "That helps.",
  "Understood.",
  "That gives me useful context.",
  "I follow.",
] as const;

const INDUSTRY_OPENERS = [
  "That gives me a useful starting point.",
  "That context helps me orient quickly.",
  "Good — that narrows the operational picture.",
] as const;

const RETURNING_PREFIXES = [
  "I already have context from earlier in our conversation.",
  "I remember what you have shared so far.",
  "We can build on what you told me before.",
] as const;

export function pickAcknowledgment(seed: number): string | null {
  if (seed % 3 === 0) return null;
  return OPTIONAL_ACKNOWLEDGMENTS[Math.abs(seed) % OPTIONAL_ACKNOWLEDGMENTS.length];
}

export function pickIndustryAcknowledgment(industryLabel: string, seed: number): string {
  const phrase = INDUSTRY_OPENERS[Math.abs(seed) % INDUSTRY_OPENERS.length];
  return `A ${industryLabel} — ${phrase.charAt(0).toLowerCase()}${phrase.slice(1)}`;
}

export function pickReturningPrefix(seed: number): string {
  return RETURNING_PREFIXES[Math.abs(seed) % RETURNING_PREFIXES.length];
}

export function softenTransition(seed: number): string | null {
  const options = [
    "One thread I want to follow next.",
    "There is one area I would like to understand next.",
    null,
  ];
  return options[Math.abs(seed) % options.length];
}

export function noticedLeadIn(seed: number): string {
  const options = [
    "One pattern is worth naming.",
    "Something in your operation stands out.",
    "A theme is emerging from what you shared.",
  ];
  return options[Math.abs(seed) % options.length];
}
