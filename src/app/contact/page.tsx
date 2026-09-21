import type { Metadata } from "next";
import { ContactPage } from "@/components/site/pages/contact-page";
import { PageShell } from "@/components/site/page-shell";

/**
 * CONTACT / INSCRIPTION — page réelle indexable (Task 48 — SEO) :
 * /contact. Le formulaire d'inscription avec évaluation du niveau
 * d'anglais. L'ancienne adresse …/#/contact est redirigée
 * automatiquement par le script inline de layout.tsx.
 */
export const metadata: Metadata = {
  title: "Inscription au coaching d'anglais — Formulaire | Stevens AKPOVI",
  description:
    "Inscris-toi au programme « De Comprendre à Parler™ » : 03 mois de coaching d'anglais personnalisé en ligne, 70 000 FCFA, paiement unique. Évalue ton niveau et réserve ta place en quelques minutes.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title:
      "Inscription — Programme « De Comprendre à Parler™ » | Stevens AKPOVI",
    description:
      "Un formulaire. Et ton programme de 03 mois peut démarrer cette semaine.",
    type: "website",
    locale: "fr_FR",
    siteName: "Stevens AKPOVI",
    url: "/contact",
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
      <ContactPage />
    </PageShell>
  );
}
