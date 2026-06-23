import type { ReactNode } from "react";
import { Container } from "./Container";

type SectionProps = {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
  /** default | hero | band (subtle background) | tight */
  variant?: "default" | "hero" | "band" | "tight";
  narrow?: boolean;
};

const variantClasses: Record<NonNullable<SectionProps["variant"]>, string> = {
  default: "nb-section",
  hero: "nb-section-hero",
  band: "nb-section-band",
  tight: "nb-section-tight",
};

export function Section({
  children,
  className = "",
  containerClassName = "",
  id,
  variant = "default",
  narrow = false,
}: SectionProps) {
  return (
    <section id={id} className={`${variantClasses[variant]} ${className}`}>
      <Container className={containerClassName} narrow={narrow}>
        {children}
      </Container>
    </section>
  );
}
