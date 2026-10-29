import type { Metadata } from "next";
import { PrelaunchPage } from "@/components/site/pages/prelaunch-page";
import { PageShell } from "@/components/site/page-shell";
import { PixelNoscript } from "@/components/site/pixel-noscript";
import { META_PIXEL_ID_PRELAUNCH } from "@/lib/meta-pixel";

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
/* TASK 87 (instruction propriétaire, 2026-10-21) : CARTE DE PARTAGE
   (WhatsApp/OG) — le nom « Stevens AKPOVI » et la mention « Première
   cohorte » ne doivent plus apparaître dans les aperçus de lien. Le
   suffixe « Première cohorte | Stevens AKPOVI » de l'OG/Twitter title
   devient « Accompagnement d'Anglais En Ligne » ; le nom sort aussi
   du <title> de l'onglet (source de repli des aperçus) et du
   og:siteName (remplacé par la marque « Mr Steve English ») ; la
   description passe de « Première cohorte de pré-lancement » à
   « Pré-lancement » (terme préféré du propriétaire). Le contenu
   visible de la page n'est PAS touché. */
export const metadata: Metadata = {
  title:
    "Pre-launch • De COMPRENDRE à PARLER™ — 02 mois · 15 000 FCFA",
  description:
    "Pré-lancement : 02 mois d'accompagnement intensif en ligne pour commencer à pratiquer l'anglais — 03 séances de 1h30 par semaine — 15 000 FCFA — 05 places disponibles.",
  alternates: {
    canonical: "/pre-launch",
  },
  openGraph: {
    title:
      "Pre-launch • De COMPRENDRE à PARLER™ — Accompagnement d'Anglais En Ligne",
    description:
      "02 mois d'accompagnement intensif en ligne pour commencer à pratiquer l'anglais. 15 000 FCFA — 05 places disponibles.",
    type: "website",
    locale: "fr_FR",
    siteName: "Mr Steve English",
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
        alt: "Pre-launch • De COMPRENDRE à PARLER™ — Accompagnement d'Anglais En Ligne, 05 places disponibles.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Pre-launch • De COMPRENDRE à PARLER™ — Accompagnement d'Anglais En Ligne",
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
          contenu — la page Bienvenue est la seule à ne pas le rendre).
          TASK 90 : repli sur LE PIXEL DU PRE-LAUNCH — le PageView des
          visiteurs sans JavaScript du tunnel pre-launch part sur le
          pixel dédié (META_PIXEL_ID_PRELAUNCH), pas sur le pixel du
          programme principal. */}
      <PixelNoscript pixelId={META_PIXEL_ID_PRELAUNCH} />
    </>
  );
}
