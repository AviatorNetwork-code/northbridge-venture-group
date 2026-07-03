import { VPRE_GOVERNANCE } from "../governance/readOnlyPolicy.js";

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
  governance: typeof VPRE_GOVERNANCE;
}

export const VPRE_CAPABILITY: NEOCapabilityDescriptor = {
  id: "neos.visual-product-review-engine",
  name: "Visual Product Review Engine",
  version: "1.0.0",
  description:
    "Evaluates products from the customer's perspective by analyzing rendered interfaces and screenshots — executive UX reports prioritized by business impact.",
  package: "@neos/visual-product-review-engine",
  mode: "read-only",
  inputs: [
    "browser_screenshots",
    "local_screenshots",
    "mobile_screenshots",
    "rendered_ui_signals",
    "screen_recordings",
    "browser_automation",
  ],
  outputs: [
    "executive_ux_report",
    "screen_scores",
    "prioritized_ux_issues",
    "conversion_friction_analysis",
    "founder_dashboard",
  ],
  governance: VPRE_GOVERNANCE,
};

export function registerVPRECapability(registry: NEOCapabilityRegistry): void {
  registry.register(VPRE_CAPABILITY);
}

export function getVPRECapabilityRegistration(): NEOCapabilityDescriptor {
  return VPRE_CAPABILITY;
}
