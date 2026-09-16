"use client";

import { CTA_LABELS } from "@/lib/site";
import { Container, Eyebrow, PageHero, Prose, Section } from "../layout-primitives";
import { CtaButton, SecondaryLink } from "../buttons";
import { Reveal } from "../reveal";
import { CountUp } from "../count-up";
import { BeforeAfter } from "../before-after";
import { ResponsiveImage } from "../responsive-image";
import { AirplaneScene } from "../airplane-scene";

/**
 * PAGE 4 — RÉSULTATS / TÉMOIGNAGES (COPYWRITING.md)
 * Fonction : preuve sociale, réduction du risque perçu.
 * Composition (DA §12) : RESULTATS-CAS en bandeau large au-dessus du
 * portrait du cas 40 ans. Trois témoignages en cards identiques
 * (radius 12px, bordure 1px), avatar à gauche de la citation, chiffre
 * clé en Bleu Profond en gros dans un angle de la card.
 *
 * TASK 27 (instructions propriétaire) :
 * - « Un parcours réel » : scène 3D avion stylisé (référence Spline
 *   3D Airplane) posée À DROITE du texte sur desktop, légèrement
 *   oblique montante (bas-gauche → haut-droite, intégrée à la scène).
 * - Avatars David/Michael : fichiers échangés (le propriétaire les
 *   avait intervertis lors de l'upload) — chaque card affiche
 *   désormais le bon visage.
 * - Bloc « Un mois pour oser parler » : CONTENU CENTRÉ.
 *
 * TASK 36 (retour propriétaire) :
 * - Les 3 cartes témoignages passent en VERRE TRANSPARENT
 *   (glass-card, comme les cartes verre du site) avec des nappes de
 *   couleur derrière elles pour rendre la translucidité lisible.
 * - Titre « Un mois pour oser parler. Trois mois… » : « Trois mois »
 *   en ROUGE.
*/

const TEMOIGNAGES = [
  {
    name: "Sarah",
    meta: "Sarah, 22 ans — étudiante, niveau intermédiaire",
    avatar: "/assets/AVATAR-SARAH.webp",
    avatarAlt: "Portrait de Sarah",
    quote: "« Je comprenais l'anglais. Mais dès qu'il fallait parler, je bloquais. »",
    body: [
      "Avant de commencer, Sarah comprenait une grande partie de ce qu'elle entendait en anglais. Mais dès qu'on lui posait une question, elle traduisait chaque phrase dans sa tête avant de répondre — et la peur de l'erreur faisait le reste.",
      "Après 9 séances de coaching, elle a commencé à répondre beaucoup plus spontanément. Lors d'une conversation avec une personne anglophone, elle a tenu environ 20 minutes sans repasser par le français. Ce qui l'a le plus marquée : elle n'avait pas besoin de connaître \"tous les mots\" pour communiquer — elle a surtout appris à utiliser ce qu'elle savait déjà.",
    ],
    before:
      "compréhension correcte, réponses lentes, forte dépendance à la traduction mentale.",
    after:
      "conversation de 20 minutes, spontanéité et confiance nettement accrues.",
    figure: 9,
    unit: "séances",
  },
  {
    name: "David",
    meta: "David, 27 ans — jeune professionnel, niveau débutant/intermédiaire",
    avatar: "/assets/AVATAR-DAVID.webp",
    avatarAlt: "Portrait de David",
    quote: "« Je pensais que je n'étais simplement pas doué en anglais. »",
    body: [
      "Au début du coaching, même une question simple comme \"What did you do this weekend?\" pouvait lui prendre plusieurs secondes à construire mentalement. David avait déjà essayé d'apprendre seul, plusieurs fois, sans résultat.",
      "Pendant 6 semaines, le travail s'est concentré sur l'expression orale et la construction spontanée des phrases. Il a fini par tenir une conversation de plusieurs minutes entièrement en anglais — sans chercher à repasser au français. Sa vraie prise de conscience : il connaissait déjà bien plus de vocabulaire qu'il ne le pensait. Son problème n'était pas le manque de mots, mais l'incapacité à les mobiliser rapidement.",
    ],
    before: "réponses lentes, vocabulaire connu mais inutilisable à l'oral.",
    after: "conversation de plusieurs minutes, vocabulaire mobilisé spontanément.",
    figure: 6,
    unit: "semaines",
  },
  {
    name: "Michael",
    meta: "Michael, 24 ans — étudiant, niveau intermédiaire",
    avatar: "/assets/AVATAR-MICHAEL.webp",
    avatarAlt: "Portrait de Michael",
    quote: "« J'ai arrêté d'attendre d'être \"parfait\" pour parler. »",
    body: [
      "Michael connaissait déjà pas mal de règles de grammaire et un vocabulaire correct — mais voulait construire chaque phrase parfaitement avant de la prononcer. Résultat : il avait souvent la réponse en tête, sans réussir à la dire à temps.",
      "Après 10 séances, il a réussi à tenir plus de 10 minutes de conversation en anglais sans interrompre sa pensée pour vérifier chaque détail grammatical. Avec des erreurs, bien sûr — mais sans abandonner. Sa phrase, après coup : \"Je n'ai pas besoin de parler parfaitement pour être compris.\"",
    ],
    before:
      "peur de l'erreur, sur-analyse grammaticale, conversation impossible à tenir.",
    after: "plus de 10 minutes de conversation, erreurs assumées, aucune paralysie.",
    figure: 10,
    unit: "séances",
  },
];

export function ResultatsPage() {
  return (
    <>
      <PageHero title="Ils comprenaient l'anglais depuis des années. Voici ce qui a débloqué leur parole." />

      {/* — Portrait : l'expatriation qui ne laissait pas le choix — */}
      <Section>
        <Container>
          <Reveal>
            <div className="relative aspect-[16/9] overflow-hidden rounded-[12px]">
              <ResponsiveImage
                src="/assets/RESULTATS-CAS.webp"
                alt="Silhouette de dos avec une valise, face à la baie vitrée d'un aéroport baignée de lumière"
                fill
                sizes="(max-width: 1023px) 92vw, 88vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal className="mt-10 lg:mt-14">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Texte « Un parcours réel » — colonne gauche (desktop) */}
              <Prose>
                <p className="t-body italic text-grey-mid">
                  Chaque apprenant vient avec un objectif différent — en voici
                  un parmi d&apos;autres.
                </p>
                <Eyebrow className="mt-6">Un parcours réel</Eyebrow>
                <h2 className="t-h2 mt-4 text-black">
                  Un poste à l&apos;international. Une seule vraie exigence :
                  parler anglais couramment.
                </h2>
                <p className="t-body mt-6">
                  Un professionnel d&apos;une quarantaine d&apos;années
                  s&apos;apprêtait à évoluer vers un poste à l&apos;international.
                  Le poste l&apos;imposait : travailler entièrement en anglais, à
                  l&apos;étranger. Sa frustration ? Il comprenait l&apos;anglais
                  depuis des années, mais bloquait complètement à l&apos;oral. Il
                  avait déjà essayé de bûcher seul les leçons de grammaire —
                  sans résultat, parce que l&apos;anglais ne s&apos;apprend pas ainsi.
                </p>
                <p className="t-body">
                  Il a suivi le format que je recommande : trois mois de
                  coaching, trois séances de 1h30 par semaine, entièrement
                  orientées vers la pratique orale de son domaine professionnel.
                  À la fin des trois mois, il s&apos;exprimait avec l&apos;aisance
                  nécessaire pour prendre son nouveau poste à l&apos;international
                  — avec succès.
                </p>
              </Prose>

              {/* Avion 3D (référence Spline « 3D Airplane ») — colonne
                  droite (desktop), oblique montant bas-gauche → haut-
                  droite ; empilé SOUS le texte sur mobile/tablette. */}
              <AirplaneScene className="mx-auto w-full max-w-[30rem] lg:max-w-none" />
            </div>
          </Reveal>

          <Reveal className="mt-10">
            <span data-wa-cta className="inline-flex">
              <CtaButton href="/contact">{CTA_LABELS.hero}</CtaButton>
            </span>
          </Reveal>
        </Container>
      </Section>

      {/* — Témoignages de mes apprenants — Task 36 (retour
          propriétaire) : les 3 cartes passent en VERRE TRANSPARENT
          (glass-card) comme les cartes verre du site — des nappes de
          couleur traversent leur cœur pour rendre la translucidité
          lisible (leçon Task 27). — */}
      <Section className="relative overflow-hidden bg-white">
        {/* Nappes de couleur derrière les cartes verre (Task 36). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-[10rem] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(255,26,26,0.30)_0%,transparent_62%)] blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-[30rem] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(28,28,64,0.30)_0%,transparent_62%)] blur-2xl"
        />
        <Container className="relative">
          <Reveal>
            <h2 className="t-h2 text-black">Témoignages de mes apprenants</h2>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:mt-14 lg:grid-cols-3">
            {TEMOIGNAGES.map((t, i) => (
              <Reveal key={t.name} delay={i * 120} as="article">
                <div className="glass-card card-hover flex h-full flex-col p-6 lg:p-7">
                  {/* Avatar à gauche de la citation (DA §12) */}
                  <div className="flex items-start gap-4">
                    <span className="mt-1 h-14 w-14 shrink-0 overflow-hidden rounded-full lg:h-16 lg:w-16">
                      <ResponsiveImage
                        src={t.avatar}
                        alt={t.avatarAlt}
                        width={64}
                        height={64}
                        sizes="64px"
                        className="h-full w-full object-cover"
                      />
                    </span>
                    <div>
                      <p className="t-quote text-black">{t.quote}</p>
                      <p className="t-caption mt-3 font-medium text-grey-mid">
                        {t.meta}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    {t.body.map((p, j) => (
                      <p key={j} className="t-body">
                        {p}
                      </p>
                    ))}
                  </div>

                  {/* Signature 2 — toggle Avant → Après (DA §14) */}
                  <div className="mt-auto">
                    <BeforeAfter before={t.before} after={t.after} />
                  </div>

                  {/* Chiffre clé — Bleu Profond, en gros, dans un angle */}
                  <div className="mt-6 flex items-baseline justify-end gap-2 border-t border-grey-line pt-5">
                    <span className="t-stat text-black">
                      <CountUp value={t.figure} />
                    </span>
                    <span className="t-stat-unit text-black">{t.unit}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* — Ce que tu peux viser (bloc centré — instruction Task 27) — */}
      <Section>
        <Container>
          <Reveal>
            <Prose className="mx-auto max-w-[46rem] text-center">
              {/* Task 36 (retour propriétaire) : « Trois mois » en
                  ROUGE. */}
              <h2 className="t-h2 text-black">
                Un mois pour oser parler.{" "}
                <span className="text-red-button">Trois mois</span> pour
                parler avec confiance.
              </h2>
              <p className="t-body">
                Chaque parcours est différent, mais la trajectoire reste la
                même : les tout premiers débutants qui suivent ma méthode
                s&apos;expriment librement dès le premier mois, dans neuf cas
                sur dix. Avec trois mois de coaching régulier,
                l&apos;objectif visé — entretien, examen, expatriation, voyage,
                ou simplement parler sans stress au quotidien — devient
                atteignable.
              </p>
            </Prose>
          </Reveal>
          <Reveal className="mt-10 flex justify-center">
            <SecondaryLink
              href="/programme"
              className="btn-invert-hover"
            >
              {CTA_LABELS.decouvrir}
            </SecondaryLink>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
