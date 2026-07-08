"use client";

function formatInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

type CatMessageContentProps = {
  content: string;
  caret?: boolean;
};

export default function CatMessageContent({ content, caret = false }: CatMessageContentProps) {
  const lines = content.split("\n");

  let lastNonEmpty = -1;
  lines.forEach((line, index) => {
    if (line.trim()) lastNonEmpty = index;
  });

  return (
    <div className="space-y-1.5 text-sm leading-relaxed text-silver">
      {lines.map((line, index) => {
        const showCaret = caret && index === lastNonEmpty;

        if (!line.trim()) {
          return <div key={index} className="h-1" />;
        }

        return (
          <p key={index} className="text-silver">
            {formatInline(line)}
            {showCaret ? <span className="cat-caret" aria-hidden /> : null}
          </p>
        );
      })}
      {caret && lastNonEmpty === -1 ? <span className="cat-caret" aria-hidden /> : null}
    </div>
  );
}
