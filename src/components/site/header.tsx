"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useScrolled } from "@/lib/motion";
import { useHashRoute, useHashSection, type RouteId } from "@/lib/router";
import { Container } from "./layout-primitives";

/**
 * Navigation (instruction propriétaire) : fixe. AU SOMMET de la page la
 * barre est SANS FOND — elle prend pour arrière-plan le haut de la page
 * (l'image sombre du hero sur l'accueil, le noir de la page Inscription ;
 * texte noir au-dessus des pages claires). Dès le scroll (ou menu ouvert),
 * elle devient noir pur #000000 + bordure white/10 (esthétique Task 13).
 * Logo « Stevens AKPOVI » à gauche, liens à droite + CTA rouge
 * « Découvrir le programme » vers la page Programme. Mobile : logo +
 * bouton menu (hamburger) — panneau déroulant noir.
 * Le lien « Méthode » mène à la section Méthode intégrée à l'accueil
 * (#/?section=methode). Le lien « FAQ » mène désormais à la section
 * « Questions fréquentes » de l'accueil (#/?section=faq) — la page FAQ
 * autonome a été supprimée (instruction propriétaire).
 */

const NAV_LINKS: { id: RouteId | "methode-section" | "faq-section"; label: string; hash: string }[] = [
  { id: "methode-section", label: "Méthode", hash: "#/?section=methode" },
  { id: "a-propos", label: "À propos", hash: "#/a-propos" },
  { id: "resultats", label: "Résultats", hash: "#/resultats" },
  { id: "programme", label: "Programme", hash: "#/programme" },
  { id: "faq-section", label: "FAQ", hash: "#/?section=faq" },
  { id: "contact", label: "Inscription", hash: "#/contact" },
];

/** Liens du menu mobile — Accueil inclus. */
const MOBILE_LINKS: { id: RouteId | "methode-section" | "faq-section"; label: string; hash: string }[] = [
  { id: "accueil", label: "Accueil", hash: "#/" },
  ...NAV_LINKS,
];

export function Header() {
  const route = useHashRoute();
  const section = useHashSection();
  const scrolled = useScrolled(8);
  const [menuOpen, setMenuOpen] = useState(false);

  // Pages dont le haut est sombre (hero image / fond noir) : texte blanc
  // quand la barre flotte sans fond. Les autres pages ont un haut clair :
  // texte noir, toujours lisible sans fond.
  const topIsDark = route === "accueil" || route === "contact";

  // Au sommet de la page, la barre est transparente (instruction
  // propriétaire) SAUF menu mobile ouvert (le panneau a besoin du fond).
  const floating = !scrolled && !menuOpen;

  // Texte blanc : barre solide (noire) OU sommet sombre. Texte noir :
  // barre flottante au-dessus d'une page claire.
  const light = !floating || topIsDark;

  // Le lien « Méthode » est actif quand on visualise sa section sur l'accueil
  const methodeActive = route === "accueil" && section === "methode";

  // Le lien « FAQ » est actif sur la section Questions fréquentes de
  // l'accueil (ou via un ancien lien #/faq — la page est supprimée)
  const faqActive =
    (route === "accueil" && section === "faq") || route === "faq";

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
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-[240ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
        floating
          ? "border-b border-transparent bg-transparent"
          : "border-b border-white/10 bg-[#000000]",
      )}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-10 focus:rounded-[8px] focus:px-4 focus:py-2 focus:bg-white focus:text-black"
      >
        Aller au contenu
      </a>
      <Container>
        <div className="flex h-16 items-center justify-between gap-3 lg:h-[72px]">
          {/* Logo texte (gauche) — blanc sur sommet sombre / barre noire,
              noir sur sommet clair */}
          <a
            href="#/"
            className={cn(
              "font-display text-[1.25rem] leading-none font-medium tracking-tight transition-colors duration-[240ms] lg:text-[1.375rem]",
              light ? "text-white" : "text-black",
            )}
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
                  (link.id === "methode-section" && methodeActive) ||
                  (link.id === "faq-section" && faqActive);
                return (
                  <li key={link.id}>
                    <a
                      href={link.hash}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-[44px] items-center rounded-[8px] px-2.5 text-[0.9375rem] font-medium transition-colors duration-[240ms] lg:px-3",
                        light
                          ? active
                            ? "text-white"
                            : "text-white/70 hover:text-white"
                          : active
                            ? "text-black"
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

          {/* Droite : CTA programme + bouton menu (mobile) */}
          <div className="flex items-center gap-2 lg:gap-4">
            <a
              href="#/programme"
              className="btn btn-primary t-btn min-h-[44px] px-4 py-[11px] text-[0.9375rem] lg:px-5 lg:text-[1.125rem]"
            >
              Découvrir le programme
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu de navigation"}
              className={cn(
                "btn-shine flex h-[44px] w-[44px] items-center justify-center rounded-[8px] transition-colors md:hidden",
                light
                  ? "text-white hover:bg-white/15"
                  : "btn-shine-dark text-black hover:bg-grey-soft",
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

      {/* Panneau de navigation mobile — noir pur (l'ouverture rend la
          barre solide, donc le panneau s'enchaîne sans couture) */}
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
                  (link.id === "methode-section" && methodeActive) ||
                  (link.id === "faq-section" && faqActive);
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
