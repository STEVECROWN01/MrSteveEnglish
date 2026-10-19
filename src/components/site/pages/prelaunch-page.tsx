"use client";

import { useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PRELAUNCH_CHECKOUT_URL, waLink } from "@/lib/site";
import {
  PRODUIT_PRELAUNCH,
  pixelEventId,
  trackPixelWithCAPI,
} from "@/lib/meta-pixel";
import { Container, Eyebrow, Prose } from "../layout-primitives";
import { Reveal } from "../reveal";
import { StickyCTA } from "../sticky-cta";
import { ResponsiveImage } from "../responsive-image";
import { FaqAccordion } from "../faq-accordion";
import { IconCheck } from "../icons";

/**
 * TASK 69 — LANDING « PRE-LAUNCH • DE COMPRENDRE À PARLER™ »
 * (brief propriétaire 2026-10-18).
 *
 * Offre STRICTEMENT distincte du programme principal (03 mois —
 * 70 000 FCFA) : 02 mois d'accompagnement intensif en ligne — 15 000
 * FCFA — 03 séances de 1h30 par semaine — 05 participants maximum —
 * première cohorte pre-launch.
 *
 * PAGE FOCALISÉE (comme /bienvenue) : ni header ni footer global du
 * site — la séparation des deux offres est totale (aucun CTA du
 * programme principal ne fuit vers ce tunnel, et inversement).
 * TASK 71 (instruction propriétaire) : PLUS AUCUN header — la landing
 * commence directement par le hero ; un pied de page dédié à l'offre
 * ferme la page.
 *
 * IDENTITÉ (brief §1) : blanc #FFFFFF / noir #000000 / rouge #FF0000,
 * composants, styles et animations existants (btn-primary + reflet,
 * glass-card, Reveal, hero-line, StickyCTA). Les 10 sections du brief
 * + pied de page. Images : public/assets/prelaunch/ (noms réels —
 * le portrait du fondateur est un .png, extension réelle respectée),
 * variantes WebP pré-générées (manifeste image-variants.json).
 *
 * TASK 71 — PRÉSENTATION VIVANTE (instruction propriétaire) :
 * — cartes des sections à fond blanc en VERRE TRANSPARENT (glass-card
 *   + nappes de couleur derrière, comme la page d'accueil) ;
 * — cadrage des images IDENTIQUE à l'accueil (coins 12px, ombre douce,
 *   sans bordure) + zoom discret au survol (img-zoom) ;
 * — chiffres de l'offre au format 02 / 03 / 05 (cohérent avec le
 *   brief et le reçu) ;
 * — animations au scroll directionnelles (left/right), zoom des
 *   cartes, rebond des grands chiffres (pop), dérive lente des nappes.
 *
 * TASK 73 (instruction propriétaire) :
 * — BANDE ROUGE FIXE en haut du hero : texte STATIQUE en une seule
 *   ligne (« Cohorte strictement limitée • Seulement 05 places sont
 *   disponibles ») traversé par le balayage lumineux des CTA
 *   (classe .band-shine de globals.css) ;
 * — BANDES DÉFILANTES ROUGES (mots-clés pre-launch, même marquee que
 *   l'accueil du programme) en tête des sections « Parce qu'un
 *   accompagnement sérieux… » et « Cette expérience est faite pour
 *   toi si… » ;
 * — images du HERO, du PROBLÈME, de la PREMIÈRE COHORTE et du
 *   DERNIER APPEL en FORMAT VERTICAL sur desktop (recadrages
 *   object-position validés par analyse visuelle : 50 % hero,
 *   40 % illustrations) ;
 * — section « Une première cohorte » : image à GAUCHE sur desktop +
 *   CTA d'inscription ajouté sous le texte.
 *
 * PERSONNAGES : le portrait du fondateur n'apparaît QUE dans le hero ;
 * toutes les autres images sont des illustrations fictives — jamais
 * présentées comme témoignages, apprenants réels ou participants de
 * la cohorte. Aucun compteur de places restantes, aucun compte à
 * rebours, aucune promesse de maîtrise garantie.
 */

/** Cible du CTA : page produit Maketou du pre-launch
 *  (PRELAUNCH_CHECKOUT_URL — produit créé par le propriétaire,
 *  vérifié : 15 000 FCFA, 02 mois). Repli si l'URL était vidée :
 *  contact WhatsApp du coach avec message pré-rempli (aucun lien
 *  cassé, aucun paiement au mauvais tarif de 70 000 FCFA, le
 *  tunnel du programme principal n'est jamais touché). */
const CTA_HREF =
  PRELAUNCH_CHECKOUT_URL ||
  waLink(
    "Bonjour Coach Stevens, je souhaite rejoindre la première cohorte de l'offre « Pre-launch • De COMPRENDRE à PARLER™ » (02 mois — 15 000 FCFA). Comment je procède pour réserver ma place ?",
  );

const CTA_HERO_LABEL = "Découvrir l'offre et s'inscrire →";
const CTA_FINAL_LABEL = "Je veux découvrir l'offre et m'inscrire →";

/** Bouton d'inscription de l'offre pre-launch — externe
 *  (Maketou ou repli WhatsApp), avec événement Meta InitiateCheckout
 *  (produit pre-launch, 15 000 XOF) au clic. `data-wa-cta` :
 *  la barre sticky mobile n'apparaît que quand aucun CTA in-page
 *  n'est visible (règle DA §18 conservée). */
function CtaOffre({ label, className }: { label: string; className?: string }) {
  return (
    <a
      href={CTA_HREF}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        trackPixelWithCAPI(
          "InitiateCheckout",
          {
            content_name: PRODUIT_PRELAUNCH.content_name,
            content_category: PRODUIT_PRELAUNCH.content_category,
            content_ids: PRODUIT_PRELAUNCH.content_ids,
            content_type: PRODUIT_PRELAUNCH.content_type,
            value: PRODUIT_PRELAUNCH.value,
            currency: PRODUIT_PRELAUNCH.currency,
            num_items: 1,
          },
          { eventId: pixelEventId("prelaunch-checkout") },
        );
      }}
      data-wa-cta
      className={cn("btn btn-primary t-btn", className)}
    >
      {label}
    </a>
  );
}

/** Cadre image — MÊME style que la page d'accueil (instruction
 *  propriétaire TASK 71) : coins 12px + ombre douce, SANS bordure ni
 *  fond blanc — le cadrage respire pareil sur fond blanc et sur fond
 *  noir. `group` : zoom discret de l'image au survol (classe img-zoom
 *  posée sur chaque image).
 *  TASK 78 : `relative` OBLIGATOIRE — sans lui, l'<img fill> en
 *  `absolute inset-0` remonte à un ancêtre positionné plus haut
 *  (Reveal) : l'image débordait de son cadre (761 px dans un cadre de
 *  731 px) et ses coins CARRÉS restaient visibles malgré le
 *  `overflow-hidden rounded-[12px]`. Avec `relative`, le cadre redevient
 *  le containing block de l'image : elle est clippée aux coins 12 px
 *  comme l'image du hero (qui a toujours eu `relative`). */
function CadreImage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.10)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Légende discrète sous les illustrations — TASK 80 : le composant
 *  est RETIRÉ (instruction propriétaire : « supprime les légendes
 *  Illustration… que tu as ajoutées sous les images — je ne t'ai pas
 *  dit d'ajouter cela ») ; les textes alternatifs alt="" restent
 *  (invisibles, accessibilité lecteurs d'écran). */

/* — SECTION 4 : les 06 éléments inclus (brief, texte exact) — */
const INCLUS_PRELAUNCH = [
  {
    num: "01",
    titre: "03 séances par semaine",
    corps:
      "03 séances de 1 h 30 par semaine pendant 02 mois, organisées pour te permettre de pratiquer régulièrement et de travailler progressivement ton expression orale.",
  },
  {
    num: "02",
    titre: "La pratique orale au centre de l'apprentissage",
    corps:
      "L'accompagnement met l'accent sur l'utilisation concrète de l'anglais : apprendre à formuler des phrases, utiliser des expressions utiles et s'entraîner à communiquer progressivement.",
  },
  {
    num: "03",
    titre: "Des exercices pour mettre en pratique",
    corps:
      "Tu seras amené à travailler les notions abordées et à appliquer les conseils reçus afin de participer activement à ton apprentissage.",
  },
  {
    num: "04",
    titre: "Un accompagnement pendant les 02 mois",
    corps:
      "Tu bénéficieras d'un cadre d'apprentissage structuré et d'un suivi pendant cette première expérience, avec l'objectif de travailler régulièrement et de progresser étape par étape.",
  },
  {
    num: "05",
    titre: "Une communauté WhatsApp",
    corps:
      "Tu pourras rejoindre la communauté dédiée aux participants pour recevoir les informations utiles et échanger avec les autres membres de la cohorte.",
  },
  {
    num: "06",
    titre: "Une formation entièrement en ligne",
    corps:
      "Tu peux suivre l'accompagnement depuis ton lieu de résidence. Tu auras besoin d'une connexion internet adaptée, de disponibilité pour les séances et de la volonté de pratiquer régulièrement.",
  },
];

/* — SECTION 7 : à qui s'adresse l'offre (listes exactes du brief) —
   TASK 75 (instruction propriétaire) : 03 points SUPPRIMÉS (« Tu
   connais quelques mots ou expressions… », « Tu comprends certaines
   choses… », « Tu disposes d'une connexion internet… ») et le point
   des séances CORRIGÉ (1h30 + au moins 10 min d'exercices). — */
const POUR_TOI = [
  "Tu es un vrai débutant en anglais et tu ne sais presque pas parler.",
  "Tu souhaites apprendre à t'exprimer oralement et tu es prêt à pratiquer régulièrement.",
  "Tu peux consacrer 1h30 aux 03 séances hebdomadaires et au moins 10 min aux exercices.",
  "Tu es prêt à appliquer les conseils reçus et à prendre ton apprentissage au sérieux.",
];
const PAS_POUR_TOI = [
  "Tu cherches une formation sans devoir participer activement.",
  "Tu n'es pas disponible pour suivre régulièrement les séances.",
  "Tu n'es pas prêt à réaliser les exercices ou à pratiquer entre les séances.",
  "Tu attends une garantie de maîtrise complète de l'anglais en seulement 02 mois.",
];

/* — SECTION 8 : les 04 étapes (textes exacts du brief) — */
const ETAPES_INSCRIPTION = [
  {
    num: "01",
    titre: "Découvre les conditions",
    texte:
      "Lis les informations relatives au niveau requis, à l'engagement attendu, aux modalités de paiement et aux conditions applicables à cette offre.",
  },
  {
    num: "02",
    titre: "Vérifie que l'accompagnement te correspond",
    texte:
      "Assure-toi que tu peux participer aux séances, disposer d'une connexion internet adaptée et consacrer du temps à ton apprentissage.",
  },
  {
    num: "03",
    titre: "Procède au paiement",
    texte:
      "Si l'offre te convient, clique sur le bouton d'inscription pour accéder à la page de paiement sécurisée et régler les 15 000 FCFA correspondant aux 02 mois d'accompagnement.",
  },
  {
    num: "04",
    titre: "Accède à la page de bienvenue",
    texte:
      "Après confirmation du paiement, tu seras redirigé vers une page de bienvenue sur laquelle tu pourras télécharger ton reçu et accéder à la communauté WhatsApp dédiée.",
  },
];

/* — SECTION 9 : Foire aux questions (textes exacts du brief) — */
const FAQ_PRELAUNCH = [
  {
    question: "Je suis un vrai débutant. Puis-je participer ?",
    answer:
      "Oui. Cette offre est destinée aux vrais débutants ainsi qu'aux personnes qui connaissent quelques mots ou expressions, mais qui n'arrivent pas encore à parler.",
  },
  {
    question:
      "Je comprends quelques phrases, mais je n'arrive pas à répondre. Est-ce pour moi ?",
    answer:
      "Oui. L'accompagnement est destiné aux personnes qui souhaitent travailler leur expression orale et commencer à utiliser plus activement ce qu'elles apprennent.",
  },
  {
    question: "Combien de temps dure l'accompagnement ?",
    answer:
      "L'accompagnement dure 02 mois, avec 03 séances de 1 h 30 par semaine.",
  },
  {
    question: "Quel est le tarif ?",
    answer:
      "La participation est de 15 000 FCFA pour les 02 mois d'accompagnement prévus dans cette offre de pré-lancement.",
  },
  {
    question: "La formation se déroule-t-elle en présentiel ?",
    /* TASK 76 (instruction propriétaire) : réponse reformulée — une
       bonne connexion stable suffit, peu importe où tu es. */
    answer:
      "Non. L'accompagnement est entièrement en ligne. Tu as juste besoin d'une bonne connexion internet stable pour participer aux séances. Peu importe où tu\u00a0es.",
  },
  {
    question: "Dois-je être disponible à des horaires précis ?",
    answer:
      "Oui. Il est nécessaire de pouvoir participer aux 03 séances hebdomadaires. Les horaires précis seront communiqués aux participants dans la communauté WhatsApp.",
  },
  {
    question: "Vais-je parler couramment anglais après 02 mois ?",
    answer:
      "Nous ne garantissons pas une maîtrise complète de l'anglais en 02 mois. L'objectif est de pratiquer régulièrement, de travailler ton expression orale et de commencer à t'exprimer progressivement en fonction de ton niveau et de ton implication.",
  },
  {
    question: "Pourquoi le nombre de participants est-il limité à 05 ?",
    answer:
      "Cette limite est volontaire. Nous souhaitons consacrer suffisamment de temps à chaque participant et assurer un suivi rapproché pendant cette première expérience.",
  },
  {
    question: "Que se passe-t-il après mon paiement ?",
    answer:
      "Une fois le paiement confirmé, tu seras redirigé vers la page de bienvenue. Tu pourras y télécharger ton reçu de paiement et accéder à la communauté WhatsApp de la cohorte.",
  },
  {
    question: "Puis-je obtenir un remboursement ?",
    /* TASK 75 (instruction propriétaire) : réponse remplacée —
       politique explicite : inscription définitive, aucun
       remboursement. */
    answer:
      "Toute inscription est définitive. Une fois l'inscription terminée, aucun remboursement ne sera accordé.",
  },
];

/* — TASK 73 : BANDE DÉFILANTE DES MOTS-CLÉS DU PRE-LAUNCH (instruction
   propriétaire) — même présentation que la bande de l'accueil du
   programme (marquee rouge, points noirs séparateurs, défilement
   continue droite → gauche, boucle parfaite sur deux copies de la
   liste, fondu latéral du viewport) mais avec le vocabulaire de CETTE
   offre. Posée en tête des sections « Parce qu'un accompagnement
   sérieux… » et « Cette expérience est faite pour toi si… ». La
   liste pre-launch est plus courte que celle de l'accueil : durée
   raccourcie en style inline pour conserver la vitesse visuelle de
   l'accueil (~78 px/s). — */
const MOTS_CLES_PRELAUNCH = [
  "Pre-launch • De Comprendre à Parler™",
  "02 mois d'accompagnement",
  "15 000 FCFA — Paiement unique",
  "Première cohorte — 05 places",
  "03 séances de 1h30 par semaine",
  "Cohorte strictement limitée",
  "Pratique orale",
  "Expressions utiles",
  "Exercices pratiques",
  "Communauté WhatsApp de la cohorte",
  "100 % en ligne",
  "Vrais débutants bienvenus",
  "Commencer à parler anglais",
  "Accompagnement personnalisé",
  "Suivi rapproché",
  "Progression étape par étape",
] as const;

function BandeMotsClesPrelaunch() {
  return (
    <section
      aria-label="Les mots-clés de l'offre Pre-launch"
      className="marquee-band on-dark relative border-b border-black/20 bg-red-button py-4 text-white md:py-5"
    >
      <div className="marquee-viewport">
        <div
          className="marquee-track items-center"
          style={{ animationDuration: "64s" }}
        >
          {[...MOTS_CLES_PRELAUNCH, ...MOTS_CLES_PRELAUNCH].map((mot, i) => (
            <span
              key={i}
              aria-hidden={i >= MOTS_CLES_PRELAUNCH.length || undefined}
              className="flex items-center gap-8 pr-8"
            >
              <span className="whitespace-nowrap text-[0.8125rem] font-bold uppercase tracking-[0.16em] text-white/90 md:text-sm">
                {/* ™ en HAUT comme un exposant (convention Task 54). */}
                {mot.endsWith("™") ? (
                  <>
                    {mot.slice(0, -1)}
                    <sup className="top-[-0.6em] text-[0.6em]">™</sup>
                  </>
                ) : (
                  mot
                )}
              </span>
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-black"
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PrelaunchPage() {
  /* TASK 69 — META PIXEL : « ViewContent » — cette page présente
     l'offre pre-launch (15 000 XOF) : un visiteur ici a vu ce
     produit. Déclenché une fois par affichage, copie serveur CAPI
     avec le même event_id — même mécanique que la page Programme. */
  useEffect(() => {
    trackPixelWithCAPI(
      "ViewContent",
      {
        content_name: PRODUIT_PRELAUNCH.content_name,
        content_category: PRODUIT_PRELAUNCH.content_category,
        content_ids: PRODUIT_PRELAUNCH.content_ids,
        content_type: PRODUIT_PRELAUNCH.content_type,
        value: PRODUIT_PRELAUNCH.value,
        currency: PRODUIT_PRELAUNCH.currency,
      },
      { eventId: pixelEventId("prelaunch-viewcontent") },
    );
  }, []);

  return (
    <>
      {/* ============================================================
          BANDE D'ANNONCE FIXE (instruction propriétaire Task 73) :
          bande rouge en HAUT de la page, position FIXED — elle reste
          visible pendant le scroll. Contrairement aux bandes marquee
          des sections, son texte est STATIQUE (« qui ne défile pas »)
          et tient en UNE SEULE LIGNE ; il est traversé par le MÊME
          balayage lumineux oblique que les CTA rouges (classe
          .band-shine — mèche étroite adaptée à la pleine largeur).
          TASK 74 : police AGRANDIE pour une vraie lisibilité.
          TASK 77 (instruction propriétaire : « le texte de la bande
          soit seulement en majuscule ») : classe uppercase — mesuré
          navigateur E2E, les capitales élargissent le texte à 39,5 px
          par pixel de police ; le coefficient mobile est donc
          RECALIBRÉ à min(2.48vw, 0.75rem) avec tracking normal
          (2.55vw débordait de 2-3 px à 320-441 px) pour garantir
          la ligne unique jusqu'à 320 px ; desktop md:text-sm
          conservé (14 px à 768px = 553 px de texte, large marge).
          Posée HORS du conteneur racine : aucune interférence avec
          son overflow-x.
          ============================================================ */}
      <div
        aria-label="Cohorte strictement limitée"
        role="note"
        className="band-shine fixed inset-x-0 top-0 z-[60] border-b border-black/20 bg-red-button py-2.5 text-center text-white md:py-3"
      >
        <p className="whitespace-nowrap text-[min(2.48vw,0.75rem)] font-bold uppercase tracking-normal text-white md:text-sm md:tracking-[0.1em]">
          Cohorte strictement limitée • Seulement 05 places sont disponibles
        </p>
      </div>

      {/* overflow-x-clip : les arrivées latérales des reveals
          (translateX initial de 28 px) dépassent brièvement le
          padding de 20 px du conteneur sur mobile — elles sont alors
          à opacité 0 (avant apparition), donc le clip est invisible ;
          il supprime le micro-débordement horizontal de 8 px. Ne
          touche NI la bande fixe NI la barre sticky mobile (position
          fixed → contenant = viewport, hors du scope de l'overflow). */}
      <div className="flex min-h-screen flex-col overflow-x-clip bg-white">
        {/* ============================================================
          SECTION 1 — HERO (brief §1) : question d'accroche, promesse
          des 02 mois, prix, CTA, méta — portrait RÉEL du fondateur à
          côté du titre (SEULE section où il apparaît). TASK 71 : plus
          de header — la page commence ici, respiration pleine.
          TASK 73 : portrait en FORMAT VERTICAL (4:5) sur desktop ;
          TASK 74 : padding supérieur RÉDUIT d'un cran (pt-20/lg:pt-24,
          était pt-24/lg:pt-32) — le propriétaire trouvait l'espace
          entre la bande fixe et l'image trop grand sur desktop.
          TASK 79 (instruction propriétaire : « le hero doit entièrement
          couvrir la taille d'écran lorsqu'on est dessus, au top — ça
          doit s'adapter aux tailles d'écran ») : hauteur minimale
          100svh (petite hauteur d'écran dynamique — la vraie unité
          plein écran sur mobile, barres d'interface déduites ; repli
          vh identique car même valeur) — le hero couvre TOUJOURS au
          moins exactement l'écran au sommet de la page, et grandit
          naturellement si le contenu dépasse (petits portables) ; le
          contenu est centré verticalement dans l'espace disponible
          (flex-1 + justify-center) — pas de vide noir disgracieux en
          bas sur grands écrans.
          ============================================================ */}
        <section className="on-dark relative flex min-h-[100svh] flex-col overflow-hidden bg-black pb-16 pt-20 text-white lg:pb-24 lg:pt-24">
          <div
            aria-hidden="true"
            className="blob-drift pointer-events-none absolute left-[4%] top-[12%] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(255,26,26,0.28)_0%,transparent_62%)] blur-2xl"
          />
          <div
            aria-hidden="true"
            className="blob-drift-alt pointer-events-none absolute right-[2%] bottom-[-6rem] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(96,110,190,0.30)_0%,transparent_62%)] blur-2xl"
          />
          <Container className="relative flex flex-1 flex-col justify-center">
            {/* TASK 75 (instruction propriétaire) : l'eyebrow du hero
                est renommé « Pre-launch • De COMPRENDRE à PARLER™ »
                (nom officiel de l'offre) et posé AU-DESSUS de la
                grille : centré horizontalement sur les DEUX colonnes
                du hero sur desktop (centré également sur mobile).
                Animation hero-line/hero-d1 conservée (1re ligne à
                apparaître). */}
            <p className="hero-line hero-d1 text-center text-[0.75rem] font-medium uppercase tracking-[0.18em] text-red-button">
              Pre-launch • De COMPRENDRE à PARLER
              <sup className="top-[-0.6em] text-[0.6em]">™</sup>
            </p>
            <div className="mt-6 grid items-center gap-10 lg:grid-cols-[45%_55%] lg:gap-14">
              {/* Portrait du fondateur — cadrage IDENTIQUE à l'accueil
                (TASK 71 : coins 12px, ombre douce, aucune bordure),
                entrée dédiée hero-portrait-in (fondu + montée + zoom
                arrière 0.96 → 1), AUCUN filtre (teint inchangé).
                TASK 73 : FORMAT VERTICAL 4:5 sur desktop (mobile 4:3
                inchangé) — recadrage validé visuellement : 50 % en
                horizontal garde le visage centré (65 % conservé sur
                mobile où la coupe est plus large). */}
              <div className="hero-portrait-in lg:order-1">
                <div className="group relative overflow-hidden rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.10)]">
                  <div className="aspect-[4/3] lg:aspect-[4/5]">
                    <ResponsiveImage
                      src="/assets/prelaunch/mrsteve-portrait-hero.png"
                      alt="Stevens AKPOVI, coach d'anglais et fondateur de Mr Steve English"
                      fill
                      priority
                      sizes="100vw"
                      className="img-zoom object-cover [object-position:65%_35%] lg:[object-position:50%_35%]"
                    />
                  </div>
                </div>
              </div>

              <div className="text-center lg:order-2 lg:text-left">
                {/* TASK 77 (instruction propriétaire : « réduis un peu la
                    taille du titre ») : surcharge LOCALE de la taille —
                    clamp(2rem, 1.4rem + 3vw, 3.5rem) soit 32 → 56 px,
                    un cran sous le t-h1 générique (36 → 64 px, inchangé
                    pour les autres pages) ; la typo serif Fraunces, la
                    graisse et l'interlignage de .t-h1 sont conservés
                    (l'utilitaire Tailwind ne surcharge que font-size,
                    couche utilities > components). */}
                <h1 className="hero-line hero-d2 t-h1 mt-0 text-[clamp(2rem,1.4rem+3vw,3.5rem)] text-white">
                  Tu veux parler anglais, mais tu ne sais pas encore comment
                  t&apos;y prendre ?
                </h1>
                <p className="hero-line hero-d3 t-body mx-auto mt-6 max-w-[38rem] text-white/75 lg:mx-0">
                  Tu débutes en anglais ou tu connais déjà quelques mots, mais
                  dès qu&apos;il faut construire une phrase et prendre la
                  parole, tu bloques ?
                </p>
                <p className="hero-line hero-d4 t-body mx-auto mt-4 max-w-[38rem] text-white/75 lg:mx-0">
                  Découvre une opportunité exceptionnelle :{" "}
                  <span className="font-medium text-white">
                    02 mois d&apos;accompagnement intensif en ligne pour
                    commencer à pratiquer l&apos;anglais
                  </span>
                  , avec seulement 05 places pour cette première cohorte.
                </p>
                <p className="hero-line hero-d5 mt-8 font-display text-[1.75rem] font-medium leading-tight text-white md:text-[2.125rem]">
                  15 000 FCFA{" "}
                  <span className="text-[1.125rem] font-normal text-white/70 md:text-[1.25rem]">
                    pour les 02 mois d&apos;accompagnement.
                  </span>
                </p>
                <div className="hero-line hero-d5 mt-8 flex justify-center lg:justify-start">
                  <CtaOffre
                    label={CTA_HERO_LABEL}
                    className="w-full sm:w-auto"
                  />
                </div>
                <p className="hero-line hero-d5 t-caption mt-6 text-white/55">
                  Seulement 05 places · 100 % en ligne · Pour débutants et
                  apprenants qui bloquent à l&apos;oral
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* ============================================================
          SECTION 2 — LE PROBLÈME (brief §2 + IMAGE 2
          prelaunch-speaking-block.png) : le visiteur se reconnaît.
          TASK 75 (instruction propriétaire) : limite OBLIQUE entre le
          hero (noir) et cette section (blanche) — EXACTEMENT comme la
          limite noir→blanc de la section « Ma méthode » de l'accueil
          du programme (même SVG, 24 px mobile / 32 px desktop : le
          noir du hero pénètre le haut-gauche de la section claire,
          bord montant bas-gauche → haut-droite).
          ============================================================ */}
        <section id="probleme" className="relative scroll-mt-20 py-12 lg:py-24">
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-x-0 top-0 block h-6 w-full lg:h-8"
          >
            <polygon points="0,0 100,0 0,100" fill="#000000" />
          </svg>
          <Container>
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <Reveal variant="left">
                <Prose>
                  <h2 className="t-h2 text-black">
                    Tu connais quelques mots d&apos;anglais. Mais peux-tu
                    vraiment les utiliser pour parler ?
                  </h2>
                  <p className="t-body mt-6 text-black/75">
                    Tu as peut-être déjà appris quelques mots, regardé des
                    vidéos en anglais ou essayé d&apos;apprendre seul.
                  </p>
                  <p className="t-body text-black/75">
                    Pourtant, lorsque tu dois répondre à une question,
                    construire une phrase ou tenir une petite conversation, tu
                    rencontres encore des difficultés.
                  </p>
                  <p className="t-body text-black/75">
                    Tu réfléchis longtemps avant de parler. Tu cherches tes
                    mots. Tu hésites sur la manière de formuler tes phrases. Et
                    parfois, tu préfères garder le silence plutôt que
                    d&apos;essayer.
                  </p>
                  <p className="t-body text-black/75">
                    Si tu te reconnais dans cette situation, tu n&apos;as pas
                    besoin d&apos;attendre de tout connaître avant de commencer
                    à pratiquer.
                  </p>
                  <div className="mt-6 rounded-[12px] bg-black p-6 md:p-7">
                    <p className="font-display text-[1.25rem] font-medium leading-snug text-white md:text-[1.375rem]">
                      Tu as besoin de travailler ton expression orale, de
                      t&apos;entraîner régulièrement et d&apos;apprendre à
                      utiliser progressivement ce que tu connais déjà.
                    </p>
                    {/* TASK 75 (instruction propriétaire) : « C'est
                        précisément dans cette démarche que s'inscrit
                        notre offre de pré-lancement. » SUPPRIMÉ. */}
                  </div>
                </Prose>
              </Reveal>
              <Reveal variant="right" delay={120}>
                <div>
                  {/* TASK 73 : FORMAT VERTICAL 3:4 sur desktop (mobile
                    3:2 inchangé) — recadrage validé visuellement :
                    40 % horizontal garde le personnage entier. */}
                  <CadreImage>
                    <div className="aspect-[3/2] lg:aspect-[3/4]">
                      <ResponsiveImage
                        src="/assets/prelaunch/prelaunch-speaking-block.png"
                        alt="Illustration d'un personnage fictif qui hésite à parler lors d'une conversation en ligne"
                        fill
                        sizes="100vw"
                        className="img-zoom object-cover lg:[object-position:40%_50%]"
                      />
                    </div>
                  </CadreImage>
                </div>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* ============================================================
          SECTION 3 — L'OPPORTUNITÉ (brief §3 + IMAGE 3
          prelaunch-online-session.png) : première cohorte, pratique,
          pas de promesse irréaliste. TASK 73 : image à GAUCHE sur
          desktop, en FORMAT VERTICAL, + CTA d'inscription sous le
          texte (instruction propriétaire).
          ============================================================ */}
        <section
          id="opportunite"
          className="on-dark relative scroll-mt-20 overflow-hidden bg-black py-12 text-white lg:py-24"
        >
          <div
            aria-hidden="true"
            className="blob-drift pointer-events-none absolute right-[8%] top-[2rem] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(255,26,26,0.26)_0%,transparent_62%)] blur-2xl"
          />
          <div
            aria-hidden="true"
            className="blob-drift-alt pointer-events-none absolute left-[4%] bottom-[-4rem] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(96,110,190,0.28)_0%,transparent_62%)] blur-2xl"
          />
          <Container className="relative">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              {/* TASK 73 : image à GAUCHE (elle était à droite) —
                arrivée depuis la gauche ; FORMAT VERTICAL 3:4 sur
                desktop (mobile 16:10 inchangé), recadrage validé
                visuellement : 40 % horizontal garde l'apprenante
                entière avec son ordinateur. */}
              <Reveal variant="left">
                <div>
                  <CadreImage>
                    <div className="aspect-[16/10] lg:aspect-[3/4]">
                      <ResponsiveImage
                        src="/assets/prelaunch/prelaunch-online-session.png"
                        alt="Illustration d'une apprenante fictive qui parle anglais pendant une séance en ligne"
                        fill
                        sizes="100vw"
                        className="img-zoom object-cover lg:[object-position:40%_50%]"
                      />
                    </div>
                  </CadreImage>
                </div>
              </Reveal>
              <Reveal variant="right" delay={120}>
                <Prose>
                  <h2 className="t-h2 text-white">
                    Une première cohorte. 05 personnes. Un objectif : commencer
                    à parler anglais.
                  </h2>
                  <p className="t-body mt-6 text-white/75">
                    Dans le cadre du pré-lancement de notre programme{" "}
                    <span className="font-medium text-white">
                      De <span className="text-red-button">Comprendre</span> à{" "}
                      <span className="text-red-button">Parler</span>
                      <sup className="top-[-0.6em] text-[0.6em]">™</sup>
                    </span>
                    , nous ouvrons une première cohorte de 05 participants pour
                    02 mois d&apos;accompagnement intensif.
                  </p>
                  <p className="t-body text-white/75">
                    Cette expérience est destinée aux personnes qui veulent
                    réellement apprendre l&apos;anglais, mais qui débutent ou
                    qui n&apos;arrivent pas encore à s&apos;exprimer oralement.
                  </p>
                  <p className="t-body text-white/75">
                    Pendant ces 02 mois, nous mettrons l&apos;accent sur la
                    pratique, les expressions utiles, les exercices et
                    l&apos;application progressive de ce que tu apprends.
                  </p>
                  <p className="t-body text-white/75">
                    L&apos;objectif est de t&apos;aider à commencer à construire
                    des phrases, à utiliser des expressions adaptées à ton
                    niveau et à prendre progressivement la parole en anglais.
                  </p>
                  {/* TASK 75 (instruction propriétaire) : le paragraphe
                      « Il ne s'agit pas de te promettre de devenir
                      parfaitement bilingue… » et le trait horizontal
                      qui le surmontait sont SUPPRIMÉS. */}
                  {/* TASK 73 (instruction propriétaire) : CTA au cœur de
                    la section — le visiteur convaincu n'attend pas la
                    section tarifaire pour s'inscrire. */}
                  <div className="mt-8">
                    <CtaOffre
                      label={CTA_HERO_LABEL}
                      className="w-full sm:w-auto"
                    />
                  </div>
                  <p className="t-caption mt-4 text-white/55">
                    15 000 FCFA · 02 mois d&apos;accompagnement · 05 places
                    disponibles
                  </p>
                </Prose>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* ============================================================
          SECTION 4 — CE QUI EST INCLUS (brief §4 + IMAGE 4
          prelaunch-practice-exercises.png) : 06 cartes numérotées.
          TASK 71 : cartes en VERRE TRANSPARENT + nappes de couleur
          derrière (même présentation que la section Pour qui ? de
          l'accueil) — c'est la traversée translucide des nappes qui
          signale le verre, pas le voile seul.
          ============================================================ */}
        <section
          id="inclus"
          className="relative scroll-mt-20 overflow-hidden py-12 lg:py-24"
        >
          <div
            aria-hidden="true"
            className="blob-drift pointer-events-none absolute -left-24 top-[44rem] h-[44rem] w-[44rem] rounded-full bg-[radial-gradient(circle,rgba(255,26,26,0.30)_0%,transparent_62%)] blur-2xl md:top-[8rem] md:h-[34rem] md:w-[34rem]"
          />
          <div
            aria-hidden="true"
            className="blob-drift-alt pointer-events-none absolute -right-24 top-[104rem] h-[46rem] w-[46rem] rounded-full bg-[radial-gradient(circle,rgba(28,28,64,0.30)_0%,transparent_62%)] blur-2xl md:top-[24rem] md:h-[38rem] md:w-[38rem]"
          />
          <Container className="relative">
            <Reveal>
              <Prose className="mx-auto text-center">
                <h2 className="t-h2 text-black">
                  02 mois pour pratiquer l&apos;anglais avec un accompagnement
                  structuré.
                </h2>
              </Prose>
            </Reveal>
            <div className="mx-auto mt-10 grid max-w-[60rem] items-center gap-10 lg:grid-cols-[42%_58%] lg:gap-12">
              <Reveal variant="left" delay={100}>
                <div>
                  <CadreImage>
                    <div className="aspect-[4/3]">
                      <ResponsiveImage
                        src="/assets/prelaunch/prelaunch-practice-exercises.png"
                        alt="Illustration d'un apprenant fictif qui pratique l'anglais devant son ordinateur"
                        fill
                        sizes="(min-width: 1024px) 55vw, 100vw"
                        className="img-zoom object-cover"
                      />
                    </div>
                  </CadreImage>
                </div>
              </Reveal>
              <Reveal variant="right" delay={160}>
                <Prose>
                  <p className="t-body text-black/75">
                    Les séances en ligne, la pratique orale, les expressions
                    utiles, les exercices, l&apos;accompagnement et la
                    communauté WhatsApp : voici exactement ce que couvrent les
                    02 mois.
                  </p>
                </Prose>
              </Reveal>
            </div>
            <div className="mx-auto mt-10 grid max-w-[60rem] gap-6 md:grid-cols-2">
              {INCLUS_PRELAUNCH.map((item, i) => (
                <Reveal key={item.num} variant="zoom" delay={i * 80}>
                  <div className="glass-card card-hover h-full p-6 lg:p-7">
                    <div className="flex items-baseline gap-4">
                      <Reveal
                        as="p"
                        variant="pop"
                        delay={i * 80 + 180}
                        className="font-display text-[2rem] font-medium leading-none text-black/25"
                      >
                        {item.num}
                      </Reveal>
                      <h3 className="t-h3 text-black">{item.titre}</h3>
                    </div>
                    <p className="t-body mt-4 text-black/70">{item.corps}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* ============================================================
          SECTION 5 — POURQUOI 15 000 FCFA (brief §5 + IMAGE 5
          prelaunch-offer-value.png) : bloc tarifaire en VRAI texte
          HTML/CSS — prix très visible, durée et rythme clairs.
          TASK 76 (instruction propriétaire) : l'IMAGE devient le FOND
          de la partie TEXTE (gauche) — cadre 12 px + voile noir pour
          la lisibilité.
          ============================================================ */}
        <section
          id="tarif"
          className="on-dark relative scroll-mt-20 overflow-hidden bg-black py-12 text-white lg:py-24"
        >
          <div
            aria-hidden="true"
            className="blob-drift pointer-events-none absolute left-[6%] top-[4rem] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(255,26,26,0.30)_0%,transparent_62%)] blur-2xl"
          />
          <div
            aria-hidden="true"
            className="blob-drift-alt pointer-events-none absolute right-[6%] bottom-[2rem] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(96,110,190,0.28)_0%,transparent_62%)] blur-2xl"
          />
          <Container className="relative">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              {/* TASK 76 (instruction propriétaire) : l'image de la
                  section devient le FOND de la partie TEXTE (à
                  gauche) — même cadre que le hero (coins 12 px + ombre
                  douce) ; l'image couvre tout le bloc derrière un voile
                  noir à 75 % qui garde chaque mot PARFAITEMENT lisible
                  (texte blanc, passages clés en graisse moyenne). La
                  colonne droite ne garde que le bloc tarifaire. */}
              <Reveal variant="left">
                <div className="relative overflow-hidden rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.10)]">
                  <div aria-hidden="true" className="absolute inset-0">
                    <ResponsiveImage
                      src="/assets/prelaunch/prelaunch-offer-value.png"
                      alt=""
                      fill
                      sizes="100vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/75" />
                  </div>
                  <div className="relative p-6 md:p-8 lg:p-10">
                    <Prose>
                      <h2 className="t-h2 text-white">
                        Une condition exceptionnelle du pré-lancement.
                      </h2>
                      {/* TASK 75 (instruction propriétaire) : contenu
                          REMPLACÉ par la version resserrée — 04
                          paragraphes, passages clés en graisse moyenne.
                          TASK 76 : blanc /85 — lisible sur le fond
                          image. */}
                      <p className="t-body mt-6 text-white/85">
                        Le programme principal{" "}
                        <span className="font-medium text-white">
                          De <span className="text-red-button">COMPRENDRE</span> à{" "}
                          <span className="text-red-button">PARLER</span>
                          <sup className="top-[-0.6em] text-[0.6em]">™</sup>
                        </span>{" "}
                        est prévu sur 03 mois au tarif de 70 000 FCFA. Pour ce
                        pré-lancement, nous proposons exceptionnellement{" "}
                        <span className="font-medium text-white">
                          02 mois d&apos;accompagnement à 15 000 FCFA, réservés à 05
                          participants seulement
                        </span>
                        .
                      </p>
                      <p className="t-body mt-4 text-white/85">
                        Cette première cohorte nous permettra d&apos;accompagner ces
                        participants, d&apos;observer leurs progrès réels et de
                        recueillir leurs retours afin de préparer le lancement
                        officiel sur des bases concrètes.
                      </p>
                      <p className="t-body mt-4 text-white/85">
                        En contrepartie, nous recherchons des personnes sérieuses,
                        prêtes à s&apos;investir pleinement dans leur apprentissage.
                      </p>
                      <p className="t-body mt-4 font-medium text-white">
                        Une occasion de bénéficier d&apos;un accompagnement
                        structuré à un tarif exceptionnel, tout en contribuant à la
                        préparation du programme officiel.
                      </p>
                    </Prose>
                  </div>
                </div>
              </Reveal>
              {/* Bloc tarifaire — PRIX EN VRAI TEXTE HTML/CSS, très
                  visible ; durée et rythme affichés clairement.
                  TASK 71 : entrée en zoom doux au scroll. */}
              <Reveal variant="zoom" delay={120}>
                <div className="glass-card glass-dark card-hover p-6 text-center md:p-8">
                  <Eyebrow className="text-white/70">
                    Pre-launch · Première cohorte
                  </Eyebrow>
                  <p className="t-stat mt-4 text-white">15 000 FCFA</p>
                  <p className="t-body mt-2 text-white/75">
                    pour les 02 mois d&apos;accompagnement — paiement unique.
                  </p>
                  <ul className="mt-6 space-y-2.5 border-t border-white/15 pt-6 text-left">
                    <li className="flex items-center gap-3">
                      <IconCheck
                        className="h-5 w-5 text-[#008000]"
                        fg="#ffffff"
                      />
                      <span className="t-body text-white">
                        02 mois d&apos;accompagnement intensif
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <IconCheck
                        className="h-5 w-5 text-[#008000]"
                        fg="#ffffff"
                      />
                      <span className="t-body text-white">
                        03 séances de 1 h 30 par semaine
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <IconCheck
                        className="h-5 w-5 text-[#008000]"
                        fg="#ffffff"
                      />
                      <span className="t-body text-white">
                        Exercices pratiques et expressions utiles
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <IconCheck
                        className="h-5 w-5 text-[#008000]"
                        fg="#ffffff"
                      />
                      <span className="t-body text-white">
                        Communauté WhatsApp de la cohorte
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <IconCheck
                        className="h-5 w-5 text-[#008000]"
                        fg="#ffffff"
                      />
                      <span className="t-body text-white">
                        100 % en ligne · 05 places disponibles
                      </span>
                    </li>
                  </ul>
                  <div className="mt-8">
                    <CtaOffre
                      label={CTA_HERO_LABEL}
                      className="w-full sm:w-auto"
                    />
                  </div>
                </div>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* ============================================================
          SECTION 6 — POURQUOI SEULEMENT 05 PLACES (brief §6 + IMAGE 7
          prelaunch-small-cohort.png) : « 05 PLACES DISPONIBLES » en
          VRAI texte HTML — aucun compteur restant, aucun faux compte
          à rebours (capacité réelle).
          TASK 75 (instruction propriétaire) : la bande défilante
          rouge qui ouvrait cette section (à la fin de la précédente
          « Une condition exceptionnelle ») est SUPPRIMÉE ; le contenu
          texte est REMPLACÉ par la version resserrée.
          ============================================================ */}
        <section id="places" className="scroll-mt-20">
          <div className="py-12 lg:py-24">
            <Container>
              <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
                <Reveal variant="left">
                  <Prose>
                    <h2 className="t-h2 text-black">
                      Parce qu&apos;un accompagnement sérieux demande du temps
                      et de l&apos;attention.
                    </h2>
                    {/* TASK 75 (instruction propriétaire) : contenu
                        REMPLACÉ par la version resserrée. */}
                    <p className="t-body mt-6 text-black/75">
                      Nous avons volontairement limité cette première cohorte à{" "}
                      <span className="font-medium text-black">
                        05 participants
                      </span>{" "}
                      afin de consacrer suffisamment de temps à chaque
                      apprenant, de suivre son évolution et d&apos;observer ses
                      progrès tout au long des 02 mois.
                    </p>
                    <p className="t-body mt-4 text-black/75">
                      L&apos;objectif est de travailler avec un groupe restreint
                      pour mieux accompagner chaque participant et tirer des
                      enseignements concrets de cette première expérience.
                    </p>
                    <p className="t-body mt-4 font-medium text-black">
                      C&apos;est pourquoi nous n&apos;accepterons pas plus de 05
                      personnes pour cette cohorte. Dès que les 05 inscriptions
                      seront confirmées, les inscriptions seront fermées.
                    </p>
                    <p className="t-body mt-4 text-black/75">
                      Si tu souhaites participer, nous t&apos;invitons donc à
                      passer à l&apos;action dès maintenant plutôt que de
                      supposer qu&apos;une place sera encore disponible plus
                      tard.
                    </p>
                  </Prose>
                </Reveal>
                <Reveal variant="right" delay={120}>
                  <div>
                    {/* « 05 PLACES DISPONIBLES » — vrai texte HTML/CSS,
                      séparé de l'image (exigence du brief). TASK 71 :
                      entrée en rebond léger (pop) au scroll. TASK 75 :
                      « maximum » → « disponibles » (instruction
                      propriétaire). */}
                    <Reveal
                      as="p"
                      variant="pop"
                      delay={220}
                      className="t-stat text-black"
                    >
                      05 <span className="t-stat-unit">places disponibles</span>
                    </Reveal>
                    <div className="mt-6">
                      <CadreImage>
                        <div className="aspect-[16/10]">
                          <ResponsiveImage
                            src="/assets/prelaunch/prelaunch-small-cohort.png"
                            alt="Illustration de quatre personnages fictifs réunis autour d'un ordinateur pour apprendre ensemble"
                            fill
                            sizes="(min-width: 1024px) 55vw, 100vw"
                            className="img-zoom object-cover"
                          />
                        </div>
                      </CadreImage>
                    </div>
                  </div>
                </Reveal>
              </div>
            </Container>
          </div>
        </section>

        {/* ============================================================
          SECTION 7 — À QUI S'ADRESSE CETTE OFFRE (brief §7) :
          deux colonnes « pour toi » / « pas pour toi ». TASK 71 : cartes
          en VERRE TRANSPARENT sur fond blanc + nappes de couleur
          derrière (même présentation que la section Pour qui ? de
          l'accueil) ; entrées latérales croisées gauche/droite.
          TASK 73 : BANDE DÉFILANTE ROUGE des mots-clés pre-launch en
          tête de section (instruction propriétaire).
          ============================================================ */}
        <section id="profil" className="relative scroll-mt-20 overflow-hidden">
          <div
            aria-hidden="true"
            className="blob-drift pointer-events-none absolute -left-24 top-[10rem] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(255,26,26,0.30)_0%,transparent_62%)] blur-2xl"
          />
          <div
            aria-hidden="true"
            className="blob-drift-alt pointer-events-none absolute -right-24 top-[40rem] h-[44rem] w-[44rem] rounded-full bg-[radial-gradient(circle,rgba(28,28,64,0.30)_0%,transparent_62%)] blur-2xl md:top-[6rem] md:h-[40rem] md:w-[40rem]"
          />
          <BandeMotsClesPrelaunch />
          <div className="py-12 lg:py-24">
            <Container className="relative">
              <Reveal>
                <Prose className="mx-auto text-center">
                  <h2 className="t-h2 text-black">
                    Cette expérience est faite pour toi si…
                  </h2>
                  <p className="t-body mt-6 text-black/75">
                    Nous voulons réunir 05 personnes motivées, conscientes de
                    leurs objectifs et prêtes à s&apos;investir dans leur
                    apprentissage.
                  </p>
                </Prose>
              </Reveal>
              <div className="mx-auto mt-10 grid max-w-[60rem] gap-6 md:grid-cols-2">
                <Reveal variant="left" delay={80}>
                  <div className="glass-card card-hover h-full p-6 lg:p-7">
                    <h3 className="t-h3 text-black">
                      Cette offre est pour toi si…
                    </h3>
                    <ul className="mt-5 space-y-3.5">
                      {POUR_TOI.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <IconCheck
                            className="mt-1 h-5 w-5 shrink-0 text-[#008000]"
                            fg="#ffffff"
                          />
                          <span className="t-body text-black/80">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
                <Reveal variant="right" delay={160}>
                  <div className="glass-card card-hover h-full p-6 lg:p-7">
                    <h3 className="t-h3 text-black">
                      Cette offre n&apos;est probablement pas adaptée à toi si…
                    </h3>
                    <ul className="mt-5 space-y-3.5">
                      {PAS_POUR_TOI.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span
                            aria-hidden="true"
                            className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center text-[1.05rem] font-bold leading-none text-red-button"
                          >
                            ✕
                          </span>
                          <span className="t-body text-black/80">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </div>
            </Container>
          </div>
        </section>

        {/* ============================================================
          SECTION 8 — COMMENT REJOINDRE LA COHORTE (brief §8) :
          04 étapes + bouton d'inscription vers le paiement.
          ============================================================ */}
        <section
          id="rejoindre"
          className="on-dark relative scroll-mt-20 overflow-hidden bg-black py-12 text-white lg:py-24"
        >
          <div
            aria-hidden="true"
            className="blob-drift pointer-events-none absolute left-[10%] top-[2rem] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(255,26,26,0.24)_0%,transparent_62%)] blur-2xl"
          />
          <div
            aria-hidden="true"
            className="blob-drift-alt pointer-events-none absolute right-[8%] bottom-[2rem] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(96,110,190,0.26)_0%,transparent_62%)] blur-2xl"
          />
          <Container className="relative">
            <Reveal>
              <Prose className="mx-auto text-center">
                <h2 className="t-h2 text-white">
                  04 étapes pour rejoindre cette première expérience.
                </h2>
              </Prose>
            </Reveal>
            <div className="mx-auto mt-10 grid max-w-[60rem] gap-6 md:grid-cols-2">
              {ETAPES_INSCRIPTION.map((e, i) => (
                <Reveal key={e.num} variant="zoom" delay={i * 100}>
                  <div className="glass-card glass-dark card-hover h-full p-6 lg:p-7">
                    <Reveal
                      as="p"
                      variant="pop"
                      delay={i * 100 + 200}
                      className="font-display text-[2rem] font-medium leading-none text-white/30"
                    >
                      {e.num}
                    </Reveal>
                    <h3 className="t-h3 mt-5 text-white">{e.titre}</h3>
                    <p className="t-body mt-3 text-white/75">{e.texte}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={200}>
              <div className="mx-auto mt-12 max-w-[36rem] text-center">
                <CtaOffre label={CTA_HERO_LABEL} className="w-full sm:w-auto" />
                <p className="t-body mt-6 text-white/70">
                  Les informations pratiques, notamment les horaires des
                  séances, seront communiquées aux participants dans le groupe.
                </p>
              </div>
            </Reveal>
          </Container>
        </section>

        {/* ============================================================
          SECTION 9 — FOIRE AUX QUESTIONS (brief §9) : accordéon
          existant (une question ouverte à la fois).
          ============================================================ */}
        <section id="faq" className="scroll-mt-20 py-12 lg:py-24">
          <Container>
            <Reveal>
              <Prose className="mx-auto text-center">
                <h2 className="t-h2 text-black">Foire aux questions.</h2>
              </Prose>
            </Reveal>
            <Reveal delay={100}>
              <div className="mx-auto mt-10 max-w-[46rem]">
                <FaqAccordion items={FAQ_PRELAUNCH} />
              </div>
            </Reveal>
          </Container>
        </section>

        {/* ============================================================
          SECTION 10 — DERNIER APPEL À L'ACTION (brief §10 + IMAGE 8
          prelaunch-final-cta.png) : rappel de l'offre, limite des 05
          places, CTA final vers le paiement de l'offre.
          ============================================================ */}
        <section
          id="inscription-offre"
          className="on-dark relative scroll-mt-20 overflow-hidden bg-black py-12 text-white lg:py-24"
        >
          <div
            aria-hidden="true"
            className="blob-drift pointer-events-none absolute left-[8%] top-[4rem] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(255,26,26,0.30)_0%,transparent_62%)] blur-2xl"
          />
          <div
            aria-hidden="true"
            className="blob-drift-alt pointer-events-none absolute right-[6%] bottom-[-4rem] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(96,110,190,0.28)_0%,transparent_62%)] blur-2xl"
          />
          <Container className="relative">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <Reveal variant="left">
                <Prose>
                  <h2 className="t-h2 text-white">
                    Tu veux commencer à parler anglais ? C&apos;est le moment de
                    découvrir cette opportunité.
                  </h2>
                  <p className="t-body mt-6 text-white/75">
                    Tu n&apos;as pas besoin de tout connaître avant de commencer
                    à pratiquer.
                  </p>
                  <p className="t-body text-white/75">
                    Tu as besoin d&apos;un cadre adapté à ton niveau, d&apos;une
                    pratique régulière et de la volonté de progresser.
                  </p>
                  <p className="t-body text-white/75">
                    Avec le{" "}
                    <span className="font-medium text-white">
                      Pre-launch • De{" "}
                      <span className="text-red-button">COMPRENDRE</span> à{" "}
                      <span className="text-red-button">PARLER</span>
                      <sup className="top-[-0.6em] text-[0.6em]">™</sup>
                    </span>
                    , tu peux rejoindre une première cohorte de 05 participants
                    pour 02 mois d&apos;accompagnement intensif en ligne, à 15
                    000 FCFA.
                  </p>
                  <p className="t-body text-white/75">
                    Mais cette expérience est volontairement limitée à 05
                    personnes afin de permettre un suivi rapproché.
                  </p>
                  <p className="t-body text-white/75">
                    Si tu es prêt à t&apos;investir, découvre les conditions et
                    vérifie que cette offre correspond à tes objectifs.
                  </p>
                  <div className="mt-8">
                    <CtaOffre
                      label={CTA_FINAL_LABEL}
                      className="w-full sm:w-auto"
                    />
                  </div>
                  <p className="t-caption mt-6 text-white/55">
                    15 000 FCFA · 02 mois d&apos;accompagnement · 05 places
                    disponibles
                  </p>
                </Prose>
              </Reveal>
              <Reveal variant="right" delay={120}>
                <div>
                  {/* TASK 73 : FORMAT VERTICAL 3:4 sur desktop (mobile
                    16:10 inchangé) — recadrage validé visuellement :
                    40 % horizontal garde l'apprenante enthousiaste
                    entière, bras levés compris. */}
                  <CadreImage>
                    <div className="aspect-[16/10] lg:aspect-[3/4]">
                      <ResponsiveImage
                        src="/assets/prelaunch/prelaunch-final-cta.png"
                        alt="Illustration d'une apprenante fictive enthousiaste devant son ordinateur"
                        fill
                        sizes="100vw"
                        className="img-zoom object-cover lg:[object-position:40%_50%]"
                      />
                    </div>
                  </CadreImage>
                </div>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* — Pied de page dédié à l'offre (brief : Mr. Steve English,
          Pre-launch • De COMPRENDRE à PARLER™, mention des conditions
          avant paiement). La page est focalisée : pas de footer global
          ni de navigation du site principal. TASK 75 (instruction
          propriétaire) : la ligne horizontale entre le dernier appel et
          le pied de page porte le MÊME balayage lumineux que sous le
          formulaire d'inscription du programme (classe .beam-separator
          de globals.css — lumière blanche qui circule de gauche à
          droite en continu). TASK 76 (retour propriétaire : « tu as
          juste séparé par un espace blanc ») : le conteneur racine de
          la page est BLANC — sans fond propre, la ligne rendait une
          simple bande claire. Fond NOIR posé sur la ligne (comme le
          fond noir de la page d'inscription) : la lumière balaie
          désormais EXACTEMENT comme sous le formulaire d'inscription. — */}
        <div className="beam-separator bg-black" aria-hidden="true" />
        <footer className="on-dark mt-auto bg-black py-10 text-white">
          <Container>
            <Reveal>
              <div className="mx-auto max-w-[42rem] text-center">
                <p className="font-display text-[1.25rem] font-medium">
                  Mr. Steve English
                </p>
                <p className="t-body mt-2 text-white/85">
                  Pre-launch • De{" "}
                  <span className="text-red-button">COMPRENDRE</span> à{" "}
                  <span className="text-red-button">PARLER</span>
                  <sup className="top-[-0.6em] text-[0.6em]">™</sup>
                </p>
                <p className="t-body mt-3 text-white/60">
                  Une expérience d&apos;accompagnement en ligne dédiée à la
                  pratique de l&apos;anglais.
                </p>
                <p className="t-caption mt-6 text-white/45">
                  Consulte les conditions de participation et les modalités
                  applicables à l&apos;offre avant de procéder au paiement.
                </p>
                <p className="t-caption mt-6 border-t border-white/10 pt-6 text-white/40">
                  © {new Date().getFullYear()} Stevens AKPOVI —{" "}
                  <Link
                    href="/"
                    className="underline-offset-4 transition-colors hover:text-white hover:underline"
                  >
                    mrsteveenglish.vercel.app
                  </Link>
                </p>
              </div>
            </Reveal>
          </Container>
        </footer>

        {/* Barre CTA sticky mobile — même cible que le bouton principal ;
          n'apparaît que quand aucun CTA in-page n'est visible. */}
        <StickyCTA href={CTA_HREF} label={CTA_HERO_LABEL} />
      </div>
    </>
  );
}
