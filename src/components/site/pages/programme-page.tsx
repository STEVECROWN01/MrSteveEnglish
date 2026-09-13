"use client";

import { CTA_LABELS, OFFRE } from "@/lib/site";
import { Container, Eyebrow, PageHero, Section } from "../layout-primitives";
import { CtaButton } from "../buttons";
import { IconCheck } from "../icons";
import { Reveal } from "../reveal";
import { StickyCTA } from "../sticky-cta";
import { ResponsiveImage } from "../responsive-image";

/**
 * PAGE 5 — PROGRAMME (ex-Offres) : L'OFFRE UNIQUE (instruction
 * propriétaire) — la conversion tourne autour d'UNE SEULE offre :
 * Programme « De Comprendre à Parler » — 03 mois de coaching
 * d'anglais personnalisé — 70 000 FCFA — paiement unique. Plus aucun
 * multi-format, aucune offre 2 mois, aucun tarif multiple. Le site
 * vend une transformation, pas des heures de cours.
 * Composition (DA §12) : OFFRES-TEXTURE en fond très discret, bloc
 * offre unique central + value stack, objections, déroulé après
 * paiement. CTA sticky mobile (DA §15).
 */

const OBJECTIONS = [
  {
    titre: "« Est-ce que ça vaut le prix ? »",
    corps: "Compare-le à ce qu'un blocage à l'oral peut te coûter : une opportunité manquée, un poste qui t'échappe, un voyage que tu repousses, une confiance qui s'effrite à chaque prise de parole évitée. Trois mois de coaching, c'est le prix d'une compétence qui reste avec toi toute la vie.",
  },
  {
    titre: "« Je n'ai pas le temps. »",
    corps: "1h30, trois fois par semaine. C'est moins de temps que ce que tu passes déjà à éviter de parler anglais par peur de te tromper.",
  },
  {
    titre: "« J'ai déjà essayé et ça n'a pas marché. »",
    corps: "Les applications et les cours collectifs ne s'adaptent pas à toi. Ici, chaque séance part de ce que tu sais déjà — et avance à ton rythme, pas à celui d'un programme figé.",
  },
];

/* Tout ce que comprend le programme — podcasts inclus (instruction
   propriétaire : ressource de pratique pure). */
const PROGRAMME_INCLUS = [
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

export function ProgrammePage() {
  return (
    <>
      <PageHero
        title={
          <>
            De <span className="text-red-button">Comprendre</span> à{" "}
            <span className="text-red-button">Parler</span>.
          </>
        }
        subtitle="Le programme d'accompagnement de 03 mois — un seul objectif : que tu parles anglais avec confiance."
      />

      {/* — L'offre unique — bloc central de conversion — */}
      <Section className="relative overflow-hidden">
        {/* OFFRES-TEXTURE — fond très discret (DA §10 prompt #9) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 select-none"
        >
          <ResponsiveImage
            src="/assets/OFFRES-TEXTURE.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-60"
          />
        </div>

        <Container className="relative">
          <Reveal>
            <div className="mx-auto max-w-[52rem]">
              <div className="card-base card-hover p-6 md:p-10 lg:p-12">
                <Eyebrow>Le programme</Eyebrow>
                <h2 className="t-h2 mt-4 text-black">
                  03 mois de coaching d&apos;anglais personnalisé.
                </h2>
                <p className="t-body mt-6">
                  Trois séances de 1h30 par semaine, pendant trois mois.
                  C&apos;est le format suivi par l&apos;apprenant qui a réussi
                  son passage à un poste international — le rythme qui laisse
                  à l&apos;anglais le temps de s&apos;installer durablement
                  dans ton quotidien.
                </p>
                <p className="t-body mt-4">
                  Chaque séance est une vraie prise de parole : conversations
                  réelles, corrections personnalisées, prononciation — et des
                  exercices courts entre les séances pour accélérer la
                  progression.
                </p>

                {/* Prix — noir pur sur fond blanc (instruction propriétaire) */}
                <div className="mt-10 flex flex-wrap items-baseline gap-x-4 border-t border-grey-line pt-8">
                  <p className="flex flex-wrap items-baseline gap-x-3">
                    <span className="t-stat text-black">{OFFRE.prix}</span>
                    <span className="t-stat-unit text-black">
                      {OFFRE.devise}
                    </span>
                  </p>
                  <p className="text-[0.9375rem] font-medium text-grey-mid">
                    {OFFRE.paiement} — pas d&apos;abonnement, pas de paiement
                    mensuel, pas de frais cachés.
                  </p>
                </div>
                <p className="t-body mt-4 font-medium">
                  Un seul paiement. Trois mois d&apos;accompagnement.
                </p>

                <div className="mt-10">
                  <span data-wa-cta className="inline-flex w-full sm:w-auto">
                    <CtaButton href="#/contact" className="w-full sm:w-auto">
                      {CTA_LABELS.rejoindre}
                    </CtaButton>
                  </span>
                  <p className="t-caption mt-4 text-grey-mid">
                    {OFFRE.sousCtaPrix}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Tout ce que le programme comprend (instruction
              propriétaire : valeur perçue) */}
          <Reveal className="mt-10 lg:mt-14">
            <div className="mx-auto max-w-[52rem]">
              <h3 className="t-h3 text-black">
                Voici tout ce que comprend le programme :
              </h3>
              <div className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2">
                {PROGRAMME_INCLUS.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 border-b border-grey-line pb-4"
                  >
                    <IconCheck className="mt-0.5 text-black" />
                    <span className="t-body">{item}</span>
                  </div>
                ))}
              </div>
              <p className="t-body mt-8">
                Soit un accompagnement complet sur trois mois — pas des
                séances isolées, mais un parcours structuré, du premier
                déclic jusqu&apos;à une parole qui tient debout.
              </p>
            </div>
          </Reveal>

          {/* Garantie basée sur l'engagement (instruction propriétaire :
              jamais de garantie absolue sans conditions) */}
          <Reveal className="mt-12 lg:mt-16">
            <div className="mx-auto max-w-[52rem] rounded-[12px] border-2 border-black p-6 md:p-8">
              <Eyebrow>Garantie</Eyebrow>
              <p className="t-body mt-3">
                Une garantie basée sur ton engagement : si tu participes
                régulièrement aux séances, fais les exercices entre les
                séances et appliques les corrections — et qu&apos;à deux mois
                tu ne t&apos;exprimes toujours pas, je te rembourse 100 % de
                ton argent, en entièreté.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* — Traitement des objections — */}
      <Section>
        <Container>
          <div className="mx-auto max-w-[46rem]">
            {OBJECTIONS.map((o, i) => (
              <Reveal key={i} className={i > 0 ? "mt-10 border-t border-grey-line pt-10" : ""}>
                <h3 className="t-h3 text-black">{o.titre}</h3>
                <p className="t-body mt-4">{o.corps}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* — Après le paiement — */}
      <Section className="pt-0">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-[46rem] rounded-[12px] bg-grey-soft p-6 md:p-10">
              <p className="t-body">
                Trois jours après ton paiement, ton coaching démarre
                réellement : suivi personnalisé et toutes les ressources
                nécessaires mises à ta disposition dès le premier jour.
              </p>
              <div className="mt-8">
                <span data-wa-cta className="inline-flex">
                  <CtaButton href="#/contact">{CTA_LABELS.rejoindre}</CtaButton>
                </span>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* CTA sticky mobile (page Programme) */}
      <StickyCTA href="#/contact" label={CTA_LABELS.decouvrirCourt} />
    </>
  );
}
