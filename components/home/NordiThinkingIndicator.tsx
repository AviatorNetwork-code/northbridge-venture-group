"use client";

import NordiAvatar from "@/components/home/NordiAvatar";

type NordiThinkingIndicatorProps = {
  label: string;
};

export default function NordiThinkingIndicator({ label }: NordiThinkingIndicatorProps) {
  return (
    <div className="flex items-start gap-3 animate-nordi-message">
      <NordiAvatar />
      <div className="rounded-2xl border border-white/10 bg-slate/50 px-4 py-3 shadow-sm shadow-black/20">
        <p className="mb-2 text-xs text-stone">{label}</p>
        <div className="flex items-center gap-1.5">
          <span className="cat-typing-dot" style={{ animationDelay: "0ms" }} />
          <span className="cat-typing-dot" style={{ animationDelay: "140ms" }} />
          <span className="cat-typing-dot" style={{ animationDelay: "280ms" }} />
        </div>
      </div>
    </div>
  );
}
