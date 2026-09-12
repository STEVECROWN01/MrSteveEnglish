"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useScrolled } from "@/lib/motion";
import { useHashRoute, useHashSection, type RouteId } from "@/lib/router";
import { Container } from "./layout-primitives";

/**
 * Navigation (instruction propriétaire : navigation complète, comme sur
 * un portfolio professionnel) : fixe, logo texte « Coach Stevens » à
 * gauche, liens à droite + CTA rouge vers le formulaire de contact.
 * Mobile : logo + bouton menu (hamburger) — standard portfolio pro.
 * Fond blanc translucide au scroll (blur 12px).
 * Sur l'accueil, le hero est désormais une image sombre plein cadre :
 * au sommet de la page la barre est transparente et le texte passe en
 * blanc (au-dessus de l'image) ; dès le scroll (ou menu ouvert), elle
 * redevient claire. Sur la page Contact (fond noir), la barre adopte
 * le fond translucide dès le départ pour garantir la lisibilité.
 * Le lien « Méthode » mène à la section Méthode intégrée à l'accueil
 * (#/?section=methode) — instruction propriétaire.
 */

const NAV_LINKS: { id: RouteId | "methode-section"; label: string; hash: string }[] = [
  { id: "methode-section", label: "Méthode", hash: "#/?section=methode" },
  { id: "a-propos", label: "À propos", hash: "#/a-propos" },
  { id: "resultats", label: "Résultats", hash: "#/resultats" },
  { id: "offres", label: "Offres", hash: "#/offres" },
  { id: "faq", label: "FAQ", hash: "#/faq" },
  { id: "contact", label: "Contact", hash: "#/contact" },
];

/** Liens du menu mobile — Accueil inclus. */
const MOBILE_LINKS: { id: RouteId | "methode-section"; label: string; hash: string }[] = [
  { id: "accueil", label: "Accueil", hash: "#/" },
  ...NAV_LINKS,
];

export function Header() {
  const route = useHashRoute();
  const section = useHashSection();
  const scrolled = useScrolled(8);
  const [menuOpen, setMenuOpen] = useState(false);
  const onDarkPage = route === "contact";

  // Au sommet de l'accueil, la barre flotte au-dessus de l'image sombre
  // du hero : texte blanc, fond transparent (l'image couvre tout le hero).
  const overDarkHero = route === "accueil" && !scrolled && !menuOpen;

  const solid = scrolled || onDarkPage || menuOpen;

  // Le lien « Méthode » est actif quand on visualise sa section sur l'accueil
  const methodeActive = route === "accueil" && section === "methode";

  // Ferme le menu mobile à la touche Escape (accessibilité)
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,color,box-shadow,border-color] duration-[240ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
        solid
          ? "border-b border-grey-line bg-white/85 backdrop-blur-[12px]"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <a
        href="#main-content"
        className={cn(
          "sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-10 focus:rounded-[8px] focus:px-4 focus:py-2",
          overDarkHero
            ? "focus:bg-white focus:text-black"
            : "focus:bg-black focus:text-white",
        )}
      >
        Aller au contenu
      </a>
      <Container>
        <div className="flex h-16 items-center justify-between gap-3 lg:h-[72px]">
          {/* Logo texte (gauche) — blanc au-dessus de l'image sombre du hero */}
          <a
            href="#/"
            className={cn(
              "font-display text-[1.25rem] leading-none font-medium tracking-tight transition-colors duration-[240ms] lg:text-[1.375rem]",
              overDarkHero ? "text-white" : "text-black",
            )}
            aria-label="Coach Stevens — retour à l'accueil"
          >
            Coach Stevens
          </a>

          {/* Liens desktop — toutes les pages (instruction propriétaire) */}
          <nav aria-label="Navigation principale" className="hidden md:block">
            <ul className="flex items-center gap-0.5 lg:gap-1">
              {NAV_LINKS.map((link) => {
                const active =
                  route === link.id ||
                  (link.id === "methode-section" && methodeActive);
                return (
                  <li key={link.id}>
                    <a
                      href={link.hash}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-[44px] items-center rounded-[8px] px-2.5 text-[0.9375rem] font-medium transition-colors duration-[240ms] lg:px-3",
                        active
                          ? overDarkHero
                            ? "text-white"
                            : "text-black"
                          : overDarkHero
                            ? "text-white/80 hover:text-white"
                            : "text-grey-mid hover:text-black",
                      )}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Droite : CTA formulaire + bouton menu (mobile) */}
          <div className="flex items-center gap-2 lg:gap-4">
            <a
              href="#/contact"
              className="btn btn-primary t-btn min-h-[44px] px-4 py-[11px] text-[0.9375rem] lg:px-5 lg:text-[1.125rem]"
            >
              Parlons-en
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu de navigation"}
              className={cn(
                "flex h-[44px] w-[44px] items-center justify-center rounded-[8px] transition-colors md:hidden",
                overDarkHero
                  ? "text-white hover:bg-white/15"
                  : "text-black hover:bg-grey-soft",
              )}
            >
              {menuOpen ? (
                /* Croix de fermeture */
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                  <path
                    d="M5 5 C 8.5 8.5, 13.5 13.5, 17 17 M17 5 C 13.5 8.5, 8.5 13.5, 5 17"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                /* Hamburger */
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                  <path
                    d="M4 7.5 C 8 7.3, 14 7.3, 18 7.5 M4 15 C 8 14.8, 14 14.8, 18 15"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* Panneau de navigation mobile */}
      <div
        id="mobile-nav"
        hidden={!menuOpen}
        className="border-t border-grey-line bg-white/95 backdrop-blur-[12px] md:hidden"
      >
        <Container className="py-4">
          <nav aria-label="Navigation mobile">
            <ul className="flex flex-col">
              {MOBILE_LINKS.map((link) => {
                const active =
                  route === link.id ||
                  (link.id === "methode-section" && methodeActive);
                return (
                  <li key={link.id}>
                    <a
                      href={link.hash}
                      onClick={() => setMenuOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-[48px] items-center rounded-[8px] px-3 text-[1rem] font-medium transition-colors",
                        active
                          ? "bg-grey-soft text-black"
                          : "text-grey-mid hover:bg-grey-soft hover:text-black",
                      )}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </Container>
      </div>
    </header>
  );
}
