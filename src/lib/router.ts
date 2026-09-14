"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

/** Les pages du site — routées par hash sur la route /. La méthode et
 * la FAQ vivent désormais SUR l'accueil (instruction propriétaire) : les
 * liens de navigation « Méthode » et « FAQ » pointent vers
 * #/?section=methode et #/?section=faq.
 * « offres » et « faq » restent des clés valides : les anciens liens
 * partagés #/offres atterrissent sur la page Programme, et #/faq sur
 * l'accueil (défilement automatique vers la section Questions
 * fréquentes — géré dans app/page.tsx). */
export type RouteId =
  | "accueil"
  | "a-propos"
  | "resultats"
  | "programme"
  | "offres"
  | "faq"
  | "contact"
  | "bienvenue";

export const ROUTES: Record<RouteId, { hash: string; title: string }> = {
  accueil: { hash: "#/", title: "Stevens AKPOVI — Coach d'anglais" },
  "a-propos": { hash: "#/a-propos", title: "À propos — Stevens AKPOVI" },
  resultats: { hash: "#/resultats", title: "Résultats — Stevens AKPOVI" },
  programme: { hash: "#/programme", title: "Programme — Stevens AKPOVI" },
  offres: { hash: "#/programme", title: "Programme — Stevens AKPOVI" },
  faq: { hash: "#/faq", title: "Questions fréquentes — Stevens AKPOVI" },
  contact: { hash: "#/contact", title: "Inscription — Stevens AKPOVI" },
  bienvenue: { hash: "#/bienvenue", title: "Bienvenue — Stevens AKPOVI" },
};

/**
 * Normalise un hash ou une route en clé comparable : "#/a-propos" →
 * "a-propos", "#/" → "".
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
 * Section d'ancre demandée dans le hash : "#/?section=methode" →
 * "methode". Sert de cible intermédiaire aux liens de navigation qui
 * pointent vers une section d'une page (ici : la section Méthode
 * intégrée à l'accueil). Retourne null si absent.
 */
export function useHashSection(): string | null {
  const section = useSyncExternalStore(
    subscribeToHash,
    () => {
      const q = window.location.hash.split("?")[1];
      return q ? new URLSearchParams(q).get("section") : "";
    },
    () => "",
  );
  return section || null;
}

/**
 * Fait défiler la page vers la section demandée via ?section= dans le
 * hash (ex. "#/?section=methode"). Au premier chargement (deep-link),
 * un léger délai laisse le rendu et les polices se poser. Quand on
 * revient à l'accueil pur ("#/"), remonte en haut de page.
 */
export function useSectionScroll() {
  const hash = useSyncExternalStore(
    subscribeToHash,
    () => window.location.hash,
    () => "",
  );
  const section = hash.split("?")[1]
    ? (new URLSearchParams(hash.split("?")[1]).get("section") ?? "")
    : "";
  const hadSection = useRef(false);

  useEffect(() => {
    if (!section) {
      // Retour « Accueil » pur depuis une section : remonter en haut
      if (hadSection.current && normalizeHash(window.location.hash) === "") {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
      hadSection.current = false;
      return;
    }
    hadSection.current = true;
    const target = document.getElementById(section);
    if (!target) return;
    const t = window.setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
    return () => window.clearTimeout(t);
  }, [section]);
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

    // Changement de page réel : reset du scroll + focus a11y — sauf si
    // une section est demandée (?section=…) : le défilement vers la
    // section est alors géré par useSectionScroll (pas de flash du haut
    // de page avant la descente).
    const q = window.location.hash.split("?")[1];
    const sectionTarget = q
      ? new URLSearchParams(q).get("section")
      : null;
    if (!sectionTarget) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    }
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
