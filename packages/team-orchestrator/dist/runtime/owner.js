import { createRequestOwner, } from "@northbridge/workforce-contracts";
import { TeamOrchestratorError } from "./errors.js";
export function assignTeamRequestOwner(orgId, teamId) {
    return createRequestOwner(orgId, "team", teamId);
}
export function assertSingleOwner(current, next) {
    if (!current)
        return;
    if (current.orgId !== next.orgId) {
        throw new TeamOrchestratorError("owner_conflict", "Request owner org mismatch");
    }
    if (current.type !== next.type || current.id !== next.id) {
        throw new TeamOrchestratorError("owner_conflict", `Owner conflict: existing ${current.type}:${current.id ?? ""} vs ${next.type}:${next.id ?? ""}`);
    }
}
export function formatOwner(owner) {
    if (owner.type === "nordi")
        return "nordi";
    return `${owner.type}:${owner.id}`;
}
