"use client";

import { useEffect, useState } from "react";

/** Les 7 pages du site (COPYWRITING.md) — routées par hash sur la route /. */
export type RouteId =
  | "accueil"
  | "methode"
  | "a-propos"
  | "resultats"
  | "offres"
  | "faq"
  | "contact";

export const ROUTES: Record<RouteId, { hash: string; title: string }> = {
  accueil: { hash: "#/", title: "Stevens Akpovi — Coach d'anglais" },
  methode: { hash: "#/methode", title: "La méthode — Stevens Akpovi" },
  "a-propos": { hash: "#/a-propos", title: "À propos — Stevens Akpovi" },
  resultats: { hash: "#/resultats", title: "Résultats — Stevens Akpovi" },
  offres: { hash: "#/offres", title: "Offres — Stevens Akpovi" },
  faq: { hash: "#/faq", title: "FAQ — Stevens Akpovi" },
  contact: { hash: "#/contact", title: "Contact — Stevens Akpovi" },
};

/** Normalise un hash ou une route en clé comparable : "#/methode" → "methode", "#/" → "". */
function normalizeHash(hash: string): string {
  return hash.replace(/^#\/?/, "").replace(/\/+$/, "");
}

export function parseHash(hash: string): RouteId {
  const key = normalizeHash(hash);
  const found = (Object.keys(ROUTES) as RouteId[]).find(
    (id) => normalizeHash(ROUTES[id].hash) === key,
  );
  return found ?? "accueil";
}

/**
 * Hook de routage par hash — permet les 7 pages sur la route / unique.
 * Au changement : titre du document mis à jour, scroll remonté,
 * focus déplacé sur le contenu (accessibilité navigation clavier).
 */
export function useHashRoute(): RouteId {
  const [route, setRoute] = useState<RouteId>(() =>
    typeof window === "undefined" ? "accueil" : parseHash(window.location.hash),
  );

  useEffect(() => {
    const onHashChange = () => {
      const next = parseHash(window.location.hash);
      setRoute(next);
      document.title = ROUTES[next].title;
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      // Accessibilité : le focus suit la navigation pour les lecteurs d'écran
      requestAnimationFrame(() => {
        const main = document.getElementById("main-content");
        if (main) {
          main.focus({ preventScroll: true });
        }
      });
    };

    // Normalise un hash inconnu dès le premier rendu côté client
    const initial = parseHash(window.location.hash);
    if (window.location.hash !== ROUTES[initial].hash) {
      window.history.replaceState(null, "", ROUTES[initial].hash);
    }
    document.title = ROUTES[initial].title;

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return route;
}
