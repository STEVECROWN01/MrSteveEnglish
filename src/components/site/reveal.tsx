"use client";

import { type CSSProperties, type ElementType, type ReactNode } from "react";
import { useInViewOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Révélation au scroll (DA §13) : fondu + léger translateY depuis le bas,
 * 600ms, easing standard, déclenchée une seule fois à l'entrée du viewport.
 * prefers-reduced-motion : apparition directe (géré en CSS).
 *
 * TASK 71 (instruction propriétaire — sections vivantes et professionnelles) :
 * variantes directionnelles et rythmées, même langage motion que la
 * révélation d'origine (une seule fois à l'entrée, 600ms, easing DA) :
 * — "up"    : fondu + montée (comportement historique, par défaut) ;
 * — "left"  : arrivée depuis la gauche (contenu en colonne gauche) ;
 * — "right" : arrivée depuis la droite (visuel en colonne droite) ;
 * — "zoom"  : fondu + mise à l'échelle douce 0.94 → 1 (cartes, blocs) ;
 * — "pop"   : rebond léger overshoot (grands chiffres 01–06, stats) —
 *             le seul easing non standard, réservé aux petits éléments
 *             ponctuels pour rester premium.
 */
export type RevealVariant = "up" | "left" | "right" | "zoom" | "pop";

const VARIANT_CLASS: Record<RevealVariant, string> = {
  up: "reveal",
  left: "reveal-left",
  right: "reveal-right",
  zoom: "reveal-zoom",
  pop: "reveal-pop",
};

export function Reveal({
  children,
  className,
  delay = 0,
  variant = "up",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  /** Délai en ms — utilisé avec parcimonie (stagger maîtrisé). */
  delay?: number;
  /** Variante d'entrée (TASK 71) — voir le commentaire du composant. */
  variant?: RevealVariant;
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
      className={cn(VARIANT_CLASS[variant], inView && "is-visible", className)}
      style={style}
    >
      {children}
    </Component>
  );
}
