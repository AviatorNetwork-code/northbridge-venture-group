"use client";

import { useNeo } from "@/lib/neo/context/NeoProvider";

export default function ToastStack() {
  const { toasts, dismissToast } = useNeo();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="border border-white/15 bg-charcoal/95 backdrop-blur px-4 py-3 shadow-lg animate-slide-in"
          role="alert"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">{toast.title}</p>
              <p className="text-xs text-silver mt-1">{toast.message}</p>
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="text-silver hover:text-white text-xs"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
