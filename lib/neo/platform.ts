import type { NeoPlatformServices } from "@/lib/neo/contracts";
import { mockNeoPlatform } from "@/lib/neo/providers/mock";

let platform: NeoPlatformServices = mockNeoPlatform;

/**
 * Returns the active NEO platform service bindings for the Operations Center.
 * Live bindings replace mocks when @neos/* packages are installed from NEO.
 */
export function getNeoPlatform(): NeoPlatformServices {
  return platform;
}

/** Test-only hook to inject live NEO providers without duplicating domain logic. */
export function setNeoPlatform(services: NeoPlatformServices): void {
  platform = services;
}
