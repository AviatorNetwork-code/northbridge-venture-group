import type { ProductCapabilityRequest } from "./request.js";
import type { ProductCapabilityResponse } from "./response.js";
import type { ProductOwnershipMetadata } from "./registry.js";

/**
 * Product adapter contract — each product owns its capability knowledge.
 * Core broker must never embed product-specific claims.
 */
export interface ProductCapabilityAdapter {
  readonly productId: string;
  readonly displayName: string;
  readonly ownership: ProductOwnershipMetadata;

  /** Authoritative capability response for a broker request. */
  respond(request: ProductCapabilityRequest): ProductCapabilityResponse;
}
