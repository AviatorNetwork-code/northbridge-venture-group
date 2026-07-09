import type {
  SpecialistPermissions,
  WorkforceFeatureFlags,
} from "@northbridge/workforce-contracts";

export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
}

export function mergeSpecialistPermissions(
  base: SpecialistPermissions,
  overlay?: Partial<SpecialistPermissions>,
): SpecialistPermissions {
  const canDo = new Set(base.canDo);
  const cannotDo = new Set(base.cannotDo);

  for (const action of overlay?.canDo ?? []) {
    canDo.add(action);
    cannotDo.delete(action);
  }
  for (const action of overlay?.cannotDo ?? []) {
    cannotDo.add(action);
    canDo.delete(action);
  }

  return {
    canDo: [...canDo],
    cannotDo: [...cannotDo],
  };
}

export function canPerformAction(
  permissions: SpecialistPermissions,
  action: string,
): PermissionCheckResult {
  if (permissions.cannotDo.includes(action)) {
    return {
      allowed: false,
      reason: `Action '${action}' is explicitly denied`,
    };
  }
  if (permissions.canDo.length > 0 && !permissions.canDo.includes(action)) {
    return {
      allowed: false,
      reason: `Action '${action}' is not in canDo envelope`,
    };
  }
  return { allowed: true };
}

export function assertCanPerformAction(
  permissions: SpecialistPermissions,
  action: string,
): void {
  const result = canPerformAction(permissions, action);
  if (!result.allowed) {
    throw new Error(result.reason ?? "Permission denied");
  }
}

export interface OrgPolicyOverlay {
  deniedActions?: string[];
}

export function applyOrgPolicyOverlay(
  permissions: SpecialistPermissions,
  policy?: OrgPolicyOverlay,
): SpecialistPermissions {
  if (!policy?.deniedActions?.length) {
    return permissions;
  }
  return mergeSpecialistPermissions(permissions, {
    cannotDo: policy.deniedActions,
  });
}

export function permissionsAllowCustomerCommunication(
  permissions: SpecialistPermissions,
  flags: WorkforceFeatureFlags,
): boolean {
  void flags;
  return canPerformAction(permissions, "customer_communication").allowed;
}
