import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
  narrow?: boolean;
};

export function Container({
  children,
  className = "",
  as: Tag = "div",
  narrow = false,
}: ContainerProps) {
  return (
    <Tag
      className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${narrow ? "max-w-3xl" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}
