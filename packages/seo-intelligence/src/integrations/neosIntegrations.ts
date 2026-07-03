/**
 * Integration interface for Product Capability Broker.
 * SIE consumes PCB to verify product claims before content recommendations.
 */
import type { ProductCapabilityVerifier } from "../engines/productMappingEngine.js";

export type { ProductCapabilityVerifier };

export function createPcbVerifierFromBroker(
  askFn: (keyword: string, productId: string) => {
    confidence: string;
    publicSafeSummary: string;
    honestNoFit?: boolean;
  },
): ProductCapabilityVerifier {
  return {
    verifyProductFit(keyword, productId) {
      if (productId === "none") {
        return { fitScore: 0, reason: "No product to verify", verified: false };
      }
      const result = askFn(keyword, productId);
      const fitScore =
        result.confidence === "high" ? 0.85 : result.confidence === "medium" ? 0.6 : 0.35;
      return {
        fitScore: result.honestNoFit ? 0.2 : fitScore,
        reason: result.publicSafeSummary,
        verified: true,
      };
    },
  };
}

/** Declared integration inputs — consumed from other NEOS capabilities. */
export const SIE_INTEGRATION_INPUTS = [
  "business_impact_engine",
  "product_capability_broker",
  "executive_intelligence",
  "customer_experience_intelligence",
] as const;

export const SIE_INTEGRATION_OUTPUTS = [
  "northbridge_website",
  "aviator_network",
  "future_operating_companies",
  "founder_dashboard",
  "content_recommendation_queue",
] as const;
