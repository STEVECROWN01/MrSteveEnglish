"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useHashRoute, useHashSection, type RouteId } from "@/lib/router";
import { Container } from "./layout-primitives";

/**
 * Navigation (instruction propriétaire) : fixe, fond noir pur #000000,
 * logo texte « Stevens AKPOVI » à gauche (blanc), liens à droite + CTA
 * rouge vers le formulaire de contact. Mobile : logo + bouton menu
 * (hamburger) — panneau déroulant noir.
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
  const [menuOpen, setMenuOpen] = useState(false);

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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#000000]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-10 focus:rounded-[8px] focus:px-4 focus:py-2 focus:bg-white focus:text-black"
      >
        Aller au contenu
      </a>
      <Container>
        <div className="flex h-16 items-center justify-between gap-3 lg:h-[72px]">
          {/* Logo texte (gauche) — blanc sur fond noir */}
          <a
            href="#/"
            className="font-display text-[1.25rem] leading-none font-medium tracking-tight text-white transition-colors duration-[240ms] lg:text-[1.375rem]"
            aria-label="Stevens AKPOVI — retour à l'accueil"
          >
            Stevens AKPOVI
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
                          ? "text-white"
                          : "text-white/70 hover:text-white",
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
                "text-white hover:bg-white/15",
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

      {/* Panneau de navigation mobile — même noir pur que la barre */}
      <div
        id="mobile-nav"
        hidden={!menuOpen}
        className="border-t border-white/10 bg-[#000000] md:hidden"
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
                          ? "bg-white/10 text-white"
                          : "text-white/70 hover:bg-white/10 hover:text-white",
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
