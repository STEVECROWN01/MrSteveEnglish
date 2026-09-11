"use client";

import Image from "next/image";
import { WA_MESSAGES, waLink, CTA_LABELS } from "@/lib/site";
import { Container, PageHero, Prose, Section } from "../layout-primitives";
import { WhatsAppButton, SecondaryLink } from "../buttons";
import { Reveal } from "../reveal";

/**
 * PAGE 2 — MÉTHODE / APPROCHE (COPYWRITING.md)
 * Fonction : construire la confiance en expliquant le "comment",
 * se différencier.
 * Composition (DA §12) : METHODE-01 au centre entre le texte "grammaire
 * bûchée" (gauche) et "méthode vivante" (droite) — l'image est le point
 * de bascule. Timeline "Mois 1 / Mois 2-3" en ligne horizontale simple
 * avec deux points (jamais en cards numérotées génériques).
 */

export function MethodePage() {
  return (
    <>
      <PageHero
        title="Pourquoi la grammaire seule ne t'a jamais fait parler anglais."
        subtitle="Et pourquoi une méthode vivante, adaptée à toi, y arrive en quelques semaines."
      />

      {/* — Angle : méthode vs grammaire bûchée — */}
      <Section>
        <Container>
          <Reveal>
            <h2 className="t-h2 max-w-[46rem] text-black">
              Apprendre des règles n&apos;apprend pas à parler.
              S&apos;exprimer, oui.
            </h2>
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

            {/* Diptyque METHODE-01 — le point de bascule (DA §15 :
                côte à côte desktop, empilé rigide/fluide mobile) */}
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
                  alt="Deux chemins comparés : une grille rigide de lignes parallèles face à une ligne organique et fluide qui s'adapte"
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
                C&apos;est exactement ce que fait Stevens. Chaque séance part de
                ce que tu sais déjà dire — et pousse un peu plus loin. Pas de
                manuel figé. Pas de leçon générique. Une conversation,
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
                Le format recommandé — celui qui a mené un apprenant jusqu&apos;à
                l&apos;expatriation professionnelle — c&apos;est trois séances de
                1h30 par semaine, pendant trois mois. Un rythme qui installe
                l&apos;anglais dans ton quotidien, sans le laisser retomber entre
                deux séances.
              </p>
              <p className="t-body">
                Une version plus courte, sur deux mois, existe aussi pour ceux
                qui veulent avancer plus vite. Le résultat dépend surtout
                d&apos;une chose : que tu mettes en application ce qui est vu en
                séance.
              </p>
              <p className="t-body">
                Individuel, pour un accompagnement sur-mesure. Ou en petit
                groupe, pour ceux qui apprennent mieux en interaction.
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
              <WhatsAppButton href={waLink(WA_MESSAGES.format)}>
                {CTA_LABELS.reserverFormat}
              </WhatsAppButton>
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
    </>
  );
}
