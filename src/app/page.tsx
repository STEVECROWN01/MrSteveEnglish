"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useHashRoute, useRouteEffects, useSectionScroll, type RouteId } from "@/lib/router";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { HomePage } from "@/components/site/pages/home-page";

/**
 * Site Stevens AKPOVI — pages routées par hash sur la route /. La méthode
 * vit désormais SUR la page d'accueil (instruction propriétaire) : le lien
 * « Méthode » y mène via #/?section=methode. Chaque page conserve son rôle
 * dans le parcours utilisateur. Tous les CTA mènent au formulaire de
 * contact (instruction propriétaire).
 * Le footer reste collé en bas de viewport quand le contenu est court
 * et est poussé naturellement quand il déborde.
 *
 * PERF (instruction propriétaire : site lent, boutons lents à diriger) :
 * les 5 pages secondaires sont code-split — le bundle initial n'embarque
 * que l'accueil, l'hydratation est plus rapide et TOUT le site répond
 * plus tôt (les <a href="#/…"> deviennent fonctionnels dès que React est
 * hydraté). Les chunks sont ensuite PRÉCHAUFFÉS pendant l'inactivité du
 * navigateur : la navigation reste instantanée, y compris à la première
 * interaction. La scène 3D (three.js, le chunk le plus lourd) est
 * préchauffée en dernier.
 */

const PageLoading = () => <div className="min-h-[60svh]" aria-hidden="true" />;

const AProposPage = dynamic(
  () => import("@/components/site/pages/a-propos-page").then((m) => m.AProposPage),
  { ssr: false, loading: PageLoading },
);
const ResultatsPage = dynamic(
  () => import("@/components/site/pages/resultats-page").then((m) => m.ResultatsPage),
  { ssr: false, loading: PageLoading },
);
const OffresPage = dynamic(
  () => import("@/components/site/pages/offres-page").then((m) => m.OffresPage),
  { ssr: false, loading: PageLoading },
);
const FaqPage = dynamic(
  () => import("@/components/site/pages/faq-page").then((m) => m.FaqPage),
  { ssr: false, loading: PageLoading },
);
const ContactPage = dynamic(
  () => import("@/components/site/pages/contact-page").then((m) => m.ContactPage),
  { ssr: false, loading: PageLoading },
);

function renderPage(route: RouteId) {
  switch (route) {
    case "a-propos":
      return <AProposPage />;
    case "resultats":
      return <ResultatsPage />;
    case "offres":
      return <OffresPage />;
    case "faq":
      return <FaqPage />;
    case "contact":
      return <ContactPage />;
    default:
      return <HomePage />;
  }
}

export default function Page() {
  const route = useHashRoute();
  useRouteEffects(route);
  useSectionScroll();

  /* Préchauffage à l'inactivité (idle) : les 5 pages secondaires (~35 Ko
     gz au total) sont chargées pendant le repos du navigateur — la
     navigation reste instantanée, y compris à la première interaction,
     sans jamais retarder le chargement initial. La scène 3D (three.js,
     ~210 Ko gz) n'est volontairement PAS préchauffée : elle ne se charge
     qu'à l'approche réelle de sa section (données mobiles économisées).
     requestIdleCallback absent (Safari) : repli setTimeout. */
  useEffect(() => {
    const warm = () => {
      void import("@/components/site/pages/a-propos-page");
      void import("@/components/site/pages/resultats-page");
      void import("@/components/site/pages/offres-page");
      void import("@/components/site/pages/faq-page");
      void import("@/components/site/pages/contact-page");
    };
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(warm, { timeout: 4000 });
      return () => cancelIdleCallback(id);
    }
    const t = window.setTimeout(warm, 2500);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 focus:outline-none"
      >
        {/* Transition entre pages : fondu + montée 240ms (langage motion DA §13) */}
        <div key={route} className="page-enter">
          {renderPage(route)}
        </div>
      </main>
      <Footer />
    </div>
  );
}
