"use client";

import { type CSSProperties, type ElementType, type ReactNode } from "react";
import { useInViewOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Révélation au scroll (DA §13) : fondu + léger translateY depuis le bas,
 * 600ms, easing standard, déclenchée une seule fois à l'entrée du viewport.
 * prefers-reduced-motion : apparition directe (géré en CSS).
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  /** Délai en ms — utilisé avec parcimonie (stagger maîtrisé). */
  delay?: number;
  as?: "div" | "section" | "article" | "li" | "span" | "p" | "h2" | "h3";
}) {
  const [ref, inView] = useInViewOnce<HTMLElement>();

  const style: CSSProperties | undefined =
    delay > 0
      ? { transitionDelay: `${delay}ms` }
      : undefined;

  /* Élément polymorphe :ElementType accepte un RefObject<HTMLElement>. */
  const Component = Tag as ElementType;

  return (
    <Component
      ref={ref}
      className={cn("reveal", inView && "is-visible", className)}
      style={style}
    >
      {children}
    </Component>
  );
}
