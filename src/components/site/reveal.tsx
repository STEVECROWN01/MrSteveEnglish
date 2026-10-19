"use client";

import { type CSSProperties, type ElementType, type ReactNode } from "react";
import { useInView } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Révélation au scroll (DA §13) : fondu + léger translateY depuis le bas,
 * 600ms, easing standard.
 * TASK 77 (instruction propriétaire — « à chaque fois qu'on scroll down ou
 * scroll up, ces animations doivent se manifester ») : l'observateur est
 * désormais PERSISTANT (useInView) — la révélation se joue à CHAQUE entrée
 * dans le viewport, en descendant comme en remontant, et la sortie est
 * animée (transition posée sur l'état de base en CSS) : l'élément se
 * « dés-active » (retour fondu à l'état caché) dès qu'il quitte
 * complètement le viewport, puis se révèle à nouveau à son retour.
 * prefers-reduced-motion : apparition directe (géré en CSS).
 *
 * TASK 71 (sections vivantes et professionnelles) : variantes
 * directionnelles et rythmées, même langage motion que la révélation
 * d'origine (600ms, easing DA) :
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
  /* TASK 77 : observateur PERSISTANT — mêmes seuils d'entrée que la
     révélation historique (20 % visible, 8 % au-dessus du bas), mais sans
     disconnect : is-visible s'ajoute à CHAQUE entrée dans le viewport et se
     retire à la sortie complète → l'animation se rejoue en descendant ET en
     remontant (instruction propriétaire). */
  const [ref, inView] = useInView<HTMLElement>({
    threshold: 0.2,
    rootMargin: "0px 0px -8% 0px",
  });

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
