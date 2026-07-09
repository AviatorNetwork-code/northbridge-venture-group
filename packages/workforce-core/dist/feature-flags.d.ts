import type { WorkforceFeatureFlags } from "@northbridge/workforce-contracts";
export declare const DEFAULT_WORKFORCE_FEATURE_FLAGS: WorkforceFeatureFlags;
export declare function normalizeFeatureFlags(flags: Partial<WorkforceFeatureFlags> | undefined): WorkforceFeatureFlags;
export declare function isManagerTierEnabled(flags: WorkforceFeatureFlags): boolean;
export declare function isDirectorTierEnabled(flags: WorkforceFeatureFlags): boolean;
export declare function isVpTierEnabled(flags: WorkforceFeatureFlags): boolean;
export declare function assertFeatureFlagDependency(flags: WorkforceFeatureFlags): void;
