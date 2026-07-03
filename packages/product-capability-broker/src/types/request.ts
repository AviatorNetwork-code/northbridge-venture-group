import type { DisclosureLevel } from "./disclosure.js";

export type CapabilityConfidence = "high" | "medium" | "low";

export interface VisitorContext {
  industry?: string;
  visitorType?: string;
  challenge?: string;
  launchContext?: string;
  goals?: string[];
  signals?: string[];
}

export interface ProductCapabilityRequest {
  requestId: string;
  requesterId: string;
  targetProductId: string;
  visitorIntent: string;
  visitorContext: VisitorContext;
  question: string;
  requiredConfidence: CapabilityConfidence;
  publicFacing: boolean;
  allowedDisclosureLevel: DisclosureLevel;
  timestamp: number;
}
