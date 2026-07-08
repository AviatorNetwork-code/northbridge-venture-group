import type { NeoPlatformServices } from "@/lib/neo/contracts";
import { liveMockNeoPlatform } from "@/lib/neo/providers/live-mock";
import { mockNeoPlatform } from "@/lib/neo/providers/mock";

let platform: NeoPlatformServices = liveMockNeoPlatform;
let useLive = true;

export function getNeoPlatform(): NeoPlatformServices {
  return platform;
}

export function setNeoPlatform(services: NeoPlatformServices): void {
  platform = services;
}

export function enableLiveMockEngine(enabled = true): void {
  useLive = enabled;
  platform = enabled ? liveMockNeoPlatform : (mockNeoPlatform as NeoPlatformServices);
}

export function isLiveMode(): boolean {
  return useLive;
}
