"use client";

import { useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PRELAUNCH, PRELAUNCH_CHECKOUT_URL, waLink } from "@/lib/site";
import {
  PRODUIT_PRELAUNCH,
  pixelEventId,
  trackPixelWithCAPI,
} from "@/lib/meta-pixel";
import { useScrolled } from "@/lib/motion";
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
 * programme principal ne fuit vers ce tunnel, et inversement). Une
 * barre minimaliste (logo → accueil) et un pied de page dédié à
 * l'offre encadrent la page.
 *
 * IDENTITÉ (brief §1) : blanc #FFFFFF / noir #000000 / rouge #FF0000,
 * composants, styles et animations existants (btn-primary + reflet,
 * glass-card, Reveal, hero-line, StickyCTA). Les 10 sections du brief
 * + pied de page. Images : public/assets/prelaunch/ (noms réels —
 * le portrait du fondateur est un .png, extension réelle respectée),
 * variantes WebP pré-générées (manifeste image-variants.json).
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
function CtaOffre({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
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

/** Barre minimaliste (page focalisée) : logo « Stevens AKPOVI » →
 *  accueil du site. Transparente au sommet (hero noir), noire au
 *  scroll — même mécanique que le header global. */
function TopBar() {
  const scrolled = useScrolled(8);
  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-[240ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
        scrolled
          ? "border-b border-white/10 bg-[#000000]"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between lg:h-[72px]">
          <Link
            href="/"
            className="font-display text-[1.125rem] font-medium tracking-tight text-white"
          >
            Stevens AKPOVI
          </Link>
          <p className="t-caption hidden text-white/60 sm:block">
            Pre-launch · Première cohorte · {PRELAUNCH.places} places
          </p>
        </div>
      </Container>
    </header>
  );
}

/** Cadre image élégant et homogène (ratio fixe = zéro décalage de
 *  mise en page). */
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
        "overflow-hidden rounded-[12px] border border-grey-line bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Légende discrète sous les illustrations à personnages — rappelle
 *  qu'il s'agit d'illustrations fictives (brief §4). */
function Legende({ children }: { children: React.ReactNode }) {
  return (
    <p className="t-caption mt-3 text-black/50">{children}</p>
  );
}

/* — SECTION 4 : les 06 éléments inclus (brief, texte exact) — */
const INCLUS_PRELAUNCH = [
  {
    num: "01",
    titre: "Trois séances par semaine",
    corps:
      "Trois séances de 1 h 30 par semaine pendant deux mois, organisées pour te permettre de pratiquer régulièrement et de travailler progressivement ton expression orale.",
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
    titre: "Un accompagnement pendant les deux mois",
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

/* — SECTION 7 : à qui s'adresse l'offre (listes exactes du brief) — */
const POUR_TOI = [
  "Tu es un vrai débutant en anglais et tu ne sais presque pas parler.",
  "Tu connais quelques mots ou expressions, mais tu as du mal à construire des phrases.",
  "Tu comprends certaines choses en anglais, mais tu bloques lorsque tu dois répondre.",
  "Tu souhaites apprendre à t'exprimer oralement et tu es prêt à pratiquer régulièrement.",
  "Tu peux consacrer du temps aux trois séances hebdomadaires et aux exercices.",
  "Tu disposes d'une connexion internet adaptée pour suivre l'accompagnement en ligne.",
  "Tu es prêt à appliquer les conseils reçus et à prendre ton apprentissage au sérieux.",
];
const PAS_POUR_TOI = [
  "Tu cherches une formation sans devoir participer activement.",
  "Tu n'es pas disponible pour suivre régulièrement les séances.",
  "Tu n'es pas prêt à réaliser les exercices ou à pratiquer entre les séances.",
  "Tu attends une garantie de maîtrise complète de l'anglais en seulement deux mois.",
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
      "Si l'offre te convient, clique sur le bouton d'inscription pour accéder à la page de paiement sécurisée et régler les 15 000 FCFA correspondant aux deux mois d'accompagnement.",
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
      "L'accompagnement dure deux mois, avec trois séances de 1 h 30 par semaine.",
  },
  {
    question: "Quel est le tarif ?",
    answer:
      "La participation est de 15 000 FCFA pour les deux mois d'accompagnement prévus dans cette offre de pré-lancement.",
  },
  {
    question: "La formation se déroule-t-elle en présentiel ?",
    answer:
      "Non. L'accompagnement est entièrement en ligne. Tu dois disposer d'une connexion internet adaptée pour participer aux séances.",
  },
  {
    question: "Dois-je être disponible à des horaires précis ?",
    answer:
      "Oui. Il est nécessaire de pouvoir participer aux trois séances hebdomadaires. Les horaires précis seront communiqués aux participants dans la communauté WhatsApp.",
  },
  {
    question: "Vais-je parler couramment anglais après deux mois ?",
    answer:
      "Nous ne garantissons pas une maîtrise complète de l'anglais en deux mois. L'objectif est de pratiquer régulièrement, de travailler ton expression orale et de commencer à t'exprimer progressivement en fonction de ton niveau et de ton implication.",
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
    answer:
      "Les conditions applicables aux paiements et aux éventuels remboursements sont précisées dans les conditions de l'offre. Consulte-les attentivement avant de procéder au paiement.",
  },
];

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
    <div className="flex min-h-screen flex-col bg-white">
      <TopBar />

      {/* ============================================================
          SECTION 1 — HERO (brief §1) : question d'accroche, promesse
          des 02 mois, prix, CTA, méta — portrait RÉEL du fondateur à
          côté du titre (SEULE section où il apparaît).
          ============================================================ */}
      <section className="on-dark relative overflow-hidden bg-black pb-16 pt-[112px] text-white lg:pb-24 lg:pt-[168px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[4%] top-[12%] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(255,26,26,0.28)_0%,transparent_62%)] blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[2%] bottom-[-6rem] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(96,110,190,0.30)_0%,transparent_62%)] blur-2xl"
        />
        <Container className="relative">
          <div className="grid items-center gap-10 lg:grid-cols-[45%_55%] lg:gap-14">
            {/* Portrait du fondateur — cadre professionnel élégant,
                AUCUN filtre (teint inchangé), recadrage 4:3 orienté
                vers le sujet (visage + lunettes préservés). */}
            <div className="hero-line hero-d1 lg:order-1">
              <div className="relative overflow-hidden rounded-[12px] border border-white/15 shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
                <div className="aspect-[4/3]">
                  <ResponsiveImage
                    src="/assets/prelaunch/mrsteve-portrait-hero.png"
                    alt="Stevens AKPOVI, coach d'anglais et fondateur de Mr Steve English"
                    fill
                    priority
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover [object-position:65%_35%]"
                  />
                </div>
              </div>
            </div>

            <div className="text-center lg:order-2 lg:text-left">
              <p className="hero-line hero-d1 text-[0.75rem] font-medium uppercase tracking-[0.18em] text-red-button">
                Pre-launch · Première cohorte
              </p>
              <h1 className="hero-line hero-d2 t-h1 mt-4 text-white">
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
                , avec seulement cinq places pour cette première cohorte.
              </p>
              <p className="hero-line hero-d5 mt-8 font-display text-[1.75rem] font-medium leading-tight text-white md:text-[2.125rem]">
                15 000 FCFA{" "}
                <span className="text-[1.125rem] font-normal text-white/70 md:text-[1.25rem]">
                  pour les deux mois d&apos;accompagnement.
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
          ============================================================ */}
      <section id="probleme" className="scroll-mt-20 py-12 lg:py-24">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <Reveal>
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
                  besoin d&apos;attendre de tout connaître avant de
                  commencer à pratiquer.
                </p>
                <div className="mt-6 rounded-[12px] bg-black p-6 md:p-7">
                  <p className="font-display text-[1.25rem] font-medium leading-snug text-white md:text-[1.375rem]">
                    Tu as besoin de travailler ton expression orale, de
                    t&apos;entraîner régulièrement et d&apos;apprendre à
                    utiliser progressivement ce que tu connais déjà.
                  </p>
                  <p className="t-body mt-4 text-white/75">
                    C&apos;est précisément dans cette démarche que
                    s&apos;inscrit notre offre de pré-lancement.
                  </p>
                </div>
              </Prose>
            </Reveal>
            <Reveal delay={120}>
              <div>
                <CadreImage>
                  <div className="aspect-[3/2]">
                    <ResponsiveImage
                      src="/assets/prelaunch/prelaunch-speaking-block.png"
                      alt="Illustration d'un personnage fictif qui hésite à parler lors d'une conversation en ligne"
                      fill
                      sizes="(min-width: 1024px) 48vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </CadreImage>
                <Legende>
                  Illustration — personnage fictif, représentation du blocage
                  à l&apos;oral.
                </Legende>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ============================================================
          SECTION 3 — L'OPPORTUNITÉ (brief §3 + IMAGE 3
          prelaunch-online-session.png) : première cohorte, pratique,
          pas de promesse irréaliste.
          ============================================================ */}
      <section
        id="opportunite"
        className="on-dark relative scroll-mt-20 overflow-hidden bg-black py-12 text-white lg:py-24"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[8%] top-[2rem] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(255,26,26,0.26)_0%,transparent_62%)] blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[4%] bottom-[-4rem] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(96,110,190,0.28)_0%,transparent_62%)] blur-2xl"
        />
        <Container className="relative">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <Reveal>
              <Prose>
                <h2 className="t-h2 text-white">
                  Une première cohorte. 05 personnes. Un objectif :
                  commencer à parler anglais.
                </h2>
                <p className="t-body mt-6 text-white/75">
                  Dans le cadre du pré-lancement de notre programme{" "}
                  <span className="font-medium text-white">
                    De <span className="text-red-button">Comprendre</span> à{" "}
                    <span className="text-red-button">Parler</span>
                    <sup className="top-[-0.6em] text-[0.6em]">™</sup>
                  </span>
                  , nous ouvrons une première cohorte de 05 participants pour
                  deux mois d&apos;accompagnement intensif.
                </p>
                <p className="t-body text-white/75">
                  Cette expérience est destinée aux personnes qui veulent
                  réellement apprendre l&apos;anglais, mais qui débutent ou
                  qui n&apos;arrivent pas encore à s&apos;exprimer oralement.
                </p>
                <p className="t-body text-white/75">
                  Pendant ces deux mois, nous mettrons l&apos;accent sur la
                  pratique, les expressions utiles, les exercices et
                  l&apos;application progressive de ce que tu apprends.
                </p>
                <p className="t-body text-white/75">
                  L&apos;objectif est de t&apos;aider à commencer à
                  construire des phrases, à utiliser des expressions adaptées
                  à ton niveau et à prendre progressivement la parole en
                  anglais.
                </p>
                <p className="t-body border-t border-white/15 pt-6 text-white/75">
                  Il ne s&apos;agit pas de te promettre de devenir
                  parfaitement bilingue en deux mois. Il s&apos;agit de te
                  proposer un cadre structuré pour pratiquer, travailler ton
                  expression orale et progresser avec méthode.
                </p>
              </Prose>
            </Reveal>
            <Reveal delay={120}>
              <div>
                <CadreImage className="border-white/15 bg-black shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
                  <div className="aspect-[16/10]">
                    <ResponsiveImage
                      src="/assets/prelaunch/prelaunch-online-session.png"
                      alt="Illustration d'une apprenante fictive qui parle anglais pendant une séance en ligne"
                      fill
                      sizes="(min-width: 1024px) 48vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </CadreImage>
                <p className="t-caption mt-3 text-white/45">
                  Illustration — apprenante fictive pendant une séance de
                  pratique orale.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ============================================================
          SECTION 4 — CE QUI EST INCLUS (brief §4 + IMAGE 4
          prelaunch-practice-exercises.png) : 06 cartes numérotées.
          ============================================================ */}
      <section id="inclus" className="scroll-mt-20 py-12 lg:py-24">
        <Container>
          <Reveal>
            <Prose className="mx-auto text-center">
              <h2 className="t-h2 text-black">
                Deux mois pour commencer à pratiquer l&apos;anglais avec un
                accompagnement structuré.
              </h2>
            </Prose>
          </Reveal>
          <div className="mx-auto mt-10 grid max-w-[60rem] items-center gap-10 lg:grid-cols-[42%_58%] lg:gap-12">
            <Reveal delay={100}>
              <div>
                <CadreImage>
                  <div className="aspect-[4/3]">
                    <ResponsiveImage
                      src="/assets/prelaunch/prelaunch-practice-exercises.png"
                      alt="Illustration d'un apprenant fictif qui pratique l'anglais devant son ordinateur"
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </CadreImage>
                <Legende>
                  Illustration — apprenant fictif pendant ses exercices de
                  pratique.
                </Legende>
              </div>
            </Reveal>
            <Reveal delay={160}>
              <Prose>
                <p className="t-body text-black/75">
                  Les séances en ligne, la pratique orale, les expressions
                  utiles, les exercices, l&apos;accompagnement et la
                  communauté WhatsApp : voici exactement ce que couvrent les
                  deux mois.
                </p>
              </Prose>
            </Reveal>
          </div>
          <div className="mx-auto mt-10 grid max-w-[60rem] gap-6 md:grid-cols-2">
            {INCLUS_PRELAUNCH.map((item, i) => (
              <Reveal key={item.num} delay={i * 80}>
                <div className="card-hover h-full rounded-[12px] border border-grey-line bg-grey-soft p-6 lg:p-7">
                  <div className="flex items-baseline gap-4">
                    <p className="font-display text-[2rem] font-medium leading-none text-black/25">
                      {item.num}
                    </p>
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
          ============================================================ */}
      <section
        id="tarif"
        className="on-dark relative scroll-mt-20 overflow-hidden bg-black py-12 text-white lg:py-24"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[6%] top-[4rem] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(255,26,26,0.30)_0%,transparent_62%)] blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[6%] bottom-[2rem] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(96,110,190,0.28)_0%,transparent_62%)] blur-2xl"
        />
        <Container className="relative">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <Reveal>
              <Prose>
                <h2 className="t-h2 text-white">
                  Une condition exceptionnelle pour la première cohorte de
                  pré-lancement.
                </h2>
                <p className="t-body mt-6 text-white/75">
                  Le programme principal{" "}
                  <span className="font-medium text-white">
                    De <span className="text-red-button">Comprendre</span> à{" "}
                    <span className="text-red-button">Parler</span>
                    <sup className="top-[-0.6em] text-[0.6em]">™</sup>
                  </span>{" "}
                  est prévu sur trois mois, au tarif de 70 000 FCFA.
                </p>
                <p className="t-body text-white/75">
                  L&apos;offre que nous te présentons ici est différente :
                  elle porte exclusivement sur deux mois
                  d&apos;accompagnement, proposés exceptionnellement à{" "}
                  <span className="font-medium text-white">15 000 FCFA</span>{" "}
                  pour cette première cohorte.
                </p>
                <p className="t-body text-white/75">Pourquoi cette différence ?</p>
                <p className="t-body text-white/75">
                  Parce que cette expérience s&apos;inscrit dans un défi que
                  nous nous sommes fixé dans le cadre de la préparation du
                  lancement officiel du programme.
                </p>
                <p className="t-body text-white/75">
                  Nous voulons accompagner cinq personnes pendant deux mois,
                  observer leurs progrès réels, recueillir leurs retours et
                  tirer des enseignements concrets de cette première
                  expérience.
                </p>
                <p className="t-body text-white/75">
                  Nous avons choisi d&apos;investir notre temps et notre
                  expertise dans ce travail afin de préparer la suite du
                  programme sur des bases concrètes.
                </p>
                <p className="t-body text-white/75">
                  En retour, nous recherchons des participants qui
                  s&apos;impliqueront sérieusement dans leur apprentissage et
                  qui accepteront de faire les efforts nécessaires pour
                  progresser.
                </p>
                <p className="t-body text-white/75">
                  Cette offre est donc une occasion particulière de
                  bénéficier d&apos;un accompagnement structuré à un tarif
                  accessible, dans le cadre de notre pré-lancement.
                </p>
              </Prose>
            </Reveal>
            <Reveal delay={120}>
              <div className="space-y-6">
                {/* Bloc tarifaire — PRIX EN VRAI TEXTE HTML/CSS, très
                    visible ; durée et rythme affichés clairement. */}
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
                      <IconCheck className="h-5 w-5 text-[#008000]" fg="#ffffff" />
                      <span className="t-body text-white">
                        02 mois d&apos;accompagnement intensif
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <IconCheck className="h-5 w-5 text-[#008000]" fg="#ffffff" />
                      <span className="t-body text-white">
                        03 séances de 1 h 30 par semaine
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <IconCheck className="h-5 w-5 text-[#008000]" fg="#ffffff" />
                      <span className="t-body text-white">
                        Exercices pratiques et expressions utiles
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <IconCheck className="h-5 w-5 text-[#008000]" fg="#ffffff" />
                      <span className="t-body text-white">
                        Communauté WhatsApp de la cohorte
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <IconCheck className="h-5 w-5 text-[#008000]" fg="#ffffff" />
                      <span className="t-body text-white">
                        100 % en ligne · 05 places maximum
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
                <CadreImage className="border-white/15 bg-black shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
                  <div className="aspect-[16/10]">
                    <ResponsiveImage
                      src="/assets/prelaunch/prelaunch-offer-value.png"
                      alt="Bureau minimaliste avec ordinateur portable, carnet et casque audio"
                      fill
                      sizes="(min-width: 1024px) 48vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </CadreImage>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ============================================================
          SECTION 6 — POURQUOI SEULEMENT 05 PLACES (brief §6 + IMAGE 7
          prelaunch-small-cohort.png) : « 05 PLACES MAXIMUM » en VRAI
          texte HTML — aucun compteur restant, aucun faux compte à
          rebours (capacité réelle).
          ============================================================ */}
      <section id="places" className="scroll-mt-20 py-12 lg:py-24">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <Reveal>
              <Prose>
                <h2 className="t-h2 text-black">
                  Parce qu&apos;un accompagnement sérieux demande du temps et
                  de l&apos;attention.
                </h2>
                <p className="t-body mt-6 text-black/75">
                  Nous avons volontairement limité cette première cohorte à
                  cinq participants.
                </p>
                <p className="t-body text-black/75">
                  Notre objectif n&apos;est pas de réunir le plus grand nombre
                  de personnes possible. Nous voulons pouvoir consacrer
                  suffisamment de temps à chaque apprenant, suivre son
                  évolution et observer les progrès réalisés pendant les deux
                  mois.
                </p>
                <p className="t-body text-black/75">
                  Cette première expérience doit nous permettre de travailler
                  avec un groupe restreint et de mieux comprendre le parcours
                  des participants.
                </p>
                <p className="t-body font-medium text-black">
                  C&apos;est pourquoi nous ne prendrons pas plus de 05
                  personnes pour cette cohorte.
                </p>
                <p className="t-body text-black/75">
                  Dès que les 05 inscriptions seront confirmées, les
                  inscriptions à cette offre seront fermées.
                </p>
                <p className="t-body text-black/75">
                  Si tu souhaites participer, nous t&apos;invitons à
                  découvrir les conditions dès maintenant plutôt que de
                  supposer qu&apos;une place sera encore disponible plus tard.
                </p>
              </Prose>
            </Reveal>
            <Reveal delay={120}>
              <div>
                {/* « 05 PLACES MAXIMUM » — vrai texte HTML/CSS, séparé de
                    l'image (exigence du brief). */}
                <p className="t-stat text-black">
                  05 <span className="t-stat-unit">places maximum</span>
                </p>
                <div className="mt-6">
                  <CadreImage>
                    <div className="aspect-[16/10]">
                      <ResponsiveImage
                        src="/assets/prelaunch/prelaunch-small-cohort.png"
                        alt="Illustration de quatre personnages fictifs réunis autour d'un ordinateur pour apprendre ensemble"
                        fill
                        sizes="(min-width: 1024px) 48vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  </CadreImage>
                  <Legende>
                    Illustration — personnages fictifs. La capacité réelle de
                    la cohorte est de 05 participants.
                  </Legende>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ============================================================
          SECTION 7 — À QUI S'ADRESSE CETTE OFFRE (brief §7) :
          deux colonnes « pour toi » / « pas pour toi ».
          ============================================================ */}
      <section id="profil" className="scroll-mt-20 bg-[#F4F4F6] py-12 lg:py-24">
        <Container>
          <Reveal>
            <Prose className="mx-auto text-center">
              <h2 className="t-h2 text-black">
                Cette expérience est faite pour toi si…
              </h2>
              <p className="t-body mt-6 text-black/75">
                Nous voulons réunir cinq personnes motivées, conscientes de
                leurs objectifs et prêtes à s&apos;investir dans leur
                apprentissage.
              </p>
            </Prose>
          </Reveal>
          <div className="mx-auto mt-10 grid max-w-[60rem] gap-6 md:grid-cols-2">
            <Reveal delay={80}>
              <div className="card-hover h-full rounded-[12px] border border-grey-line bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] lg:p-7">
                <h3 className="t-h3 text-black">Cette offre est pour toi si…</h3>
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
            <Reveal delay={160}>
              <div className="card-hover h-full rounded-[12px] border border-grey-line bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] lg:p-7">
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
          className="pointer-events-none absolute left-[10%] top-[2rem] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(255,26,26,0.24)_0%,transparent_62%)] blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[8%] bottom-[2rem] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(96,110,190,0.26)_0%,transparent_62%)] blur-2xl"
        />
        <Container className="relative">
          <Reveal>
            <Prose className="mx-auto text-center">
              <h2 className="t-h2 text-white">
                Quatre étapes pour rejoindre cette première expérience.
              </h2>
            </Prose>
          </Reveal>
          <div className="mx-auto mt-10 grid max-w-[60rem] gap-6 md:grid-cols-2">
            {ETAPES_INSCRIPTION.map((e, i) => (
              <Reveal key={e.num} delay={i * 100}>
                <div className="glass-card glass-dark card-hover h-full p-6 lg:p-7">
                  <p className="font-display text-[2rem] font-medium leading-none text-white/30">
                    {e.num}
                  </p>
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
          className="pointer-events-none absolute left-[8%] top-[4rem] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(255,26,26,0.30)_0%,transparent_62%)] blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[6%] bottom-[-4rem] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(96,110,190,0.28)_0%,transparent_62%)] blur-2xl"
        />
        <Container className="relative">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <Reveal>
              <Prose>
                <h2 className="t-h2 text-white">
                  Tu veux commencer à parler anglais ? C&apos;est le moment de
                  découvrir cette opportunité.
                </h2>
                <p className="t-body mt-6 text-white/75">
                  Tu n&apos;as pas besoin de tout connaître avant de
                  commencer à pratiquer.
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
                  pour deux mois d&apos;accompagnement intensif en ligne, à
                  15 000 FCFA.
                </p>
                <p className="t-body text-white/75">
                  Mais cette expérience est volontairement limitée à cinq
                  personnes afin de permettre un suivi rapproché.
                </p>
                <p className="t-body text-white/75">
                  Si tu es prêt à t&apos;investir, découvre les conditions et
                  vérifie que cette offre correspond à tes objectifs.
                </p>
                <div className="mt-8">
                  <CtaOffre label={CTA_FINAL_LABEL} className="w-full sm:w-auto" />
                </div>
                <p className="t-caption mt-6 text-white/55">
                  15 000 FCFA · 02 mois d&apos;accompagnement · 05 places
                  maximum
                </p>
              </Prose>
            </Reveal>
            <Reveal delay={120}>
              <div>
                <CadreImage className="border-white/15 bg-black shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
                  <div className="aspect-[16/10]">
                    <ResponsiveImage
                      src="/assets/prelaunch/prelaunch-final-cta.png"
                      alt="Illustration d'une apprenante fictive enthousiaste devant son ordinateur"
                      fill
                      sizes="(min-width: 1024px) 48vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </CadreImage>
                <p className="t-caption mt-3 text-white/45">
                  Illustration — apprenante fictive.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* — Pied de page dédié à l'offre (brief : Mr. Steve English,
          Pre-launch • De COMPRENDRE à PARLER™, mention des conditions
          avant paiement). La page est focalisée : pas de footer global
          ni de navigation du site principal. — */}
      <footer className="on-dark mt-auto border-t border-white/10 bg-black py-10 text-white">
        <Container>
          <div className="mx-auto max-w-[42rem] text-center">
            <p className="font-display text-[1.25rem] font-medium">
              Mr. Steve English
            </p>
            <p className="t-body mt-2 text-white/85">
              Pre-launch • De <span className="text-red-button">COMPRENDRE</span>{" "}
              à <span className="text-red-button">PARLER</span>
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
        </Container>
      </footer>

      {/* Barre CTA sticky mobile — même cible que le bouton principal ;
          n'apparaît que quand aucun CTA in-page n'est visible. */}
      <StickyCTA href={CTA_HREF} label={CTA_HERO_LABEL} />
    </div>
  );
}
