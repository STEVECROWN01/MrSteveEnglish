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
const BienvenuePage = dynamic(
  () => import("@/components/site/pages/bienvenue-page").then((m) => m.BienvenuePage),
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
    case "bienvenue": // page post-paiement (Task 28) — tunnel focalisé
      return <BienvenuePage />;
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

  /* Rechargement → HAUT de la page courante (instruction propriétaire
     Task 28) : quoi qu'il arrive, recharger la page ramène toujours en
     haut de LA PAGE OÙ L'ON ÉTAIT — le navigateur ne restaure plus
     l'ancienne position de scroll (history.scrollRestoration = manual,
     posé une fois au montage). Les deep-links ?section= (Méthode, FAQ)
     et l'alias #/faq conservent leur défilement automatique vers la
     section demandée — pas de flash du haut de page inutile. */
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    const q = window.location.hash.split("?")[1];
    const section = q ? new URLSearchParams(q).get("section") : null;
    if (!section && route !== "faq") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    }
    // Exécuté UNE seule fois au montage (rechargement inclus) — la
    // valeur de route au montage est celle de la page rechargée.
  }, []);

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

  /* Page BIENVENUE (Task 28 — instruction propriétaire) : tunnel
     post-paiement très focalisé — ni header ni footer global (aucun
     lien ni CTA secondaire : un seul parcours, compréhension →
     WhatsApp). Sur l'accueil, la carte « Le coût de l'inaction » vit
     dans la section finale AVANT le bouton « Je veux parler anglais
     avec confiance » — le footer la masque pour éviter le doublon. */
  const focused = route === "bienvenue";

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {focused ? null : <Header />}
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
      {focused ? (
        null
      ) : (
        <Footer hideCarte={route === "accueil"} />
      )}
    </div>
  );
}
