import type { Metadata } from "next";
import { AProposPage } from "@/components/site/pages/a-propos-page";
import { PageShell } from "@/components/site/page-shell";
import { PixelNoscript } from "@/components/site/pixel-noscript";

/**
 * À PROPOS — page réelle indexable (Task 48 — SEO) : /a-propos.
 * L'ancienne adresse …/#/a-propos est redirigée automatiquement par le
 * script inline de layout.tsx (compatibilité liens WhatsApp partagés).
 */
export const metadata: Metadata = {
  title: "À propos de Stevens AKPOVI — Coach d'anglais en ligne",
  description:
    "Stevens AKPOVI, coach d'anglais professionnel, accompagne les francophones qui comprennent l'anglais mais n'osent pas le parler. Découvrez son parcours, sa méthode et pourquoi il comprend votre blocage.",
  alternates: {
    canonical: "/a-propos",
  },
  openGraph: {
    title: "À propos de Stevens AKPOVI — Coach d'anglais en ligne",
    description:
      "Le parcours d'un coach qui comprend le blocage des francophones : comprendre l'anglais est une chose, oser le parler en est une autre.",
    type: "website",
    locale: "fr_FR",
    siteName: "Stevens AKPOVI",
    url: "/a-propos",
    images: [
      {
        url: "/assets/OG-SOCIAL.jpg",
        type: "image/jpeg",
        width: 1200,
        height: 630,
        alt:
          "Stevens AKPOVI — coach d'anglais en ligne pour francophones.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "À propos de Stevens AKPOVI — Coach d'anglais en ligne",
    description:
      "Le parcours d'un coach qui comprend le blocage des francophones.",
  },
};

export default function Page() {
  return (
    <>
      <PageShell>
        <AProposPage />
      </PageShell>
      {/* Task 60 : repli <noscript> du pixel Meta — rendu page par
          page car /bienvenue (retour paiement) n'émet AUCUN
          PageView, seulement l'événement Purchase. */}
      <PixelNoscript />
    </>
  );
}
