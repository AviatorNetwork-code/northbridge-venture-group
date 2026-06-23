type AnalyticsProperties = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

/**
 * Lightweight analytics hook. Pushes to window.dataLayer when present;
 * otherwise logs in development only.
 */
export function trackEvent(event: string, properties?: AnalyticsProperties): void {
  const payload = { event, ...properties, timestamp: new Date().toISOString() };

  if (typeof window !== "undefined" && Array.isArray(window.dataLayer)) {
    window.dataLayer.push(payload);
    return;
  }

  if (process.env.NODE_ENV === "development") {
    console.info("[analytics]", payload);
  }
}
