"use client";

interface CatLauncherProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function CatLauncher({ isOpen, onToggle }: CatLauncherProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls="northbridge-cat-panel"
      aria-label={
        isOpen ? "Close Northbridge consultant" : "Open Northbridge solutions consultant"
      }
      className="fixed z-[60] right-4 sm:right-6 bottom-[calc(1rem+env(safe-area-inset-bottom))] inline-flex items-center gap-2 px-4 py-3 text-sm font-medium bg-red text-white hover:bg-red-hover shadow-lg shadow-black/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      <span
        className="inline-flex items-center justify-center h-6 w-6 rounded-full border border-white/30 text-xs font-semibold"
        aria-hidden
      >
        C
      </span>
      <span className="hidden sm:inline">
        {isOpen ? "Close" : "Talk to a Consultant"}
      </span>
      <span className="sm:hidden">{isOpen ? "Close" : "Consult"}</span>
    </button>
  );
}
