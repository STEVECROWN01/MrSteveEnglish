"use client";

import Image from "next/image";
import { CTA_LABELS, PAGES } from "@/lib/site";
import { Container, Eyebrow, PageHero, Section } from "../layout-primitives";
import { CtaButton } from "../buttons";
import { Reveal } from "../reveal";
import { StickyCTA } from "../sticky-cta";

/**
 * PAGE 5 — OFFRES / TARIFS (COPYWRITING.md)
 * Fonction : lever les dernières objections, présenter la formule comme
 * une évidence.
 * Composition (DA §12) : OFFRES-TEXTURE en fond très discret, les deux
 * formules en deux cards côte à côte de poids visuel strictement égal.
 * Mobile : cards empilées, la recommandée (3 mois) en premier, CTA
 * WhatsApp sticky en bas d'écran (DA §15).
 */

const FORMULES = [
  {
    eyebrow: "Formule recommandée",
    titre: "Coaching 3 mois",
    prix: "70 000",
    devise: "FCFA",
    corps: (
      <>
        <p className="t-body">
          Trois séances de 1h30 par semaine, pendant trois mois. C&apos;est le
          format suivi par l&apos;apprenant qui a réussi son passage à un poste
          international. C&apos;est la formule que je recommande, parce
          qu&apos;elle laisse le temps à l&apos;anglais de s&apos;installer
          durablement.
        </p>
      </>
    ),
    cta: CTA_LABELS.reserver3mois,
    href: PAGES.contactOffre3mois,
  },
  {
    eyebrow: "Formule courte",
    titre: "Coaching 2 mois",
    prix: "60 000",
    devise: "FCFA",
    corps: (
      <>
        <p className="t-body">
          Le même accompagnement, sur un rythme plus resserré. Idéal si ton
          échéance est proche. Le résultat reste atteignable, à condition de
          mettre en application ce qui est vu en séance.
        </p>
        <p className="t-body">
          Individuel ou en petit groupe, selon ta préférence.
        </p>
      </>
    ),
    cta: CTA_LABELS.reserver2mois,
    href: PAGES.contactOffre2mois,
  },
];

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

export function OffresPage() {
  return (
    <>
      <PageHero
        title="Une formule. Un objectif clair : que tu parles anglais avec aisance."
        subtitle="Pas de forfait à rallonge, pas d'options qui compliquent la décision. Deux durées, un seul résultat visé."
      />

      {/* — Les deux formules : poids visuel strictement égal (DA §12) — */}
      <Section className="relative overflow-hidden">
        {/* OFFRES-TEXTURE — fond très discret (DA §10 prompt #9) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 select-none"
        >
          <Image
            src="/assets/OFFRES-TEXTURE.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-60"
          />
        </div>

        <Container className="relative">
          <div className="grid gap-6 md:grid-cols-2 lg:gap-10">
            {FORMULES.map((f, i) => (
              <Reveal key={f.titre} delay={i * 120}>
                <div className="card-base card-hover flex h-full flex-col p-6 md:p-8 lg:p-10">
                  <Eyebrow>{f.eyebrow}</Eyebrow>
                  <h2 className="t-h3 mt-3 text-black">{f.titre}</h2>

                  {/* Prix — noir pur sur fond blanc (instruction propriétaire) */}
                  <p className="mt-6 flex flex-wrap items-baseline gap-x-3">
                    <span className="t-stat text-black">{f.prix}</span>
                    <span className="t-stat-unit text-black">{f.devise}</span>
                  </p>

                  <div className="mt-6 space-y-4">{f.corps}</div>

                  <div className="mt-auto pt-8">
                    <span data-wa-cta className="inline-flex w-full">
                      <CtaButton href={f.href} className="w-full">
                        {f.cta}
                      </CtaButton>
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
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
                  <CtaButton href={PAGES.contact}>
                    {CTA_LABELS.reserverPlace}
                  </CtaButton>
                </span>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* CTA sticky mobile (page Offres) */}
      <StickyCTA href={PAGES.contact} label={CTA_LABELS.reserverPlace} />
    </>
  );
}
