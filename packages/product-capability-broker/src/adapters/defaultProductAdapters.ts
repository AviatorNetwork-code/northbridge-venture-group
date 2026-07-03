import type { ProductCapabilityAdapter } from "../types/adapter.js";
import type { ProductCapabilityRequest } from "../types/request.js";
import type { ProductCapabilityResponse } from "../types/response.js";

function createResponseId(request: ProductCapabilityRequest): string {
  return `resp-${request.targetProductId}-${request.requestId}`;
}

function baseOwnership(productId: string, displayName: string, team: string) {
  return {
    productId,
    displayName,
    owningTeam: team,
    capabilitySource: `${productId}-capability-adapter`,
    roadmapDisclosurePolicy: "public_planned_only" as const,
    maxPublicDisclosure: "sales_safe" as const,
  };
}

function matchesAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

export const aviatorNetworkCapabilityAdapter: ProductCapabilityAdapter = {
  productId: "aviator-network",
  displayName: "Aviator Network",
  ownership: baseOwnership("aviator-network", "Aviator Network", "Aviator Network Product"),

  respond(request: ProductCapabilityRequest): ProductCapabilityResponse {
    const q = `${request.question} ${request.visitorIntent}`.toLowerCase();
    const isFlightSchool =
      /flight school|training organization|cfi|instructor|student acquisition|enrollment/.test(q) ||
      request.visitorContext.industry === "aviation";

    const unsupportedClaims = [
      {
        claim: "guaranteed student acquisition",
        reason: "Marketplace visibility does not guarantee enrollment outcomes",
      },
      {
        claim: "FAA endorsement",
        reason: "Aviator Network is not an FAA-certified or endorsed training provider",
      },
      {
        claim: "replacing school operations software without setup",
        reason: "Operational adoption requires onboarding and workflow configuration",
      },
    ];

    return {
      responseId: createResponseId(request),
      targetProductId: "aviator-network",
      answeredBy: "aviator-network-capability-adapter",
      currentCapabilities: [
        {
          id: "marketplace-positioning",
          label: "Aviation marketplace positioning",
          description: "Connects pilots, instructors, and training participants in a structured marketplace.",
          disclosureLevel: "public",
        },
        {
          id: "instructor-student-discovery",
          label: "Instructor and student discovery",
          description: "Profiles and search workflows for finding instructors and training opportunities.",
          disclosureLevel: "public",
        },
        {
          id: "profiles",
          label: "Pilot and instructor profiles",
          description: "Structured profiles for aviation training participants.",
          disclosureLevel: "public",
        },
        {
          id: "training-requests",
          label: "Training requests",
          description: "Workflows for initiating and managing training requests.",
          disclosureLevel: "sales_safe",
        },
        {
          id: "logbook-foundation",
          label: "Logbook foundation",
          description: "Digital logbook capabilities supporting training record workflows.",
          disclosureLevel: "sales_safe",
        },
        {
          id: "cat-foundation",
          label: "CAT foundation",
          description: "Product assistant foundation for aviation-specific guidance within Aviator Network.",
          disclosureLevel: "partner_safe",
        },
      ],
      plannedCapabilities: [
        {
          id: "school-workspace",
          label: "Deeper school workspace",
          description: "Expanded operational workspace for flight schools.",
          disclosureLevel: "sales_safe",
        },
        {
          id: "analytics",
          label: "Training analytics",
          description: "Analytics for training organizations.",
          disclosureLevel: "sales_safe",
        },
        {
          id: "advanced-cat-workflows",
          label: "Advanced CAT workflows",
          description: "Extended assistant workflows for aviation operators.",
          disclosureLevel: "partner_safe",
        },
      ],
      unsupportedClaims,
      recommendedPositioning: isFlightSchool
        ? "Position Aviator Network as a visibility and connection platform for aviation training — not a guaranteed enrollment engine."
        : "Position Aviator Network as an aviation marketplace connecting pilots, instructors, and training workflows.",
      recommendedCTA: "Explore Aviator Network and request a fit consultation for your school or operation.",
      confidence: isFlightSchool ? "high" : "medium",
      evidence: [
        {
          source: "aviator-network-product-catalog",
          detail: "Marketplace, profiles, messaging, and logbook capabilities are in production.",
        },
        {
          source: "aviator-network-roadmap",
          detail: "School workspace and analytics are planned — not generally available.",
        },
      ],
      escalationRequired: false,
      publicSafeSummary:
        "Aviator Network can help improve visibility and connection workflows for aviation training, but it should not be presented as a guaranteed student acquisition system.",
      privateNotes: "Flight school fit is strong for discovery/connection use cases; qualify operational scope before deeper platform claims.",
      lastUpdated: Date.now(),
    };
  },
};

export const quadrixCapabilityAdapter: ProductCapabilityAdapter = {
  productId: "quadrix",
  displayName: "Quadrix",
  ownership: baseOwnership("quadrix", "Quadrix", "Quadrix Product"),

  respond(request: ProductCapabilityRequest): ProductCapabilityResponse {
    const q = `${request.question} ${request.visitorIntent}`.toLowerCase();

    return {
      responseId: createResponseId(request),
      targetProductId: "quadrix",
      answeredBy: "quadrix-capability-adapter",
      currentCapabilities: [
        {
          id: "gameplay",
          label: "Core gameplay",
          description: "Interactive gameplay experience with progression mechanics.",
          disclosureLevel: "public",
        },
        {
          id: "education-mode",
          label: "Education-oriented play",
          description: "Modes suitable for educational and training contexts.",
          disclosureLevel: "sales_safe",
        },
        {
          id: "multiplayer-foundation",
          label: "Multiplayer foundation",
          description: "Shared session and multiplayer infrastructure.",
          disclosureLevel: "sales_safe",
        },
      ],
      plannedCapabilities: [
        {
          id: "retention-systems",
          label: "Advanced retention systems",
          description: "Planned retention and re-engagement features.",
          disclosureLevel: "sales_safe",
        },
        {
          id: "monetization-expansion",
          label: "Monetization expansion",
          description: "Additional monetization models under evaluation.",
          disclosureLevel: "partner_safe",
        },
      ],
      unsupportedClaims: [
        {
          claim: "guaranteed learning outcomes",
          reason: "Gameplay engagement does not guarantee educational results without curriculum design",
        },
        {
          claim: "enterprise LMS replacement",
          reason: "Quadrix is not a full learning management system",
        },
      ],
      recommendedPositioning: matchesAny(q, [/education|school|training/])
        ? "Position Quadrix for engagement and practice — pair with curriculum design for education outcomes."
        : "Position Quadrix as an engaging gameplay product with optional education-oriented modes.",
      recommendedCTA: "Review Quadrix gameplay and discuss education or retention goals with the product team.",
      confidence: "medium",
      evidence: [
        { source: "quadrix-product-catalog", detail: "Core gameplay and education modes documented." },
      ],
      escalationRequired: false,
      publicSafeSummary:
        "Quadrix offers engaging gameplay with education-oriented modes, but should not be sold as a guaranteed learning outcome platform or LMS replacement.",
      lastUpdated: Date.now(),
    };
  },
};

export const northbridgeDigitalServicesAdapter: ProductCapabilityAdapter = {
  productId: "northbridge-services",
  displayName: "Northbridge Digital Services",
  ownership: baseOwnership(
    "northbridge-services",
    "Northbridge Digital Services",
    "Northbridge Digital",
  ),

  respond(request: ProductCapabilityRequest): ProductCapabilityResponse {
    return {
      responseId: createResponseId(request),
      targetProductId: "northbridge-services",
      answeredBy: "northbridge-services-capability-adapter",
      currentCapabilities: [
        {
          id: "website-development",
          label: "Website development",
          description: "Structured website engagements with defined scope and timelines.",
          disclosureLevel: "public",
        },
        {
          id: "lead-systems",
          label: "Lead capture systems",
          description: "Lead capture, CRM integration, and conversion workflows.",
          disclosureLevel: "sales_safe",
        },
        {
          id: "platform-development",
          label: "Custom platform development",
          description: "Scoped platform builds for business operations.",
          disclosureLevel: "sales_safe",
        },
        {
          id: "automation",
          label: "Workflow automation",
          description: "Practical automation for operational workflows.",
          disclosureLevel: "sales_safe",
        },
      ],
      plannedCapabilities: [],
      unsupportedClaims: [
        {
          claim: "instant delivery of any platform",
          reason: "Engagements require scoping, timeline agreement, and structured delivery",
        },
        {
          claim: "unlimited revisions without scope",
          reason: "Revisions are bounded by engagement tier and statement of work",
        },
      ],
      recommendedPositioning:
        "Position Northbridge Digital Services for scoped digital infrastructure — websites, platforms, automation — with clear timelines.",
      recommendedCTA: "Review services tiers and request a scoping consultation.",
      confidence: "high",
      evidence: [
        {
          source: "northbridge-services-engagement-catalog",
          detail: "Public services tiers and engagement model documented.",
        },
      ],
      escalationRequired: false,
      publicSafeSummary:
        "Northbridge Digital Services delivers scoped website, platform, and automation work with defined timelines — not open-ended or instant platform delivery.",
      lastUpdated: Date.now(),
    };
  },
};

export const airTaxCapabilityAdapter: ProductCapabilityAdapter = {
  productId: "airtax-financial",
  displayName: "AirTax Financial",
  ownership: {
    ...baseOwnership("airtax-financial", "AirTax Financial", "AirTax Product"),
    roadmapDisclosurePolicy: "sales_safe_planned",
  },

  respond(request: ProductCapabilityRequest): ProductCapabilityResponse {
    return {
      responseId: createResponseId(request),
      targetProductId: "airtax-financial",
      answeredBy: "airtax-capability-adapter",
      currentCapabilities: [
        {
          id: "aviation-tax-positioning",
          label: "Aviation tax services positioning",
          description: "Financial and tax services oriented toward aviation professionals.",
          disclosureLevel: "public",
        },
      ],
      plannedCapabilities: [
        {
          id: "expanded-advisory",
          label: "Expanded advisory workflows",
          description: "Broader advisory tooling for aviation financial clients.",
          disclosureLevel: "sales_safe",
        },
      ],
      unsupportedClaims: [
        {
          claim: "guaranteed tax savings",
          reason: "Tax outcomes depend on individual circumstances and qualified review",
        },
        {
          claim: "IRS representation without engagement",
          reason: "Representation requires formal client engagement",
        },
      ],
      recommendedPositioning:
        "Position AirTax for aviation-oriented tax and financial guidance — escalate to licensed advisors for specifics.",
      recommendedCTA: "Contact AirTax for an advisory consultation.",
      confidence: "low",
      evidence: [
        {
          source: "airtax-placeholder-catalog",
          detail: "Placeholder adapter — limited capability detail until product CAT is fully connected.",
        },
      ],
      escalationRequired: true,
      publicSafeSummary:
        "AirTax Financial may fit aviation tax and financial needs, but specific advice requires a qualified advisory conversation.",
      privateNotes: "Placeholder adapter — replace with authoritative AirTax product CAT when available.",
      lastUpdated: Date.now(),
    };
  },
};

export function createGenericProductAdapter(
  productId: string,
  displayName: string,
): ProductCapabilityAdapter {
  return {
    productId,
    displayName,
    ownership: baseOwnership(productId, displayName, "Future Product Team"),

    respond(request: ProductCapabilityRequest): ProductCapabilityResponse {
      return {
        responseId: createResponseId(request),
        targetProductId: productId,
        answeredBy: `${productId}-generic-capability-adapter`,
        currentCapabilities: [],
        plannedCapabilities: [],
        unsupportedClaims: [
          {
            claim: "specific capability claims without product source",
            reason: "Generic adapter cannot authoritatively describe product capabilities",
          },
        ],
        recommendedPositioning: `Defer detailed claims about ${displayName} until a product-owned capability adapter is connected.`,
        recommendedCTA: "Contact Northbridge for a human-led product fit conversation.",
        confidence: "low",
        evidence: [
          {
            source: "generic-adapter",
            detail: "No product-specific capability source registered.",
          },
        ],
        escalationRequired: true,
        publicSafeSummary: `I do not have authoritative capability detail for ${displayName} yet. A consultation is the appropriate next step.`,
        lastUpdated: Date.now(),
      };
    },
  };
}

export const DEFAULT_PRODUCT_ADAPTERS: ProductCapabilityAdapter[] = [
  aviatorNetworkCapabilityAdapter,
  quadrixCapabilityAdapter,
  northbridgeDigitalServicesAdapter,
  airTaxCapabilityAdapter,
];
