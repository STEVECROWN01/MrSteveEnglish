"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Boutons (DA §7, adaptés instruction propriétaire) :
 * — CtaButton (primaire) : fond Rouge #FF0000, texte blanc 18px/700,
 *   radius 8px, padding 16px/28px. Mène TOUJOURS à la page Contact
 *   (formulaire) — jamais directement à WhatsApp.
 * — SecondaryLink : contour noir 1.5px, fond transparent, texte noir.
 *   Navigation interne entre les pages du site.
 * Task 48 (vraies pages) : les href internes (commençant par « / »)
 * sont rendus par <Link> Next.js — navigation douce + préchargement
 * automatique ; les href externes (http…) restent des <a> classiques
 * dans un nouvel onglet.
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
  const cls = cn("btn btn-primary t-btn", className);
  if (href.startsWith("/")) {
    return (
      <Link href={href} aria-label={ariaLabel} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={cls}
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
  const cls = cn("btn btn-secondary t-btn", className);
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cls}
    >
      {children}
    </a>
  );
}
