import type {
  CatAnalyticsEventName,
  CatAnalyticsHandler,
  CatAnalyticsPayload,
} from "./websiteAssistantTypes";

let analyticsHandler: CatAnalyticsHandler | null = null;

export function setCatAnalyticsHandler(handler: CatAnalyticsHandler | null): void {
  analyticsHandler = handler;
}

export function trackCatEvent(
  event: CatAnalyticsEventName,
  properties?: CatAnalyticsPayload["properties"],
): void {
  const payload: CatAnalyticsPayload = {
    event,
    timestamp: Date.now(),
    properties,
  };

  analyticsHandler?.(payload);

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("northbridge:cat-analytics", { detail: payload }),
    );
  }
}

export function trackSalesEvent(
  event:
    | "discovery_started"
    | "clarification_requested"
    | "product_fit_detected"
    | "objection_detected"
    | "objection_handled"
    | "close_recommended"
    | "qualified_lead_detected",
  properties?: CatAnalyticsPayload["properties"],
): void {
  trackCatEvent(event, properties);
}

export function trackConversionEvent(
  type: "cta_click" | "qualified_lead" | "consultation_intent" | "conversation_complete",
  properties?: CatAnalyticsPayload["properties"],
): void {
  const eventMap = {
    cta_click: "cat_cta_clicked",
    qualified_lead: "cat_qualified_lead_signal",
    consultation_intent: "cat_conversion_intent",
    conversation_complete: "cat_conversation_completed",
  } as const;

  trackCatEvent(eventMap[type], properties);
}
