import type { Metadata } from "next";
import { HomePage } from "@/components/site/pages/home-page";
import { PageShell } from "@/components/site/page-shell";

/**
 * ACCUEIL (Task 48 — SEO, vraies pages Google) : le site était une SPA
 * hash-routée (une seule URL pour tout le contenu) — Google n'indexait
 * que cette page et ne voyait ni le programme, ni les résultats, ni le
 * formulaire. Chaque page vit désormais à sa propre adresse
 * (app/a-propos, app/programme, app/resultats, app/contact…) avec son
 * HTML statique pré-rendu, son titre, sa description et ses balises
 * Open Graph.
 *
 * L'accueil porte la section Méthode, la FAQ, les mots-clés et la
 * conversion principale ; les anciens liens partagés …/#/… sont
 * traduits par le script inline de layout.tsx.
 *
 * PERF (conservée) : chaque route est code-split automatiquement par
 * Next.js — le bundle initial de l'accueil n'embarque plus les pages
 * secondaires, l'hydratation reste rapide, et les <Link> de navigation
 * préchargent la page cible (navigation douce instantanée).
 */
export const metadata: Metadata = {
  title: "Coach d'anglais en ligne pour francophones — Stevens AKPOVI",
  description:
    "Programme « De Comprendre à Parler » : 03 mois de coaching d'anglais personnalisé en ligne pour les francophones d'Afrique et d'ailleurs. Speaking, prononciation, confiance — 70 000 FCFA, paiement unique.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Stevens AKPOVI — Coach d'anglais en ligne",
    description:
      "03 mois pour transformer ton anglais que tu comprends en anglais que tu oses vraiment parler. Coaching personnalisé en ligne, 70 000 FCFA, paiement unique.",
    type: "website",
    locale: "fr_FR",
    siteName: "Stevens AKPOVI",
    url: "/",
    images: [
      {
        url: "/assets/OG-SOCIAL.png",
        width: 1200,
        height: 630,
        alt:
          "03 mois pour transformer ton anglais que tu comprends en anglais que tu oses vraiment parler.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stevens AKPOVI — Coach d'anglais en ligne",
    description:
      "03 mois pour transformer ton anglais que tu comprends en anglais que tu oses vraiment parler.",
  },
};

export default function Page() {
  return (
    <PageShell hideCarte>
      <HomePage />
    </PageShell>
  );
}
