"use client";

type NordiActionBarProps = {
  showExploreButton: boolean;
  showSaveButton: boolean;
  showCallButton: boolean;
  saved: boolean;
  callRequested: boolean;
  onExplore: () => void;
  onSave: () => void;
  onCall: () => void;
};

export default function NordiActionBar({
  showExploreButton,
  showSaveButton,
  showCallButton,
  saved,
  callRequested,
  onExplore,
  onSave,
  onCall,
}: NordiActionBarProps) {
  const hasActions = showExploreButton || showSaveButton || showCallButton;
  if (!hasActions) return null;

  return (
    <div
      className="shrink-0 border-t border-white/[0.08] bg-black/85 px-0.5 pt-2.5 backdrop-blur-md sm:pt-3"
      aria-label="Conversation actions"
    >
      <div className="flex flex-wrap items-center gap-2 pb-2 sm:gap-2.5">
        {showExploreButton ? (
          <button
            type="button"
            onClick={onExplore}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 bg-black/40 px-4 text-sm font-medium text-white backdrop-blur transition-colors hover:border-white/30 hover:bg-white/5 sm:px-5"
          >
            Explore Northbridge
          </button>
        ) : null}
        {showSaveButton ? (
          <button
            type="button"
            onClick={onSave}
            aria-pressed={saved}
            className={[
              "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium backdrop-blur transition-colors sm:px-5",
              saved
                ? "border border-red/40 bg-red/15 text-white"
                : "border border-white/15 bg-black/40 text-white hover:border-white/30 hover:bg-white/5",
            ].join(" ")}
          >
            {saved ? "Conversation saved" : "Save Conversation"}
          </button>
        ) : null}
        {showCallButton ? (
          <button
            type="button"
            onClick={onCall}
            aria-pressed={callRequested}
            className={[
              "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium backdrop-blur transition-colors sm:px-5",
              callRequested
                ? "border border-red/40 bg-red/15 text-white"
                : "border border-white/15 bg-black/40 text-white hover:border-white/30 hover:bg-white/5",
            ].join(" ")}
          >
            {callRequested ? "Call requested" : "Request a Call"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
