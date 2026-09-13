"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useHashRoute, useRouteEffects, useSectionScroll, type RouteId } from "@/lib/router";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { HomePage } from "@/components/site/pages/home-page";

/**
 * Site Stevens AKPOVI — pages routées par hash sur la route /. La méthode
 * et la FAQ vivent désormais SUR la page d'accueil (instruction
 * propriétaire) : les liens « Méthode » et « FAQ » y mènent via
 * #/?section=methode et #/?section=faq. La page FAQ autonome a été
 * SUPPRIMÉE : la clé de route « faq » est conservée comme alias de
 * l'accueil — les anciens liens partagés #/faq atterrissent sur
 * l'accueil, avec défilement automatique vers la section « Questions
 * fréquentes ». Tous les CTA mènent au formulaire de contact
 * (instruction propriétaire). Le footer reste collé en bas de viewport
 * quand le contenu est court.
 *
 * PERF (instruction propriétaire : site lent, boutons lents à diriger) :
 * les pages secondaires sont code-split — le bundle initial n'embarque
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
const ProgrammePage = dynamic(
  () => import("@/components/site/pages/programme-page").then((m) => m.ProgrammePage),
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
    case "programme":
    case "offres": // anciens liens partagés #/offres
      return <ProgrammePage />;
    case "faq": // anciens liens #/faq → FAQ vit désormais sur l'accueil
      return <HomePage />;
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

  /* Anciens liens partagés #/faq : la page FAQ est supprimée, la route
     « faq » rend l'accueil — on défile alors vers la section « Questions
     fréquentes » (id="faq"). Le léger délai laisse le rendu se poser
     après le reset de scroll du changement de page. */
  useEffect(() => {
    if (route !== "faq") return;
    const t = window.setTimeout(() => {
      document
        .getElementById("faq")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 250);
    return () => window.clearTimeout(t);
  }, [route]);

  /* Préchauffage à l'inactivité (idle) : les pages secondaires (~30 Ko
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
      void import("@/components/site/pages/programme-page");
      void import("@/components/site/pages/contact-page");
    };
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(warm, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
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
