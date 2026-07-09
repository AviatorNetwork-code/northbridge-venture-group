"use client";

import NordiAvatar from "@/components/home/NordiAvatar";
import { LEARNING_CONSENT_MESSAGE } from "@/lib/nordi/conversation-learning-consent";

type ConversationLearningConsentCardProps = {
  onAllow: () => void;
  onDecline: () => void;
};

export default function ConversationLearningConsentCard({
  onAllow,
  onDecline,
}: ConversationLearningConsentCardProps) {
  return (
    <div className="flex items-start gap-3 animate-fade-slide-up">
      <NordiAvatar />

      <div className="w-full max-w-[92%] rounded-2xl border border-white/10 bg-slate/50 px-4 py-4">
        <p className="whitespace-pre-line text-sm leading-relaxed text-silver">
          {LEARNING_CONSENT_MESSAGE}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onAllow}
            className="min-h-11 rounded-full border border-red/40 bg-red/15 px-5 text-sm font-medium text-white transition-colors hover:border-red/60 hover:bg-red/25"
          >
            Allow
          </button>
          <button
            type="button"
            onClick={onDecline}
            className="min-h-11 rounded-full border border-white/15 bg-black/30 px-5 text-sm text-white transition-colors hover:border-white/30 hover:bg-white/5"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
