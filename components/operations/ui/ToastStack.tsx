"use client";

import { useNeoLive } from "@/components/operations/providers/NeoLiveProvider";

const levelStyles = {
  info: "border-white/20 bg-slate",
  success: "border-emerald-500/30 bg-emerald-500/10",
  warning: "border-amber-500/30 bg-amber-500/10",
  critical: "border-red/40 bg-red/10",
};

export default function ToastStack() {
  const { toasts, dismissToast } = useNeoLive();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-[min(100%,20rem)]"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`border px-4 py-3 shadow-lg animate-slide-in ${levelStyles[toast.level]}`}
          role="status"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-white">{toast.title}</p>
              <p className="text-xs text-silver mt-0.5">{toast.message}</p>
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="text-silver hover:text-white text-xs shrink-0"
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
