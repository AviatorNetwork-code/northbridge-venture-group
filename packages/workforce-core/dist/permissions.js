export function mergeSpecialistPermissions(base, overlay) {
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
export function canPerformAction(permissions, action) {
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
export function assertCanPerformAction(permissions, action) {
    const result = canPerformAction(permissions, action);
    if (!result.allowed) {
        throw new Error(result.reason ?? "Permission denied");
    }
}
export function applyOrgPolicyOverlay(permissions, policy) {
    if (!policy?.deniedActions?.length) {
        return permissions;
    }
    return mergeSpecialistPermissions(permissions, {
        cannotDo: policy.deniedActions,
    });
}
export function permissionsAllowCustomerCommunication(permissions, flags) {
    void flags;
    return canPerformAction(permissions, "customer_communication").allowed;
}
