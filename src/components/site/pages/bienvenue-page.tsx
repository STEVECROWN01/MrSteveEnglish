"use client";

import { cn } from "@/lib/utils";
import { waLink } from "@/lib/site";
import { Container, Eyebrow, Prose } from "../layout-primitives";
import { Reveal } from "../reveal";
import { IconCheck, WhatsAppGlyph } from "../icons";

/**
 * PAGE 8 — BIENVENUE (post-paiement) — instruction propriétaire Task 28.
 *
 * Page de confirmation + onboarding destinée aux clients qui viennent
 * de terminer leur paiement avec succès. Elle N'EST PAS un simple
 * « Merci pour votre paiement » : l'accompagnement commence ici —
 * rassurer, confirmer l'inscription, rappeler ce qui vient d'être
 * acheté, et mener clairement vers l'unique prochaine étape :
 * contacter le coach sur WhatsApp.
 *
 * IMPORTANT (instruction propriétaire) :
 * — AUCUNE logique de paiement ici, aucune modification du système de
 *   paiement, aucune redirection programmée depuis le checkout. C'est
 *   une page AUTONOME : le propriétaire récupère son URL
 *   (…/#/bienvenue) et la configure lui-même comme URL de redirection
 *   après paiement réussi dans son système de paiement.
 * — Page très FOCALISÉE : ni header ni footer global (aucun lien ou
 *   CTA secondaire) — un seul parcours : compréhension → WhatsApp.
 * — Design premium, élégant, minimaliste, cohérent avec le site
 *   (noir / blanc / rouge, Fraunces, animations légères Reveal —
 *   pas de confettis, pas d'animation excessive).
 * — Le message WhatsApp est PRÉ-REMPLI mais jamais envoyé
 *   automatiquement : le client peut le modifier avant l'envoi.
 * — Aucune information privée n'est affichée (ni numéro de téléphone
 *   en clair, ni données de paiement, ni données client).
 */

/** Message WhatsApp pré-rempli (libellé exact propriétaire Task 28). */
const WHATSAPP_MESSAGE =
  "Bonjour Stevens, je viens de finaliser mon inscription au programme d'accompagnement de 3 mois. Mon paiement a bien été effectué et je vous contacte pour connaître la prochaine étape. Merci !";

/* Résumé élégant du programme (instruction propriétaire). */
const PROGRAMME_RECAP = [
  { titre: "03 mois", texte: "Accompagnement personnalisé" },
  { titre: "Speaking & Conversation", texte: "Pratique réelle de l'anglais" },
  { titre: "Prononciation", texte: "Correction et amélioration" },
  {
    titre: "Exercices & Ressources",
    texte: "Pour progresser également entre les séances",
  },
];

/* Les 3 étapes « Et maintenant ? » (instruction propriétaire). */
const ETAPES = [
  {
    num: "01",
    titre: "Contacte-moi sur WhatsApp",
    texte: "Envoie-moi un message pour confirmer ton arrivée et que nous puissions préparer la suite.",
  },
  {
    num: "02",
    titre: "Nous préparons ton démarrage",
    texte: "Nous échangeons sur les prochaines étapes de ton accompagnement et sur la manière dont nous allons commencer.",
  },
  {
    num: "03",
    titre: "Ton coaching commence",
    texte: "Nous travaillons à partir de ton niveau actuel pour construire progressivement une expression anglaise plus naturelle et plus confiante.",
  },
];

/* Statut du récapitulatif (coches vertes « état validé », DA §5). */
const STATUTS = [
  "Paiement effectué",
  "Inscription confirmée",
  "Prochaine étape : contacter le coach",
];

/** Bouton WhatsApp principal / final — même lien, même message
 *  pré-rempli, modifiable par le client avant l'envoi. */
function WhatsAppCta({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <a
      href={waLink(WHATSAPP_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("btn btn-primary t-btn", className)}
    >
      <WhatsAppGlyph />
      {label}
    </a>
  );
}

export function BienvenuePage() {
  return (
    <div className="on-dark flex min-h-screen flex-col bg-black text-white">
      {/* — HERO : icône de confirmation élégante + label + titre — */}
      <section className="pb-8 pt-16 lg:pb-12 lg:pt-24">
        <Container className="text-center">
          <div className="hero-line hero-d1 flex justify-center">
            <IconCheck className="h-12 w-12 text-white lg:h-14 lg:w-14" fg="#000000" />
          </div>
          <p className="hero-line hero-d2 mt-6 text-[0.75rem] font-medium uppercase tracking-[0.18em] text-white/70">
            Inscription confirmée
          </p>
          <h1 className="hero-line hero-d3 t-h1 mt-4 text-white">
            Bienvenue dans ton accompagnement.
          </h1>
          <p className="hero-line hero-d4 t-body mx-auto mt-6 max-w-[38rem] text-white/75">
            Tu viens de faire le premier pas vers un anglais que tu ne te
            contentes plus de comprendre — mais que tu oses réellement
            parler.
          </p>
        </Container>
      </section>

      {/* — CONFIRMATION — */}
      <section className="py-8 lg:py-10">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-[42rem] rounded-[12px] border border-white/20 bg-white/[0.05] p-6 text-center md:p-8">
              <p className="t-body text-white/90">
                Ton paiement a bien été effectué. Ta place dans le programme
                d&apos;accompagnement de 3 mois est maintenant confirmée.
              </p>
              <p className="t-body mt-4 text-white/75">
                Tu n&apos;as plus rien à acheter ni à refaire. La prochaine
                étape est simplement de prendre contact avec moi afin de
                préparer le début de ton accompagnement.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* — RAPPEL DU PROGRAMME — */}
      <section className="py-10 lg:py-14">
        <Container>
          <Reveal>
            <Prose className="mx-auto max-w-[42rem] text-center">
              <h2 className="t-h2 text-white">
                Tu viens de choisir de passer à l&apos;action.
              </h2>
              <p className="t-body mt-6 text-white/80">
                Pendant ces trois mois, nous allons travailler ton anglais
                de manière progressive, pratique et adaptée à ton niveau,
                tes difficultés et tes objectifs.
              </p>
              <p className="t-body text-white/80">
                L&apos;objectif n&apos;est pas simplement de connaître
                davantage de règles. L&apos;objectif est de te permettre de
                mieux comprendre, de mieux t&apos;exprimer et surtout de
                prendre la parole avec davantage de confiance.
              </p>
            </Prose>
          </Reveal>
          <div className="mx-auto mt-10 grid max-w-[46rem] gap-4 sm:grid-cols-2 lg:mt-12">
            {PROGRAMME_RECAP.map((item, i) => (
              <Reveal key={item.titre} delay={i * 100}>
                <div className="h-full rounded-[12px] border border-white/15 bg-white/[0.04] p-6">
                  <p className="font-display text-[1.25rem] font-medium leading-snug text-white md:text-[1.375rem]">
                    {item.titre}
                  </p>
                  <p className="t-caption mt-2 text-white/70">{item.texte}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* — ET MAINTENANT ? — 3 étapes — */}
      <section className="py-10 lg:py-14">
        <Container>
          <Reveal>
            <h2 className="t-h2 text-center text-white">
              Voici ce qui se passe maintenant.
            </h2>
          </Reveal>
          <div className="mx-auto mt-10 grid max-w-[60rem] gap-6 md:grid-cols-3 lg:mt-14">
            {ETAPES.map((e, i) => (
              <Reveal key={e.num} delay={i * 120}>
                <div className="h-full rounded-[12px] border border-white/15 bg-white/[0.04] p-6 lg:p-7">
                  <p className="font-display text-[2rem] font-medium leading-none text-white/30">
                    {e.num}
                  </p>
                  <h3 className="t-h3 mt-5 text-white">{e.titre}</h3>
                  <p className="t-body mt-3 text-white/75">{e.texte}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* — CTA WHATSAPP PRINCIPAL — */}
      <section className="py-10 lg:py-14">
        <Container>
          <Reveal>
            <Prose className="mx-auto max-w-[42rem] text-center">
              <h2 className="t-h2 text-white">Prêt(e) à commencer ?</h2>
              <p className="t-body mt-6 text-white/80">
                Une dernière étape : contacte-moi directement sur WhatsApp
                pour que nous puissions préparer ton accompagnement.
              </p>
            </Prose>
          </Reveal>
          <Reveal className="mt-8 lg:mt-10">
            <div className="flex justify-center">
              <WhatsAppCta
                label="Contacter mon coach sur WhatsApp"
                className="w-full sm:w-auto"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* — RASSURANCE — */}
      <section className="py-10 lg:py-14">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-[42rem] text-center">
              <h2 className="t-h2 text-white">Tu es au bon endroit.</h2>
              <div className="mt-8 space-y-3">
                <p className="t-quote text-white/85">
                  Tu n&apos;as pas besoin d&apos;avoir un anglais parfait
                  pour commencer.
                </p>
                <p className="t-quote text-white/85">
                  Tu n&apos;as pas besoin d&apos;avoir confiance avant de
                  commencer.
                </p>
                <p className="t-quote text-white/85">
                  Et tu n&apos;as pas besoin de tout savoir.
                </p>
              </div>
              <p className="t-body mt-8 font-medium text-white">
                C&apos;est précisément pour cela que tu es ici.
              </p>
              <p className="t-body mt-4 text-white/75">
                Nous allons partir de ton niveau actuel et avancer
                progressivement, avec une méthode adaptée à tes besoins et
                à tes objectifs.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* — VALORISER LA DÉCISION — */}
      <section className="py-10 lg:py-14">
        <Container>
          <Reveal>
            <Prose className="mx-auto max-w-[42rem] text-center">
              <h2 className="t-h2 text-white">
                Tu viens de faire quelque chose d&apos;important.
              </h2>
              <p className="t-body mt-6 text-white/80">
                Beaucoup de personnes comprennent l&apos;anglais depuis des
                années sans jamais vraiment oser le parler.
              </p>
              <p className="t-body text-white/80">
                Toi, tu viens de décider de faire quelque chose à ce sujet.
              </p>
              <p className="t-body font-medium text-white">
                Maintenant, on va transformer cette décision en progression
                réelle.
              </p>
            </Prose>
          </Reveal>
        </Container>
      </section>

      {/* — RÉCAPITULATIF : carte élégante blanche (écho de la carte
          offre du site — contraste premium sur fond noir) — */}
      <section className="py-10 lg:py-14">
        <Container>
          <Reveal>
            <div className="card-base mx-auto max-w-[36rem] p-6 md:p-10">
              <Eyebrow>Récapitulatif</Eyebrow>
              <h2 className="t-h3 mt-3 text-black">Ton accompagnement</h2>
              <dl className="mt-6 divide-y divide-grey-line">
                <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <dt className="t-caption text-grey-mid">Programme</dt>
                  <dd className="t-body font-medium text-black">
                    De <span className="text-red-button">Comprendre</span> à{" "}
                    <span className="text-red-button">Parler</span>
                  </dd>
                </div>
                <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <dt className="t-caption text-grey-mid">Durée</dt>
                  <dd className="t-body font-medium text-black">3 mois</dd>
                </div>
                <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <dt className="t-caption text-grey-mid">Format</dt>
                  <dd className="t-body font-medium text-black">
                    Coaching en ligne personnalisé
                  </dd>
                </div>
                <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <dt className="t-caption text-grey-mid">Objectif</dt>
                  <dd className="t-body font-medium text-black">
                    Développer ton expression orale et gagner en aisance en
                    anglais
                  </dd>
                </div>
              </dl>
              <div className="mt-6 border-t border-grey-line pt-6">
                <p className="t-caption text-grey-mid">Statut</p>
                <ul className="mt-3 space-y-2.5">
                  {STATUTS.map((s) => (
                    <li key={s} className="flex items-center gap-3">
                      <IconCheck className="h-5 w-5 text-success" fg="#ffffff" />
                      <span className="t-body text-black">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* — MESSAGE FINAL + dernier bouton WhatsApp — */}
      <section className="pt-10 pb-14 lg:pt-14 lg:pb-20">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-[42rem] text-center">
              <p className="font-display text-[1.5rem] leading-snug text-white md:text-[1.75rem]">
                Merci pour ta confiance.
              </p>
              <p className="t-body mt-4 text-white/80">
                Ton parcours commence maintenant.
              </p>
              <p className="t-body text-white/80">
                À très bientôt pour la suite.
              </p>
              <p className="font-display mt-6 text-[1.125rem] italic text-white/85">
                — Stevens
              </p>
            </div>
          </Reveal>
          <Reveal className="mt-10">
            <div className="flex justify-center">
              <WhatsAppCta
                label="Démarrer mon accompagnement"
                className="w-full sm:w-auto"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Pied minimal (page focalisée — pas de footer global) : la barre
          reste collée en bas de viewport même si le contenu est court. */}
      <div className="mt-auto border-t border-white/10 py-8">
        <Container>
          <p className="t-caption text-center text-white/40">
            © {new Date().getFullYear()} Stevens AKPOVI — Coach
            d&apos;anglais en ligne.
          </p>
        </Container>
      </div>
    </div>
  );
}
