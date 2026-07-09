export const PRESENTATION_FORMATS = [
  "short_answer",
  "detailed_answer",
  "card",
  "expandable_card",
  "table",
  "timeline",
  "checklist",
  "confirmation",
] as const;

export type PresentationFormat = (typeof PRESENTATION_FORMATS)[number];

export type PresentationChannel = "mobile" | "desktop" | "unknown";

export type PresentationPolicyInput = {
  intentType: string;
  rowCount?: number;
  stepCount?: number;
  confidence: number;
  requiresConfirmation: boolean;
  hasStructuredData: boolean;
  channel?: PresentationChannel;
};

export type PresentationDecision = {
  format: PresentationFormat;
  collapsedByDefault: boolean;
  maxVisibleRows: number;
  reasoning: string;
};
