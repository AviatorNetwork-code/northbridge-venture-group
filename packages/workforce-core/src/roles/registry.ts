import type { WorkforceRole } from "@northbridge/workforce-contracts";

export interface RoleDefinition {
  role: WorkforceRole;
  label: string;
  description: string;
  /** Minimum organizational tier required before this role can be provisioned. */
  minimumTier: "team" | "manager" | "director" | "vice_president";
  customerVisible: boolean;
}

const ROLE_DEFINITIONS: Record<WorkforceRole, RoleDefinition> = {
  team_lead: {
    role: "team_lead",
    label: "Team Lead",
    description: "Coordinates specialists and owns customer-facing team voice",
    minimumTier: "team",
    customerVisible: true,
  },
  specialist: {
    role: "specialist",
    label: "Specialist",
    description: "Reusable capability executing tasks within permission envelope",
    minimumTier: "team",
    customerVisible: false,
  },
  manager: {
    role: "manager",
    label: "Manager",
    description: "Coordinates multiple teams at department level",
    minimumTier: "manager",
    customerVisible: true,
  },
  director: {
    role: "director",
    label: "Director",
    description: "Coordinates managers and strategic initiatives",
    minimumTier: "director",
    customerVisible: true,
  },
  vice_president: {
    role: "vice_president",
    label: "Vice President",
    description: "Executive-level cross-department coordination",
    minimumTier: "vice_president",
    customerVisible: true,
  },
};

export function getRoleDefinition(role: WorkforceRole): RoleDefinition {
  return ROLE_DEFINITIONS[role];
}

export function listRoleDefinitions(): RoleDefinition[] {
  return Object.values(ROLE_DEFINITIONS);
}

export function isRoleRegistered(role: string): role is WorkforceRole {
  return role in ROLE_DEFINITIONS;
}

export function registerRoleDefinition(
  definition: RoleDefinition,
  registry: Record<WorkforceRole, RoleDefinition> = ROLE_DEFINITIONS,
): void {
  registry[definition.role] = definition;
}

export { ROLE_DEFINITIONS };
