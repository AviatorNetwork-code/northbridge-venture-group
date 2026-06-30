import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string | ReactNode;
  children?: ReactNode;
  align?: "left" | "center";
};

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  align = "left",
}: PageHeaderProps) {
  const alignClass = align === "center" ? "text-center mx-auto max-w-3xl" : "max-w-3xl";

  return (
    <header className={`nb-animate-in ${alignClass}`}>
      {eyebrow && <p className="nb-eyebrow">{eyebrow}</p>}
      <h1 className={`nb-h1 ${eyebrow ? "mt-3 sm:mt-4" : ""}`}>{title}</h1>
      {description && (
        <div className={`mt-5 sm:mt-6 nb-lead ${align === "center" ? "mx-auto" : ""}`}>
          {typeof description === "string" ? <p>{description}</p> : description}
        </div>
      )}
      {children && <div className="mt-8 sm:mt-10">{children}</div>}
    </header>
  );
}
