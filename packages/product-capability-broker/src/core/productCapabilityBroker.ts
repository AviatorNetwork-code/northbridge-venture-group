import { DEFAULT_PRODUCT_ADAPTERS } from "../adapters/defaultProductAdapters.js";
import {
  detectHallucinationRisk,
  findBlockedClaimsForQuestion,
  validateCapabilityResponse,
} from "../engines/capabilityResponseValidator.js";
import {
  applyDisclosureGuardrails,
  enforceRoadmapDisclosureRules,
} from "../engines/disclosureGuardrails.js";
import { synthesizePublicAnswer } from "../engines/publicSafeSynthesis.js";
import {
  assertNoAutonomousInvention,
  assertReadOnlyOperation,
  PCB_GOVERNANCE,
} from "../governance/readOnlyPolicy.js";
import {
  createDefaultProductRegistry,
  ProductRegistry,
} from "../registry/productRegistry.js";
import type { ProductCapabilityAdapter } from "../types/adapter.js";
import type { ProductCapabilityRequest } from "../types/request.js";
import type { BrokeredCapabilityResult } from "../types/response.js";

export interface ProductCapabilityBrokerOptions {
  registry?: ProductRegistry;
  adapters?: ProductCapabilityAdapter[];
}

export class ProductCapabilityBroker {
  readonly registry: ProductRegistry;

  constructor(options: ProductCapabilityBrokerOptions = {}) {
    this.registry =
      options.registry ??
      createDefaultProductRegistry(options.adapters ?? DEFAULT_PRODUCT_ADAPTERS);
  }

  /** Read-only broker request — delegates to product-owned adapter. */
  ask(request: ProductCapabilityRequest): BrokeredCapabilityResult {
    assertReadOnlyOperation("broker_request");

    const adapter = this.registry.requireAdapter(request.targetProductId);
    assertNoAutonomousInvention(request.requesterId, adapter.productId);

    const rawResponse = adapter.respond(request);

    const validation = validateCapabilityResponse(rawResponse, request.requiredConfidence);
    if (!validation.valid) {
      throw new Error(
        `Invalid capability response from ${adapter.productId}: ${validation.errors.join("; ")}`,
      );
    }

    const roadmapSafe = enforceRoadmapDisclosureRules(rawResponse);
    const guardrails = applyDisclosureGuardrails(
      roadmapSafe,
      request.allowedDisclosureLevel,
      request.publicFacing,
    );

    const hallucinationRisks = detectHallucinationRisk(guardrails.response, request.question);
    const blockedClaims = findBlockedClaimsForQuestion(guardrails.response, request.question);

    const publicAnswer = synthesizePublicAnswer(request, guardrails.response);

    return {
      requestId: request.requestId,
      response: guardrails.response,
      publicAnswer,
      blockedClaims,
      guardrailWarnings: [...guardrails.warnings, ...validation.warnings, ...hallucinationRisks],
      synthesisApplied: true,
    };
  }

  listProducts() {
    return this.registry.listProducts();
  }
}

export function createProductCapabilityBroker(
  options?: ProductCapabilityBrokerOptions,
): ProductCapabilityBroker {
  return new ProductCapabilityBroker(options);
}

export { PCB_GOVERNANCE };
