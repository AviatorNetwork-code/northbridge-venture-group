import type { ProductReviewExpectations, VisualReviewAdapter } from "../types/adapter.js";
import type { ReviewDimension } from "../types/dimensions.js";

function baseExpectations(
  productId: string,
  displayName: string,
  conversionGoal: string,
  overrides: Partial<ProductReviewExpectations> = {},
): ProductReviewExpectations {
  return {
    productId,
    displayName,
    primaryConversionGoal: conversionGoal,
    criticalScreens: ["home", "landing"],
    expectedTrustElements: ["about", "contact"],
    expectedNavigationItems: ["products", "services", "about", "contact"],
    catExpected: false,
    mobileFirst: false,
    dimensionWeights: {},
    ...overrides,
  };
}

export const northbridgeWebsiteReviewAdapter: VisualReviewAdapter = {
  productId: "northbridge-website",
  displayName: "Northbridge Website",
  getReviewExpectations: () =>
    baseExpectations(
      "northbridge-website",
      "Northbridge Website",
      "consultation or product exploration",
      {
        catExpected: true,
        criticalScreens: ["home", "services", "contact"],
        expectedNavigationItems: ["ventures", "services", "about", "contact"],
      },
    ),
  getExecutiveContext: () =>
    "Northbridge Website serves as the primary discovery and consultative entry point for ventures and services.",
};

export const aviatorNetworkReviewAdapter: VisualReviewAdapter = {
  productId: "aviator-network",
  displayName: "Aviator Network",
  getReviewExpectations: () =>
    baseExpectations(
      "aviator-network",
      "Aviator Network",
      "pilot/instructor signup or marketplace exploration",
      {
        mobileFirst: true,
        criticalScreens: ["home", "marketplace", "profile", "signup"],
        expectedNavigationItems: ["marketplace", "logbook", "profile", "messages"],
      },
    ),
  getExecutiveContext: () =>
    "Aviator Network is a marketplace product — discovery, profile clarity, and training workflow visibility drive conversion.",
};

export const quadrixReviewAdapter: VisualReviewAdapter = {
  productId: "quadrix",
  displayName: "Quadrix",
  getReviewExpectations: () =>
    baseExpectations(
      "quadrix",
      "Quadrix",
      "gameplay start or return session",
      {
        mobileFirst: true,
        criticalScreens: ["home", "gameplay", "onboarding"],
        expectedNavigationItems: ["play", "progress", "settings"],
      },
    ),
  getExecutiveContext: () =>
    "Quadrix is engagement-driven — first session clarity and return-path visibility affect retention.",
};

export const DEFAULT_REVIEW_ADAPTERS: VisualReviewAdapter[] = [
  northbridgeWebsiteReviewAdapter,
  aviatorNetworkReviewAdapter,
  quadrixReviewAdapter,
];

export function createGenericReviewAdapter(
  productId: string,
  displayName: string,
): VisualReviewAdapter {
  return {
    productId,
    displayName,
    getReviewExpectations: () =>
      baseExpectations(productId, displayName, "product exploration"),
  };
}
