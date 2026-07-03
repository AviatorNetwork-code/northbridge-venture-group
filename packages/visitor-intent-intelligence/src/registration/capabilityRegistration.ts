import { VII_GOVERNANCE } from "../governance/readOnlyPolicy.js";

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
  governance: typeof VII_GOVERNANCE;
}

export const VII_CAPABILITY: NEOCapabilityDescriptor = {
  id: "neos.visitor-intent-intelligence",
  name: "Visitor Intent Intelligence",
  version: "1.0.0",
  description:
    "Infers visitor intent, journey success, confidence progression, and CAT improvement recommendations across Northbridge products via adapters.",
  package: "@neos/visitor-intent-intelligence",
  mode: "read-only",
  inputs: [
    "customer_experience_intelligence",
    "product_evolution_engine",
    "continuous_product_learning_system",
    "conversation_intelligence",
    "product_adapter_events",
  ],
  outputs: [
    "founder_dashboard",
    "executive_intelligence",
    "customer_experience_intelligence",
    "product_evolution_engine",
    "cat_improvement_recommendations",
  ],
  governance: VII_GOVERNANCE,
};

export function registerVIICapability(registry: NEOCapabilityRegistry): void {
  registry.register(VII_CAPABILITY);
}

export function getVIICapabilityRegistration(): NEOCapabilityDescriptor {
  return VII_CAPABILITY;
}
