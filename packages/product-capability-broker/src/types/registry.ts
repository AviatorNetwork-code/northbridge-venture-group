import type { DisclosureLevel } from "./disclosure.js";

export interface ProductOwnershipMetadata {
  productId: string;
  displayName: string;
  owningTeam: string;
  capabilitySource: string;
  maintainerContact?: string;
  roadmapDisclosurePolicy: "public_planned_only" | "sales_safe_planned" | "no_roadmap";
  maxPublicDisclosure: DisclosureLevel;
}

export interface RegisteredProduct {
  metadata: ProductOwnershipMetadata;
  adapterId: string;
  registeredAt: number;
}
