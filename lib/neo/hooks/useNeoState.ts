"use client";

import { useSyncExternalStore } from "react";
import { getNeoPlatform } from "@/lib/neo/platform";
import type { NeoPlatformState } from "@/lib/neo/state/seed";

export function useNeoState(): NeoPlatformState {
  const neo = getNeoPlatform();
  return useSyncExternalStore(
    (onStoreChange) => neo.realtime.subscribeState(onStoreChange),
    () => neo.realtime.getState(),
    () => neo.realtime.getState()
  );
}

export function useNeoSelector<T>(selector: (state: NeoPlatformState) => T): T {
  const state = useNeoState();
  return selector(state);
}
