import type { NorthbridgeProductId, ProductMappingResult } from "../types/product.js";
import type { SearchIntentClassification } from "../types/intent.js";

export interface ProductCapabilityVerifier {
  verifyProductFit(
    keyword: string,
    productId: NorthbridgeProductId,
  ): Promise<{ fitScore: number; reason: string; verified: boolean }> | {
    fitScore: number;
    reason: string;
    verified: boolean;
  };
}

interface ProductRule {
  productId: NorthbridgeProductId;
  name: string;
  patterns: RegExp[];
  baseFit: number;
}

const PRODUCT_RULES: ProductRule[] = [
  {
    productId: "aviator-network",
    name: "Aviator Network",
    patterns: [
      /flight school|pilot|cfi|instructor|logbook|aviation training|marketplace|student pilot|fbo/i,
    ],
    baseFit: 0.75,
  },
  {
    productId: "northbridge-services",
    name: "Northbridge Digital Services",
    patterns: [
      /website|web design|digital|platform development|custom software|business website|lead capture/i,
    ],
    baseFit: 0.7,
  },
  {
    productId: "ai-automation",
    name: "AI & Automation Solutions",
    patterns: [/ai |automation|workflow|chatbot|machine learning|intelligent/i],
    baseFit: 0.72,
  },
  {
    productId: "airtax-financial",
    name: "AirTax Financial",
    patterns: [/tax|financial|accounting|faa medical|aviation tax|1099|deduction/i],
    baseFit: 0.65,
  },
  {
    productId: "quadrix",
    name: "Quadrix",
    patterns: [/quadrix|game|gameplay|multiplayer|retention|education game/i],
    baseFit: 0.68,
  },
];

export function mapKeywordToProduct(
  keyword: string,
  intent: SearchIntentClassification,
): ProductMappingResult {
  const normalized = keyword.toLowerCase();
  let best: ProductRule | null = null;
  let bestScore = 0;

  for (const rule of PRODUCT_RULES) {
    if (rule.patterns.some((p) => p.test(normalized))) {
      const intentBoost =
        intent.buyerIntentLevel === "high" ? 0.15 : intent.buyerIntentLevel === "medium" ? 0.08 : 0;
      const score = Math.min(1, rule.baseFit + intentBoost);
      if (score > bestScore) {
        bestScore = score;
        best = rule;
      }
    }
  }

  if (!best || bestScore < 0.45) {
    return {
      keyword,
      recommendedProductId: "none",
      recommendedProductName: "No product fit",
      fitScore: bestScore,
      honestNoFit: true,
      mappingReason:
        "No Northbridge product strongly matches this keyword — avoid forced product placement.",
      capabilityVerified: false,
      alternativeProducts: [],
    };
  }

  const alternatives = PRODUCT_RULES.filter(
    (r) => r.productId !== best!.productId && r.patterns.some((p) => p.test(normalized)),
  ).map((r) => r.productId);

  return {
    keyword,
    recommendedProductId: best.productId,
    recommendedProductName: best.name,
    fitScore: bestScore,
    honestNoFit: false,
    mappingReason: `${best.name} aligns with search intent and keyword signals for this topic.`,
    capabilityVerified: false,
    alternativeProducts: alternatives,
  };
}

export async function mapKeywordWithCapabilityVerification(
  keyword: string,
  intent: SearchIntentClassification,
  verifier?: ProductCapabilityVerifier,
): Promise<ProductMappingResult> {
  const base = mapKeywordToProduct(keyword, intent);
  if (base.honestNoFit || !verifier) return base;

  const verification = await verifier.verifyProductFit(keyword, base.recommendedProductId);
  if (verification.fitScore < 0.4) {
    return {
      ...base,
      recommendedProductId: "none",
      recommendedProductName: "No product fit",
      honestNoFit: true,
      fitScore: verification.fitScore,
      mappingReason: `Product Capability Broker: ${verification.reason}`,
      capabilityVerified: verification.verified,
    };
  }

  return {
    ...base,
    fitScore: Math.min(1, (base.fitScore + verification.fitScore) / 2),
    mappingReason: `${base.mappingReason} Capability verified: ${verification.reason}`,
    capabilityVerified: verification.verified,
  };
}
