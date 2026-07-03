import { AEE_GOVERNANCE } from "../governance/readOnlyPolicy.js";

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
  governance: typeof AEE_GOVERNANCE;
}

export const AEE_CAPABILITY: NEOCapabilityDescriptor = {
  id: "neos.adaptive-experience-engine",
  name: "Adaptive Experience Engine",
  version: "1.0.0",
  description:
    "Recommends personalized customer experiences across Northbridge operating companies without autonomous product modification.",
  package: "@neos/adaptive-experience-engine",
  mode: "read-only",
  inputs: [
    "customer_experience_intelligence",
    "visitor_intent_intelligence",
    "business_impact_engine",
    "executive_intelligence",
    "organization_understanding",
    "founder_decision_learning",
    "customer_journey_intelligence",
    "product_telemetry",
    "conversation_analytics",
    "session_analytics",
    "experiment_outcomes",
  ],
  outputs: [
    "executive_intelligence",
    "founder_dashboard",
    "adaptive_experience_plan",
    "personalization_confidence",
    "risk_assessment",
  ],
  governance: AEE_GOVERNANCE,
};

export function registerAEECapability(registry: NEOCapabilityRegistry): void {
  registry.register(AEE_CAPABILITY);
}

export function getAEECapabilityRegistration(): NEOCapabilityDescriptor {
  return AEE_CAPABILITY;
}
