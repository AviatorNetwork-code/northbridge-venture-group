import type {
  CatAnalyticsEventName,
  CatAnalyticsHandler,
  CatAnalyticsPayload,
} from "./websiteAssistantTypes";

let analyticsHandler: CatAnalyticsHandler | null = null;

/** Register a backend or third-party analytics handler when available. */
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
