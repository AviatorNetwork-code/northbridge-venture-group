"use client";

import { useEffect, useState } from "react";
import type { NeoEvent, NeoEventType } from "../types";
import { useNeo } from "../context/NeoProvider";

export function useNeoSubscription<T extends NeoEventType>(
  type: T,
  handler: (event: NeoEvent<T>) => void,
): void {
  const { provider } = useNeo();

  useEffect(() => {
    return provider.subscribe((event) => {
      if (event.type === type) {
        handler(event as NeoEvent<T>);
      }
    });
  }, [provider, type, handler]);
}

export function useNeoData<T>(selector: (ctx: ReturnType<typeof useNeo>) => T): T {
  const ctx = useNeo();
  const [data, setData] = useState<T>(() => selector(ctx));

  useEffect(() => {
    setData(selector(ctx));
  }, [ctx, selector]);

  return data;
}
