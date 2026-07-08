import type { VisualReviewAdapter } from "../types/adapter.js";

export class ReviewSourceRegistry {
  private readonly adapters = new Map<string, VisualReviewAdapter>();

  register(adapter: VisualReviewAdapter): void {
    if (this.adapters.has(adapter.productId)) {
      throw new Error(`Review adapter already registered: ${adapter.productId}`);
    }
    this.adapters.set(adapter.productId, adapter);
  }

  getAdapter(productId: string): VisualReviewAdapter | undefined {
    return this.adapters.get(productId);
  }

  requireAdapter(productId: string): VisualReviewAdapter {
    const adapter = this.getAdapter(productId);
    if (!adapter) {
      throw new Error(`No visual review adapter for product: ${productId}`);
    }
    return adapter;
  }

  listProducts(): string[] {
    return [...this.adapters.keys()];
  }
}

export function createDefaultReviewRegistry(
  adapters: VisualReviewAdapter[],
): ReviewSourceRegistry {
  const registry = new ReviewSourceRegistry();
  for (const adapter of adapters) {
    registry.register(adapter);
  }
  return registry;
}

/** Future capture source integrations — registered as metadata only in v1. */
export const FUTURE_CAPTURE_INTEGRATIONS = [
  "cursor_browser",
  "playwright",
  "chrome_devtools",
  "local_screenshots",
  "aviator_network",
  "quadrix",
  "northbridge_website",
] as const;

export type FutureCaptureIntegration = (typeof FUTURE_CAPTURE_INTEGRATIONS)[number];
