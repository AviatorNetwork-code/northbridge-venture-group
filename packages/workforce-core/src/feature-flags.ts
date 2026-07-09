import type { WorkforceFeatureFlags } from "@northbridge/workforce-contracts";

export const DEFAULT_WORKFORCE_FEATURE_FLAGS: WorkforceFeatureFlags = {
  managersEnabled: false,
  directorsEnabled: false,
  vpsEnabled: false,
};

export function normalizeFeatureFlags(
  flags: Partial<WorkforceFeatureFlags> | undefined,
): WorkforceFeatureFlags {
  return {
    managersEnabled: flags?.managersEnabled ?? false,
    directorsEnabled: flags?.directorsEnabled ?? false,
    vpsEnabled: flags?.vpsEnabled ?? false,
  };
}

export function isManagerTierEnabled(flags: WorkforceFeatureFlags): boolean {
  return flags.managersEnabled;
}

export function isDirectorTierEnabled(flags: WorkforceFeatureFlags): boolean {
  return flags.directorsEnabled;
}

export function isVpTierEnabled(flags: WorkforceFeatureFlags): boolean {
  return flags.vpsEnabled;
}

export function assertFeatureFlagDependency(
  flags: WorkforceFeatureFlags,
): void {
  if (flags.directorsEnabled && !flags.managersEnabled) {
    throw new Error("directorsEnabled requires managersEnabled");
  }
  if (flags.vpsEnabled && !flags.directorsEnabled) {
    throw new Error("vpsEnabled requires directorsEnabled");
  }
}
