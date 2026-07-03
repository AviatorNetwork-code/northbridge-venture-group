import { FRB_GOVERNANCE } from "../governance/readOnlyPolicy.js";

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
  governance: typeof FRB_GOVERNANCE;
}

export const FRB_CAPABILITY: NEOCapabilityDescriptor = {
  id: "neos.founder-reporting-bridge",
  name: "Founder Reporting Bridge",
  version: "1.0.0",
  description:
    "Read-only bridge connecting NEO intelligence to Founder Slack briefings — reports only, no execution.",
  package: "@neos/founder-reporting-bridge",
  mode: "read-only",
  inputs: [
    "aviator_network_neo_reports",
    "quadrix_neo_reports",
    "northbridge_website_neo_reports",
    "founder_dashboard",
    "executive_intelligence",
    "customer_experience_intelligence",
    "cat_website_analytics",
    "product_capability_broker",
    "institutional_memory",
  ],
  outputs: ["slack_founder_channel", "slack_founder_dm"],
  governance: FRB_GOVERNANCE,
};

export function registerFRBCapability(registry: NEOCapabilityRegistry): void {
  registry.register(FRB_CAPABILITY);
}

export function getFRBCapabilityRegistration(): NEOCapabilityDescriptor {
  return FRB_CAPABILITY;
}
