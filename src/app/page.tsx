"use client";

import { useHashRoute, useRouteEffects, useSectionScroll } from "@/lib/router";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { HomePage } from "@/components/site/pages/home-page";
import { AProposPage } from "@/components/site/pages/a-propos-page";
import { ResultatsPage } from "@/components/site/pages/resultats-page";
import { OffresPage } from "@/components/site/pages/offres-page";
import { FaqPage } from "@/components/site/pages/faq-page";
import { ContactPage } from "@/components/site/pages/contact-page";

/**
 * Site Coach Stevens — pages routées par hash sur la route /. La méthode
 * vit désormais SUR la page d'accueil (instruction propriétaire) : le lien
 * « Méthode » y mène via #/?section=methode. Chaque page conserve son rôle
 * dans le parcours utilisateur. Tous les CTA mènent au formulaire de
 * contact (instruction propriétaire).
 * Le footer reste collé en bas de viewport quand le contenu est court
 * et est poussé naturellement quand il déborde.
 */

function renderPage(route: string) {
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
