export interface ContentOutlineSection {
  level: "h1" | "h2" | "h3";
  heading: string;
  purpose: string;
}

export interface FAQSchemaItem {
  question: string;
  answer: string;
}

export interface ContentDraft {
  seoTitle: string;
  metaDescription: string;
  urlSlug: string;
  outline: ContentOutlineSection[];
  internalLinkingSuggestions: string[];
  ctaRecommendations: string[];
  productReferences: string[];
  faqSchema: FAQSchemaItem[];
  jsonLdSuggestions: string[];
}
