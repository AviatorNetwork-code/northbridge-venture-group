export const DEFAULT_WORKFORCE_FEATURE_FLAGS = {
    managersEnabled: false,
    directorsEnabled: false,
    vpsEnabled: false,
};
export function normalizeFeatureFlags(flags) {
    return {
        managersEnabled: flags?.managersEnabled ?? false,
        directorsEnabled: flags?.directorsEnabled ?? false,
        vpsEnabled: flags?.vpsEnabled ?? false,
    };
}
export function isManagerTierEnabled(flags) {
    return flags.managersEnabled;
}
export function isDirectorTierEnabled(flags) {
    return flags.directorsEnabled;
}
export function isVpTierEnabled(flags) {
    return flags.vpsEnabled;
}
export function assertFeatureFlagDependency(flags) {
    if (flags.directorsEnabled && !flags.managersEnabled) {
        throw new Error("directorsEnabled requires managersEnabled");
    }
    if (flags.vpsEnabled && !flags.directorsEnabled) {
        throw new Error("vpsEnabled requires directorsEnabled");
    }
}
