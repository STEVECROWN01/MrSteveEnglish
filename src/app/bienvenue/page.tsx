import type { Metadata } from "next";
import { BienvenuePage } from "@/components/site/pages/bienvenue-page";
import { PageShell } from "@/components/site/page-shell";

/**
 * BIENVENUE — page post-paiement (Task 28), NON INDEXABLE (Task 48) :
 * c'est une page privée de confirmation (reçu PDF, WhatsApp) — elle ne
 * doit PAS apparaître sur Google (une personne qui la trouverait sans
 * avoir payé serait confuse). robots noindex + exclue du sitemap +
 * interdite dans robots.txt. L'URL de retour configurée dans le système
 * de paiement du propriétaire pointait vers …/#/bienvenue : le script
 * inline de layout.tsx la traduit automatiquement vers /bienvenue — le
 * flux de paiement des clients existants est préservé.
 */
export const metadata: Metadata = {
  title: "Bienvenue — Ton inscription est confirmée | Stevens AKPOVI",
  description:
    "Ton inscription au programme « De Comprendre à Parler » est confirmée. Télécharge ton reçu et contacte ton coach sur WhatsApp.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <PageShell focused>
      <BienvenuePage />
    </PageShell>
  );
}
