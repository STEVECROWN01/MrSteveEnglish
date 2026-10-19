import type { Metadata } from "next";
import { PrelaunchPage } from "@/components/site/pages/prelaunch-page";
import { PageShell } from "@/components/site/page-shell";
import { PixelNoscript } from "@/components/site/pixel-noscript";

/**
 * PRE-LAUNCH (Task 69 — brief propriétaire 2026-10-18) : landing
 * dédiée à l'offre « Pre-launch • De COMPRENDRE à PARLER™ » — 02 mois
 * d'accompagnement intensif en ligne — 15 000 FCFA — 05 participants
 * maximum — première cohorte pre-launch.
 *
 * Page INDEXABLE (landing marketing publique, déclarée dans le
 * sitemap), mais FOCALISÉE comme /bienvenue : ni header ni footer
 * global — la séparation avec le tunnel du programme principal
 * (03 mois — 70 000 FCFA — /inscription) est totale : aucun CTA de
 * cette page ne mène au formulaire ni au paiement du programme
 * principal, et réciproquement.
 *
 * Le CTA d'inscription mène à la page produit Maketou du pre-launch
 * (PRELAUNCH_CHECKOUT_URL dans lib/site.ts — produit 15 000 FCFA
 * créé par le propriétaire) ; l'URL de retour du paiement est
 * /bienvenue?offre=prelaunch (variante prelaunch de la page Bienvenue
 * + reçu dédié).
 *
 * RENOMMAGE /pre-lancement → /pre-launch (instruction propriétaire
 * 2026-10-19 : « Pre-launch » en anglais dans le code) : redirection
 * 308 PERMANENTE depuis l'ancienne route (next.config.ts) — les
 * liens déjà partagés restent valides.
 */
export const metadata: Metadata = {
  title:
    "Pre-launch • De COMPRENDRE à PARLER™ — 02 mois · 15 000 FCFA | Stevens AKPOVI",
  description:
    "Première cohorte de pré-lancement : 02 mois d'accompagnement intensif en ligne pour commencer à pratiquer l'anglais — 03 séances de 1h30 par semaine — 15 000 FCFA — 05 places disponibles.",
  alternates: {
    canonical: "/pre-launch",
  },
  openGraph: {
    title:
      "Pre-launch • De COMPRENDRE à PARLER™ — Première cohorte | Stevens AKPOVI",
    description:
      "02 mois d'accompagnement intensif en ligne pour commencer à pratiquer l'anglais. 15 000 FCFA — 05 places disponibles.",
    type: "website",
    locale: "fr_FR",
    siteName: "Stevens AKPOVI",
    url: "/pre-launch",
    /* TASK 75 (instruction propriétaire) : OG DÉDIÉE au pre-launch —
       image uploadée par le propriétaire
       (public/assets/prelaunch/OG-SOCIAL.png, 1254×1254), optimisée
       selon la règle établie pour l'OG du programme (worklog) :
       JPEG q90 LANCZOS 1254→1200 = 229 Ko (limite pratique WhatsApp
       ~300 Ko), nom CACHE-BUSTER (OG-SOCIAL-PL-v1.jpg) pour forcer le
       re-fetch des crawlers — l'OG du programme principal
       (/assets/OG-SOCIAL-v2.jpg) reste STRICTEMENT inchangée. */
    images: [
      {
        url: "/assets/prelaunch/OG-SOCIAL-PL-v1.jpg",
        type: "image/jpeg",
        width: 1200,
        height: 1200,
        alt: "Pre-launch • De COMPRENDRE à PARLER™ — première cohorte de 05 participants.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Pre-launch • De COMPRENDRE à PARLER™ — Première cohorte | Stevens AKPOVI",
    description:
      "02 mois d'accompagnement intensif en ligne pour commencer à pratiquer l'anglais. 15 000 FCFA — 05 places disponibles.",
  },
};

export default function Page() {
  return (
    <>
      <PageShell focused>
        <PrelaunchPage />
      </PageShell>
      {/* Repli <noscript> du pixel Meta (comme toutes les pages de
          contenu — la page Bienvenue est la seule à ne pas le rendre). */}
      <PixelNoscript />
    </>
  );
}
