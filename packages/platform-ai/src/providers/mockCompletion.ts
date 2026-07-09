import { buildCostEstimate } from "../cost/estimate.js";
import type { CompletionPort, ProviderResponse } from "./types.js";

/** Deterministic mock LLM for tests and local development. */
export function createMockCompletionPort(
  responseText = "mock response",
): CompletionPort {
  return {
    async complete(request): Promise<ProviderResponse> {
      const usage = buildCostEstimate(request.model, 10, 5);
      return {
        text: responseText,
        usage,
        metadata: { provider: "mock" },
      };
    },
  };
}
