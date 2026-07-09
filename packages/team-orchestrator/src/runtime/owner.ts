import {
  createRequestOwner,
  type RequestOwner,
} from "@northbridge/workforce-contracts";
import { TeamOrchestratorError } from "./errors.js";

export function assignTeamRequestOwner(
  orgId: string,
  teamId: string,
): RequestOwner {
  return createRequestOwner(orgId, "team", teamId);
}

export function assertSingleOwner(
  current: RequestOwner | null,
  next: RequestOwner,
): void {
  if (!current) return;
  if (current.orgId !== next.orgId) {
    throw new TeamOrchestratorError(
      "owner_conflict",
      "Request owner org mismatch",
    );
  }
  if (current.type !== next.type || current.id !== next.id) {
    throw new TeamOrchestratorError(
      "owner_conflict",
      `Owner conflict: existing ${current.type}:${current.id ?? ""} vs ${next.type}:${next.id ?? ""}`,
    );
  }
}

export function formatOwner(owner: RequestOwner): string {
  if (owner.type === "nordi") return "nordi";
  return `${owner.type}:${owner.id}`;
}
