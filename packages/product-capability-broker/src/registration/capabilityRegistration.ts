import { PCB_GOVERNANCE } from "../governance/readOnlyPolicy.js";

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
  governance: typeof PCB_GOVERNANCE;
}

export const PCB_CAPABILITY: NEOCapabilityDescriptor = {
  id: "neos.product-capability-broker",
  name: "Product Capability Broker",
  version: "1.0.0",
  description:
    "Federated product intelligence protocol — lets consultative assistants ask product-owned capability sources before answering users.",
  package: "@neos/product-capability-broker",
  mode: "read-only",
  inputs: [
    "product_capability_adapters",
    "visitor_intent",
    "consultant_context",
    "website_cat_requests",
    "product_cat_responses",
  ],
  outputs: [
    "public_safe_capability_answers",
    "product_fit_guidance",
    "unsupported_claim_blocks",
    "escalation_signals",
    "capability_confidence",
  ],
  governance: PCB_GOVERNANCE,
};

export function registerPCBCapability(registry: NEOCapabilityRegistry): void {
  registry.register(PCB_CAPABILITY);
}

export function getPCBCapabilityRegistration(): NEOCapabilityDescriptor {
  return PCB_CAPABILITY;
}
