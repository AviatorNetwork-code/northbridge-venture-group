import type { CatCta, CatMessageRecord } from "@/lib/cat/websiteAssistantTypes";

interface CatMessageProps {
  message: CatMessageRecord;
  onCtaClick?: (cta: CatCta) => void;
}

export default function CatMessage({ message, onCtaClick }: CatMessageProps) {
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
      role="listitem"
    >
      <div
        className={`max-w-[92%] sm:max-w-[85%] rounded-sm px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm leading-relaxed ${
          isAssistant
            ? "border border-white/10 bg-slate/80 text-silver"
            : "bg-red text-white"
        }`}
      >
        {isAssistant && message.stageLabel && (
          <p className="text-[10px] uppercase tracking-wider text-red/90 mb-2">
            {message.stageLabel}
          </p>
        )}
        <p className="whitespace-pre-wrap">{message.content}</p>

        {isAssistant && message.productRecommendation && (
          <div className="mt-3 p-2.5 border border-white/10 bg-black/40 text-xs text-silver">
            <p className="font-semibold text-white text-sm mb-1">
              Recommended: {message.productRecommendation.productName}
            </p>
            <p className="mb-1">{message.productRecommendation.why}</p>
            <p className="text-silver/80">
              Fit confidence: {Math.round(message.productRecommendation.fitScore * 100)}%
            </p>
          </div>
        )}

        {isAssistant && message.followUpQuestion && (
          <p className="mt-2 text-xs text-white/80 italic">{message.followUpQuestion}</p>
        )}

        {isAssistant && message.ctas && message.ctas.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.ctas.map((cta) => (
              <a
                key={cta.id}
                href={cta.href}
                target={cta.kind === "external" ? "_blank" : undefined}
                rel={cta.kind === "external" ? "noopener noreferrer" : undefined}
                onClick={() => onCtaClick?.(cta)}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium border border-white/20 text-white hover:border-red hover:bg-red/10 transition-colors"
              >
                {cta.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
