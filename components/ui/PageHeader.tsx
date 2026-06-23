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
      <h1 className={`nb-h1 ${eyebrow ? "mt-4" : ""} text-balance`}>{title}</h1>
      {description && (
        <div className={`mt-6 nb-lead text-balance ${typeof description === "string" ? "" : ""}`}>
          {typeof description === "string" ? <p>{description}</p> : description}
        </div>
      )}
      {children && <div className="mt-10">{children}</div>}
    </header>
  );
}
