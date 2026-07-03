/**
 * Reference adapters and sample inputs — NOT imported by AEE core.
 */
import type { AdaptiveExperienceAdapter } from "../../src/types/adapter.js";
import type { AEEInputBundle } from "../../src/types/inputs.js";
import type { ExperienceRecommendation } from "../../src/types/recommendations.js";

function baseAdapter(
  productId: string,
  displayName: string,
): AdaptiveExperienceAdapter {
  return {
    productId,
    displayName,
    getExperienceContext() {
      return {
        productId,
        domains: [
          { id: "core", label: "Core Experience", areas: ["navigation", "content_ordering"] },
        ],
      };
    },
    normalizeTelemetry(raw) {
      if (!raw || typeof raw !== "object") return [];
      const event = raw as Record<string, unknown>;
      return [
        {
          type: String(event.type ?? "telemetry"),
          timestamp: Number(event.timestamp ?? Date.now()),
          path: event.path ? String(event.path) : undefined,
          feature: event.feature ? String(event.feature) : undefined,
        },
      ];
    },
  };
}

export const northbridgeWebsiteAdapter: AdaptiveExperienceAdapter = {
  ...baseAdapter("northbridge-website", "Northbridge Website"),
  getRecommendationTemplates(context, _inputs) {
    if (!context.visitorIntent.includes("ai") && !context.visitorIntent.includes("evaluate_ai")) {
      return [];
    }
    return [
      {
        area: "content_ordering",
        title: "AI overview before services",
        recommendation: "Show AI product overview before consulting services.",
        reason: "Highest predicted engagement based on visitor intent and previous journeys.",
        experienceScore: 0.88,
        businessImpactScore: 0.75,
        customerValueScore: 0.9,
        confidence: 0.85,
      },
    ];
  },
};

export const aviatorNetworkAdapter: AdaptiveExperienceAdapter = {
  ...baseAdapter("aviator-network", "Aviator Network"),
  getRecommendationTemplates(context) {
    if (
      !context.visitorIntent.includes("flight") &&
      !context.visitorIntent.includes("commercial")
    ) {
      return [];
    }
    return [
      {
        area: "feature_discovery",
        title: "Logbook Scanner before Marketplace",
        recommendation: "Promote Logbook Scanner before Marketplace.",
        reason: "Improves activation probability for student pilots.",
        experienceScore: 0.9,
        businessImpactScore: 0.86,
        customerValueScore: 0.88,
        confidence: 0.87,
      },
    ];
  },
};

export const quadrixAdapter: AdaptiveExperienceAdapter = {
  ...baseAdapter("quadrix", "Quadrix"),
  getRecommendationTemplates(context, inputs) {
    const days = inputs.journeyIntelligence?.daysSinceLastVisit ?? 0;
    if (!context.repeatVisit || days < 7) return [];
    return [
      {
        area: "onboarding",
        title: "Resume progression",
        recommendation: "Resume progression immediately instead of tutorial.",
        reason: "Higher retention probability for returning players.",
        experienceScore: 0.92,
        businessImpactScore: 0.82,
        customerValueScore: 0.94,
        confidence: 0.89,
      },
    ];
  },
};

/** Sample input: Northbridge Website — AI learning intent */
export const northbridgeWebsiteSampleInput: AEEInputBundle = {
  productId: "northbridge-website",
  visitorIntent: {
    primaryIntent: "evaluate_ai_capabilities",
    confidence: 0.84,
  },
  customerExperience: {
    experienceScore: 0.62,
    painPoints: ["Unclear AI offering sequence"],
  },
  businessImpact: {
    estimatedValueScore: 55,
    conversionProbability: 0.35,
  },
  executivePriorities: [
    { priorityId: "ai-growth", label: "AI services growth", weight: 0.9 },
  ],
  journeyIntelligence: {
    entryPoint: "/services",
    repeatVisit: false,
    abandonedPages: ["/services"],
  },
  conversationAnalytics: {
    catGuidanceScore: 0.68,
    conversationLength: 3,
  },
  sessionAnalytics: {
    sessionId: "web-sample-1",
    pageViews: 4,
    featureAdoption: ["cat"],
  },
};

/** Sample input: Aviator Network — Commercial pilot student */
export const aviatorNetworkSampleInput: AEEInputBundle = {
  productId: "aviator-network",
  visitorIntent: {
    primaryIntent: "flight_training",
    secondaryIntent: "commercial",
    confidence: 0.81,
  },
  customerExperience: {
    experienceScore: 0.7,
    frictionEvents: ["marketplace_bounce"],
  },
  businessImpact: {
    estimatedValueScore: 65,
    conversionProbability: 0.42,
  },
  journeyIntelligence: {
    entryPoint: "/dashboard",
    completedObjectives: [],
  },
  sessionAnalytics: {
    sessionId: "aviator-sample-1",
    pageViews: 6,
    featureAdoption: ["marketplace"],
  },
};

/** Sample input: Quadrix — returning player after 7 days */
export const quadrixSampleInput: AEEInputBundle = {
  productId: "quadrix",
  visitorIntent: {
    primaryIntent: "returning_progression",
    confidence: 0.79,
  },
  customerExperience: {
    experienceScore: 0.74,
  },
  businessImpact: {
    estimatedValueScore: 58,
    retentionIndicator: "positive",
  },
  journeyIntelligence: {
    repeatVisit: true,
    daysSinceLastVisit: 7,
    completedObjectives: ["prior_session_started"],
  },
  sessionAnalytics: {
    sessionId: "quadrix-sample-1",
    pageViews: 2,
    featureAdoption: ["tutorial_prompt"],
  },
};

export function getSampleRecommendationPreview(
  productId: string,
): Partial<ExperienceRecommendation> | null {
  const samples: Record<string, Partial<ExperienceRecommendation>> = {
    "northbridge-website": {
      title: "AI overview before services",
      recommendation: "Show AI product overview before consulting services.",
      reason: "Highest predicted engagement based on visitor intent and previous journeys.",
    },
    "aviator-network": {
      title: "Logbook Scanner before Marketplace",
      recommendation: "Promote Logbook Scanner before Marketplace.",
      reason: "Improves activation probability.",
    },
    quadrix: {
      title: "Resume progression",
      recommendation: "Resume progression immediately instead of tutorial.",
      reason: "Higher retention probability.",
    },
  };
  return samples[productId] ?? null;
}
