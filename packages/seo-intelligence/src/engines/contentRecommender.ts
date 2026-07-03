import type { SearchIntentClassification } from "../types/intent.js";
import type { ContentFormatRecommendation } from "../types/opportunity.js";
import type { ProductMappingResult } from "../types/product.js";

export function recommendContentFormat(
  keyword: string,
  intent: SearchIntentClassification,
  product: ProductMappingResult,
): ContentFormatRecommendation {
  const normalized = keyword.toLowerCase();

  if (intent.primaryIntent === "comparison" || / vs |versus|compare|best /.test(normalized)) {
    return "comparison_page";
  }
  if (/case study|success story|customer story/.test(normalized)) {
    return "case_study";
  }
  if (/tool|calculator|generator|checker/.test(normalized)) {
    return "tool_page";
  }
  if (/faq|questions|answers/.test(normalized)) {
    return "faq";
  }
  if (/how to start|industry guide|complete guide|checklist/.test(normalized)) {
    return "industry_guide";
  }
  if (intent.primaryIntent === "transactional" || intent.buyerIntentLevel === "high") {
    return "landing_page";
  }
  if (intent.primaryIntent === "informational" && !product.honestNoFit) {
    return "knowledge_article";
  }
  if (/resources|library|hub/.test(normalized)) {
    return "resource_library";
  }
  return "knowledge_article";
}
