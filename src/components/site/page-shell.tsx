"use client";

import type { ReactNode } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { usePageEffects, useSectionScroll } from "@/lib/router";

/**
 * Coquille commune des pages (Task 48 — routage par chemins réels) :
 * chaque route (app/<route>/page.tsx) rend la même structure que l'ancienne
 * SPA — header fixe + contenu + footer collé en bas de viewport.
 *
 * La page BIENVENUE (tunnel post-paiement, instruction propriétaire
 * Task 28) reste FOCALISÉE : ni header ni footer — un seul parcours,
 * compréhension → WhatsApp.
 *
 * Effets conservés de l'ancienne page unique : remontée en haut au
 * rechargement (scrollRestoration manual), focus a11y sur le contenu
 * après navigation, défilement vers les sections ?section= de l'accueil
 * (Méthode, FAQ). La transition « page-enter » (fondu + montée 240 ms)
 * se rejoue à chaque montage de page — identique à l'ancien comportement
 * à changement de hash.
 */
export function PageShell({
  children,
  /** Sur l'accueil : la carte « Le coût de l'inaction » vit dans la
   *  section finale — le footer la masque pour éviter le doublon. */
  hideCarte = false,
  /** Page focalisée (bienvenue) : ni header ni footer. */
  focused = false,
}: {
  children: ReactNode;
  hideCarte?: boolean;
  focused?: boolean;
}) {
  useSectionScroll();
  usePageEffects();

  if (focused) {
    return (
      <div className="app-shell flex min-h-screen flex-col bg-white">
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 focus:outline-none"
        >
          <div className="page-enter">{children}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell flex min-h-screen flex-col bg-white">
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 focus:outline-none"
      >
        {/* Transition entre pages : fondu + montée 240ms (langage motion DA §13) */}
        <div className="page-enter">{children}</div>
      </main>
      <Footer hideCarte={hideCarte} />
    </div>
  );
}
