"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { NeoEvent } from "@/lib/neo/events";
import { getNeoPlatform } from "@/lib/neo/platform";
import type { OpsNotification } from "@/lib/neo/types";

interface ToastItem extends OpsNotification {
  visible: boolean;
}

interface NeoLiveContextValue {
  toasts: ToastItem[];
  dismissToast: (id: string) => void;
  live: boolean;
}

const NeoLiveContext = createContext<NeoLiveContextValue | null>(null);

export function NeoLiveProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const neo = getNeoPlatform();
    neo.realtime.start();
    setLive(true);

    return neo.realtime.subscribe((event: NeoEvent) => {
      if (event.notification) {
        setToasts((prev) => [
          { ...event.notification!, visible: true },
          ...prev,
        ].slice(0, 5));
      }
    });
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((t) =>
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, 5000)
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = useMemo(
    () => ({ toasts, dismissToast, live }),
    [toasts, dismissToast, live]
  );

  return (
    <NeoLiveContext.Provider value={value}>{children}</NeoLiveContext.Provider>
  );
}

export function useNeoLive() {
  const ctx = useContext(NeoLiveContext);
  if (!ctx) throw new Error("useNeoLive must be used within NeoLiveProvider");
  return ctx;
}
