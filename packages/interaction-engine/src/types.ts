import type { ConversationTurnAction } from "@northbridge/conversation-engine";
import type { PresentationFormat } from "@northbridge/presentation-policy";

export const INTERACTION_MODALITIES = [
  "message",
  "card",
  "form",
  "timeline",
  "chart",
  "confirmation",
  "alert",
  "quick_actions",
] as const;

export type InteractionModality = (typeof INTERACTION_MODALITIES)[number];

export type InteractionModalityInput = {
  turnAction: ConversationTurnAction;
  presentationFormat: PresentationFormat;
  hasFormFields: boolean;
  hasTimeSeries: boolean;
  hasMetrics: boolean;
  severity?: "info" | "warning" | "error";
};

export type InteractionModalityDecision = {
  modality: InteractionModality;
  reasoning: string;
};
