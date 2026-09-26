"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackPixel } from "@/lib/meta-pixel";

/**
 * TASK 59 — META PIXEL : PageView sur NAVIGATION INTERNE.
 *
 * Le site utilise les <Link> de Next.js (header, CTA, footer) : la
 * navigation entre pages se fait SANS rechargement complet — or le
 * code de base du pixel (layout.tsx) ne s'exécute qu'au chargement
 * d'une page. Sans ce composant, un visiteur qui arrive sur
 * l'accueil puis navigue vers /programme puis /contact ne
 * compterait qu'UN SEUL PageView.
 *
 * Ce composant (rendu dans le layout racine, aucune sortie visuelle)
 * déclenche un PageView à chaque changement de chemin. Le PREMIER
 * rendu est ignoré : le PageView de l'arrivée sur le site est déjà
 * couvert par le fbq('track','PageView') du code de base (sinon il
 * serait compté deux fois).
 */
export function MetaPixelPageView() {
  const pathname = usePathname();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    trackPixel("PageView");
  }, [pathname]);

  return null;
}
