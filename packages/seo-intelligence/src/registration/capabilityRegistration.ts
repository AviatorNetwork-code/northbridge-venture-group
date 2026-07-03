import { SIE_GOVERNANCE } from "../governance/readOnlyPolicy.js";

export interface NEOCapabilityRegistry {
  register(capability: NEOCapabilityDescriptor): void;
}

export interface NEOCapabilityDescriptor {
  id: string;
  name: string;
  version: string;
  description: string;
  package: string;
  mode: "read-only" | "read-write";
  inputs: string[];
  outputs: string[];
  governance: typeof SIE_GOVERNANCE;
}

export const SIE_CAPABILITY: NEOCapabilityDescriptor = {
  id: "neos.seo-intelligence",
  name: "SEO Intelligence Engine",
  version: "1.0.0",
  description:
    "Evidence-based SEO opportunity detection and content recommendations — strategist-first, not article-writer-first.",
  package: "@neos/seo-intelligence",
  mode: "read-only",
  inputs: [
    "business_impact_engine",
    "product_capability_broker",
    "executive_intelligence",
    "customer_experience_intelligence",
    "search_keywords",
    "existing_content_catalog",
  ],
  outputs: [
    "seo_executive_report",
    "content_recommendations",
    "content_drafts",
    "northbridge_website",
    "aviator_network",
    "founder_dashboard",
  ],
  governance: SIE_GOVERNANCE,
};

export function registerSIECapability(registry: NEOCapabilityRegistry): void {
  registry.register(SIE_CAPABILITY);
}

export function getSIECapabilityRegistration(): NEOCapabilityDescriptor {
  return SIE_CAPABILITY;
}
