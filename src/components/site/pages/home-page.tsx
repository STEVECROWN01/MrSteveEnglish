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
import { MicrophoneScene } from "../microphone-scene";

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
 * nouvelle version à droite du bloc contenu, de même hauteur que lui —
 * instruction propriétaire) → La
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
          alt="Stevens AKPOVI, coach d'anglais, souriant, assis à une table dans un intérieur chaleureux"
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
          {/* Rareté (instruction propriétaire : stratégie marketing) —
              places limitées dès le premier écran, sans crier */}
          <p className="hero-line hero-d5 t-caption mt-6 text-white/75">
            Places limitées chaque mois — je n&apos;accompagne qu&apos;un
            nombre restreint d&apos;élèves à la fois.
          </p>
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
        {/* Coût de l&apos;inaction (instruction propriétaire : FOMO /
            urgence) — les opportunités passent à ceux qui osent parler.
            Carte sombre encadrée, même langage que le fond noir. */}
        <Reveal className="mt-16 lg:mt-24">
          <div className="rounded-[12px] border border-white/15 bg-white/[0.06] p-6 md:p-8 lg:p-10">
            <Eyebrow className="text-white/75">
              Ce que coûte vraiment l&apos;attente
            </Eyebrow>
            <h3 className="t-h3 mt-4 text-white">
              Et pendant ce temps, quelqu&apos;un d&apos;autre postule.
            </h3>
            <p className="t-body mt-4 text-white/85">
              Quelqu&apos;un qui ose parler — même imparfaitement — passe
              l&apos;entretien, décroche le poste, signe le client, part
              travailler à l&apos;étranger. Ton blocage ne coûte pas seulement
              de la frustration : il te coûte des opportunités que tu ne
              verras même jamais passer. Et chaque mois qui passe éloigne un
              peu plus les prochaines.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* — Solution : retour au blanc. Le fond passe du noir au blanc
     par fondu 500ms à l'entrée dans le viewport.
     Card avec le chiffre clé 98 % en noir, et l'image METHOD-01
     (nouvelle version, SANS miroir — instruction propriétaire) intégrée
     À DROITE du bloc enveloppant le contenu, à la MÊME HAUTEUR que lui
     (instruction propriétaire). Voix première personne
     (instruction propriétaire). Mobile : bloc puis image, empilés. — */
function Solution() {
  return (
    <section
      id="methode"
      className="relative scroll-mt-20 overflow-hidden bg-white lg:scroll-mt-24"
    >
      <DarkFadeOverlay />
      {/* Limite de section oblique (instruction propriétaire) : la
          frontière avec la section noire ci-dessus monte de la gauche
          vers la droite — coin noir plein en haut-gauche, aligné au
          bord. Sous le voile dark-fade : invisible avant le fondu,
          révélée avec lui. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-0 block h-10 w-full lg:h-14"
      >
        <polygon points="0,0 100,0 0,100" fill="#000000" />
      </svg>
      <Container className="relative py-12 lg:py-24">
        {/* items-stretch : l'image (droite) prend la MÊME HAUTEUR que le
            bloc texte (gauche) — instruction propriétaire. */}
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

          {/* Image METHOD-01 (nouvelle version, SANS miroir — instruction
              propriétaire : le sujet regarde déjà vers la gauche, vers le
              contenu). Même hauteur que le bloc à sa gauche sur desktop :
              le conteneur est étiré (lg:h-full) et l'image recadrée par
              object-cover, décalée à 60 % pour préserver la tasse
              « Small Steps Big Progress ». Mobile : ratio naturel 2:3,
              aucune coupe. Servie sans ré-encodage (unoptimized) pour la
              netteté (leçon hero). */}
          <Reveal delay={120}>
            <div className="relative mx-auto aspect-[2/3] w-full max-w-[22rem] overflow-hidden rounded-[12px] lg:mx-0 lg:aspect-auto lg:h-full">
              <Image
                src="/assets/METHOD-01.webp"
                alt="Apprenante souriante en pleine séance de coaching d'anglais en ligne, concentrée sur son écran — tasse « Small Steps Big Progress » posée sur le bureau"
                sizes="(max-width: 1023px) 92vw, 352px"
                fill
                unoptimized
                className="object-cover object-[60%_center]"
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
     Point d'ancrage de la navigation : #/?section=methode — ancre
     posée sur la section « Ma méthode » (Solution) ci-dessus
     (instruction propriétaire : le menu « Méthode » y mène). — */
function Methode() {
  return (
    <div>
      {/* — Angle : méthode vs grammaire bûchée — */}
      <Section>
        {/* Trait de séparation court (instruction propriétaire) :
            marque la limite « Ma méthode » / « Comment ça marche » —
            horizontal, centré, noir pur #000000, légèrement épais. */}
        <div aria-hidden="true" className="mx-auto h-[3px] w-20 bg-black" />
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

          {/* Diptyque — les deux textes en OVERLAY sur les images
              (instruction propriétaire) : la grammaire bûchée sur
              METHODE-01-rigide (gauche), la méthode vivante sur
              METHODE-01-fluide (droite). Lisibilité garantie par un voile
              dégradé bas (fort en bas, transparent en haut — les visages
              restent clairs) + ombre portée sur le texte. Ratio 4:5 —
              hauteur réduite à la demande (recadrage object-cover centré,
              visages préservés), servies sans ré-encodage (unoptimized).
              Côte à côte desktop, empilé mobile. */}
          <div className="mt-10 grid gap-6 lg:mt-14 lg:grid-cols-2 lg:gap-8">
            <Reveal>
              <figure className="relative aspect-[4/5] overflow-hidden rounded-[12px]">
                <Image
                  src="/assets/METHODE-01-rigide.webp"
                  alt="Homme pensif face à ses livres de grammaire anglaise — feuilles froissées sur le bureau, affiche « Discipline » : l'étude rigide qui ne fait pas parler"
                  fill
                  unoptimized
                  sizes="(max-width: 1023px) 92vw, 566px"
                  className="object-cover"
                />
                {/* Voile de lisibilité — concentré sur la zone texte (bas) */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent"
                />
                {/* Texte en overlay (instruction propriétaire) */}
                <figcaption className="absolute inset-x-0 bottom-0 p-6 [text-shadow:0_1px_12px_rgba(0,0,0,0.5)] md:p-8">
                  <Eyebrow className="text-white/80">
                    La grammaire seule
                  </Eyebrow>
                  <p className="t-body mt-3 text-white">
                    Tu peux connaître toutes les règles de grammaire anglaise
                    et rester muet face à un anglophone. Ce n&apos;est pas un
                    manque de connaissances. C&apos;est un manque de pratique
                    orale réelle, avec quelqu&apos;un qui corrige au bon
                    moment, sans te bloquer dans la peur de l&apos;erreur.
                  </p>
                </figcaption>
              </figure>
            </Reveal>

            <Reveal delay={120}>
              <figure className="relative aspect-[4/5] overflow-hidden rounded-[12px]">
                <Image
                  src="/assets/METHODE-01-fluide.webp"
                  alt="Femme souriante en séance de coaching d'anglais en visioconférence — casque sur les oreilles, lumière chaude : la pratique vivante qui débloque la parole"
                  fill
                  unoptimized
                  sizes="(max-width: 1023px) 92vw, 566px"
                  className="object-cover"
                />
                {/* Voile de lisibilité — concentré sur la zone texte (bas) */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent"
                />
                {/* Texte en overlay (instruction propriétaire) */}
                <figcaption className="absolute inset-x-0 bottom-0 p-6 [text-shadow:0_1px_12px_rgba(0,0,0,0.5)] md:p-8">
                  <Eyebrow className="text-white/80">
                    La méthode vivante
                  </Eyebrow>
                  <p className="t-body mt-3 text-white">
                    C&apos;est exactement ce que je fais avec toi. Chaque séance
                    part de ce que tu sais déjà dire — et pousse un peu plus
                    loin. Pas de manuel figé. Pas de leçon générique. Une
                    conversation, structurée, qui avance à ton rythme.
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* — Comment se déroule le coaching — texte à gauche, scène 3D
           « microphone tech » à droite (instruction propriétaire :
           recréation animée de l'asset Spline désigné, accents néon
           adaptés au rouge DA §19). Fond commun sombre — le radial
           studio de la scène s'étend à toute la section (hotspot
           repositionné sur le micro : centré-bas mobile, colonne
           droite desktop) : le micro ne vit plus dans un bloc, il
           flotte directement sur le fond (instruction propriétaire).
           Mobile : texte puis scène. — */}
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
                    Le format que je recommande — celui qui a mené un apprenant
                    jusqu&apos;à l&apos;expatriation professionnelle —
                    c&apos;est trois séances de 1h30 par semaine, pendant trois
                    mois. Un rythme qui installe l&apos;anglais dans ton
                    quotidien, sans le laisser retomber entre deux séances.
                  </p>
                  <p className="t-body text-white/85">
                    Je propose aussi une version plus courte, sur deux mois, si
                    tu veux avancer plus vite. Le résultat dépend surtout
                    d&apos;une chose : que tu mettes en application ce qui est
                    vu en séance.
                  </p>
                  <p className="t-body text-white/85">
                    Individuel, pour un accompagnement sur-mesure. Ou en petit
                    groupe, si tu apprends mieux en interaction.
                  </p>
                </Prose>
              </Reveal>

              {/* Timeline — ligne horizontale simple avec deux points (DA §12),
                  déclinée en blanc sur le fond sombre */}
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

              {/* Rareté (instruction propriétaire : stratégie marketing) —
                  placée juste avant le CTA : un vrai suivi exige trois
                  séances par semaine par élève, donc des places comptées. */}
              <Reveal className="mt-10">
                <div className="max-w-[34rem] rounded-[12px] border border-white/15 bg-white/[0.06] p-5 md:p-6">
                  <p className="text-[0.9375rem] font-medium text-white">
                    Places limitées — c&apos;est la condition d&apos;un vrai
                    suivi.
                  </p>
                  <p className="t-body mt-2 text-white/85">
                    Trois séances par semaine par élève, c&apos;est un temps
                    réel que je consacre à chaque apprenant. Je ne prends
                    qu&apos;un nombre restreint d&apos;élèves à la fois :
                    quand les places du mois sont prises, il faut attendre le
                    suivant.
                  </p>
                </div>
              </Reveal>

              <Reveal className="mt-12">
                <span data-wa-cta className="inline-flex">
                  <CtaButton href="#/contact">{CTA_LABELS.reserverFormat}</CtaButton>
                </span>
              </Reveal>
            </div>

            {/* Scène 3D — chargée à l'approche du viewport uniquement */}
            <Reveal delay={120}>
              <MicrophoneScene className="mx-auto max-w-[30rem] lg:max-w-none" />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* — Traitement d'objection — centré (instruction propriétaire :
            moment d'affirmation courte, DA §7 réserve le centrage à
            ces moments). — */}
      <Section>
        <Container>
          <Reveal>
            <Prose className="mx-auto text-center">
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
          <Reveal className="mt-10 flex justify-center">
            <SecondaryLink href="#/resultats">
              {CTA_LABELS.voirMethode}
            </SecondaryLink>
          </Reveal>
        </Container>
      </Section>

      {/* — Garantie de résultat (instruction propriétaire : stratégie
            marketing confiance / renversement du risque) — si l&apos;élève
            applique rigoureusement la méthode pendant deux mois et ne
            parle pas, il est remboursé intégralement. Carte « contrat »
            encadrée sur fond noir, en clôture de narration avant le
            footer. — */}
      <Section className="on-dark bg-black text-white">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-[46rem] rounded-[12px] border border-white/20 bg-white/[0.04] p-6 md:p-10">
              <Eyebrow className="text-white/75">
                Garantie de résultat
              </Eyebrow>
              <h2 className="t-h2 mt-4 text-white">
                Si tu appliques, tu parles. Sinon, je te rembourse.
              </h2>
              <p className="t-body mt-6 text-white/85">
                Je ne te demande pas de me croire sur parole. Je te demande
                de faire ta part : les séances, les exercices entre deux,
                les corrections intégrées. Si tu appliques rigoureusement
                ce qu&apos;on travaille ensemble, parler devient une
                conséquence — pas une question de chance, ni de talent.
              </p>
              <p className="t-body mt-4 text-white/85">
                Et si, après deux mois d&apos;application rigoureuse, tu
                n&apos;arrives toujours pas à t&apos;exprimer, je te rembourse
                la totalité de ton accompagnement. Pas de justification
                interminable : tu me montres que tu as fait le travail, et
                je te rends ton argent.
              </p>

              {/* Les trois engagements — ce qui active la garantie */}
              <ul className="mt-8 space-y-3 border-t border-white/15 pt-6">
                {[
                  "Tu suis le rythme de séances qu'on définit ensemble.",
                  "Tu pratiques entre les séances, comme convenu.",
                  "Tu appliques les corrections travaillées en séance.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg
                      className="mt-1 h-5 w-5 shrink-0 text-white"
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 10.5 C 6.5 13, 8.5 15, 9 15.5 C 11.5 12, 14 8.5, 16.5 5.5"
                        stroke="currentColor"
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="t-body text-white/85">{item}</span>
                  </li>
                ))}
              </ul>

              <p className="t-body mt-8 text-white/85">
                Le risque, c&apos;est moi qui le prends. Le seul qui te
                reste : être exactement au même point dans six mois.
              </p>
              <div className="mt-10">
                <span data-wa-cta className="inline-flex">
                  <CtaButton href="#/contact">{CTA_LABELS.hero}</CtaButton>
                </span>
              </div>
            </div>
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
