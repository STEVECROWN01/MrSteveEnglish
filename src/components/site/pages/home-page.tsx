"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useInViewOnce, usePrefersReducedMotion } from "@/lib/motion";
import { CTA_LABELS } from "@/lib/site";
import { Container, Eyebrow, Prose, Section } from "../layout-primitives";
import { CtaButton, SecondaryLink } from "../buttons";
import { Reveal } from "../reveal";
import { CountUp } from "../count-up";
import { StickyCTA } from "../sticky-cta";

/**
 * PAGE 1 — ACCUEIL
 * Fonction : capter en 3 secondes, nommer le problème, promettre la
 * transformation, PUIS expliquer la méthode (instruction propriétaire :
 * le contenu de l'ancienne page Méthode complète désormais l'accueil).
 * Hero plein cadre (l'image couvre toute la section, y compris derrière
 * la barre de navigation translucide — le texte est en overlay, aligné
 * à gauche) → Problème/Agitation (fond noir, image PROBLEME-01 à gauche
 * du texte d'agitation aligné à droite — instruction propriétaire) →
 * Solution (retour blanc avec fondu noir → blanc, 98 %, image METHOD-01
 * miroir à droite du bloc contenu — instruction propriétaire) → La
 * Méthode (angle grammaire vs vivante, format, objection). Voix éditoriale :
 * le coach parle à la première personne (« je ») directement au prospect
 * (instruction propriétaire). Tous les CTA mènent au formulaire de
 * contact.
 */

export function HomePage() {
  return (
    <>
      <Hero />
      <ProblemeAgitation />
      <Solution />
      <Methode />
      <StickyCTA href="#/contact" label={CTA_LABELS.hero} />
    </>
  );
}

/* — Hero : l'image HERO-01 couvre la totalité de la section (plein
     cadre, edge-to-edge) et passe derrière la barre de navigation
     translucide. Le texte est posé SUR l'image (overlay), aligné à
     gauche dans la zone sombre, ancré vers le bas avec un espace
     déterministe et généreux sous le CTA (96px mobile / 192px desktop)
     avant la limite de section qui sépare le hero de la suite
     (instruction propriétaire : ne jamais coller le bouton au bord). — */
function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden">
      {/* Image — couvre tout le hero */}
      <div className="absolute inset-0">
        <Image
          src="/assets/HERO-01.webp"
          alt="Le Coach Stevens, souriant, assis à une table dans un intérieur chaleureux"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          /* Servi tel quel, sans ré-encodage par l'optimiseur Next.js :
             il re-compresserait en JPEG q75 et détruirait la netteté
             (le WebP q95 préparé par scripts/convert_hero_v2.py EST la
             version finale). */
          unoptimized
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

      {/* Texte sur l'image — aligné à gauche, espace large sous le CTA */}
      <Container className="relative w-full pb-24 pt-28 lg:pb-48 lg:pt-32">
        <div className="max-w-[30rem]">
          <h1 className="t-h1 text-white">
            <span className="hero-line hero-d1 block">
              Tu comprends l&apos;anglais depuis des années.
            </span>
            <span className="hero-line hero-d2 block">
              Mais dès qu&apos;il faut parler, ta gorge se noue.
            </span>
          </h1>
          <p className="hero-line hero-d3 t-body mt-6 text-white/85">
            Je t&apos;accompagne pour parler anglais avec aisance en 2 à 3
            mois — pas en révisant des règles, mais en t&apos;exprimant,
            vraiment, dès la première séance.
          </p>
          <div className="hero-line hero-d4 mt-8">
            <span data-wa-cta className="inline-flex">
              <CtaButton href="#/contact">{CTA_LABELS.hero}</CtaButton>
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* — Problème + Agitation : fond noir plein, sobre (waveform filigrane
     supprimée — instruction propriétaire) — */
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
              <Image
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
              <p className="t-body text-white/85">
                Tu as peut-être déjà essayé. Des applications. Des cours en groupe
                où tu parles trois minutes sur soixante. Des heures à bûcher la
                grammaire, seul, le soir. Et le jour où il a fallu parler pour de
                vrai, rien n&apos;est sorti. Parce que l&apos;anglais ne se bûche
                pas. Il se pratique.
              </p>
            </Prose>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* — Solution : retour au blanc. Le fond passe du noir au blanc
     par fondu 500ms à l'entrée dans le viewport.
     Card avec le chiffre clé 98 % en noir, et l'image METHOD-01
     (miroir horizontal — instruction propriétaire) intégrée À DROITE
     du bloc enveloppant le contenu. Voix première personne
     (instruction propriétaire). Mobile : bloc puis image, empilés. — */
function Solution() {
  return (
    <section className="relative overflow-hidden bg-white">
      <DarkFadeOverlay />
      <Container className="relative py-12 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,46rem)_minmax(0,22rem)] lg:justify-center lg:gap-12">
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
                le papier. Résultat : 98 % de mes débutants absolus
                s&apos;expriment librement après un mois de coaching.
              </p>
              <p className="t-body mt-4">
                Je te coache en individuel ou en petit groupe, en ligne, avec
                un objectif clair : que tu parles anglais avec confiance, dans
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

          {/* Image METHOD-01 — à droite du bloc (retournée en miroir :
              l'apprenante souriante regarde vers le contenu, à sa gauche) */}
          <Reveal delay={120}>
            <div className="relative mx-auto w-full max-w-[22rem] overflow-hidden rounded-[12px] lg:mx-0">
              <Image
                src="/assets/METHOD-01.webp"
                alt="Apprenante épanouie et souriante en pleine séance de coaching d'anglais en visioconférence, tournée vers la méthode"
                width={900}
                height={1350}
                sizes="(max-width: 1023px) 92vw, 352px"
                className="h-auto w-full"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/* — La Méthode — ancienne page Méthode intégrée à l'accueil
     (instruction propriétaire : « prendre la page méthode pour
     compléter la page d'accueil »). Emplacement stratégique : juste
     après la promesse Solution — la narration enchaîne naturellement
     « ce que ça t'apporte » → « comment ça marche ».
     Point d'ancrage de la navigation : #/?section=methode. — */
function Methode() {
  return (
    <div id="methode" className="scroll-mt-20 lg:scroll-mt-24">
      {/* — Angle : méthode vs grammaire bûchée — */}
      <Section>
        <Container>
          <Reveal>
            <Prose>
              <Eyebrow>Comment ça marche</Eyebrow>
              <h2 className="t-h2 mt-4 text-black">
                Pourquoi la grammaire seule ne t&apos;a jamais fait parler
                anglais.
              </h2>
              <p className="t-body">
                Et pourquoi une méthode vivante, adaptée à toi, y arrive en
                quelques semaines.
              </p>
            </Prose>
          </Reveal>

          <div className="mt-10 grid items-center gap-8 lg:mt-14 lg:grid-cols-[1fr_1.25fr_1fr] lg:gap-10">
            {/* Texte gauche — la grammaire bûchée */}
            <Reveal>
              <p className="t-body">
                Tu peux connaître toutes les règles de grammaire anglaise et
                rester muet face à un anglophone. Ce n&apos;est pas un manque de
                connaissances. C&apos;est un manque de pratique orale réelle,
                avec quelqu&apos;un qui corrige au bon moment, sans te bloquer
                dans la peur de l&apos;erreur.
              </p>
            </Reveal>

            {/* Diptyque — le point de bascule : grammaire bûchée (froide,
                studieuse) face à la méthode vivante (conversation en visio).
                Côte à côte desktop, empilé mobile */}
            <Reveal delay={120}>
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                <Image
                  src="/assets/METHODE-01-rigide.webp"
                  alt=""
                  width={724}
                  height={1086}
                  sizes="(max-width: 1023px) 92vw, 34vw"
                  className="h-auto w-full"
                  aria-hidden="true"
                />
                <Image
                  src="/assets/METHODE-01-fluide.webp"
                  alt="Apprenante épanouie en pleine séance de coaching d'anglais en visioconférence, lumière chaude, méthode vivante"
                  width={724}
                  height={1086}
                  sizes="(max-width: 1023px) 92vw, 34vw"
                  className="h-auto w-full"
                />
              </div>
            </Reveal>

            {/* Texte droite — la méthode vivante */}
            <Reveal delay={240}>
              <p className="t-body">
                C&apos;est exactement ce que je fais avec toi. Chaque séance
                part de ce que tu sais déjà dire — et pousse un peu plus loin.
                Pas de manuel figé. Pas de leçon générique. Une conversation,
                structurée, qui avance à ton rythme.
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* — Comment se déroule le coaching — */}
      <Section>
        <Container>
          <Reveal>
            <Prose>
              <h2 className="t-h2 text-black">
                Trois mois. Trois séances par semaine. Une transformation.
              </h2>
              <p className="t-body">
                Le format que je recommande — celui qui a mené un apprenant
                jusqu&apos;à l&apos;expatriation professionnelle — c&apos;est
                trois séances de 1h30 par semaine, pendant trois mois. Un
                rythme qui installe l&apos;anglais dans ton quotidien, sans le
                laisser retomber entre deux séances.
              </p>
              <p className="t-body">
                Je propose aussi une version plus courte, sur deux mois, si tu
                veux avancer plus vite. Le résultat dépend surtout d&apos;une
                chose : que tu mettes en application ce qui est vu en séance.
              </p>
              <p className="t-body">
                Individuel, pour un accompagnement sur-mesure. Ou en petit
                groupe, si tu apprends mieux en interaction.
              </p>
            </Prose>
          </Reveal>

          {/* Timeline — ligne horizontale simple avec deux points (DA §12) */}
          <Reveal className="mt-12">
            <div className="max-w-[34rem]">
              <div className="flex items-center" aria-hidden="true">
                <span className="h-3.5 w-3.5 shrink-0 rounded-full bg-black" />
                <span className="h-[2px] flex-1 bg-black" />
                <span className="h-3.5 w-3.5 shrink-0 rounded-full bg-black" />
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-[0.9375rem] font-medium text-black">
                  Mois 1
                </span>
                <span className="text-[0.9375rem] font-medium text-black">
                  Mois 2-3
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal className="mt-12">
            <span data-wa-cta className="inline-flex">
              <CtaButton href="#/contact">{CTA_LABELS.reserverFormat}</CtaButton>
            </span>
          </Reveal>
        </Container>
      </Section>

      {/* — Traitement d'objection — */}
      <Section>
        <Container>
          <Reveal>
            <Prose>
              <h2 className="t-h2 text-black">
                « J&apos;ai déjà essayé, ça n&apos;a jamais marché. »
              </h2>
              <p className="t-body">
                C&apos;est normal. Une application ne corrige pas ta
                prononciation. Un cours collectif de 20 personnes ne te fait pas
                parler assez. Et la grammaire seule ne prépare à aucune
                conversation réelle. Ici, chaque séance est calée sur toi — ton
                niveau, ton objectif, ton rythme. C&apos;est la différence entre
                suivre un programme et être suivi.
              </p>
            </Prose>
          </Reveal>
          <Reveal className="mt-10">
            <SecondaryLink href="#/resultats">
              {CTA_LABELS.voirMethode}
            </SecondaryLink>
          </Reveal>
        </Container>
      </Section>
    </div>
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
