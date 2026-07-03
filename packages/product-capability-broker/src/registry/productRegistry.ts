import type { ProductCapabilityAdapter } from "../types/adapter.js";
import type { RegisteredProduct } from "../types/registry.js";

export class ProductRegistry {
  private readonly adapters = new Map<string, ProductCapabilityAdapter>();
  private readonly registrations = new Map<string, RegisteredProduct>();

  register(adapter: ProductCapabilityAdapter): void {
    if (this.adapters.has(adapter.productId)) {
      throw new Error(`Product already registered: ${adapter.productId}`);
    }

    this.adapters.set(adapter.productId, adapter);
    this.registrations.set(adapter.productId, {
      metadata: adapter.ownership,
      adapterId: adapter.productId,
      registeredAt: Date.now(),
    });
  }

  getAdapter(productId: string): ProductCapabilityAdapter | undefined {
    return this.adapters.get(productId);
  }

  requireAdapter(productId: string): ProductCapabilityAdapter {
    const adapter = this.getAdapter(productId);
    if (!adapter) {
      throw new Error(`No capability adapter registered for product: ${productId}`);
    }
    return adapter;
  }

  listProducts(): RegisteredProduct[] {
    return [...this.registrations.values()];
  }

  hasProduct(productId: string): boolean {
    return this.adapters.has(productId);
  }
}

export function createDefaultProductRegistry(
  adapters: ProductCapabilityAdapter[],
): ProductRegistry {
  const registry = new ProductRegistry();
  for (const adapter of adapters) {
    registry.register(adapter);
  }
  return registry;
}
