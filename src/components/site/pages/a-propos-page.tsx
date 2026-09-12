"use client";

import Image from "next/image";
import { CTA_LABELS } from "@/lib/site";
import { Container, Prose, Section } from "../layout-primitives";
import { CtaButton, SecondaryLink } from "../buttons";
import { Reveal } from "../reveal";

/**
 * PAGE 3 — À PROPOS / COACH (COPYWRITING.md)
 * Fonction : humaniser, créer la connexion émotionnelle, asseoir la
 * légitimité.
 * Composition (DA §12) : APROPOS-PORTRAIT sur 40 % à gauche, texte
 * biographique à droite (78 caractères max par ligne). APROPOS-AMBIANCE
 * en rupture visuelle avant la section crédentials.
 */

export function AProposPage() {
  return (
    <>
      {/* — Hero : portrait réel 40 % + texte — */}
      <section className="pt-[112px] lg:pt-[168px]">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-[2fr_3fr] lg:gap-16">
            {/* Portrait — vraie photographie de Stevens (brief 8.4) */}
            <Reveal className="relative mx-auto w-full max-w-[26rem] lg:mx-0">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.10)]">
                <Image
                  src="/assets/APROPOS-PORTRAIT.webp"
                  alt="Portrait de Stevens Akpovi, coach d'anglais, regard direct et sourire confiant"
                  fill
                  priority
                  sizes="(max-width: 1023px) 92vw, 40vw"
                  className="object-cover"
                />
              </div>
            </Reveal>

            {/* Texte biographique — P1 */}
            <div className="max-w-[42rem]">
              <Reveal>
                <h1 className="t-h1 text-black">
                  Stevens AKPOVI. Pas un accent parfait. Une méthode qui
                  fonctionne.
                </h1>
                <p className="t-body mt-6 text-grey-mid">
                  Licencié en anglais américain, formé sur le terrain, et
                  toujours en train de coacher aujourd&apos;hui.
                </p>
                <p className="t-body mt-6">
                  Stevens n&apos;a jamais cru que le secret d&apos;un bon coach,
                  c&apos;était un accent impeccable. Le secret, c&apos;est
                  d&apos;entendre exactement où l&apos;élève bloque — et de
                  s&apos;y adapter, séance après séance, plutôt que de dérouler
                  un programme prévu à l&apos;avance.
                </p>
              </Reveal>
              <Reveal className="mt-10">
                <span data-wa-cta className="inline-flex">
                  <CtaButton href="#/contact">{CTA_LABELS.parlerDirect}</CtaButton>
                </span>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* — Rupture visuelle : APROPOS-AMBIANCE avant les crédentials — */}
      <Section>
        <Container>
          <Reveal>
            <div className="relative aspect-[16/9] overflow-hidden rounded-[12px]">
              <Image
                src="/assets/APROPOS-AMBIANCE.webp"
                alt="Casque audio et ordinateur portable ouvert sur une visioconférence, lumière naturelle de fin d'après-midi"
                fill
                sizes="(max-width: 1023px) 92vw, 88vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* — Crédentials — */}
      <Section className="pt-0">
        <Container>
          <Reveal>
            <Prose>
              <p className="t-body">
                Titulaire d&apos;une licence en anglais américain, Stevens
                s&apos;est formé sur le terrain dès ses débuts, avec une
                première certification obtenue dans son tout premier centre de
                formation. Il a ensuite effectué un stage académique de trois
                mois à l&apos;American Corner — un centre international de la
                langue anglaise — où il a été reconnu comme l&apos;un des
                meilleurs stagiaires. Là-bas, il a coaché des étudiants, des
                cadres et des professionnels de tous horizons venus apprendre à
                parler anglais avec aisance et professionnalisme.
              </p>
              <p className="t-body">
                Aujourd&apos;hui encore, il continue d&apos;accompagner des
                débutants au sein d&apos;une académie internationale de langue
                anglaise en ligne. Trois ans de pratique constante, une seule
                obsession : faire parler ses élèves, pas seulement leur faire
                réciter des règles.
              </p>
            </Prose>
          </Reveal>
          <Reveal className="mt-12">
            <SecondaryLink href="#/resultats">
              {CTA_LABELS.voirResultats}
            </SecondaryLink>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
