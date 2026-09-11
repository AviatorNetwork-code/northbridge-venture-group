/**
 * Local adapter stub for @northbridge/operations-intelligence.
 * Canonical package lives in NEOS; this keeps website builds runnable when the
 * sibling NEOS path is unavailable (NEO_LIVE_CROSS_REPO_VERIFICATION_PENDING).
 */

export type OrganizationProfile = {
  organizationId: string;
  displayName: string;
  publicName: string;
  industry?: string;
};

export type OrganizationService = {
  organizationId: string;
  serviceId: string;
  name: string;
  status: "active" | "inactive";
};

export type OrganizationDepartment = {
  organizationId: string;
  departmentId: string;
  name: string;
};

export type OrganizationGoal = {
  organizationId: string;
  goalId: string;
  title: string;
};

export type OrganizationPolicy = {
  organizationId: string;
  policyId: string;
  title: string;
};

export type OrganizationFact = {
  organizationId: string;
  factId: string;
  text: string;
};

export type OrganizationFacts = {
  organizationId: string;
  facts: OrganizationFact[];
};

export type WebsiteIntelligence = {
  organizationId: string;
  summary?: string;
};

export type OrganizationIntelligenceInput = {
  profile: OrganizationProfile;
  services: OrganizationService[];
  departments: OrganizationDepartment[];
  goals: OrganizationGoal[];
  policies: OrganizationPolicy[];
  facts: OrganizationFacts;
  websiteIntelligence?: WebsiteIntelligence;
};

export type OrganizationIntelligenceContext = {
  organizationId: string;
  profile: OrganizationProfile;
  activeServices: OrganizationService[];
  workforceTeamIds: string[];
  departments: OrganizationDepartment[];
  goals: OrganizationGoal[];
  policies: OrganizationPolicy[];
  facts: OrganizationFacts;
  websiteIntelligence?: WebsiteIntelligence;
  builtAt: string;
  contextVersion: string;
};

export type ConsumedOperationsSection =
  | "profile"
  | "services"
  | "departments"
  | "goals"
  | "policies"
  | "facts"
  | "websiteIntelligence";

export type TeamOrganizationContextReference = {
  teamId: string;
  consumedSections: ConsumedOperationsSection[];
};

export const MARKETING_TEAM_ORGANIZATION_CONTEXT_REFERENCE: TeamOrganizationContextReference =
  {
    teamId: "team-marketing",
    consumedSections: ["profile", "goals", "services", "facts"],
  };

export const TEAM_ORGANIZATION_CONTEXT_REFERENCES: TeamOrganizationContextReference[] =
  [
    MARKETING_TEAM_ORGANIZATION_CONTEXT_REFERENCE,
    {
      teamId: "team-sales",
      consumedSections: ["profile", "services", "goals"],
    },
    {
      teamId: "team-customer-service",
      consumedSections: ["profile", "policies", "facts"],
    },
    {
      teamId: "team-financial",
      consumedSections: ["profile", "goals", "policies", "services"],
    },
  ];

export function buildExampleSkywardOrganizationInput(): OrganizationIntelligenceInput {
  const organizationId = "org-skyward";
  return {
    profile: {
      organizationId,
      displayName: "Skyward Aviation",
      publicName: "Skyward Aviation",
      industry: "aviation",
    },
    services: [
      {
        organizationId,
        serviceId: "svc-flight-training",
        name: "Flight Training",
        status: "active",
      },
      {
        organizationId,
        serviceId: "svc-aircraft-rental",
        name: "Aircraft Rental",
        status: "active",
      },
    ],
    departments: [
      {
        organizationId,
        departmentId: "dept-ops",
        name: "Operations",
      },
    ],
    goals: [
      {
        organizationId,
        goalId: "goal-retention",
        title: "Improve student retention",
      },
    ],
    policies: [
      {
        organizationId,
        policyId: "pol-safety",
        title: "Safety-first operations",
      },
    ],
    facts: {
      organizationId,
      facts: [
        {
          organizationId,
          factId: "fact-1",
          text: "Primary training aircraft: Cessna 172",
        },
      ],
    },
    websiteIntelligence: {
      organizationId,
      summary: "Flight school and rental operator",
    },
  };
}

export function assertValidOrganizationIntelligence(
  input: OrganizationIntelligenceInput,
): void {
  if (!input?.profile?.organizationId) {
    throw new Error("Invalid organization intelligence: missing organizationId");
  }
}

export function buildOrganizationContext(
  input: OrganizationIntelligenceInput,
  options?: { now?: () => string; contextVersion?: string },
): OrganizationIntelligenceContext {
  assertValidOrganizationIntelligence(input);
  const now = options?.now ?? (() => new Date().toISOString());
  return {
    organizationId: input.profile.organizationId,
    profile: input.profile,
    activeServices: input.services.filter((service) => service.status === "active"),
    workforceTeamIds: ["team-marketing", "team-sales", "team-customer-service", "team-financial"],
    departments: input.departments,
    goals: input.goals,
    policies: input.policies,
    facts: input.facts,
    websiteIntelligence: input.websiteIntelligence,
    builtAt: now(),
    contextVersion: options?.contextVersion ?? "1.0.0",
  };
}
