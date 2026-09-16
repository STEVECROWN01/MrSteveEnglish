import type { Metadata } from "next";
import { ResultatsPage } from "@/components/site/pages/resultats-page";
import { PageShell } from "@/components/site/page-shell";

/**
 * RÉSULTATS — page réelle indexable (Task 48 — SEO) : /resultats.
 * Témoignages et parcours d'élèves : contenu précieux pour Google
 * (preuve sociale) et pour les requêtes « témoignages coaching anglais ».
 */
export const metadata: Metadata = {
  title: "Résultats et témoignages — Coaching d'anglais | Stevens AKPOVI",
  description:
    "Découvrez les résultats obtenus par les élèves accompagnés par Stevens AKPOVI : témoignages, progression et parcours de francophones qui parlent désormais anglais avec confiance.",
  alternates: {
    canonical: "/resultats",
  },
  openGraph: {
    title: "Résultats et témoignages — Coaching d'anglais | Stevens AKPOVI",
    description:
      "Des francophones comme vous, qui comprenaient l'anglais… et qui le parlent désormais avec confiance.",
    type: "website",
    locale: "fr_FR",
    siteName: "Stevens AKPOVI",
    url: "/resultats",
    images: [
      {
        url: "/assets/OG-SOCIAL.png",
        width: 1200,
        height: 630,
        alt:
          "Résultats et témoignages d'élèves accompagnés par Stevens AKPOVI, coach d'anglais en ligne.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Résultats et témoignages — Coaching d'anglais | Stevens AKPOVI",
    description:
      "Des francophones comme vous, qui comprenaient l'anglais… et qui le parlent désormais avec confiance.",
  },
};

export default function Page() {
  return (
    <PageShell>
      <ResultatsPage />
    </PageShell>
  );
}
