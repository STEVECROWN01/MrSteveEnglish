"use client";

import { CTA_LABELS } from "@/lib/site";
import { Container, Prose, Section } from "../layout-primitives";
import { CtaButton, SecondaryLink } from "../buttons";
import { Reveal } from "../reveal";
import { ResponsiveImage } from "../responsive-image";

/**
 * PAGE 3 — À PROPOS / COACH (COPYWRITING.md)
 * Fonction : humaniser, créer la connexion émotionnelle, asseoir la
 * légitimité.
 * Task 27 (instruction propriétaire) :
 * — la toute première section (portrait + titre) passe sur fond NOIR
 *   #000000 (texte blanc) — UNIQUEMENT cette section ;
 * — sur DESKTOP uniquement, l'image d'ambiance devient VERTICALE
 *   (APROPOS-AMBIANCE-02) et vit À DROITE du texte « Titulaire d'une
 *   licence… » ; l'image horizontale pleine largeur reste le traitement
 *   mobile/tablette ;
 * — l'espace entre l'image et le texte est resserré sur desktop.
 */

export function AProposPage() {
  return (
    <>
      {/* — Hero : portrait réel 40 % + texte — fond NOIR (Task 27) — */}
      <section className="on-dark bg-black pt-[112px] text-white lg:pt-[168px]">
        <Container>
          <div className="grid items-start gap-10 pb-12 lg:grid-cols-[2fr_3fr] lg:gap-16 lg:pb-24">
            {/* Portrait — photographie professionnelle de Stevens
                (ratio 2:3 conservé intégralement — aucun recadrage, le
                visage reste entier) */}
            <Reveal className="relative mx-auto w-full max-w-[26rem] lg:mx-0">
              <div className="relative aspect-[2/3] overflow-hidden rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.10)]">
                <ResponsiveImage
                  src="/assets/APROPOS-PORTRAIT.webp"
                  alt="Portrait professionnel de Stevens Akpovi, coach d'anglais, en costume noir et lunettes, dans un intérieur moderne"
                  fill
                  priority
                  sizes="(max-width: 639px) 92vw, 480px"
                  className="object-cover"
                />
              </div>
            </Reveal>

            {/* Texte biographique — P1 */}
            <div className="max-w-[42rem]">
              <Reveal>
                <h1 className="t-h1 text-white">
                  Stevens AKPOVI. Pas un accent parfait. Une méthode qui
                  fonctionne.
                </h1>
                <p className="t-body mt-6 text-white/75">
                  Licencié en anglais américain, formé sur le terrain, et
                  toujours en train de coacher aujourd&apos;hui.
                </p>
                <p className="t-body mt-6 text-white/85">
                  Stevens n&apos;a jamais cru que le secret d&apos;un bon
                  coach, c&apos;était un accent impeccable. Le secret,
                  c&apos;est d&apos;entendre exactement où l&apos;apprenant
                  bloque — et de s&apos;y adapter, séance après séance, plutôt
                  que de dérouler un programme prévu à l&apos;avance.
                </p>
              </Reveal>
              <Reveal className="mt-10">
                <span data-wa-cta className="inline-flex">
                  <CtaButton href="#/contact">{CTA_LABELS.hero}</CtaButton>
                </span>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* — Ambiance + crédentials — fond blanc (inchangé).
          MOBILE / TABLETTE : image horizontale APROPOS-AMBIANCE pleine
          largeur AU-DESSUS du texte (traitement d'origine).
          DESKTOP (Task 27) : l'image horizontale disparaît au profit de
          l'image VERTICALE APROPOS-AMBIANCE-02 posée À DROITE du texte,
          dans la même grille — l'espace entre image et texte est
          resserré (une seule section, gap contrôlé). */}
      <Section className="pt-12 lg:pt-16">
        <Container>
          {/* Image horizontale — mobile / tablette uniquement */}
          <Reveal className="lg:hidden">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[12px]">
              <ResponsiveImage
                src="/assets/APROPOS-AMBIANCE.webp"
                alt="Casque audio et ordinateur portable ouvert sur une visioconférence, lumière naturelle de fin d'après-midi"
                fill
                sizes="(max-width: 1023px) 92vw, 88vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <div className="mt-10 grid items-start gap-10 lg:mt-0 lg:grid-cols-[minmax(0,44rem)_minmax(0,22rem)] lg:gap-12">
            {/* Crédentials — texte à gauche (desktop) */}
            <Reveal className="lg:pt-2">
              <Prose>
                <p className="t-body">
                  Titulaire d&apos;une licence en anglais américain, Stevens
                  s&apos;est formé sur le terrain dès ses débuts, avec une
                  première certification obtenue dans son tout premier centre
                  de formation. Il a ensuite effectué un stage académique de
                  trois mois à l&apos;American Corner — un centre international
                  de la langue anglaise — où il a été reconnu comme l&apos;un
                  des meilleurs stagiaires. Là-bas, il a coaché des étudiants,
                  des cadres et des professionnels de tous horizons venus
                  apprendre à parler anglais avec aisance et professionnalisme.
                </p>
                <p className="t-body">
                  Aujourd&apos;hui encore, il continue d&apos;accompagner des
                  débutants au sein d&apos;une académie internationale de
                  langue anglaise en ligne. Trois ans de pratique constante,
                  une seule obsession : faire parler ses apprenants, pas
                  seulement leur faire réciter des règles.
                </p>
              </Prose>
              <Reveal className="mt-12">
                <SecondaryLink
                  href="#/resultats"
                  className="btn-invert-hover"
                >
                  {CTA_LABELS.voirResultats}
                </SecondaryLink>
              </Reveal>
            </Reveal>

            {/* Image verticale — desktop uniquement, à droite du texte
                (Task 27 : APROPOS-AMBIANCE-02, format portrait) */}
            <Reveal delay={120} className="hidden lg:block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.10)]">
                <ResponsiveImage
                  src="/assets/APROPOS-AMBIANCE-02.webp"
                  alt="Bureau lumineux de coaching en ligne : ordinateur en visioconférence, casque, carnet et tasse — l'environnement des séances avec Stevens"
                  fill
                  sizes="352px"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
