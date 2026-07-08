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
        <p className="whitespace-pre-wrap">{message.content}</p>
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
