"use client";

import NordiAvatar from "@/components/home/NordiAvatar";
import CatTypewriter from "@/components/home/CatTypewriter";
import NordiInsightCard from "@/components/home/NordiInsightCard";
import NordiObservationCard from "@/components/home/NordiObservationCard";
import NordiSnapshotCard from "@/components/home/NordiSnapshotCard";
import type { NordiMessageCard } from "@/lib/nordi/cards";

type NordiMessageBubbleProps = {
  messageId: string;
  content: string;
  animate: boolean;
  card?: NordiMessageCard;
  onDone?: () => void;
  onProgress?: () => void;
};

function renderCard(card: NordiMessageCard) {
  switch (card.type) {
    case "website-observation":
      return <NordiObservationCard title={card.data.title} rows={card.data.rows} />;
    case "conversation-insight":
      return (
        <NordiInsightCard
          title={card.data.title}
          observation={card.data.observation}
          confidence={card.data.confidence}
          reason={card.data.reason}
        />
      );
    case "business-snapshot":
      return (
        <NordiSnapshotCard
          title={card.data.title}
          business={card.data.business}
          employees={card.data.employees}
          confidence={card.data.confidence}
        />
      );
    default:
      return null;
  }
}

export default function NordiMessageBubble({
  messageId,
  content,
  animate,
  card,
  onDone,
  onProgress,
}: NordiMessageBubbleProps) {
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <NordiAvatar />
      <div className="max-w-[92%] space-y-3">
        {content ? (
          <div className="rounded-2xl border border-white/10 bg-slate/50 px-4 py-3 shadow-sm shadow-black/20">
            <CatTypewriter
              messageId={messageId}
              text={content}
              animate={animate}
              onDone={onDone}
              onProgress={onProgress}
            />
          </div>
        ) : null}
        {card ? renderCard(card) : null}
      </div>
    </div>
  );
}
