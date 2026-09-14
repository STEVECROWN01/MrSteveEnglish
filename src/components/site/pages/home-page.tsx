"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useInViewOnce, usePrefersReducedMotion } from "@/lib/motion";
import { CTA_LABELS, OFFRE } from "@/lib/site";
import { Container, Eyebrow, Prose, Section } from "../layout-primitives";
import { CtaButton, SecondaryLink } from "../buttons";
import { IconCheck, IconCross } from "../icons";
import { Reveal } from "../reveal";
import { CountUp } from "../count-up";
import { StickyCTA } from "../sticky-cta";
import { MicrophoneScene } from "../microphone-scene";
import { ResponsiveImage } from "../responsive-image";
import { FaqAccordion } from "../faq-accordion";

/**
 * PAGE 1 — ACCUEIL — FUNNEL DE CONVERSION AUTOUR DE L'OFFRE UNIQUE
 * (instruction propriétaire : le site vend une TRANSFORMATION, pas des
 * cours — « Comprendre l'anglais » → « Oser le parler » → « Parler avec
 * confiance »).
 * Parcours (instruction propriétaire) : problème → coût de l'inaction →
 * solution → méthode → transformation → offre → preuve → FAQ → CTA.
 * Une seule offre partout : Programme « De "Comprendre" à "Parler" » —
 * 03 mois — 70 000 FCFA — paiement unique. Aucun multi-format, aucune
 * mention d'offre 2 mois, aucun compte à rebours inventé (urgence
 * strictement éthique). Voix première personne : le coach parle en « je ».
 */

export function HomePage() {
  return (
    <>
      <Hero />
      <ProblemeAgitation />
      <Solution />
      <PourquoiCaMarchaitPas />
      <Accompagnement />
      <AvantApres />
      <CeQueTuAchetes />
      <CeQuiEstInclus />
      <PourquoiMoi />
      <PourQui />
      <SectionPrix />
      <Garantie />
      <FaqSection />
      <CtaFinal />
      <StickyCTA href="#/contact" label={CTA_LABELS.decouvrirCourt} />
    </>
  );
}

/** Fin du titre hero — machine à écrire rotative (instruction
 *  propriétaire) : « ta gorge se noue. » → « ta gorge se serre. » →
 *  « tu te bloques. » → « tu perds tes mots. » puis retour à la première,
 *  en boucle infinie. La phrase est FRAPPÉE lettre par lettre (~75 ms),
 *  tenue 3 s APRÈS la fin de la frappe (le chrono démarre une fois la
 *  phrase complète — pas au début de la frappe), puis EFFACÉE lettre par
 *  lettre (~40 ms, retour arrière) — la suivante est frappée immédiatement
 *  après l'effacement complet.
 *  Zéro déplacement du texte environnant : un réservoir invisible (la
 *  variante la plus large) occupe la boîte finale dès le premier rendu et
 *  le texte frappé s'y superpose — la boîte ne change jamais de hauteur.
 *  Rendu serveur identique au client (aucun décalage d'hydratation) ;
 *  SEO/lecteurs d'écran : copie sr-only de la première variante dans le
 *  h1. Reduced motion : texte statique sur la première variante. */
const HERO_PHRASES = [
  "ta gorge se noue.",
  "ta gorge se serre.",
  "tu te bloques.",
  "tu perds tes mots.",
] as const;

/* Réservoir = la plus large des variantes : garantit la hauteur maximale
   que la frappe peut occuper, quel que soit le viewport. */
const HERO_RESERVE = "tu perds tes mots.";

const TYPE_MS = 75; // frappe : ~1,3 s pour la phrase la plus longue
const DELETE_MS = 40; // effacement : retour arrière plus rapide
const HOLD_MS = 3000; // tenue APRÈS la fin de la frappe (instruction)
const FIRST_TYPE_DELAY_MS = 700; // laisse la ligne hero-d2 se révéler

function HeroTypewriter() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"waiting" | "typing" | "deleting">(
    "waiting",
  );
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const current = HERO_PHRASES[index];
    let t: ReturnType<typeof setTimeout> | undefined;

    if (phase === "waiting") {
      // Première frappe : après la révélation de la ligne hero-d2
      // (délai 230 ms + animation 600 ms).
      t = setTimeout(() => setPhase("typing"), FIRST_TYPE_DELAY_MS);
    } else if (phase === "typing") {
      if (text.length < current.length) {
        t = setTimeout(
          () => setText(current.slice(0, text.length + 1)),
          TYPE_MS,
        );
      } else {
        // Phrase complète : le chrono de 3 s démarre ICI.
        t = setTimeout(() => setPhase("deleting"), HOLD_MS);
      }
    } else if (text.length > 0) {
      t = setTimeout(
        () => setText(current.slice(0, text.length - 1)),
        DELETE_MS,
      );
    } else {
      // Effacement complet : phrase suivante, frappe immédiate.
      setIndex((i) => (i + 1) % HERO_PHRASES.length);
      setPhase("typing");
    }

    return () => {
      if (t) clearTimeout(t);
    };
  }, [text, phase, index, reduced]);

  if (reduced) {
    return (
      <span className="hero-line hero-d2 block hero-phrase-type">
        {HERO_PHRASES[0]}
      </span>
    );
  }

  return (
    <span className="hero-line hero-d2 block relative">
      {/* Réservoir invisible : réserve exactement la boîte finale dès le
          premier rendu — aucun mouvement du texte environnant pendant la
          frappe ou l’effacement. */}
      <span aria-hidden="true" className="invisible">
        {HERO_RESERVE}
      </span>
      {/* Texte frappé, superposé au réservoir — rouge verrouillé DA §19
          (même rouge que les CTA). */}
      <span aria-hidden="true" className="hero-phrase-type absolute inset-0">
        {text}
      </span>
    </span>
  );
}

/* — Hero : l'image HERO-01 couvre la totalité de la section (plein
     cadre, edge-to-edge) et passe derrière la barre de navigation
     transparente (instruction propriétaire : au sommet, le header est
     sans fond). Le texte est posé SUR l'image (overlay), aligné à
     gauche dans la zone sombre, ancré vers le bas.
     Typo : taille DA §6 RESTAURÉE à pleine échelle (instruction
     propriétaire : titre redevenu trop petit après le calibrage
     précédent) — un léger plafond lié à la hauteur d'écran (7,1svh)
     garde le hero dans le premier écran sur les portables bas (le
     contenu hero est plus court qu'avant : sous-titre d'une ligne
     d'esprit, ligne programme compacte). — */
function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden">
      {/* Image — couvre tout le hero */}
      <div className="absolute inset-0">
        <ResponsiveImage
          src="/assets/HERO-01.webp"
          alt="Stevens AKPOVI, coach d'anglais, souriant, assis à une table dans un intérieur chaleureux"
          fill
          priority
          /* Netteté haute densité (instruction propriétaire) : le hero
             recadre un visuel paysage dans un viewport portrait — le crop
             amplifie l'étirement, d'où des tailles surfaites (300vw mobile /
             200vw tablette) qui forcent la variante 2560w sur les écrans
             DPR 2–3 (mobile : 2,1× plus de pixels qu'avant). Desktop
             100vw → 2560w (100 Ko, plus légère que l'originale). */
          sizes="(max-width: 640px) 300vw, (max-width: 1024px) 200vw, 100vw"
          className="object-cover object-[75%_center] lg:object-center"
        />
        {/* Overlays de lisibilité : voile renforcé côté gauche (zone du
            texte) qui s'éclaircit vers le sujet à droite, fondu bas
            (texte mobile) et voile haut (navigation) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/10"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/35"
        />
      </div>

      {/* Texte sur l'image — aligné à gauche, calé vers le bas.
          Colonne élargie à 33rem (instruction propriétaire : titre
          plus grand sans ajouter de lignes — les phrases cassent
          moins) ; espacements compactés pour garantir 0px de
          débordement sur les portables bas. */}
      <Container className="relative w-full pb-24 pt-28 lg:pb-16 lg:pt-20 [@media(max-height:750px)]:pb-16 [@media(max-height:750px)]:pt-24 [@media(max-height:750px)]:lg:pb-12 [@media(max-height:750px)]:lg:pt-16 [@media(min-height:1050px)]:lg:pb-48">
        <div className="max-w-[33rem]">
          {/* Pleine taille DA (64px+) sur écrans standard ; plafond léger
              min(4.5rem, 8.15svh) — titre encore un peu agrandi
              (instruction propriétaire, 2e demande) — pour que le titre
              multi-lignes tienne dans le premier écran des portables bas —
              1080p garde 72px nets. Mobile : clamp rehaussé
              (2.5rem → 4.5rem, pente 3.6vw). */}
          <h1 className="t-h1 text-white text-[length:clamp(2.5rem,1.7rem+3.6vw,4.5rem)] lg:text-[length:min(4.5rem,8.15svh)]">
            <span className="hero-line hero-d1 block">
              Tu comprends l&apos;anglais depuis des années.
            </span>
            <span className="hero-line hero-d2 block">
              Mais dès qu&apos;il faut parler,
              <span className="sr-only"> ta gorge se noue.</span>
            </span>
            <HeroTypewriter />
          </h1>
          {/* Sous-titre (instruction propriétaire — nouveau) */}
          <p className="hero-line hero-d3 t-body mt-4 text-white/85 lg:mt-4">
            En 03 mois, transforme ton anglais que tu comprends en anglais
            que tu oses vraiment parler avec confiance.
          </p>
          <div className="hero-line hero-d4 mt-5 lg:mt-5">
            <span data-wa-cta className="inline-flex">
              <CtaButton href="#/contact">{CTA_LABELS.hero}</CtaButton>
            </span>
          </div>
          {/* Ligne programme sous le CTA (instruction propriétaire) */}
          <p className="hero-line hero-d5 t-caption mt-4 text-white/75">
            {OFFRE.resumeSousCta}
          </p>
        </div>
      </Container>
    </section>
  );
}

/* — Problème + Agitation : fond noir plein, sobre. La carte FOMO
     (« quelqu'un d'autre postule ») a été RETIRÉE (instruction
     propriétaire : plus de FOMO/urgence artificielle) et remplacée par
     une urgence strictement ÉTHIQUE, ancrée dans la situation du
     prospect — pas de faux compte à rebours, pas de rareté inventée. — */
/* — Coût de l'inaction — URGENCE ÉTHIQUE (instruction propriétaire :
            l'urgence vient de la situation du prospect, jamais d'un
            artifice). En CARTE sombre encadrée (instruction propriétaire :
            même langage que l'ancienne carte « quelqu'un d'autre postule »).
            Composant réutilisé par le CTA final. — */
function CarteUrgenceEthique({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-[12px] border border-white/15 bg-white/[0.06] p-6 md:p-8 lg:p-10",
        className,
      )}
    >
      <Eyebrow className="text-white/75">Le coût de l&apos;inaction</Eyebrow>
      <p className="font-display mt-4 text-[1.375rem] leading-snug text-white md:text-[1.625rem] lg:text-[1.75rem]">
        Chaque mois où tu repousses ta pratique est un mois supplémentaire
        pendant lequel tu restes dans la même situation.
      </p>
      <p className="t-body mt-4 text-white/85">
        Ta prochaine opportunité ne commencera pas quand tu te sentiras
        parfaitement prêt. Commence maintenant.
      </p>
    </div>
  );
}

function ProblemeAgitation() {
  return (
    <section className="on-dark relative overflow-hidden bg-black text-white">
      <Container className="relative py-12 lg:py-24">
        {/* Section Problème */}
        <Reveal>
          <Prose>
            <Eyebrow className="text-white/75">
              Le blocage que tu connais trop bien
            </Eyebrow>
            <h2 className="t-h2 mt-4 text-white">
              Ce n&apos;est pas ton niveau qui bloque. C&apos;est ta bouche.
            </h2>
            <p className="t-body text-white/85">
              Tu lis un email en anglais sans problème. Tu comprends un film
              sans sous-titres. Mais dès qu&apos;il faut répondre à l&apos;oral
              — en réunion, à l&apos;oral d&apos;un examen, en voyage, face à un
              anglophone — les mots restent coincés. Tu réfléchis trop. Tu as
              peur de l&apos;erreur. Et le silence devient plus confortable que
              la phrase.
            </p>
          </Prose>
        </Reveal>

        {/* Section Agitation — image PROBLEME-01 à gauche, texte du
            bloc aligné à droite (instruction propriétaire). Mobile :
            image puis texte, empilés. */}
        <Reveal className="mt-16 lg:mt-24">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,25rem)_minmax(0,42rem)] lg:justify-between lg:gap-12">
            {/* Image — à gauche du texte (apprenante bloquée, feuille
                froissée : l'agitation du problème) */}
            <div className="relative mx-auto w-full max-w-[25rem] overflow-hidden rounded-[12px] lg:mx-0">
              <ResponsiveImage
                src="/assets/PROBLEME-01.webp"
                alt="Apprenante démotivée : menton posé sur la main devant ses livres de grammaire anglaise, feuille froissée sur le bureau"
                width={900}
                height={1125}
                sizes="(max-width: 1023px) 92vw, 400px"
                className="h-auto w-full"
              />
            </div>

            {/* Texte — positionné à droite de l'image */}
            <Prose>
              {/* Deux temps, deux titres (instruction propriétaire) :
                  le constat d&apos;abord, puis la conséquence. */}
              <h2 className="t-h2 text-white">
                Et pendant ce temps, ton projet attend.
              </h2>
              <p className="t-body text-white/85">
                Un poste qui exige l&apos;anglais. Un examen qui approche. Un
                voyage que tu repousses parce que tu as peur de ne pas savoir
                répondre à une simple question. Étudiant, professionnel, futur
                voyageur — peu importe ton objectif, il attend que tu sois capable
                de parler. Chaque mois qui passe sans progrès, c&apos;est cet
                objectif qui se rapproche sans que tu sois prêt.
              </p>
              <h2 className="t-h2 mt-12 text-white">
                Puis quelqu&apos;un d&apos;autre postule.
              </h2>
              <p className="t-body text-white/85">
                Quelqu&apos;un qui ose parler — même imparfaitement — passe
                l&apos;entretien, décroche le poste, signe le client, part
                travailler à l&apos;étranger. Ton blocage ne coûte pas seulement
                de la frustration : il te coûte des opportunités que tu ne
                verras même jamais passer. Et chaque mois qui passe éloigne un
                peu plus les prochaines.
              </p>
            </Prose>
          </div>
        </Reveal>

        {/* Coût de l'inaction — URGENCE ÉTHIQUE en carte (instruction
            propriétaire : le moment d'affirmation prend le même langage
            visuel que l'ancienne carte « quelqu'un d'autre postule »). */}
        <Reveal className="mt-16 lg:mt-24">
          <CarteUrgenceEthique />
        </Reveal>
      </Container>
    </section>
  );
}

/* — Solution : retour au blanc. Le fond passe du noir au blanc
     par fondu 500ms à l'entrée dans le viewport. Card avec le chiffre
     clé 98 % en noir, image METHOD-01 À DROITE du bloc contenu, à la
     MÊME HAUTEUR que lui (instruction propriétaire). Offre unique :
     plus aucune mention de format multiples. — */
function Solution() {
  return (
    <section
      id="methode"
      className="relative scroll-mt-20 overflow-hidden bg-white lg:scroll-mt-24"
    >
      <DarkFadeOverlay />
      {/* Limite de section oblique (instruction propriétaire) :
          24 px mobile / 32 px desktop, sous le voile dark-fade. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-0 block h-6 w-full lg:h-8"
      >
        <polygon points="0,0 100,0 0,100" fill="#000000" />
      </svg>
      <Container className="relative py-12 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,46rem)_minmax(0,22rem)] lg:items-stretch lg:justify-center lg:gap-12">
          {/* Bloc contenu (à gauche de l'image) */}
          <Reveal>
            <div className="card-base card-hover p-6 md:p-10 lg:p-12">
              <Eyebrow>Ma méthode</Eyebrow>
              <h2 className="t-h2 mt-4 text-black">
                Une méthode que j&apos;adapte à toi, séance après séance.
              </h2>
              <p className="t-body mt-6">
                Je ne suis pas un programme figé. J&apos;ajuste chaque séance à
                ce que tu as réellement compris — pas à ce qui était prévu sur
                le papier.
              </p>
              <p className="t-body mt-4">
                Résultat : Après quelques semaines, le changement ne se mesure
                plus seulement dans ce que tu connais, mais dans ce que tu oses
                enfin faire. Répondre sans préparer chaque phrase. Trouver tes
                mots sans paniquer. Continuer une conversation même quand ton
                anglais n&apos;est pas parfait. C&apos;est à ce moment-là que
                l&apos;anglais commence réellement à devenir une langue que tu
                utilises — et plus seulement une matière que tu étudies.
              </p>
              <p className="t-body mt-4">
                Je t&apos;accompagne en ligne, pendant trois mois, avec un
                objectif clair : que tu parles anglais avec confiance, dans
                ton domaine, pour ton objectif à toi.
              </p>

              {/* Chiffre clé — noir pur sur fond blanc, jamais en rouge (DA §5) */}
              <div className="mt-10 flex flex-wrap items-baseline gap-x-4 gap-y-2 border-t border-grey-line pt-8">
                <p className="t-stat text-black">
                  <CountUp value={98} />
                  <span className="t-stat-unit"> %</span>
                </p>
                <p className="max-w-[22rem] text-[0.9375rem] leading-snug text-grey-mid">
                  de mes débutants absolus s&apos;expriment librement après un
                  mois de coaching
                </p>
              </div>
            </div>
          </Reveal>

          {/* Image METHOD-01 — même hauteur que le bloc à sa gauche sur
              desktop (lg:h-full + object-cover 60 %). Mobile : 2:3. */}
          <Reveal delay={120}>
            <div className="relative mx-auto aspect-[2/3] w-full max-w-[22rem] overflow-hidden rounded-[12px] lg:mx-0 lg:aspect-auto lg:h-full">
              <ResponsiveImage
                src="/assets/METHOD-01.webp"
                alt="Apprenante souriante en pleine séance de coaching d'anglais en ligne, concentrée sur son écran — tasse « Small Steps Big Progress » posée sur le bureau"
                fill
                sizes="352px"
                className="object-cover object-[60%_center]"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/* — « POURQUOI ÇA NE MARCHAIT PAS AVANT » (instruction propriétaire :
     l'ancienne section « Comment ça marche » devient le traitement des
     anciennes méthodes). QUATRE cartes image de fond + texte overlay :
     applications, cours traditionnels (visuels PROVISOIRES en attente
     des images du propriétaire), grammaire seule, méthode vivante.
     Cartes COMPACTES (instruction propriétaire : hauteur réduite) et
     descriptions VRAIMENT percutantes — pas une phrase jetée. — */
const ANCIENNES_METHODES = [
  {
    image: "/assets/METHODE-02-applications.webp",
    alt: "Apprenant seul chez lui, le regard fatigué, devant une application d'anglais sur son téléphone : personne pour le faire parler",
    eyebrow: "Les applications",
    titre: "Des badges, pas des mots.",
    texte:
      "Des mois de séries de mots, de badges dorés, de scores parfaits. Et le jour où quelqu'un te parle en vrai ? Le silence. Taper sur un écran n'a jamais débloqué une bouche : tu révises, tu mémorises… et tu ne parles toujours pas.",
  },
  {
    image: "/assets/METHODE-02-traditionnel.webp",
    alt: "Salle de classe traditionnelle : le professeur écrit des règles de grammaire au tableau, les apprenants copient passivement",
    eyebrow: "Les cours traditionnels",
    titre: "Trois minutes de parole par heure.",
    texte:
      "Le professeur parle, le tableau se remplit, tu recopies. Sur soixante minutes de cours, tu parles trois minutes — parfois moins. Tu paies pour écouter quelqu'un d'autre parler anglais. Des années comme ça, et le blocage est toujours là.",
  },
  {
    image: "/assets/METHODE-01-rigide.webp",
    alt: "Homme pensif face à ses livres de grammaire anglaise — feuilles froissées sur le bureau, affiche « Discipline » : l'étude rigide qui ne fait pas parler",
    eyebrow: "La grammaire seule",
    titre: "La théorie ne parle pas.",
    texte:
      "Tu connais les règles sur le bout des doigts. Mais face à un anglophone, aucune règle ne vient à ta rescousse. Personne n'a jamais appris à parler en relisant des tableaux de conjugaison — comme personne n'a appris à nager dans un livre.",
  },
  {
    image: "/assets/METHODE-01-fluide.webp",
    alt: "Femme souriante en séance de coaching d'anglais en visioconférence — casque sur les oreilles, lumière chaude : la pratique vivante qui débloque la parole",
    eyebrow: "La méthode vivante",
    titre: "Ici, tu parles. Dès la première séance.",
    texte:
      "Pas de badge à collectionner, pas de tableau à recopier : tu parles dès la première séance, à ton niveau, sur tes vraies situations. On pratique, on corrige, on répète — jusqu'à ce que parler devienne un réflexe.",
  },
];

function PourquoiCaMarchaitPas() {
  return (
    <Section>
      {/* Trait de séparation court (instruction propriétaire) : 112 px,
          centré verticalement dans l'espace inter-sections (compensé
          par le margin-bottom équivalent — seul le trait bouge). */}
      <div
        aria-hidden="true"
        className="mx-auto -mt-12 mb-12 h-[3px] w-28 bg-black lg:-mt-24 lg:mb-24"
      />
      <Container>
        <Reveal>
          <Prose>
            <Eyebrow>Pourquoi ça ne marchait pas avant</Eyebrow>
            <h2 className="t-h2 mt-4 text-black">
              Ce que tu as déjà essayé ne pouvait pas te faire parler.
            </h2>
            <p className="t-body">
              Ce n&apos;est pas ta faute : ces méthodes n&apos;ont simplement
              pas été conçues pour débloquer ta prise de parole. Voici
              pourquoi — et ce qui change ici.
            </p>
          </Prose>
        </Reveal>

        {/* Quatre cartes — image de fond + voile + texte overlay.
            2×2 desktop (sm:), empilées mobile. Hauteur FLEXIBLE
            (instruction propriétaire : les titres des cartes 2-4 restaient
            coincés contre le bord supérieur — l'ancien ratio fixe 4:3/3:2
            était trop court pour le texte sur mobile). La carte garde une
            hauteur minimum compacte et GRANDIT si le texte l'exige :
            plus aucun texte ne peut déborder du cadre. */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-14 lg:gap-8">
          {ANCIENNES_METHODES.map((carte, i) => (
            <Reveal key={carte.eyebrow} delay={(i % 2) * 120}>
              <figure className="relative flex min-h-[21rem] flex-col justify-end overflow-hidden rounded-[12px] sm:min-h-[23rem] lg:min-h-[24rem]">
                <ResponsiveImage
                  src={carte.image}
                  alt={carte.alt}
                  fill
                  sizes="(max-width: 639px) 92vw, (max-width: 1023px) 60vw, 566px"
                  className="object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/65 to-black/10"
                />
                <figcaption className="relative p-6 [text-shadow:0_1px_12px_rgba(0,0,0,0.5)] md:p-7">
                  <Eyebrow className="text-white/80">{carte.eyebrow}</Eyebrow>
                  <h3 className="t-h3 mt-2 text-white">{carte.titre}</h3>
                  <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-white/90">
                    {carte.texte}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

      </Container>
    </Section>
  );
}

/* — Comment se déroule l'accompagnement (méthode) — texte à gauche,
     scène 3D « microphone tech » à droite. Fond commun sombre (radial
     studio étendu à toute la section). OFFRE UNIQUE : plus de version
     2 mois, plus de choix individuel/groupe, plus de carte « places
     limitées » (rareté retirée — instruction propriétaire). — */
function Accompagnement() {
  return (
    <Section className="on-dark relative overflow-hidden bg-[radial-gradient(120%_85%_at_50%_78%,#1b1b1f_0%,#0c0c0e_52%,#050506_100%)] text-white lg:bg-[radial-gradient(120%_85%_at_70%_20%,#1b1b1f_0%,#0c0c0e_52%,#050506_100%)]">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <div>
            <Reveal>
              <Prose>
                <h2 className="t-h2 text-white">
                  Trois mois. Trois séances par semaine. Une transformation.
                </h2>
                <p className="t-body text-white/85">
                  Le programme dure trois mois, à raison de trois séances de
                  1h30 par semaine. C&apos;est le rythme qui a mené un
                  apprenant jusqu&apos;à l&apos;expatriation professionnelle
                  — un rythme qui installe l&apos;anglais dans ton quotidien,
                  sans le laisser retomber entre deux séances.
                </p>
                <p className="t-body text-white/85">
                  Chaque séance est une vraie prise de parole : des
                  conversations inspirées de situations réelles, des
                  corrections personnalisées au bon moment, un travail sur ta
                  prononciation. Et entre les séances, des exercices courts
                  prolongent la progression.
                </p>
                <p className="t-body text-white/85">
                  Le résultat dépend d&apos;une chose : que tu mettes en
                  application ce qui est travaillé ensemble. C&apos;est
                  exactement ce que la garantie engage.
                </p>
              </Prose>
            </Reveal>

            {/* Timeline — DA §12, déclinée en blanc sur le fond sombre */}
            <Reveal className="mt-12">
              <div className="max-w-[34rem]">
                <div className="flex items-center" aria-hidden="true">
                  <span className="h-3.5 w-3.5 shrink-0 rounded-full bg-white" />
                  <span className="h-[2px] flex-1 bg-white" />
                  <span className="h-3.5 w-3.5 shrink-0 rounded-full bg-white" />
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-[0.9375rem] font-medium text-white">
                    Mois 1
                  </span>
                  <span className="text-[0.9375rem] font-medium text-white">
                    Mois 2-3
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal className="mt-12">
              <span data-wa-cta className="inline-flex">
                <CtaButton href="#/contact">{CTA_LABELS.hero}</CtaButton>
              </span>
              {/* Ligne programme sous le CTA (instruction propriétaire) */}
              <p className="t-caption mt-4 text-white/70">
                {OFFRE.resumeSousCta}
              </p>
            </Reveal>
          </div>

          {/* Scène 3D — chargée à l'approche du viewport uniquement */}
          <Reveal delay={120}>
            <MicrophoneScene className="mx-auto max-w-[30rem] lg:max-w-none" />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

/* — « AVANT → APRÈS » (instruction propriétaire) : comparaison visuelle
     très forte, deux cartes plein image avec texte en overlay. Images
     PROVISOIRES (en attente des visuels du propriétaire) : PROBLEME-01
     pour l'avant, METHOD-01 pour l'après. Flèche de transformation au
     centre sur desktop. — */
const AVANT = [
  "Je comprends mais je n'arrive pas à répondre.",
  "Je cherche mes mots.",
  "J'ai peur de faire des erreurs.",
  "Je traduis dans ma tête.",
  "Je manque de confiance.",
];

const APRES = [
  "Je prends la parole plus facilement.",
  "Je construis mes phrases plus naturelment.",
  "Je comprends mieux les conversations.",
  "Je fais moins de traductions mentales.",
  "Je parle avec davantage de confiance.",
];

function AvantApres() {
  return (
    <Section>
      <Container>
        <Reveal>
          <Prose className="mx-auto max-w-[42rem] text-center">
            <Eyebrow>La transformation</Eyebrow>
            <h2 className="t-h2 mt-4 text-black">
              Avant le programme. Après le programme.
            </h2>
            <p className="t-body">
              Le même apprenant, trois mois d&apos;écart — la différence
              entre comprendre l&apos;anglais et oser le parler.
            </p>
          </Prose>
        </Reveal>

        <div className="mt-10 grid items-stretch gap-6 lg:mt-14 lg:grid-cols-[1fr_auto_1fr] lg:gap-4">
          {/* AVANT */}
          <Reveal>
            <figure className="relative h-full min-h-[26rem] overflow-hidden rounded-[12px]">
              <ResponsiveImage
                src="/assets/PROBLEME-01.webp"
                alt="Apprenante bloquée : menton posé sur la main devant ses livres, feuille froissée — l'anglais compris mais pas parlé"
                fill
                sizes="(max-width: 1023px) 180vw, 44vw"
                className="object-cover [filter:grayscale(35%)]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/25"
              />
              <figcaption className="absolute inset-x-0 bottom-0 p-6 [text-shadow:0_1px_12px_rgba(0,0,0,0.5)] md:p-8">
                <p className="font-display text-[1.375rem] font-medium text-white/90">
                  AVANT
                </p>
                <ul className="mt-4 space-y-2.5">
                  {AVANT.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-white/60"
                      />
                      <span className="t-body text-white/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </figcaption>
            </figure>
          </Reveal>

          {/* Flèche de transformation (desktop) */}
          <div
            aria-hidden="true"
            className="hidden items-center justify-center lg:flex"
          >
            <svg width="44" height="24" viewBox="0 0 44 24" fill="none">
              <path
                d="M2 12 C 16 12, 28 12, 40 12 M34 5 C 36.5 8, 38.5 10, 40.5 12 C 38.5 14, 36.5 16, 34 19"
                stroke="#000000"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* APRÈS */}
          <Reveal delay={120}>
            <figure className="relative h-full min-h-[26rem] overflow-hidden rounded-[12px]">
              <ResponsiveImage
                src="/assets/METHOD-01.webp"
                alt="Apprenante épanouie en séance de coaching en ligne, tasse « Small Steps Big Progress » sur le bureau — l'anglais qu'on ose parler"
                fill
                sizes="(max-width: 1023px) 180vw, 44vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/25"
              />
              <figcaption className="absolute inset-x-0 bottom-0 p-6 [text-shadow:0_1px_12px_rgba(0,0,0,0.5)] md:p-8">
                <p className="font-display text-[1.375rem] font-medium text-white">
                  APRÈS
                </p>
                <ul className="mt-4 space-y-2.5">
                  {APRES.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <IconCheck className="mt-0.5 text-white" fg="#000000" />
                      <span className="t-body text-white">{item}</span>
                    </li>
                  ))}
                </ul>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

/* — « CE QUE TU ACHÈTES VRAIMENT » (instruction propriétaire) : ne pas
     présenter des cours, présenter la TRANSFORMATION. Les 10 axes du
     programme en grille de checks. — */
const AXES_PROGRAMME = [
  "Pratique orale régulière",
  "Conversations réelles",
  "Corrections personnalisées",
  "Prononciation",
  "Vocabulaire utile",
  "Compréhension orale",
  "Construction des phrases",
  "Confiance à l'oral",
  "Accompagnement personnalisé",
  "Exercices entre les séances",
];

function CeQueTuAchetes() {
  return (
    <Section className="bg-grey-soft">
      <Container>
        <Reveal>
          <Prose className="mx-auto max-w-[46rem] text-center">
            <Eyebrow>Ce que tu achètes vraiment</Eyebrow>
            <h2 className="t-h2 mt-4 text-black">
              Tu n&apos;achètes pas 03 mois de cours d&apos;anglais.
            </h2>
            <p className="t-body">
              Tu investis dans ta capacité à communiquer en anglais avec
              plus de confiance — une compétence qui reste avec toi bien
              après le programme, dans ton travail, tes études, tes voyages
              et ta vie personnelle.
            </p>
          </Prose>
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-[52rem] gap-x-10 gap-y-4 sm:grid-cols-2 lg:mt-14">
          {AXES_PROGRAMME.map((axe, i) => (
            <Reveal key={axe} delay={(i % 2) * 80}>
              <div className="flex items-start gap-3 border-b border-grey-line pb-4">
                <IconCheck className="mt-0.5 text-black" />
                <span className="t-body text-black">{axe}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* — « CE QUI EST INCLUS » (instruction propriétaire) : le programme
     présenté comme un package à forte valeur perçue — blocs numérotés.
     PODCASTS inclus (instruction propriétaire) : ressource de pratique
     pure mise à disposition de l'apprenant. — */
const INCLUS = [
  {
    num: "01",
    titre: "Coaching personnalisé",
    corps: "Des séances adaptées à ton niveau, tes difficultés et ton objectif.",
  },
  {
    num: "02",
    titre: "Speaking Practice",
    corps: "Une pratique centrée sur la prise de parole réelle.",
  },
  {
    num: "03",
    titre: "Prononciation",
    corps: "Identification et correction de tes erreurs de prononciation.",
  },
  {
    num: "04",
    titre: "Conversation",
    corps: "Des situations inspirées de la vie réelle.",
  },
  {
    num: "05",
    titre: "Exercices personnalisés",
    corps: "Du travail entre les séances pour accélérer ta progression.",
  },
  {
    num: "06",
    titre: "Suivi",
    corps: "Une progression structurée pendant les trois mois.",
  },
  {
    num: "07",
    titre: "Podcasts",
    corps:
      "Des podcasts à ta disposition pour la pratique pure : de l'anglais réel à écouter, entre les séances, à ton rythme.",
  },
];

function CeQuiEstInclus() {
  return (
    <Section>
      <Container>
        <Reveal>
          <Prose className="mx-auto max-w-[46rem] text-center">
            <Eyebrow>Ce qui est inclus</Eyebrow>
            <h2 className="t-h2 mt-4 text-black">
              Ton accompagnement de 03 mois comprend :
            </h2>
          </Prose>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-8">
          {INCLUS.map((item, i) => (
            <Reveal key={item.num} delay={(i % 4) * 100}>
              <div className="card-base card-hover flex h-full flex-col p-6">
                <p className="font-display text-[2rem] font-medium leading-none text-grey-line">
                  {item.num}
                </p>
                <h3 className="t-h3 mt-5 text-black">{item.titre}</h3>
                <p className="t-body mt-3">{item.corps}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* — « POURQUOI MOI ? » (instruction propriétaire) : développer Stevens
     comme marque personnelle — répond à la question silencieuse « pourquoi
     toi plutôt qu'une application ou un autre professeur ? ». Portrait à
     gauche, arguments à droite, bouton vers la page À propos. — */
const POURQUOI_MOI = [
  "Une expérience réelle du coaching, terrain et en ligne",
  "Une approche personnalisée — chaque séance est calée sur toi",
  "Une habitude des débutants et des intermédiaires",
  "Une maîtrise de l'anglais forgée par la formation et la pratique",
  "La compréhension des difficultés spécifiques des francophones",
  "Un coaching 100 % en ligne, où que tu sois",
  "Une approche centrée sur la pratique orale — pas sur la théorie",
];

function PourquoiMoi() {
  return (
    <Section className="on-dark bg-black text-white">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,24rem)_minmax(0,40rem)] lg:gap-16">
          {/* Portrait Stevens */}
          <Reveal>
            <div className="relative mx-auto aspect-[2/3] w-full max-w-[22rem] overflow-hidden rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.10)] lg:mx-0">
              <ResponsiveImage
                src="/assets/APROPOS-PORTRAIT.webp"
                alt="Portrait professionnel de Stevens Akpovi, coach d'anglais, en costume noir et lunettes, dans un intérieur moderne"
                fill
                sizes="352px"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <Prose>
              <Eyebrow className="text-white/75">Pourquoi moi ?</Eyebrow>
              <h2 className="t-h2 mt-4 text-white">
                Pourquoi apprendre avec moi, plutôt qu&apos;avec une
                application ou un autre professeur ?
              </h2>
              <p className="t-body text-white/85">
                Parce qu&apos;une application ne t&apos;entend pas. Parce
                qu&apos;un programme figé ne s&apos;adapte pas. Et parce que
                ce blocage spécifique — <strong>comprendre sans oser
                parler</strong> — est exactement celui que je traite, séance
                après séance.
              </p>
              <ul className="mt-6 space-y-3">
                {POURQUOI_MOI.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <IconCheck className="mt-0.5 text-white" fg="#000000" />
                    <span className="t-body text-white/85">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <SecondaryLink
                  href="#/a-propos"
                  className="btn-secondary-dark"
                >
                  {CTA_LABELS.pourquoiMoi}
                </SecondaryLink>
              </div>
            </Prose>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

/* — « POUR QUI ? » (instruction propriétaire) : qualification du
     prospect — deux cartes face à face, ce qui qualifie / ce qui
     disqualifie (croix rouges, le rouge restant réservé aux accents
     hors CTA dans cet usage sémantique d'exclusion). — */
const POUR_TOI = [
  "tu comprends déjà un peu ou assez bien l'anglais mais tu as du mal à le parler ;",
  "tu es débutant ou intermédiaire ;",
  "tu veux améliorer ton anglais pour le travail, les études, les voyages ou ta vie personnelle ;",
  "tu veux pratiquer régulièrement ;",
  "tu veux être accompagné plutôt qu'apprendre seul ;",
  "tu es prêt à pratiquer entre les séances ;",
  "tu es prêt à mettre en application mes conseils.",
];

const PAS_POUR_TOI = [
  "tu cherches une solution magique sans pratiquer ;",
  "tu veux uniquement apprendre de la grammaire ;",
  "tu ne comptes pas participer régulièrement ;",
  "tu n'es pas réellement engagé à garder la discipline jusqu'au bout.",
];

function PourQui() {
  return (
    <Section>
      <Container>
        <Reveal>
          <Prose className="mx-auto max-w-[46rem] text-center">
            <Eyebrow>Pour qui ?</Eyebrow>
            <h2 className="t-h2 mt-4 text-black">
              Ce programme est-il fait pour toi ?
            </h2>
            <p className="t-body">
              Je préfère te le dire franchement avant que tu t&apos;engages.
            </p>
          </Prose>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:mt-14 lg:grid-cols-2 lg:gap-8">
          {/* POUR TOI */}
          <Reveal>
            <div className="card-base h-full p-6 md:p-8 lg:p-10">
              <h3 className="t-h3 text-black">Ce programme est pour toi si :</h3>
              <ul className="mt-6 space-y-3.5">
                {POUR_TOI.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <IconCheck className="mt-0.5 text-black" />
                    <span className="t-body">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* PAS POUR TOI */}
          <Reveal delay={120}>
            <div className="card-base h-full p-6 md:p-8 lg:p-10">
              <h3 className="t-h3 text-black">
                Ce programme n&apos;est PAS pour toi si :
              </h3>
              <ul className="mt-6 space-y-3.5">
                {PAS_POUR_TOI.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <IconCross className="mt-0.5" />
                    <span className="t-body">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="t-body mt-8 text-grey-mid">
                Dans ces cas, aucune méthode honnête ne te fera parler — et
                je préfère ne pas te vendre un programme qui ne te convient
                pas.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

/* — SECTION PRIX (instruction propriétaire) : le contenu de l'ancienne
     page Offres, RENFORCÉ, devient le bloc central de conversion de
     l'accueil — offre unique, value stack complet à côté du prix, CTA
     dédié. Fond noir : moment le plus fort du funnel. Value stack en
     DEUX COLONNES de cinq (instruction propriétaire) avec les PODCASTS
     (pratique pure) inclus. — */
const VALUE_STACK = [
  "Pratique orale régulière",
  "Conversations réelles",
  "Corrections personnalisées",
  "Prononciation",
  "Vocabulaire utile",
  "Construction des phrases",
  "Confiance à l'oral",
  "Accompagnement personnalisé",
  "Exercices entre les séances",
  "Des podcasts pour la pratique pure",
];

function SectionPrix() {
  return (
    <Section className="on-dark relative overflow-hidden bg-black text-white">
      <Container>
        <Reveal>
          <Prose className="mx-auto max-w-[46rem] text-center">
            <Eyebrow className="text-white/75">L&apos;offre</Eyebrow>
            <h2 className="t-h2 mt-4 text-white">
              <span className="text-red-button">03 mois</span> pour passer de
              la compréhension à la parole.
            </h2>
            <p className="t-body text-white/85">
              Programme « De <span className="text-red-button">Comprendre</span>{" "}
              à <span className="text-red-button">Parler</span> » — 03 mois de
              coaching d&apos;anglais personnalisé, en ligne.
            </p>
          </Prose>
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-[64rem] gap-6 lg:mt-14 lg:grid-cols-[minmax(0,28rem)_minmax(0,32rem)] lg:justify-center lg:gap-8">
          {/* Bloc prix */}
          <Reveal>
            <div className="flex h-full flex-col rounded-[12px] border border-white/20 bg-white/[0.06] p-6 md:p-10">
              <p className="t-caption font-medium uppercase tracking-[0.14em] text-white/75">
                Paiement unique
              </p>
              <p className="mt-6 flex flex-wrap items-baseline gap-x-4">
                <span className="t-stat text-white">{OFFRE.prix}</span>
                <span className="t-stat-unit text-white">{OFFRE.devise}</span>
              </p>
              <p className="t-body mt-6 text-white/85">
                Pas d&apos;abonnement. Pas de paiement mensuel. Pas de frais
                cachés.
              </p>
              <p className="t-body mt-4 font-medium text-white">
                Un seul paiement. Trois mois d&apos;accompagnement.
              </p>

              {/* Durée mise en scène : le programme est un accompagnement
                  de 03 mois, pas des séances isolées (instruction
                  propriétaire : valeur perçue). */}
              <div className="mt-8 border-t border-white/15 pt-6" aria-hidden="true">
                <div className="flex items-center">
                  <span className="h-3 w-3 shrink-0 rounded-full bg-white" />
                  <span className="h-[2px] flex-1 bg-white/40" />
                  <span className="h-3 w-3 shrink-0 rounded-full bg-white" />
                  <span className="h-[2px] flex-1 bg-white/40" />
                  <span className="h-3 w-3 shrink-0 rounded-full bg-white" />
                </div>
                <div className="mt-3 flex items-baseline justify-between text-[0.9375rem] font-medium text-white">
                  <span>Mois 1</span>
                  <span>Mois 2</span>
                  <span>Mois 3</span>
                </div>
              </div>

              <div className="mt-auto pt-10">
                <span data-wa-cta className="inline-flex w-full">
                  <CtaButton href="#/contact" className="w-full">
                    {CTA_LABELS.rejoindre}
                  </CtaButton>
                </span>
                <p className="t-caption mt-4 text-center text-white/70">
                  {OFFRE.sousCtaPrix}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Value stack — tout ce que tu reçois (instruction
              propriétaire : ne jamais écrire juste « 70 000 FCFA »).
              Liste longue → DEUX colonnes de cinq dans la même carte
              (instruction propriétaire). */}
          <Reveal delay={120}>
            <div className="h-full rounded-[12px] border border-white/15 bg-white/[0.03] p-6 md:p-10">
              <h3 className="t-h3 text-white">
                Voici tout ce que tu reçois pour {OFFRE.prix}{" "}
                {OFFRE.devise} :
              </h3>
              <ul className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2 sm:grid-rows-5 sm:grid-flow-col">
                {VALUE_STACK.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <IconCheck className="mt-0.5 text-white" fg="#000000" />
                    <span className="t-body text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="t-body mt-8 border-t border-white/15 pt-6 text-white/85">
                Soit un accompagnement complet sur trois mois — pas des
                séances isolées, mais un parcours structuré, du premier
                déclic jusqu&apos;à une parole qui tient debout.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

/* — GARANTIE + PREUVE (instruction propriétaire) : la garantie est
     basée sur l'ENGAGEMENT, jamais une promesse absolue de résultat
     sans conditions ; le contenu PREUVE (cas réel + 98 %) vit
     désormais À DROITE du cadre garantie — hors du cadre, pas dedans.
     Carte « contrat » sur fond clair, bordure noire épaisse (héritage
     DA de l'encart Offres). — */
function Garantie() {
  return (
    <Section>
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Cadre garantie — à gauche */}
          <Reveal>
            <div className="h-full rounded-[12px] border-2 border-black p-6 md:p-10">
              <Eyebrow>Garantie</Eyebrow>
              <h2 className="t-h2 mt-4 text-black">
                Une garantie basée sur ton engagement.
              </h2>
              <p className="t-body mt-6">
                Je ne te promets pas un résultat sans conditions — personne ne
                peut honnêtement contrôler à ta place si tu parles. Ce que je
                peux t&apos;engager, c&apos;est ceci : si tu remplis les
                conditions ci-dessous et qu&apos;à deux mois tu ne t&apos;exprimes
                toujours pas en anglais, je te rembourse 100 % de ton argent,
                en entièreté.
              </p>

              {/* Les conditions — ce que la garantie exige */}
              <ul className="mt-8 space-y-3 border-t border-grey-line pt-6">
                {[
                  "Tu participes régulièrement aux séances du programme.",
                  "Tu fais les exercices personnalisés entre les séances.",
                  "Tu appliques les corrections travaillées ensemble.",
                  "Tu mets vraiment en application mes conseils.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <IconCheck className="mt-0.5 text-black" />
                    <span className="t-body">{item}</span>
                  </li>
                ))}
              </ul>

              <p className="t-body mt-6 text-grey-mid">
                Ce que je ne promets pas : que l&apos;anglais arrive tout seul.
                <br />
                Ce que je promets : si tu fais ta part et que ça ne suffit
                pas, tu ne perds pas ton argent.
              </p>
            </div>
          </Reveal>

          {/* Preuve — à DROITE du cadre, hors du cadre
              (instruction propriétaire) */}
          <Reveal delay={120}>
            <Prose>
              <Eyebrow>Preuve</Eyebrow>
              <h2 className="t-h2 mt-4 text-black">
                Un parcours réel : de la compréhension au poste
                international.
              </h2>
              <p className="t-body">
                Un professionnel d&apos;une quarantaine d&apos;années
                comprenait l&apos;anglais depuis des années — et bloquait
                complètement à l&apos;oral. Trois mois de coaching centré sur
                la pratique orale de son domaine, et il s&apos;exprimait avec
                l&apos;aisance nécessaire pour prendre son poste à
                l&apos;international. Ce n&apos;est pas de la magie. C&apos;est
                de la pure pratique.
              </p>
              <p className="t-body">
                Et ce n&apos;est pas un cas isolé : 98 % de mes débutants
                absolus s&apos;expriment librement après un mois de coaching.
              </p>
              <div className="mt-8">
                <SecondaryLink
                  href="#/resultats"
                  className="btn-invert-hover"
                >
                  {CTA_LABELS.voirResultats}
                </SecondaryLink>
              </div>
            </Prose>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

/* — FAQ (instruction propriétaire) : le contenu de la page FAQ, renforcé,
     intégré à l'accueil pour traiter les objections avant le CTA final.
     Ancre #faq : la navigation « FAQ » (header + footer) pointe directement
     ici — la page FAQ autonome a été supprimée (instruction propriétaire). — */
const FAQ_OBJECTIONS = [
  {
    question: "Et si je suis débutant ?",
    answer:
      "Ce programme est fait pour toi : débutants et intermédiaires sont exactement les apprenants que j'accompagne. 98 % de mes débutants absolus s'expriment librement dès le premier mois — chaque séance part de ton niveau réel, pas d'un programme figé.",
  },
  {
    question:
      "Et si je comprends l'anglais mais que je n'arrive vraiment pas à parler ?",
    answer:
      "C'est précisément pour ce blocage que le programme existe. Comprendre sans parler n'est pas un problème de connaissances : c'est un manque de pratique orale. Ici, tu parles dès la première séance, avec quelqu'un qui corrige au bon moment.",
  },
  {
    question: "Et si je fais beaucoup d'erreurs ?",
    answer:
      "Les erreurs font partie de l'apprentissage — les figer, c'est ce qui te bloque aujourd'hui. Je les corrige au bon moment, sans te couper, pour que chaque erreur devienne un progrès au lieu d'une peur.",
  },
  {
    question: "Combien de temps dois-je consacrer au programme ?",
    answer:
      "Trois séances de 1h30 par semaine, plus de courts exercices personnalisés entre les séances. C'est un rythme volontairement régulier : c'est lui qui installe l'anglais dans ton quotidien.",
  },
  {
    question: "Les séances sont-elles en ligne ?",
    answer:
      "Oui, à 100 %. En visioconférence, avec un lien envoyé avant chaque séance. Aucun déplacement, aucun matériel à acheter — où que tu sois.",
  },
  {
    question: "Comment fonctionne le paiement ?",
    answer:
      "Un paiement unique de 70 000 FCFA au moment de l'inscription. Après le formulaire, tu es dirigé automatiquement vers le paiement sécurisé. Trois jours après confirmation, ton coaching démarre réellement.",
  },
  {
    question: "Pourquoi un paiement unique ?",
    answer:
      "Parce que le programme est un accompagnement complet de 03 mois, pas un abonnement. Pas de paiement mensuel, pas de reconduction, pas de frais cachés — tu sais exactement ce que tu paies, une fois.",
  },
  {
    question: "Est-ce que 03 mois suffisent ?",
    answer:
      "Le premier déclic — oser parler sans blocage — arrive généralement dès le premier mois. Trois mois, c'est le temps nécessaire pour que la pratique s'installe durablement, et le format a déjà mené un apprenant jusqu'à un poste international. La garantie basée sur ton engagement couvre exactement ce point.",
  },
  {
    question: "Que se passe-t-il après les 03 mois ?",
    answer:
      "Tu repars avec une pratique installée : tu prends la parole plus facilement, tu construis tes phrases plus naturellement, tu as moins besoin de traduire mentalement. Si tu souhaites continuer, on en parle ensemble — sans engagement.",
  },
];

function FaqSection() {
  return (
    <Section id="faq" className="scroll-mt-20 bg-grey-soft lg:scroll-mt-24">
      <Container>
        <Reveal>
          <Prose className="mx-auto max-w-[46rem] text-center">
            <Eyebrow>Questions fréquentes</Eyebrow>
            <h2 className="t-h2 mt-4 text-black">
              Ce que tu te demandes peut-être.
            </h2>
          </Prose>
        </Reveal>
        <Reveal className="mt-10 lg:mt-14">
          <FaqAccordion
            className="mx-auto max-w-[52rem]"
            items={FAQ_OBJECTIONS}
          />
        </Reveal>
      </Container>
    </Section>
  );
}

/* — CTA FINAL : urgence éthique (instruction propriétaire — jamais
     d'artifice) en CARTE (même langage que la carte « quelqu'un d'autre
     postule ») + CTA principal répété. Centré : clôture du funnel. — */
function CtaFinal() {
  return (
    <Section className="on-dark bg-black text-white">
      <Container>
        <Reveal>
          <CarteUrgenceEthique className="mx-auto max-w-[46rem]" />
        </Reveal>
        <Reveal className="mt-10">
          <div className="flex flex-col items-center gap-5">
            <span data-wa-cta className="inline-flex">
              <CtaButton href="#/contact">{CTA_LABELS.hero}</CtaButton>
            </span>
            <p className="t-caption text-white/70">{OFFRE.resumeSousCta}</p>
            <SecondaryLink href="#/programme" className="btn-secondary-dark">
              {CTA_LABELS.decouvrir}
            </SecondaryLink>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

/** Overlay noir → blanc (500ms, une fois, à l'entrée dans le viewport). */
function DarkFadeOverlay() {
  const [ref, inView] = useInViewOnce<HTMLDivElement>({ threshold: 0.15 });
  const reduced = usePrefersReducedMotion();

  // Avant l'entrée : noir plein. À l'entrée : fondu 500ms (ou coupe nette
  // en reduced motion). Le style inline pilote les cas non animés.
  const animated = inView && !reduced;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-10 bg-black",
        animated && "dark-fade",
      )}
      style={animated ? undefined : { opacity: inView ? 0 : 1 }}
    />
  );
}
