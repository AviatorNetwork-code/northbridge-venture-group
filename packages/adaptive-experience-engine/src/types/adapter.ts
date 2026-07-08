import type { AnalyzedExperienceContext, AEEInputBundle } from "./inputs.js";
import type { ExperienceRecommendation } from "./recommendations.js";

export interface ExperienceDomain {
  id: string;
  label: string;
  areas: Array<ExperienceRecommendation["area"]>;
}

export interface ProductExperienceContext {
  productId: string;
  domains: ExperienceDomain[];
  intentAliases?: Record<string, string>;
  featureCatalog?: string[];
}

/**
 * Product adapter contract — all product-specific logic lives in adapters.
 * Core AEE must never import product implementations.
 */
export interface AdaptiveExperienceAdapter {
  readonly productId: string;
  readonly displayName: string;

  /** Product experience domains and mappings. */
  getExperienceContext(): ProductExperienceContext;

  /** Normalize raw product telemetry. */
  normalizeTelemetry(raw: unknown): import("./inputs.js").TelemetryEvent[];

  /** Optional product-specific recommendation templates. */
  getRecommendationTemplates?(
    context: AnalyzedExperienceContext,
    inputs: AEEInputBundle,
  ): Partial<ExperienceRecommendation>[];
}
