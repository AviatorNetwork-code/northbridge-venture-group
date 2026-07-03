import type { ContentFormatRecommendation } from "../types/opportunity.js";
import type { SearchOpportunity } from "../types/opportunity.js";
import type { ProductMappingResult } from "../types/product.js";
import type { ContentDraft } from "../types/draft.js";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

function titleCase(keyword: string): string {
  return keyword.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function generateContentDraft(
  opportunity: SearchOpportunity,
  product: ProductMappingResult,
  format: ContentFormatRecommendation,
): ContentDraft {
  const title = titleCase(opportunity.keyword);
  const slug = slugify(opportunity.keyword);

  const seoTitle =
    format === "comparison_page"
      ? `${title}: Comparison and Buyer's Guide (2026)`
      : `${title} | Northbridge Guide`;

  const metaDescription = product.honestNoFit
    ? `Evidence-based guide to ${opportunity.keyword}. Practical answers without product hype — from Northbridge.`
    : `Learn about ${opportunity.keyword} and how ${product.recommendedProductName} may fit your situation. Practical, customer-focused guidance from Northbridge.`;

  const outline = buildOutline(opportunity.keyword, format, product);
  const internalLinks = buildInternalLinks(product, format);
  const ctas = buildCtas(product, format);
  const productRefs = product.honestNoFit ? [] : [product.recommendedProductName];
  const faqSchema = buildFaqSchema(opportunity.keyword, product);
  const jsonLd = buildJsonLd(seoTitle, metaDescription, faqSchema);

  return {
    seoTitle: seoTitle.slice(0, 60),
    metaDescription: metaDescription.slice(0, 160),
    urlSlug: slug,
    outline,
    internalLinkingSuggestions: internalLinks,
    ctaRecommendations: ctas,
    productReferences: productRefs,
    faqSchema,
    jsonLdSuggestions: jsonLd,
  };
}

function buildOutline(
  keyword: string,
  format: ContentFormatRecommendation,
  product: ProductMappingResult,
): ContentDraft["outline"] {
  const sections: ContentDraft["outline"] = [
    { level: "h1", heading: titleCase(keyword), purpose: "Primary topic and search match" },
    {
      level: "h2",
      heading: "Who this is for",
      purpose: "Qualify reader and set expectations",
    },
    {
      level: "h2",
      heading: "Key questions answered",
      purpose: "Address unanswered search intent",
    },
  ];

  if (format === "industry_guide" || format === "knowledge_article") {
    sections.push(
      { level: "h2", heading: "Step-by-step overview", purpose: "Informational depth" },
      { level: "h3", heading: "Common mistakes to avoid", purpose: "Differentiation" },
    );
  }

  if (format === "comparison_page") {
    sections.push(
      { level: "h2", heading: "Evaluation criteria", purpose: "Commercial investigation support" },
      { level: "h2", heading: "Options compared", purpose: "Fair comparison without oversell" },
    );
  }

  if (!product.honestNoFit) {
    sections.push({
      level: "h2",
      heading: `Where ${product.recommendedProductName} fits`,
      purpose: "Honest product mapping — not forced pitch",
    });
  } else {
    sections.push({
      level: "h2",
      heading: "When to seek professional guidance",
      purpose: "Honest no-fit path",
    });
  }

  sections.push(
    { level: "h2", heading: "Next steps", purpose: "Conversion path without pressure" },
    { level: "h2", heading: "Frequently asked questions", purpose: "FAQ schema support" },
  );

  return sections;
}

function buildInternalLinks(
  product: ProductMappingResult,
  format: ContentFormatRecommendation,
): string[] {
  const links = ["/about", "/contact"];
  if (!product.honestNoFit) {
    if (product.recommendedProductId === "aviator-network") links.push("/ventures", "https://aviatornetwork.com");
    if (product.recommendedProductId === "northbridge-services") links.push("/services");
    if (product.recommendedProductId === "ai-automation") links.push("/services", "/digital");
  }
  if (format === "comparison_page") links.push("/services");
  return links;
}

function buildCtas(product: ProductMappingResult, format: ContentFormatRecommendation): string[] {
  const ctas = ["Contact Northbridge for a fit consultation"];
  if (!product.honestNoFit && format === "landing_page") {
    ctas.unshift(`Explore ${product.recommendedProductName}`);
  }
  if (format === "knowledge_article" || format === "industry_guide") {
    ctas.push("Subscribe to updates — no hard sell");
  }
  return ctas;
}

function buildFaqSchema(keyword: string, product: ProductMappingResult): ContentDraft["faqSchema"] {
  const faqs = [
    {
      question: `What should I know about ${keyword}?`,
      answer: `This guide addresses ${keyword} from a practical customer perspective with evidence-based recommendations.`,
    },
  ];
  if (!product.honestNoFit) {
    faqs.push({
      question: `Does ${product.recommendedProductName} fit ${keyword}?`,
      answer: `${product.mappingReason} A consultation can confirm fit for your specific situation.`,
    });
  }
  return faqs;
}

function buildJsonLd(title: string, description: string, faq: ContentDraft["faqSchema"]): string[] {
  return [
    JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description,
    }),
    JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    }),
  ];
}
