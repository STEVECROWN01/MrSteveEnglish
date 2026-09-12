"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Boutons (DA §7, adaptés instruction propriétaire) :
 * — CtaButton (primaire) : fond Rouge #FF0000, texte blanc 18px/700,
 *   radius 8px, padding 16px/28px. Mène TOUJOURS à la page Contact
 *   (formulaire) — jamais directement à WhatsApp.
 * — SecondaryLink : contour noir 1.5px, fond transparent, texte noir.
 *   Navigation interne entre les pages du site.
 */
export function CtaButton({
  href,
  children,
  className,
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className={cn("btn btn-primary t-btn", className)}
    >
      {children}
    </a>
  );
}

export function SecondaryLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a href={href} className={cn("btn btn-secondary t-btn", className)}>
      {children}
    </a>
  );
}
