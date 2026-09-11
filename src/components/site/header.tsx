"use client";

import { cn } from "@/lib/utils";
import { useScrolled } from "@/lib/motion";
import { useHashRoute, type RouteId } from "@/lib/router";
import { WA_MESSAGES, waLink } from "@/lib/site";
import { Container } from "./layout-primitives";

/**
 * Navigation (DA §7 + §15) : fixe, fond blanc translucide au scroll
 * (blur 12px), logo texte à gauche, un seul lien CTA WhatsApp à droite
 * en bouton primaire rouge, 4 liens maximum.
 * Mobile : logo + lien FAQ + CTA — pas de menu hamburger.
 * Sur la page Contact (fond Bleu Profond), la barre adopte le fond
 * translucide dès le départ pour garantir la lisibilité.
 */

const NAV_LINKS: { id: RouteId; label: string; hash: string }[] = [
  { id: "methode", label: "Méthode", hash: "#/methode" },
  { id: "a-propos", label: "À propos", hash: "#/a-propos" },
  { id: "resultats", label: "Résultats", hash: "#/resultats" },
  { id: "offres", label: "Offres", hash: "#/offres" },
];

export function Header() {
  const route = useHashRoute();
  const scrolled = useScrolled(8);
  const onDarkPage = route === "contact";

  const solid = scrolled || onDarkPage;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-[240ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
        solid
          ? "border-b border-grey-line bg-white/85 backdrop-blur-[12px]"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-10 focus:rounded-[8px] focus:bg-black focus:px-4 focus:py-2 focus:text-white"
      >
        Aller au contenu
      </a>
      <Container>
        <div className="flex h-16 items-center justify-between gap-3 lg:h-[72px]">
          {/* Logo texte (gauche) */}
          <a
            href="#/"
            className="font-display text-[1.25rem] leading-none font-medium tracking-tight text-black lg:text-[1.375rem]"
            aria-label="Stevens Akpovi — retour à l'accueil"
          >
            Stevens Akpovi
          </a>

          {/* Liens desktop — 4 maximum (DA §7) */}
          <nav aria-label="Navigation principale" className="hidden md:block">
            <ul className="flex items-center gap-1 lg:gap-2">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.hash}
                    aria-current={route === link.id ? "page" : undefined}
                    className={cn(
                      "flex min-h-[44px] items-center rounded-[8px] px-3 text-[0.9375rem] font-medium transition-colors duration-[240ms]",
                      route === link.id
                        ? "text-black"
                        : "text-grey-mid hover:text-black",
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Droite : lien FAQ (mobile) + CTA WhatsApp unique */}
          <div className="flex items-center gap-2 lg:gap-4">
            <a
              href="#/faq"
              aria-current={route === "faq" ? "page" : undefined}
              className={cn(
                "flex min-h-[44px] items-center px-2 text-[0.9375rem] font-medium transition-colors duration-[240ms] md:hidden",
                route === "faq" ? "text-black" : "text-grey-mid",
              )}
            >
              FAQ
            </a>
            <a
              href={waLink(WA_MESSAGES.hero)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary t-btn min-h-[44px] px-4 py-[11px] text-[0.9375rem] lg:px-5 lg:text-[1.125rem]"
            >
              Parler à Stevens
            </a>
          </div>
        </div>
      </Container>
    </header>
  );
}
