"use client";

import { useEffect } from "react";
import type { NeoEvent } from "@/lib/neo/events";
import { getNeoPlatform } from "@/lib/neo/platform";

export function useNeoEvents(
  handler: (event: NeoEvent) => void,
  enabled = true
): void {
  useEffect(() => {
    if (!enabled) return;
    const neo = getNeoPlatform();
    return neo.realtime.subscribe(handler);
  }, [handler, enabled]);
}
