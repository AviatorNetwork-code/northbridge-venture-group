import type { WorkforceFeatureFlags } from "@northbridge/workforce-contracts";

/**
 * Service categories for Northbridge Digital team products.
 */
export type TeamServiceCategory =
  | "marketing"
  | "sales"
  | "customer-experience"
  | "financial"
  | "aviation"
  | "dental"
  | "legal"
  | "hvac"
  | "general";

export interface FutureOrganizationalLayerRef {
  layer: "manager" | "director" | "vice_president";
  catalogRoleId: string;
  requiredFeatureFlag: keyof WorkforceFeatureFlags;
  launchVisible: false;
}

export interface TeamLeadAssignment {
  id: string;
  teamId: string;
  role: "team_lead";
  displayName: string;
}

export interface NdpTeamCatalogEntry {
  id: string;
  name: string;
  serviceCategory: TeamServiceCategory;
  teamProductId: string;
  teamLead: TeamLeadAssignment;
  specialistIds: string[];
  capabilityTags: string[];
  routingTags: string[];
  launchVisible: boolean;
  inventoryVersion: "1.0";
  futureOrganizationalLayers: FutureOrganizationalLayerRef[];
}

function teamLead(teamId: string, displayName: string): TeamLeadAssignment {
  return {
    id: `lead-${teamId}`,
    teamId,
    role: "team_lead",
    displayName,
  };
}

function futureLayers(teamId: string): FutureOrganizationalLayerRef[] {
  return [
    {
      layer: "manager",
      catalogRoleId: `manager-${teamId}`,
      requiredFeatureFlag: "managersEnabled",
      launchVisible: false,
    },
    {
      layer: "director",
      catalogRoleId: `director-${teamId}`,
      requiredFeatureFlag: "directorsEnabled",
      launchVisible: false,
    },
    {
      layer: "vice_president",
      catalogRoleId: `vp-${teamId}`,
      requiredFeatureFlag: "vpsEnabled",
      launchVisible: false,
    },
  ];
}

export const NDP_LAUNCH_TEAMS: NdpTeamCatalogEntry[] = [
  {
    id: "team-marketing",
    name: "Marketing Team",
    serviceCategory: "marketing",
    teamProductId: "product-marketing-team",
    teamLead: teamLead("team-marketing", "Marketing Team Lead"),
    specialistIds: [
      "marketing-campaign-specialist",
      "content-posts-specialist",
      "brand-specialist",
      "marketing-analytics-specialist",
      "advertising-budget-specialist",
    ],
    capabilityTags: [
      "capability:customer_acquisition",
      "capability:content_marketing",
      "capability:analytics",
    ],
    routingTags: [
      "intent:operational",
      "capability:customer_acquisition",
      "capability:content_marketing",
    ],
    launchVisible: true,
    inventoryVersion: "1.0",
    futureOrganizationalLayers: futureLayers("team-marketing"),
  },
  {
    id: "team-sales",
    name: "Sales Team",
    serviceCategory: "sales",
    teamProductId: "product-sales-team",
    teamLead: teamLead("team-sales", "Sales Team Lead"),
    specialistIds: [
      "sales-specialist",
      "lead-qualification-specialist",
      "proposal-quote-specialist",
      "follow-up-specialist",
      "crm-specialist",
    ],
    capabilityTags: ["capability:sales_pipeline", "capability:analytics"],
    routingTags: ["intent:operational", "capability:sales_pipeline"],
    launchVisible: true,
    inventoryVersion: "1.0",
    futureOrganizationalLayers: futureLayers("team-sales"),
  },
  {
    id: "team-customer-service",
    name: "Customer Service Team",
    serviceCategory: "customer-experience",
    teamProductId: "product-customer-service-team",
    teamLead: teamLead("team-customer-service", "Customer Service Team Lead"),
    specialistIds: [
      "customer-service-specialist",
      "reception-specialist",
      "appointment-specialist",
      "reminder-specialist",
      "customer-success-specialist",
    ],
    capabilityTags: ["capability:customer_service", "capability:scheduling"],
    routingTags: [
      "intent:operational",
      "capability:customer_service",
      "capability:scheduling",
    ],
    launchVisible: true,
    inventoryVersion: "1.0",
    futureOrganizationalLayers: futureLayers("team-customer-service"),
  },
  {
    id: "team-financial",
    name: "Financial Team",
    serviceCategory: "financial",
    teamProductId: "product-financial-team",
    teamLead: teamLead("team-financial", "Financial Team Lead"),
    specialistIds: [
      "financial-specialist",
      "billing-specialist",
      "accounts-receivable-specialist",
      "financial-reporting-specialist",
    ],
    capabilityTags: ["capability:finance", "capability:analytics"],
    routingTags: ["intent:operational", "capability:finance"],
    launchVisible: true,
    inventoryVersion: "1.0",
    futureOrganizationalLayers: futureLayers("team-financial"),
  },
  {
    id: "team-flight-school",
    name: "Flight School Team",
    serviceCategory: "aviation",
    teamProductId: "product-flight-school-team",
    teamLead: teamLead("team-flight-school", "Flight School Team Lead"),
    specialistIds: [
      "aviation-scheduling-specialist",
      "student-progress-specialist",
      "flight-training-specialist",
      "customer-service-specialist",
      "marketing-campaign-specialist",
      "sales-specialist",
    ],
    capabilityTags: [
      "capability:aviation_operations",
      "capability:scheduling",
      "capability:customer_service",
      "capability:customer_acquisition",
      "capability:sales_pipeline",
    ],
    routingTags: [
      "intent:operational",
      "capability:aviation_operations",
      "capability:scheduling",
    ],
    launchVisible: true,
    inventoryVersion: "1.0",
    futureOrganizationalLayers: futureLayers("team-flight-school"),
  },
  {
    id: "team-dental-office",
    name: "Dental Office Team",
    serviceCategory: "dental",
    teamProductId: "product-dental-office-team",
    teamLead: teamLead("team-dental-office", "Dental Office Team Lead"),
    specialistIds: [
      "patient-scheduling-specialist",
      "recall-specialist",
      "insurance-verification-specialist",
      "treatment-coordinator-specialist",
      "reception-specialist",
      "marketing-campaign-specialist",
      "sales-specialist",
    ],
    capabilityTags: [
      "capability:dental_operations",
      "capability:scheduling",
      "capability:customer_service",
      "capability:customer_acquisition",
      "capability:sales_pipeline",
    ],
    routingTags: [
      "intent:operational",
      "capability:dental_operations",
      "capability:scheduling",
    ],
    launchVisible: true,
    inventoryVersion: "1.0",
    futureOrganizationalLayers: futureLayers("team-dental-office"),
  },
  {
    id: "team-law-firm",
    name: "Law Firm Team",
    serviceCategory: "legal",
    teamProductId: "product-law-firm-team",
    teamLead: teamLead("team-law-firm", "Law Firm Team Lead"),
    specialistIds: [
      "client-intake-specialist",
      "case-scheduling-specialist",
      "legal-documentation-specialist",
      "client-communication-specialist",
      "marketing-campaign-specialist",
      "sales-specialist",
    ],
    capabilityTags: [
      "capability:legal_operations",
      "capability:scheduling",
      "capability:customer_acquisition",
      "capability:sales_pipeline",
    ],
    routingTags: [
      "intent:operational",
      "capability:legal_operations",
      "capability:scheduling",
    ],
    launchVisible: true,
    inventoryVersion: "1.0",
    futureOrganizationalLayers: futureLayers("team-law-firm"),
  },
  {
    id: "team-hvac",
    name: "HVAC Team",
    serviceCategory: "hvac",
    teamProductId: "product-hvac-team",
    teamLead: teamLead("team-hvac", "HVAC Team Lead"),
    specialistIds: [
      "dispatch-specialist",
      "technician-scheduling-specialist",
      "maintenance-agreement-specialist",
      "estimate-specialist",
      "customer-service-specialist",
      "marketing-campaign-specialist",
      "sales-specialist",
    ],
    capabilityTags: [
      "capability:hvac_operations",
      "capability:scheduling",
      "capability:customer_service",
      "capability:customer_acquisition",
      "capability:sales_pipeline",
    ],
    routingTags: [
      "intent:operational",
      "capability:hvac_operations",
      "capability:scheduling",
    ],
    launchVisible: true,
    inventoryVersion: "1.0",
    futureOrganizationalLayers: futureLayers("team-hvac"),
  },
  {
    id: "team-general-service",
    name: "General Service Business Team",
    serviceCategory: "general",
    teamProductId: "product-general-service-team",
    teamLead: teamLead("team-general-service", "General Service Team Lead"),
    specialistIds: [
      "appointment-specialist",
      "customer-service-specialist",
      "follow-up-specialist",
      "sales-specialist",
      "marketing-campaign-specialist",
      "financial-specialist",
    ],
    capabilityTags: [
      "capability:general_operations",
      "capability:scheduling",
      "capability:customer_service",
      "capability:sales_pipeline",
      "capability:customer_acquisition",
      "capability:finance",
    ],
    routingTags: [
      "intent:operational",
      "capability:general_operations",
      "capability:scheduling",
    ],
    launchVisible: true,
    inventoryVersion: "1.0",
    futureOrganizationalLayers: futureLayers("team-general-service"),
  },
];

export const NDP_LAUNCH_TEAM_ID_SET = new Set(NDP_LAUNCH_TEAMS.map((team) => team.id));

export function getLaunchTeam(id: string): NdpTeamCatalogEntry | undefined {
  return NDP_LAUNCH_TEAMS.find((team) => team.id === id);
}

export function listLaunchVisibleTeams(): NdpTeamCatalogEntry[] {
  return NDP_LAUNCH_TEAMS.filter((team) => team.launchVisible);
}

export function getTeamByCapabilityTag(tag: string): NdpTeamCatalogEntry[] {
  return NDP_LAUNCH_TEAMS.filter((team) => team.capabilityTags.includes(tag));
}
