"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useInViewOnce, usePrefersReducedMotion } from "@/lib/motion";
import { WA_MESSAGES, waLink, CTA_LABELS } from "@/lib/site";
import { Container, Eyebrow, Prose } from "../layout-primitives";
import { WhatsAppButton, SecondaryLink } from "../buttons";
import { Reveal } from "../reveal";
import { CountUp } from "../count-up";
import { StickyCTA } from "../sticky-cta";

/**
 * PAGE 1 — ACCUEIL (COPYWRITING.md)
 * Fonction : capter en 3 secondes, nommer le problème, promettre la
 * transformation.
 * Hero → Problème/Agitation (fond Bleu Profond, DA §12) → Solution
 * (retour blanc avec fondu bleu → blanc, DA §13 animation 2).
 */

export function HomePage() {
  return (
    <>
      <Hero />
      <ProblemeAgitation />
      <Solution />
      <StickyCTA
        href={waLink(WA_MESSAGES.hero)}
        label={CTA_LABELS.hero}
      />
    </>
  );
}

/* — Hero : H1 orchestré ligne par ligne, image 60 % à droite — */
function Hero() {
  return (
    <section className="pt-16 lg:pt-[72px]">
      <div className="grid min-h-[calc(100svh-4rem)] lg:grid-cols-[2fr_3fr] lg:min-h-[calc(100svh-72px)]">
        {/* Texte — 40 % à gauche */}
        <div className="order-2 flex items-center px-5 py-12 md:px-6 lg:order-1 lg:py-0">
          <div className="max-w-[30rem]">
            <h1 className="t-h1 text-black">
              <span className="hero-line hero-d1 block">
                Tu comprends l&apos;anglais depuis des années.
              </span>
              <span className="hero-line hero-d2 block">
                Mais dès qu&apos;il faut parler, ta gorge se noue.
              </span>
            </h1>
            <p className="hero-line hero-d3 t-body mt-6 text-grey-mid">
              Stevens AKPOVI t&apos;accompagne pour parler anglais avec aisance
              en 2 à 3 mois — pas en révisant des règles, mais en
              t&apos;exprimant, vraiment, dès la première séance.
            </p>
            <div className="hero-line hero-d4 mt-8">
              <span data-wa-cta className="inline-flex">
                <WhatsAppButton href={waLink(WA_MESSAGES.hero)}>
                  {CTA_LABELS.hero}
                </WhatsAppButton>
              </span>
            </div>
          </div>
        </div>

        {/* Image — 60 % à droite, pleine hauteur (mobile : 1:1 au-dessus) */}
        <div className="order-1 relative aspect-square lg:order-2 lg:aspect-auto lg:h-full">
          <Image
            src="/assets/HERO-01.webp"
            alt="Personne au moment de commencer à parler, lumière naturelle de fin de journée"
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 1023px) 100vw, 60vw"
            className="object-cover"
          />
        </div>
      </div>
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

        {/* Section Agitation */}
        <Reveal className="mt-16 lg:mt-24">
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
        </Reveal>
      </Container>
    </section>
  );
}

/* — Solution : retour au blanc. Le fond passe du noir au blanc
     par fondu 500ms à l'entrée dans le viewport.
     Card unique avec le chiffre clé 98 % en noir. — */
function Solution() {
  return (
    <section className="relative overflow-hidden bg-white">
      <DarkFadeOverlay />
      <Container className="relative py-12 lg:py-24">
        <Reveal>
          <div className="card-base card-hover max-w-[46rem] p-6 md:p-10 lg:p-12">
            <Eyebrow>La méthode Stevens Akpovi</Eyebrow>
            <h2 className="t-h2 mt-4 text-black">
              Une méthode qui s&apos;adapte à toi, séance après séance.
            </h2>
            <p className="t-body mt-6">
              Stevens ne suit pas un programme figé. Il ajuste chaque séance à
              ce que tu as réellement compris — pas à ce qui était prévu sur le
              papier. Résultat : 98 % de ses débutants absolus s&apos;expriment
              librement après un mois de coaching.
            </p>
            <p className="t-body mt-4">
              Individuel ou en petit groupe, en ligne, avec un objectif clair :
              que tu parles anglais avec confiance, dans ton domaine, pour ton
              objectif à toi.
            </p>

            {/* Chiffre clé — noir pur sur fond blanc, jamais en rouge (DA §5) */}
            <div className="mt-10 flex flex-wrap items-baseline gap-x-4 gap-y-2 border-t border-grey-line pt-8">
              <p className="t-stat text-black">
                <CountUp value={98} />
                <span className="t-stat-unit"> %</span>
              </p>
              <p className="max-w-[22rem] text-[0.9375rem] leading-snug text-grey-mid">
                des débutants absolus s&apos;expriment librement après un mois
                de coaching
              </p>
            </div>

            <div className="mt-10">
              <SecondaryLink href="#/methode">
                {CTA_LABELS.decouvrir}
              </SecondaryLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
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
