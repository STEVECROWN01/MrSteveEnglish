"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

/**
 * ROUTAGE PAR CHEMINS RÉELS (Task 48 — SEO) : le site possédait une
 * seule URL (SPA hash-routée #/a-propos, #/programme…), invisible pour
 * Google — les fragments #/… ne sont JAMAIS envoyés au serveur et le
 * crawler ne voyait qu'une page. Chaque page vit désormais à sa propre
 * adresse : /a-propos, /resultats, /programme, /contact, /bienvenue —
 * pré-rendues en HTML statique par Next.js, donc INDEXABLES, avec
 * titre/description/openGraph propres à chaque route (fichiers
 * app/<route>/page.tsx).
 *
 * COMPATIBILITÉ ANCRE ANCiens LIENS (critique) : des centaines de liens
 * WhatsApp/partages pointent vers …/#/programme, …/#/bienvenue (URL de
 * retour configurée dans le système de paiement du propriétaire !),
 * …/#/faq… Un script inline dans layout.tsx, exécuté AVANT le premier
 * rendu, traduit ces hashs en chemins réels (location.replace) — les
 * anciens liens continuent de fonctionner, indéfiniment. Les alias
 * historiques sont conservés : /offres → /programme (redirection
 * serveur), /faq → /?section=faq (la FAQ vit sur l'accueil).
 *
 * Les sections de l'accueil (Méthode, FAQ) utilisent un vrai paramètre
 * de requête : /?section=methode — lisible par useSectionParam() aussi
 * bien au chargement qu'après une navigation douce (re-render App
 * Router) ou un popstate.
 */
export type RouteId =
  | "accueil"
  | "a-propos"
  | "resultats"
  | "programme"
  | "offres"
  | "faq"
  | "contact"
  | "bienvenue";

/** Chemin réel de chaque route (title conservé pour référence — le
 *  <title> vient désormais des métadonnées serveur de chaque page). */
export const ROUTES: Record<RouteId, { path: string; title: string }> = {
  accueil: { path: "/", title: "Coach d'anglais en ligne pour francophones — Stevens AKPOVI" },
  "a-propos": { path: "/a-propos", title: "À propos de Stevens AKPOVI — Coach d'anglais" },
  resultats: { path: "/resultats", title: "Résultats et témoignages — Coaching d'anglais" },
  programme: { path: "/programme", title: "Programme de coaching d'anglais — 03 mois" },
  offres: { path: "/programme", title: "Programme de coaching d'anglais — 03 mois" },
  faq: { path: "/", title: "Questions fréquentes — Stevens AKPOVI" },
  contact: { path: "/contact", title: "Inscription au programme de coaching d'anglais" },
  bienvenue: { path: "/bienvenue", title: "Bienvenue — Stevens AKPOVI" },
};

/**
 * Normalise un chemin en clé de route : "/a-propos" → "a-propos",
 * "/" → "accueil", "/offres" → "offres" (alias → programme au rendu).
 * Les chemins inconnus retombent sur l'accueil (comportement 404 doux
 * volontaire du site monopage d'origine).
 */
export function parsePath(pathname: string): RouteId {
  const key = (pathname || "/").split("?")[0].replace(/\/+$/, "") || "/";
  const found = (Object.keys(ROUTES) as RouteId[]).find(
    (id) => ROUTES[id].path === key,
  );
  if (found) return found === "offres" ? "programme" : found;
  return "accueil";
}

/** Route courante — chemin réel via usePathname (navigation douce App
 *  Router incluse). L'alias « offres » est résolu vers « programme ». */
export function usePathRoute(): RouteId {
  return parsePath(usePathname() ?? "/");
}

/* — Paramètre ?section= de l'accueil (Méthode, FAQ) — */

function subscribeToUrl(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener("hashchange", callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener("hashchange", callback);
  };
}

function sectionSnapshot(): string {
  return new URLSearchParams(window.location.search).get("section") || "";
}

/**
 * Section demandée : "/?section=methode" → "methode" (null si absent).
 * Lecture par useSyncExternalStore — la valeur est relue à chaque
 * rendu (les navigations douces App Router re-rendent la page, y
 * compris à changement de query sur la même route) et à chaque
 * popstate/hashchange (bouton précédent).
 */
export function useSectionParam(): string | null {
  const v = useSyncExternalStore(subscribeToUrl, sectionSnapshot, () => "");
  return v || null;
}

/**
 * Fait défiler la page vers la section demandée via ?section= dans
 * l'URL (ex. "/?section=methode"). Au premier chargement (deep-link),
 * un léger délai laisse le rendu et les polices se poser. Quand on
 * revient à l'accueil pur ("/"), remonte en haut de page.
 */
export function useSectionScroll() {
  const section = useSectionParam();
  const pathname = usePathname();
  const hadSection = useRef(false);

  useEffect(() => {
    if (!section) {
      // Retour « Accueil » pur depuis une section : remonter en haut
      if (hadSection.current && pathname === "/") {
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
  }, [section, pathname]);
}

/* — Effets de page (scroll + focus accessibilité) — */

/** Compteur de montées de page (module) : la toute première (chargement
 *  initial du site) ne déplace PAS le focus — seules les navigations
 *  ultérieures (montée d'une nouvelle page) focalisent le contenu. */
let pageMountCount = 0;

/**
 * Effets communs à chaque page, à appeler une seule fois par page :
 * — history.scrollRestoration = "manual" : un rechargement ramène
 *   TOUJOURS en haut de la page courante (instruction propriétaire
 *   Task 28 — le navigateur ne restaure plus l'ancienne position) ;
 * — au montage : haut de page instantané SAUF si une ?section= est
 *   demandée (le défilement vers la section est géré par
 *   useSectionScroll) ;
 * — navigations suivantes : focus clavier sur le contenu principal
 *   (accessibilité navigation clavier, comme l'ancien useRouteEffects).
 */
export function usePageEffects() {
  const pathname = usePathname();
  const section = useSectionParam();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (!section) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    }
    if (pageMountCount >= 2) {
      requestAnimationFrame(() => {
        document
          .getElementById("main-content")
          ?.focus({ preventScroll: true });
      });
    }
    pageMountCount += 1;
    // Exécuté par montage de page (navigation douce incluse).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
}
