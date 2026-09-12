"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

/** Les 7 pages du site — routées par hash sur la route /. */
export type RouteId =
  | "accueil"
  | "methode"
  | "a-propos"
  | "resultats"
  | "offres"
  | "faq"
  | "contact";

export const ROUTES: Record<RouteId, { hash: string; title: string }> = {
  accueil: { hash: "#/", title: "Coach Stevens — Coach d'anglais" },
  methode: { hash: "#/methode", title: "La méthode — Coach Stevens" },
  "a-propos": { hash: "#/a-propos", title: "À propos — Stevens Akpovi" },
  resultats: { hash: "#/resultats", title: "Résultats — Coach Stevens" },
  offres: { hash: "#/offres", title: "Offres — Coach Stevens" },
  faq: { hash: "#/faq", title: "FAQ — Coach Stevens" },
  contact: { hash: "#/contact", title: "Contact — Coach Stevens" },
};

/**
 * Normalise un hash ou une route en clé comparable : "#/methode" → "methode",
 * "#/" → "".
 * La query éventuelle (ex. "#/contact?offre=3mois") est ignorée pour la
 * résolution de la route mais reste disponible pour la page (lecture via
 * `hashQuery`).
 */
function normalizeHash(hash: string): string {
  return hash
    .replace(/^#\/?/, "")
    .split("?")[0]
    .replace(/\/+$/, "");
}

/**
 * Lit la query du hash : "#/contact?offre=3mois" → "3mois".
 * Retourne null si le paramètre est absent.
 */
export function hashQuery(name: string): string | null {
  if (typeof window === "undefined") return null;
  const q = window.location.hash.split("?")[1];
  if (!q) return null;
  const params = new URLSearchParams(q);
  return params.get(name);
}

export function parseHash(hash: string): RouteId {
  const key = normalizeHash(hash);
  const found = (Object.keys(ROUTES) as RouteId[]).find(
    (id) => normalizeHash(ROUTES[id].hash) === key,
  );
  return found ?? "accueil";
}

/** Abonnement au hash (useSyncExternalStore). */
function subscribeToHash(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

/**
 * Route courante — via useSyncExternalStore : le serveur rend toujours
 * « accueil » (getServerSnapshot), le client se synchronise sur le hash
 * réel dès l'hydratation. Aucun mismatch d'hydratation, même en deep-link
 * direct (ex. partage du lien .../#/contact).
 */
export function useHashRoute(): RouteId {
  return useSyncExternalStore(
    subscribeToHash,
    () => parseHash(window.location.hash),
    () => "accueil" as RouteId,
  );
}

/**
 * Effets de navigation, à appeler une seule fois au niveau de la page :
 * — titre du document synchronisé sur la route ;
 * — au CHANGEMENT de page uniquement : scroll remonté + focus déplacé
 *   sur le contenu (accessibilité navigation clavier).
 * Remarque : un changement de hash qui ne change PAS de page (ancre
 * interne « #contact » du sticky, query ?offre=…) ne remonte PAS en
 * haut — le navigateur gère le scroll vers l'ancre.
 * Note : aucune réécriture du hash ici — écraser l'URL pendant
 * l'hydratation (serveur « accueil » vs deep-link « #/contact »)
 * casserait le partage de liens directs.
 */
export function useRouteEffects(route: RouteId) {
  const isFirstRun = useRef(true);

  useEffect(() => {
    document.title = ROUTES[route].title;

    // Garde-fou deep-link : pendant l'hydratation, React/Next peuvent
    // restaurer le <title> SSR statique plusieurs ticks après le mount.
    // Pendant une courte fenêtre, toute écrasement est immédiatement
    // corrigé — ensuite l'observateur se retire.
    const expected = ROUTES[route].title;
    const titleEl = document.querySelector("title");
    let observer: MutationObserver | null = null;
    if (titleEl) {
      observer = new MutationObserver(() => {
        if (document.title !== expected) {
          document.title = expected;
        }
      });
      observer.observe(titleEl, {
        childList: true,
        characterData: true,
        subtree: true,
      });
    }
    const stop = window.setTimeout(() => observer?.disconnect(), 1500);

    if (isFirstRun.current) {
      isFirstRun.current = false;
      return () => {
        observer?.disconnect();
        window.clearTimeout(stop);
      };
    }

    // Changement de page réel : reset du scroll + focus a11y
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    requestAnimationFrame(() => {
      const main = document.getElementById("main-content");
      if (main) {
        main.focus({ preventScroll: true });
      }
    });
    return () => {
      observer?.disconnect();
      window.clearTimeout(stop);
    };
  }, [route]);
}
