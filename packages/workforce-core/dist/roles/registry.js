const ROLE_DEFINITIONS = {
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
export function getRoleDefinition(role) {
    return ROLE_DEFINITIONS[role];
}
export function listRoleDefinitions() {
    return Object.values(ROLE_DEFINITIONS);
}
export function isRoleRegistered(role) {
    return role in ROLE_DEFINITIONS;
}
export function registerRoleDefinition(definition, registry = ROLE_DEFINITIONS) {
    registry[definition.role] = definition;
}
export { ROLE_DEFINITIONS };
