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
};

export default function CatMessageContent({ content }: CatMessageContentProps) {
  const lines = content.split("\n");

  return (
    <div className="space-y-1.5 text-sm leading-relaxed text-silver">
      {lines.map((line, index) => {
        if (!line.trim()) {
          return <div key={index} className="h-1" />;
        }

        if (line.startsWith("✓ ") || line.startsWith("○ ") || line.startsWith("✗ ") || line.startsWith("• ")) {
          return (
            <p key={index} className="text-silver">
              {formatInline(line)}
            </p>
          );
        }

        return (
          <p key={index} className="text-silver">
            {formatInline(line)}
          </p>
        );
      })}
    </div>
  );
}
