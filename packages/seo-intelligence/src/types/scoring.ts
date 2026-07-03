export interface BusinessImpactFactors {
  searchDemand: number;
  buyerIntent: number;
  revenuePotential: number;
  customerValue: number;
  strategicAlignment: number;
  competition: number;
  maintenanceCost: number;
}

export interface SEOBusinessScore {
  overall: number;
  factors: BusinessImpactFactors;
  trafficValueEstimate: "low" | "medium" | "high";
  conversionImpactEstimate: "low" | "medium" | "high";
  contentComplexity: "low" | "medium" | "high";
}
