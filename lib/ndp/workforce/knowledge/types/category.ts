export type KnowledgeCategory =
  | "universal"
  | "business"
  | "marketing"
  | "sales"
  | "customer_service"
  | "finance"
  | "scheduling"
  | "aviation"
  | "dental"
  | "legal"
  | "hvac"
  | "organization"
  | "compliance";

export type KnowledgeLayerType =
  | "universal"
  | "business"
  | "domain"
  | "industry"
  | "organization"
  | "compliance";

export const KNOWLEDGE_LAYER_ORDER: Record<KnowledgeLayerType, number> = {
  universal: 0,
  business: 10,
  domain: 20,
  industry: 30,
  organization: 40,
  compliance: 50,
};

export const KNOWLEDGE_CATEGORY_SET = new Set<string>([
  "universal",
  "business",
  "marketing",
  "sales",
  "customer_service",
  "finance",
  "scheduling",
  "aviation",
  "dental",
  "legal",
  "hvac",
  "organization",
  "compliance",
]);

export function isKnownKnowledgeCategory(
  category: string,
): category is KnowledgeCategory {
  return KNOWLEDGE_CATEGORY_SET.has(category);
}

export function defaultLayerForCategory(
  category: KnowledgeCategory,
): KnowledgeLayerType {
  switch (category) {
    case "universal":
      return "universal";
    case "business":
      return "business";
    case "organization":
      return "organization";
    case "compliance":
      return "compliance";
    case "aviation":
    case "dental":
    case "legal":
    case "hvac":
      return "industry";
    default:
      return "domain";
  }
}
