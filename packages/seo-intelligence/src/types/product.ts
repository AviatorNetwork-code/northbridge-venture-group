export type NorthbridgeProductId =
  | "aviator-network"
  | "northbridge-services"
  | "ai-automation"
  | "airtax-financial"
  | "quadrix"
  | "none";

export interface ProductMappingResult {
  keyword: string;
  recommendedProductId: NorthbridgeProductId;
  recommendedProductName: string;
  fitScore: number;
  honestNoFit: boolean;
  mappingReason: string;
  capabilityVerified: boolean;
  alternativeProducts: NorthbridgeProductId[];
}
