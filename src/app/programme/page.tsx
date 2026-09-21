import type { Metadata } from "next";
import { ProgrammePage } from "@/components/site/pages/programme-page";
import { PageShell } from "@/components/site/page-shell";

/**
 * PROGRAMME — page réelle indexable (Task 48 — SEO) : /programme.
 * Cible les requêtes « coaching d'anglais en ligne », « cours d'anglais
 * personnalisés », « apprendre à parler anglais Afrique francophone ».
 * L'ancienne adresse …/#/programme (et l'alias #/offres) est redirigée
 * automatiquement (script inline layout.tsx + /offres serveur).
 */
export const metadata: Metadata = {
  title: "Programme de coaching d'anglais — 03 mois | Stevens AKPOVI",
  description:
    "03 mois de coaching d'anglais personnalisé en ligne : trois séances de 1h30 par semaine, speaking, prononciation, vocabulaire et confiance. Certificat de fin de programme. Prix de lancement 70 000 FCFA — paiement unique. En ligne partout en Afrique francophone.",
  alternates: {
    canonical: "/programme",
  },
  openGraph: {
    title:
      "Programme « De Comprendre à Parler™ » — 03 mois de coaching d'anglais",
    description:
      "Trois séances de 1h30 par semaine pendant 03 mois. Speaking, prononciation, confiance. Certificat de fin de programme. Prix de lancement : 70 000 FCFA, paiement unique.",
    type: "website",
    locale: "fr_FR",
    siteName: "Stevens AKPOVI",
    url: "/programme",
    images: [
      {
        url: "/assets/OG-SOCIAL.png",
        width: 1200,
        height: 630,
        alt:
          "Programme « De Comprendre à Parler™ » — 03 mois de coaching d'anglais personnalisé en ligne.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Programme « De Comprendre à Parler™ » — 03 mois de coaching d'anglais",
    description:
      "Trois séances de 1h30 par semaine pendant 03 mois. Certificat de fin de programme. Prix de lancement : 70 000 FCFA, paiement unique.",
  },
};

export default function Page() {
  return (
    <PageShell>
      <ProgrammePage />
    </PageShell>
  );
}
