import { analyzeExperienceContext } from "../engines/experienceAnalyzer.js";
import {
  estimateBusinessImpact,
  estimateCustomerImpact,
} from "../engines/customerImpactEstimator.js";
import {
  buildAdaptiveExperiencePlan,
  resolveDependencies,
} from "../engines/planGenerator.js";
import {
  computeEvidenceQuality,
  scorePersonalization,
} from "../engines/personalizationScoringModel.js";
import { generateRecommendations } from "../engines/recommendationEngine.js";
import { evaluateRisk } from "../engines/riskEvaluator.js";
import {
  assertReadOnlyOperation,
  validateExperiencePlan,
  wrapRecommendationOutput,
} from "../governance/readOnlyPolicy.js";
import type { AdaptiveExperienceAdapter } from "../types/adapter.js";
import type { AEEInputBundle } from "../types/inputs.js";
import type { AEEOutputTarget } from "../types/integration.js";
import type { AdaptiveExperiencePlan } from "../types/recommendations.js";

export class AdaptiveExperienceEngine {
  private readonly adapter: AdaptiveExperienceAdapter;

  constructor(adapter: AdaptiveExperienceAdapter) {
    this.adapter = adapter;
  }

  getProductId(): string {
    return this.adapter.productId;
  }

  /** Merge adapter-normalized telemetry into input bundle. */
  enrichInputs(inputs: AEEInputBundle, rawTelemetry: unknown[] = []): AEEInputBundle {
    const normalized = rawTelemetry
      .map((raw) => this.adapter.normalizeTelemetry(raw))
      .flat();

    return {
      ...inputs,
      productId: this.adapter.productId,
      telemetry: [...(inputs.telemetry ?? []), ...normalized],
    };
  }

  /** Generate a read-only Adaptive Experience Plan. Does NOT modify products. */
  generatePlan(inputs: AEEInputBundle): AdaptiveExperiencePlan {
    assertReadOnlyOperation("generate_plan");

    const enriched = {
      ...inputs,
      productId: this.adapter.productId,
    };

    const context = analyzeExperienceContext(enriched);
    const recommendations = generateRecommendations(context, enriched, this.adapter);
    const personalization = scorePersonalization(context, enriched, recommendations);
    const expectedBusinessImpact = estimateBusinessImpact(
      recommendations,
      enriched,
      context,
    );
    const expectedCustomerImpact = estimateCustomerImpact(recommendations, context);
    const riskAssessment = evaluateRisk(context, recommendations, enriched);
    const evidenceQuality = computeEvidenceQuality(recommendations, enriched);
    const dependencies = resolveDependencies(enriched);

    const plan = buildAdaptiveExperiencePlan({
      productId: this.adapter.productId,
      recommendations,
      personalization,
      expectedBusinessImpact,
      expectedCustomerImpact,
      riskAssessment,
      evidenceQuality,
      dependencies,
    });

    return validateExperiencePlan(plan);
  }

  emitOutput(target: AEEOutputTarget, payload: unknown) {
    return wrapRecommendationOutput(target, payload);
  }
}
