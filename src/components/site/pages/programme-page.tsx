"use client";

import { CTA_LABELS, OFFRE } from "@/lib/site";
import { VALUE_STACK } from "@/lib/inclusions";
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

/* Tout ce que comprend le programme — Task 34 (instruction
   propriétaire) : la liste est EXACTEMENT CONFORME à celle de la
   carte « Voici tout ce que tu reçois pour 70 000 FCFA : » de la
   section « L'offre » de l'accueil : les 8 choses de « Ce qui est
   inclus » (source unique src/lib/inclusions.ts — les deux listes
   dérivent de la MÊME donnée, conformité auto-synchronisée). */
const PROGRAMME_INCLUS = VALUE_STACK;

export function ProgrammePage() {
  return (
    <>
      {/* Task 27 (instruction propriétaire) : le hero « De Comprendre
          à Parler » passe sur fond NOIR #000000, avec une vraie
          respiration sous le sous-titre (pb-12/lg:pb-20) — il n'est plus
          collé à la limite de la section texture qui suit. */}
      <PageHero
        dark
        className="on-dark bg-black pb-12 lg:pb-20"
        title={
          <>
            De <span className="text-red-button">Comprendre</span> à{" "}
            <span className="text-red-button">Parler</span>.
          </>
        }
        subtitle="Le programme d'accompagnement de 03 mois — un seul objectif : que tu parles anglais avec confiance."
        /* Task 28 (instruction propriétaire) : le sous-titre passe en
            GRIS — plus sobre sous le titre blanc du hero noir. */
        subtitleClassName="text-white/60"
      />

      {/* — L'offre unique — bloc central de conversion — Task 27 :
          la section devient SOMBRE (continuité du hero noir) — les
          textes « Voici tout ce que comprend le programme : » et la
          partie « Garantie » passent en BLANC #FFFFFF (instruction
          propriétaire). La carte « Le programme » reste blanche :
          contraste premium sur le fond noir. — */}
      <Section className="on-dark relative overflow-hidden bg-black pt-0 text-white">
        {/* OFFRES-TEXTURE — fond discret sur noir : opacité réduite +
            voile sombre pour la lisibilité du texte blanc.
            Task 36 (retour propriétaire) : « le fond image est trop
            sombre » — le voile passe de bg-black/55 à bg-black/40
            (l'image reste perceptiblement plus claire, le texte blanc
            reste lisible). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 select-none"
        >
          <ResponsiveImage
            src="/assets/OFFRES-TEXTURE.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <Container className="relative">
          <Reveal>
            <div className="mx-auto max-w-[52rem]">
              {/* Task 29 (instruction propriétaire) : la carte d'offre
                  passe en VERRE TRANSPARENT sombre — la texture
                  OFFRES-TEXTURE derrière elle est floutée par le
                  backdrop-filter : vrai effet glassmorphism. Textes
                  BLANCS (lisible sur verre sombre). */}
              <div className="glass-card glass-dark card-hover p-6 md:p-10 lg:p-12">
                <Eyebrow className="text-white/75">Le programme</Eyebrow>
                {/* Task 32 (instruction propriétaire) : « 03 mois » en
                    ROUGE dans le titre de la carte. */}
                <h2 className="t-h2 mt-4 text-white">
                  <span className="text-red-button">03 mois</span> de
                  coaching d&apos;anglais personnalisé.
                </h2>
                <p className="t-body mt-6 text-white/85">
                  Trois séances de 1h30 par semaine, pendant trois mois.
                  C&apos;est le format suivi par l&apos;apprenant qui a réussi
                  son passage à un poste international — le rythme qui laisse
                  à l&apos;anglais le temps de s&apos;installer durablement
                  dans ton quotidien.
                </p>
                <p className="t-body mt-4 text-white/85">
                  Chaque séance est une vraie prise de parole : conversations
                  réelles, corrections personnalisées, prononciation — et des
                  exercices courts entre les séances pour accélérer la
                  progression.
                </p>

                {/* Prix — Task 50 (recommandation expert marketing) :
                    PRIX DE LANCEMENT — tarif normal barré au-dessus du
                    prix réel, mention première cohorte. Élégance premium :
                    pas de « profitez vite ». */}
                <div className="mt-10 border-t border-white/20 pt-8">
                  <p className="t-caption font-medium uppercase tracking-[0.14em] text-red-button">
                    Prix de lancement
                  </p>
                  <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-[1.375rem] font-[550] tabular-nums text-white/50 line-through">
                      {OFFRE.prixNormal}
                    </span>
                    <span className="text-[0.9rem] font-[550] tabular-nums text-white/50 line-through">
                      {OFFRE.devise}
                    </span>
                  </p>
                  <p className="mt-2 flex flex-wrap items-baseline gap-x-4">
                    <span className="t-stat text-white">{OFFRE.prix}</span>
                    <span className="t-stat-unit text-white">
                      {OFFRE.devise}
                    </span>
                  </p>
                  <p className="t-caption mt-4 italic text-white/70">
                    Tarif de lancement réservé à la première cohorte — il
                    prendra fin à sa clôture.
                  </p>
                  <p className="text-[0.9375rem] font-medium text-white/70 mt-4">
                    {OFFRE.paiement} — pas d&apos;abonnement, pas de paiement
                    mensuel, pas de frais cachés.
                  </p>
                </div>
                <p className="t-body mt-4 font-medium text-white">
                  Un seul paiement. Trois mois d&apos;accompagnement.
                </p>

                <div className="mt-10">
                  <span data-wa-cta className="inline-flex w-full sm:w-auto">
                    <CtaButton href="/contact" className="w-full sm:w-auto">
                      {CTA_LABELS.rejoindre}
                    </CtaButton>
                  </span>
                  <p className="t-caption mt-4 text-white/70">
                    {OFFRE.sousCtaPrix}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Tout ce que le programme comprend (instruction
              propriétaire : valeur perçue) — Task 27 : textes BLANCS
              sur le fond sombre */}
          <Reveal className="mt-10 lg:mt-14">
            <div className="mx-auto max-w-[52rem]">
              <h3 className="t-h3 text-white">
                Voici tout ce que comprend le programme :
              </h3>
              <div className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2">
                {PROGRAMME_INCLUS.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 border-b border-white/20 pb-4"
                  >
                    <IconCheck className="mt-0.5 text-white" fg="#000000" />
                    <span className="t-body text-white">{item}</span>
                  </div>
                ))}
              </div>
              {/* Task 50 : certificat de fin de programme — ligne
                  DISTINCTE des 8 inclusions (source unique partagée
                  intacte), formulation différente de l'accueil. */}
              <div className="mt-6 border-t border-white/20 pt-6">
                <p className="t-caption font-medium uppercase tracking-[0.14em] text-white/75">
                  Certificat de fin de programme
                </p>
                <p className="t-body mt-2 text-white">
                  À l&apos;issue des 03 mois, chaque apprenant ayant complété
                  le programme reçoit un certificat de fin de programme,
                  délivré par Mr Steve English.
                </p>
              </div>
              <p className="t-body mt-6 text-white/85">
                Soit un accompagnement complet sur trois mois — au sein
                d&apos;une cohorte volontairement limitée à {OFFRE.places}{" "}
                apprenants, pour que chacun soit réellement suivi. Pas des
                séances isolées, mais un parcours structuré, du premier
                déclic jusqu&apos;à une parole qui tient debout.
              </p>
            </div>
          </Reveal>

          {/* Garantie basée sur l'engagement (instruction propriétaire :
              jamais de garantie absolue sans conditions) — Task 27 :
              textes BLANCS, bordure blanche */}
          <Reveal className="mt-12 lg:mt-16">
            <div className="mx-auto max-w-[52rem] rounded-[12px] border-2 border-white p-6 md:p-8">
              <Eyebrow className="text-white/75">Garantie</Eyebrow>
              <p className="t-body mt-3 text-white/85">
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

      {/* — Après le paiement — Task 29 : carte en VERRE TRANSPARENT
          (style Pour qui ?) — nappes de couleur derrière elle pour
          rendre la translucidité lisible sur fond blanc. — */}
      <Section className="relative overflow-hidden pt-0">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[2rem] top-[2rem] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(255,26,26,0.32)_0%,transparent_62%)] blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[2rem] top-[6rem] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(28,28,64,0.32)_0%,transparent_62%)] blur-2xl"
        />
        <Container className="relative">
          <Reveal>
            <div className="glass-card mx-auto max-w-[46rem] p-6 md:p-10">
              <p className="t-body">
                Trois jours après ton paiement, ton coaching démarre
                réellement : suivi personnalisé et toutes les ressources
                nécessaires mises à ta disposition dès le premier jour.
              </p>
              <div className="mt-8">
                <span data-wa-cta className="inline-flex">
                  <CtaButton href="/contact">{CTA_LABELS.rejoindre}</CtaButton>
                </span>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* CTA sticky mobile (page Programme) */}
      <StickyCTA href="/contact" label={CTA_LABELS.decouvrirCourt} />
    </>
  );
}
