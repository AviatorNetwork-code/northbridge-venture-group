import type { CapabilityConfidence } from "./request.js";
import type { DisclosureLevel } from "./disclosure.js";

export interface CapabilityItem {
  id: string;
  label: string;
  description: string;
  disclosureLevel: DisclosureLevel;
}

export interface UnsupportedClaim {
  claim: string;
  reason: string;
}

export interface CapabilityEvidence {
  source: string;
  detail: string;
}

export interface ProductCapabilityResponse {
  responseId: string;
  targetProductId: string;
  answeredBy: string;
  currentCapabilities: CapabilityItem[];
  plannedCapabilities: CapabilityItem[];
  unsupportedClaims: UnsupportedClaim[];
  recommendedPositioning: string;
  recommendedCTA: string;
  confidence: CapabilityConfidence;
  evidence: CapabilityEvidence[];
  escalationRequired: boolean;
  publicSafeSummary: string;
  privateNotes?: string;
  lastUpdated: number;
}

export interface BrokeredCapabilityResult {
  requestId: string;
  response: ProductCapabilityResponse;
  publicAnswer: string;
  blockedClaims: UnsupportedClaim[];
  guardrailWarnings: string[];
  synthesisApplied: boolean;
}
