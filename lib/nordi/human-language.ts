const ACKNOWLEDGMENTS = [
  "That helps.",
  "Perfect.",
  "Thank you.",
  "Got it.",
  "One more thing.",
  "I think I'm beginning to understand your business.",
] as const;

const INDUSTRY_ACKNOWLEDGMENTS = [
  "That helps me orient quickly.",
  "Good to know.",
  "Thank you — that gives me context.",
] as const;

const RETURNING_PREFIXES = [
  "I already know a little about your business.",
  "I remember what you've shared.",
  "I won't ask that again.",
] as const;

export function pickAcknowledgment(seed: number): string {
  return ACKNOWLEDGMENTS[Math.abs(seed) % ACKNOWLEDGMENTS.length];
}

export function pickIndustryAcknowledgment(industryLabel: string, seed: number): string {
  const phrase = INDUSTRY_ACKNOWLEDGMENTS[Math.abs(seed) % INDUSTRY_ACKNOWLEDGMENTS.length];
  return `A ${industryLabel} — ${phrase.charAt(0).toLowerCase()}${phrase.slice(1)}`;
}

export function pickReturningPrefix(seed: number): string {
  return RETURNING_PREFIXES[Math.abs(seed) % RETURNING_PREFIXES.length];
}

export function softenTransition(seed: number): string {
  const options = ["Before I explain...", "One more thing.", "I'd like to understand one more thing."];
  return options[Math.abs(seed) % options.length];
}

export function noticedLeadIn(seed: number): string {
  const options = ["I noticed something.", "Something stood out.", "One observation."];
  return options[Math.abs(seed) % options.length];
}
