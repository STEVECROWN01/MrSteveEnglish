import type { Metadata } from "next";
import { InscriptionPage } from "@/components/site/pages/inscription-page";
import { PageShell } from "@/components/site/page-shell";

/**
 * INSCRIPTION — page réelle indexable (Task 48 — SEO) :
 * /inscription (ex-/contact — renommage instruction propriétaire).
 * Le formulaire d'inscription avec qualification du niveau d'anglais.
 * L'ancienne adresse …/#/contact est redirigée automatiquement vers
 * /inscription par le script inline de layout.tsx ; l'ancienne route
 * complète /contact renvoie en redirection 308 permanente
 * (next.config.ts) — SEO et anciens liens préservés.
 */
export const metadata: Metadata = {
  title: "Inscription au coaching d'anglais — Formulaire | Stevens AKPOVI",
  description:
    "Inscris-toi au programme « De Comprendre à Parler™ » : 03 mois de coaching d'anglais personnalisé en ligne, 70 000 FCFA, paiement unique. Évalue ton niveau et réserve ta place en quelques minutes.",
  alternates: {
    canonical: "/inscription",
  },
  openGraph: {
    title:
      "Inscription — Programme « De Comprendre à Parler™ » | Stevens AKPOVI",
    description:
      "Un formulaire. Et ton programme de 03 mois peut démarrer cette semaine.",
    type: "website",
    locale: "fr_FR",
    siteName: "Stevens AKPOVI",
    url: "/inscription",
    images: [
      {
        url: "/assets/OG-SOCIAL.png",
        width: 1200,
        height: 630,
        alt:
          "Inscription au programme de coaching d'anglais « De Comprendre à Parler™ ».",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Inscription — Programme « De Comprendre à Parler™ » | Stevens AKPOVI",
    description:
      "Un formulaire. Et ton programme de 03 mois peut démarrer cette semaine.",
  },
};

export default function Page() {
  return (
    <PageShell>
      <InscriptionPage />
    </PageShell>
  );
}
