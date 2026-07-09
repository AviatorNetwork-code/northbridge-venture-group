import type { RequestOwner } from "@northbridge/workforce-contracts";
import { WorkforceRouterError } from "../runtime/errors.js";

export {
  filterCandidatesByEntitlement,
  filterCandidatesByFeatureFlags,
} from "../policy/enforce.js";

export { buildDedupKey, checkDedup, InMemoryDedupStore } from "./dedup.js";
export type { DedupStore, DedupRecord } from "./dedup.js";

export function assertSingleRouteOwner(owner: RequestOwner | undefined): asserts owner is RequestOwner {
  if (!owner) {
    throw new WorkforceRouterError(
      "owner_required",
      "Routing decision with assigned status requires exactly one owner",
    );
  }
  if (owner.type === "nordi") {
    throw new WorkforceRouterError(
      "nordi_not_routable",
      "Workforce router must not assign Nordi ownership",
    );
  }
}

export function ownersEqual(a: RequestOwner, b: RequestOwner): boolean {
  return a.orgId === b.orgId && a.type === b.type && a.id === b.id;
}
