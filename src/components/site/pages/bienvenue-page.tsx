"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { waLink } from "@/lib/site";
import {
  downloadReceipt,
  readInscription,
  receiptNumberFor,
  sendReceiptCopyEmail,
  type InscriptionData,
} from "@/lib/receipt";
import { Container, Eyebrow, Prose } from "../layout-primitives";
import { Reveal } from "../reveal";
import { IconCheck, WhatsAppGlyph } from "../icons";
import { FireworksSnow } from "../fireworks-snow";

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
 *
 * TASK 34 (retour propriétaire) :
 * — icône de confirmation + « Inscription confirmée » en ROUGE ;
 * — particules de feu d'artifice tombant du haut vers le bas comme
 *   une neige de fête (FireworksSnow — canvas plein viewport) ;
 * — TOUTES les cartes de la page en VERRE TRANSPARENT exactement
 *   comme celles du site (glass-card / glass-dark) ;
 * — section « Tu viens de choisir de passer à l'action. » sur fond
 *   GRIS (au lieu de noir) ;
 * — « Maintenant, on va transformer cette décision en progression
 *   réelle. » en rouge ;
 * — « Tu es au bon endroit… » présenté comme un PAQUET DE CARTES
 *   (cartes-fantômes décalées derrière la carte principale) ;
 * — signature « — Coach Stevens » ;
 *
 * TASK 36 (retour propriétaire) :
 * — bouton du reçu renommé « Télécharger mon Reçu (PDF) » et texte
 *   d'accompagnement sous le bouton SUPPRIMÉ ;
 * — titres des cartes « Voici ce qui se passe maintenant. » RAMENÉS
 *   AU BLANC #FFFFFF (ils étaient passés au rouge en Task 34) ;
 * — CTA « Prêt(e) à commencer ? » renommé « Contacter sur
 *   WhatsApp » ;
 * — Récapitulatif : durée « 3 mois » → « 03 mois » ;
 * — coches du statut en VERT PUR #008000 (comme le cachet PAYÉ) ;
 * — FIX anti-flash : au rechargement de #/bienvenue, le shell
 *   statique (accueil) n'est plus visible ~1 s — masqué avant le
 *   premier rendu (script inline layout.tsx + CSS globals.css),
 *   révélé par page.tsx dès que la page demandée est rendue.
 * — BOUTON DE REÇU : téléchargement d'un reçu PDF élégant,
 *   personnalisé avec les données du client (persistées par le
 *   formulaire d'inscription), cachet « PAYÉ » oblique vert pur — et
 *   AU MÊME INSTANT, copie automatique envoyée à stevensakpovi@gmail.com.
 * — Le message WhatsApp est PRÉ-REMPLI mais jamais envoyé
 *   automatiquement : le client peut le modifier avant l'envoi.
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

/** Données de repli si les données d'inscription ne sont plus dans le
 *  navigateur (localStorage vidé, autre appareil…) — le reste reste
 *  correct, les champs absents affichent « Non renseigné » sur le
 *  PDF. */
const FALLBACK_INSCRIPTION: InscriptionData = {
  nom: "",
  age: "",
  profession: "",
  email: "",
  pays: "",
  ville: "",
  dateInscription: "",
};

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

/** Petit bouton de téléchargement du reçu (version lien discret dans
 *  la carte Récapitulatif). */
function ReceiptLinkButton({
  onClick,
  state,
}: {
  onClick: () => void;
  state: "idle" | "preparing" | "done" | "error";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={state === "preparing"}
      className="t-body mt-6 inline-flex items-center gap-2 font-medium text-red-button underline underline-offset-4 transition-opacity hover:opacity-80 disabled:opacity-60"
    >
      {state === "preparing"
        ? "Préparation du reçu…"
        : state === "done"
          ? "Télécharger à nouveau mon Reçu (PDF)"
          : state === "error"
            ? "Le téléchargement a échoué — réessayer"
            : "Télécharger mon Reçu (PDF)"}
    </button>
  );
}

export function BienvenuePage() {
  /* Données d'inscription persistées par le formulaire (client-only :
     lecture au montage pour éviter tout écart d'hydratation). */
  const [inscription, setInscription] = useState<InscriptionData | null>(null);
  const [receiptState, setReceiptState] = useState<
    "idle" | "preparing" | "done" | "error"
  >("idle");
  /** Garde-fou anti double-clic : un seul envoi email par 4 s. */
  const lastClickRef = useRef(0);

  useEffect(() => {
    setInscription(readInscription());
  }, []);

  /** Téléchargement du reçu + copie email au coach AU MÊME INSTANT
   *  (instruction propriétaire Task 34 : « exactement au même instant
   *  où il le télécharge »). */
  async function handleDownloadReceipt() {
    const now = Date.now();
    if (receiptState === "preparing" || now - lastClickRef.current < 4000) {
      return;
    }
    lastClickRef.current = now;
    const data = inscription ?? FALLBACK_INSCRIPTION;
    const receiptNo = receiptNumberFor(data);
    // Copie au coach — lancée AVANT/PENDANT la construction du PDF :
    // les deux actions partent au même instant.
    sendReceiptCopyEmail(data, receiptNo);
    setReceiptState("preparing");
    try {
      await downloadReceipt(data);
      setReceiptState("done");
    } catch {
      setReceiptState("error");
    }
  }

  return (
    <div className="on-dark flex min-h-screen flex-col bg-black text-white">
      {/* Task 34 (retour propriétaire) : particules de feu d'artifice
          tombant du haut de la page vers le bas, comme une neige de
          fête — canvas fixe, aucun blocage d'interaction. */}
      <FireworksSnow />

      {/* — HERO : icône de confirmation ROUGE (Task 34) + label ROUGE
          + titre + bouton de reçu PDF — */}
      <section className="pb-8 pt-16 lg:pb-12 lg:pt-24">
        <Container className="text-center">
          <div className="hero-line hero-d1 flex justify-center">
            <IconCheck
              className="h-12 w-12 text-red-button lg:h-14 lg:w-14"
              fg="#ffffff"
            />
          </div>
          <p className="hero-line hero-d2 mt-6 text-[0.75rem] font-medium uppercase tracking-[0.18em] text-red-button">
            Inscription confirmée
          </p>
          {/* Task 34 (fix responsive) : « accompagnement. » en Fraunces
              mesure ~310px à 36px — un seul mot plus large que le
              conteneur (280px) sous ~360px de viewport → 10px de
              débordement. Taille légèrement réduite sur très petits
              écrans uniquement (au-dessus de 390px, le clamp t-h1
              reprend et le mot tient). */}
          <h1 className="hero-line hero-d3 t-h1 mt-4 text-white max-[389px]:text-[1.9rem]">
            Bienvenue dans ton accompagnement.
          </h1>
          <p className="hero-line hero-d4 t-body mx-auto mt-6 max-w-[38rem] text-white/75">
            Tu viens de faire le premier pas vers un anglais que tu ne te
            contentes plus de comprendre — mais que tu oses réellement
            parler.
          </p>

          {/* Task 34 : reçu PDF officiel — cachet PAYÉ vert
              oblique, personnalisé, copie automatique au coach. */}
          <div className="hero-line hero-d5 mt-10">
            <button
              type="button"
              onClick={handleDownloadReceipt}
              disabled={receiptState === "preparing"}
              className="btn btn-primary t-btn inline-flex items-center gap-3 text-[1.0625rem] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M12 3v12" />
                <path d="m7 11 5 5 5-5" />
                <path d="M5 21h14" />
              </svg>
              {receiptState === "preparing"
                ? "Préparation de ton reçu…"
                : receiptState === "error"
                  ? "Réessayer le téléchargement"
                  : "Télécharger mon Reçu (PDF)"}
            </button>
            {/* Task 36 (retour propriétaire) : le texte « Reçu officiel
                personnalisé — cachet PAYÉ… » sous le bouton est
                SUPPRIMÉ. */}
          </div>
        </Container>
      </section>

      {/* — CONFIRMATION — carte VERRE (Task 34 : toutes les cartes de
          la page en verre transparent comme sur le site) — */}
      <section className="relative overflow-hidden py-8 lg:py-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[10%] top-[-2rem] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(255,26,26,0.28)_0%,transparent_62%)] blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[10%] top-[2rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(96,110,190,0.28)_0%,transparent_62%)] blur-2xl"
        />
        <Container className="relative">
          <Reveal>
            <div className="glass-card glass-dark mx-auto max-w-[42rem] p-6 text-center md:p-8">
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

      {/* — RAPPEL DU PROGRAMME — Task 34 (retour propriétaire) : la
          section passe sur fond GRIS (au lieu de noir) ; les cartes du
          récapitulatif sont en VERRE TRANSPARENT blanc, exactement
          comme les cartes verre du site sur fond clair. —
          Task 35 (retour propriétaire) : la limite entre la page noire
          et cette section grise est OBLIQUE, exactement comme la
          limite noir→blanc de la section « Ma méthode » de l'accueil
          (même SVG, même 24 px mobile / 32 px desktop : le noir de la
          section précédente pénètre le haut-gauche de la section
          claire, bord montant bas-gauche → haut-droite). — */}
      <section className="relative overflow-hidden bg-[#F4F4F6] py-12 text-black lg:py-16">
        {/* Limite de section oblique (identique à l'accueil —
            home-page.tsx section Solution). */}
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-x-0 top-0 block h-6 w-full lg:h-8"
        >
          <polygon points="0,0 100,0 0,100" fill="#000000" />
        </svg>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-[4rem] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(255,26,26,0.30)_0%,transparent_62%)] blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-[16rem] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(28,28,64,0.30)_0%,transparent_62%)] blur-2xl"
        />
        <Container className="relative">
          <Reveal>
            <Prose className="mx-auto max-w-[42rem] text-center">
              <h2 className="t-h2 text-black">
                Tu viens de choisir de passer à l&apos;action.
              </h2>
              <p className="t-body mt-6 text-black/70">
                Pendant ces trois mois, nous allons travailler ton anglais
                de manière progressive, pratique et adaptée à ton niveau,
                tes difficultés et tes objectifs.
              </p>
              <p className="t-body text-black/70">
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
                <div className="glass-card card-hover h-full p-6">
                  <p className="font-display text-[1.25rem] font-medium leading-snug text-black md:text-[1.375rem]">
                    {item.titre}
                  </p>
                  <p className="t-caption mt-2 text-black/60">{item.texte}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* — ET MAINTENANT ? — 3 étapes — Task 34 : cartes en VERRE
          sombre. Task 36 (retour propriétaire) : les titres des cartes
          RAMENÉS AU BLANC #FFFFFF (couleur précédente). — */}
      <section className="relative overflow-hidden py-12 lg:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[14%] top-[2rem] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(255,26,26,0.24)_0%,transparent_62%)] blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[14%] bottom-[2rem] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(96,110,190,0.24)_0%,transparent_62%)] blur-2xl"
        />
        <Container className="relative">
          <Reveal>
            <h2 className="t-h2 text-center text-white">
              Voici ce qui se passe maintenant.
            </h2>
          </Reveal>
          <div className="mx-auto mt-10 grid max-w-[60rem] gap-6 md:grid-cols-3 lg:mt-14">
            {ETAPES.map((e, i) => (
              <Reveal key={e.num} delay={i * 120}>
                <div className="glass-card glass-dark card-hover h-full p-6 lg:p-7">
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
              {/* Task 36 (retour propriétaire) : « Contacter mon coach
                  sur WhatsApp » → « Contacter sur WhatsApp ». */}
              <WhatsAppCta
                label="Contacter sur WhatsApp"
                className="w-full sm:w-auto"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* — RASSURANCE — Task 34 (retour propriétaire) : la partie
          « Tu es au bon endroit… » est présentée comme un PAQUET DE
          CARTES : deux cartes-fantômes décalées et inclinées derrière
          la carte de verre principale qui porte tout le message. — */}
      <section className="relative overflow-hidden py-12 lg:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[8%] bottom-[-4rem] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(255,26,26,0.26)_0%,transparent_62%)] blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[8%] top-[1rem] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(28,28,64,0.30)_0%,transparent_62%)] blur-2xl"
        />
        <Container className="relative">
          <Reveal>
            <div className="relative mx-auto max-w-[42rem]">
              {/* cartes-fantômes du paquet (purement décoratives) */}
              <div
                aria-hidden="true"
                className="absolute inset-0 translate-x-4 translate-y-4 rotate-[1.6deg] rounded-[12px] border border-white/15 bg-white/[0.03]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 -translate-x-2.5 translate-y-2.5 -rotate-[1.2deg] rounded-[12px] border border-white/20 bg-white/[0.05]"
              />
              {/* carte du dessus — le message complet */}
              <div className="glass-card glass-dark relative p-8 text-center md:p-12">
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
            </div>
          </Reveal>
        </Container>
      </section>

      {/* — VALORISER LA DÉCISION — Task 34 : la phrase clé en ROUGE
          (retour propriétaire). — */}
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
              <p className="t-body mt-6 font-medium text-red-button">
                Maintenant, on va transformer cette décision en progression
                réelle.
              </p>
            </Prose>
          </Reveal>
        </Container>
      </section>

      {/* — RÉCAPITULATIF — Task 34 : carte en VERRE TRANSPARENT sombre
          (retour propriétaire : toutes les cartes de la page en verre,
          exactement comme les cartes verre du site). — */}
      <section className="relative overflow-hidden py-12 lg:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[16%] top-[1rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(255,26,26,0.24)_0%,transparent_62%)] blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[16%] bottom-[1rem] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(96,110,190,0.24)_0%,transparent_62%)] blur-2xl"
        />
        <Container className="relative">
          <Reveal>
            <div className="glass-card glass-dark mx-auto max-w-[36rem] p-6 md:p-10">
              <Eyebrow className="text-white/75">Récapitulatif</Eyebrow>
              <h2 className="t-h3 mt-3 text-white">Ton accompagnement</h2>
              <dl className="mt-6 divide-y divide-white/15">
                <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <dt className="t-caption text-white/55">Programme</dt>
                  <dd className="t-body font-medium text-white">
                    De <span className="text-red-button">Comprendre</span> à{" "}
                    <span className="text-red-button">Parler</span>
                  </dd>
                </div>
                <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <dt className="t-caption text-white/55">Durée</dt>
                  {/* Task 36 (retour propriétaire) : « 3 mois » →
                      « 03 mois ». */}
                  <dd className="t-body font-medium text-white">03 mois</dd>
                </div>
                <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <dt className="t-caption text-white/55">Format</dt>
                  <dd className="t-body font-medium text-white">
                    Coaching en ligne personnalisé
                  </dd>
                </div>
                <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <dt className="t-caption text-white/55">Objectif</dt>
                  <dd className="t-body font-medium text-white">
                    Développer ton expression orale et gagner en aisance en
                    anglais
                  </dd>
                </div>
              </dl>
              <div className="mt-6 border-t border-white/15 pt-6">
                <p className="t-caption text-white/55">Statut</p>
                <ul className="mt-3 space-y-2.5">
                  {STATUTS.map((s) => (
                    <li key={s} className="flex items-center gap-3">
                      {/* Task 36 (retour propriétaire) : coches en VERT
                          PUR #008000 (comme le cachet PAYÉ du reçu). */}
                      <IconCheck
                        className="h-5 w-5 text-[#008000]"
                        fg="#ffffff"
                      />
                      <span className="t-body text-white">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 border-t border-white/15 pt-6 text-center">
                <ReceiptLinkButton
                  onClick={handleDownloadReceipt}
                  state={receiptState}
                />
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
              {/* Task 34 (retour propriétaire) : « Stevens » →
                  « Coach Stevens ». */}
              <p className="font-display mt-6 text-[1.125rem] italic text-white/85">
                — Coach Stevens
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
