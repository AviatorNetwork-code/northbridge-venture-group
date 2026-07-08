"use client";

import { useEffect } from "react";
import { IconClose } from "@/components/operations/icons";

type AboutSection = {
  title: string;
  body: string[];
};

const sections: AboutSection[] = [
  {
    title: "Mission",
    body: [
      "Northbridge Digital exists so that no strong business idea dies for lack of infrastructure.",
      "We build the AI workforce and operating systems that let founders and operators run and grow their businesses — without needing a large team on day one.",
    ],
  },
  {
    title: "Vision",
    body: [
      "A world where any business, regardless of size, can access an intelligent operations team from the very first day.",
      "You scale that team only as far as your business genuinely needs — never more.",
    ],
  },
  {
    title: "Security",
    body: [
      "Your conversations and business details are handled with strict access controls.",
      "Nothing you share with CAT is sold, and it is never used to train external models. Sensitive actions always require your explicit authorization.",
    ],
  },
  {
    title: "Privacy",
    body: [
      "You decide what to share, and when.",
      "CAT only asks for what is needed to recommend the right workforce. You can save this conversation to your identity or discard it entirely at any time.",
    ],
  },
  {
    title: "Technology",
    body: [
      "Northbridge runs on NEO — a modular runtime of AI Specialists, Teams, and Managers coordinated through a single Operations Center.",
      "Everything connects to the tools you already use, so your workforce works where your business already lives.",
    ],
  },
  {
    title: "How CAT works",
    body: [
      "CAT is an advisor, not a worker.",
      "She listens, understands your business, and recommends the smallest solution that fits. She never performs operational work or makes financial decisions on your behalf — she guides, and you stay in control.",
    ],
  },
];

type AboutPanelProps = {
  open: boolean;
  onClose: () => void;
};

export default function AboutPanel({ open, onClose }: AboutPanelProps) {
  useEffect(() => {
    if (!open) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="About Northbridge">
      <button
        type="button"
        aria-label="Close panel"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-black/60 backdrop-blur-sm animate-fade-in"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-charcoal shadow-2xl animate-fade-slide-up sm:w-[26rem]">
        <header className="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-red">
              Northbridge Digital
            </p>
            <h2 className="mt-1 text-lg font-semibold text-white">About Northbridge</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-silver transition-colors hover:bg-white/5 hover:text-white"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          <div className="space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-red">
                  {section.title}
                </h3>
                <div className="space-y-2">
                  {section.body.map((paragraph, index) => (
                    <p key={index} className="text-sm leading-relaxed text-silver">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        <footer className="border-t border-white/10 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-white/15 bg-black/30 px-4 text-sm font-medium text-white transition-colors hover:border-white/30 hover:bg-white/5"
          >
            Close panel
          </button>
          <p className="mt-3 text-center text-xs text-stone">
            Your conversation stays exactly where you left it.
          </p>
        </footer>
      </aside>
    </div>
  );
}
