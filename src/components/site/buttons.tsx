"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { waLink } from "@/lib/site";

/**
 * Boutons (DA §7) :
 * — Primaire : fond Rouge #FF0000, texte blanc 18px/700, radius 8px,
 *   padding 16px/28px. Le SEUL endroit du site où le rouge apparaît.
 *   Un seul bouton primaire visible par écran, toujours.
 * — Secondaire : contour noir 1.5px, fond transparent, texte noir.
 */
export function WhatsAppButton({
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
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={cn("btn btn-primary t-btn", className)}
    >
      {children}
    </a>
  );
}

/** Construit le lien WhatsApp au plus près de l'usage (message pré-rempli). */
export function waHref(message?: string): string {
  return waLink(message);
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
