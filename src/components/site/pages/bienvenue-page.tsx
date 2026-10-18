"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { validerWhatsApp } from "@/lib/indicateurs-tel";
import { PAYS_VILLES } from "@/lib/pays-villes";
import { PRELAUNCH_WHATSAPP_URL, WHATSAPP_GROUP_URL, waLink } from "@/lib/site";
import {
  PRODUIT_PRELAUNCH,
  pixelEventId,
  trackPixelWithCAPI,
} from "@/lib/meta-pixel";
import {
  buildReceiptPdf,
  readInscription,
  receiptNumberFor,
  saveReceiptBlob,
  sendReceiptPdfCopy,
  type InscriptionData,
  type OffreId,
} from "@/lib/receipt";
import { Container, Eyebrow, Prose } from "../layout-primitives";
import { Reveal } from "../reveal";
import { IconCheck, WhatsAppGlyph } from "../icons";
import { TelField } from "../tel-field";
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
 * — icône de confirmation + « Inscription confirmée » en ROUGE
 *   (Task 38 : devenus VERT PUR #008000, comme les coches du
 *   récapitulatif et le cachet du reçu ; Task 63 : le label devient
 *   « Inscription terminée » — hero + statut du récapitulatif) ;
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
 *   AU MÊME INSTANT, copie envoyée à stevensakpovi@gmail.com : LE
 *   MÊME PDF en pièce jointe + un simple message d'envoi (Task 43).
 * — Le message WhatsApp est PRÉ-REMPLI mais jamais envoyé
 *   automatiquement : le client peut le modifier avant l'envoi.
 *   (Task 57 : remplacé par un lien DIRECT vers le groupe WhatsApp
 *   du programme — voir WHATSAPP_GROUP_URL dans site.ts.)
 *
 * TASK 58 (retour propriétaire) :
 * — les deux boutons WhatsApp reçoivent des libellés DIFFÉRENTS :
 *   CTA principal « Rejoindre la Communauté », bouton final
 *   « Rejoindre le Programme » — les deux ouvrent toujours le même
 *   groupe WhatsApp du programme ;
 * — « Maintenant, on va transformer cette décision en progression
 *   réelle. » en VERT PUR #008000 (ex-rouge Task 34).
 */

/** Task 57 (instruction propriétaire) : les boutons de la page
 *  redirigent désormais DIRECTEMENT vers le GROUPE WHATSAPP DU
 *  PROGRAMME (lien d'invitation fourni par le propriétaire) — plus de
 *  message pré-rempli à envoyer au coach : le nouveau client rejoint
 *  le groupe, l'accueil du programme s'y fait. Lien direct = ouverture
 *  immédiate, sans intermédiaire.
 *
 * TASK 60 (instruction propriétaire) — réorganisation du CTA :
 *  — l'ancienne section autonome « Prêt(e) à commencer ? » est
 *    SUPPRIMÉE : son titre, son texte et son bouton vivent désormais
 *    AU BAS DE LA CARTE « Récapitulatif » ;
 *  — le bouton est renommé « Rejoindre la Communauté WhatsApp du
 *    Programme » ;
 *  — l'ancien second bouton « Rejoindre le Programme » (message final)
 *    est remplacé par un emoji 👋 amical de taille moyenne ;
 *  — le lien texte « Télécharger mon Reçu (PDF) » de la carte
 *    Récapitulatif est SUPPRIMÉ (le gros bouton de reçu du haut de
 *    page reste la seule voie de téléchargement).
 *
 * TASK 72 (instruction propriétaire — Pre-launch) :
 *  — sur la variante ?offre=prelaunch, le champ optionnel unique
 *    « Ton nom complet » est remplacé par TROIS champs OBLIGATOIRES :
 *    Ton nom, Ton prénom, Ton numéro de téléphone (préfix sélection
 *    de pays, comme dans le formulaire du programme — TelField) ;
 *  — le bouton « Télécharger mon Reçu (PDF) » reste VERROUILLÉ
 *    (disabled) tant que les 03 champs ne sont pas tous valides ;
 *  — au clic : le reçu se télécharge ET sa copie PDF part
 *    automatiquement à stevensakpovi@gmail.com (même instant, même
 *    blob — Task 43/44), désormais enrichie du prénom, du numéro de
 *    téléphone et du pays de l'apprenant ;
 *  — le tunnel du programme principal (sans paramètre) est
 *    STRICTEMENT inchangé : aucun champ, bouton immédiatement actif. */
const COMMUNAUTE_LABEL = "Rejoindre la Communauté WhatsApp du Programme";

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

/* Les 3 étapes « Et maintenant ? » (instruction propriétaire —
   Task 57 : étape 01 alignée sur le groupe WhatsApp du programme). */
const ETAPES = [
  {
    num: "01",
    titre: "Rejoins le groupe WhatsApp",
    texte:
      "Rejoins le groupe WhatsApp du programme pour confirmer ton arrivée et recevoir les informations de démarrage.",
  },
  {
    num: "02",
    titre: "Nous préparons ton démarrage",
    texte:
      "Nous échangeons sur les prochaines étapes de ton accompagnement et sur la manière dont nous allons commencer.",
  },
  {
    num: "03",
    titre: "Ton coaching commence",
    texte:
      "Nous travaillons à partir de ton niveau actuel pour construire progressivement une expression anglaise plus naturelle et plus confiante.",
  },
];

/* Statut du récapitulatif (coches vertes « état validé », DA §5 —
   Task 57 : dernière étape alignée sur le groupe WhatsApp ;
   Task 63 : « Inscription confirmée » → « Inscription terminée »). */
const STATUTS = [
  "Paiement effectué",
  "Inscription terminée",
  "Prochaine étape : rejoindre le groupe du programme",
];

/* ============================================================
 * TASK 69 — VARIANTE PRE-LAUNCH (« Pre-launch • De COMPRENDRE à
 * PARLER™ » — 15 000 FCFA — 02 mois — première cohorte de 05) :
 * le propriétaire configure l'URL de retour du paiement Maketou du
 * produit pre-launch AVEC le paramètre
 * ?offre=prelaunch — la page adapte alors textes, récapitulatif,
 * étapes, statuts, CTA WhatsApp et REÇU (offre « prelaunch » de
 * receipt.ts). Le tunnel du programme principal reste STRICTEMENT
 * inchangé (mêmes textes, même HTML).
 * ============================================================ */
/* TASK 73 (instruction propriétaire) : libellé raccourci du CTA
 * communauté — « Rejoindre le groupe WhatsApp ». */
const PRELAUNCH_COMMUNAUTE_LABEL = "Rejoindre le groupe WhatsApp";

/* Résumé élégant de l'offre pre-launch (brief §6). */
const PRELAUNCH_RECAP = [
  { titre: "02 mois", texte: "Accompagnement intensif" },
  { titre: "03 séances / semaine", texte: "Séances de 1h30 en ligne" },
  { titre: "Pratique orale", texte: "Au centre de l'accompagnement" },
  { titre: "Communauté WhatsApp", texte: "Dédiée à la première cohorte" },
];

/* Les 3 étapes « Et maintenant ? » — variante cohorte. */
const PRELAUNCH_ETAPES = [
  {
    num: "01",
    titre: "Rejoins la communauté de la cohorte",
    texte:
      "Rejoins la communauté WhatsApp de la première cohorte pour confirmer ton arrivée et recevoir les informations de démarrage.",
  },
  {
    num: "02",
    titre: "Nous préparons le démarrage",
    texte:
      "Nous échangeons sur les prochaines étapes de ton accompagnement et sur la manière dont nous allons commencer.",
  },
  {
    num: "03",
    titre: "Ton accompagnement commence",
    texte:
      "Nous travaillons à partir de ton niveau actuel pour construire progressivement une expression anglaise plus naturelle et plus confiante.",
  },
];

/* Statuts du récapitulatif — variante cohorte. */
const PRELAUNCH_STATUTS = [
  "Paiement effectué",
  "Inscription terminée",
  "Prochaine étape : rejoindre la communauté de la cohorte",
];

/** Message WhatsApp de REPLI tant que le lien du groupe de la
 * cohorte n'a pas été fourni (PRELAUNCH_WHATSAPP_URL vide) : contact
 * direct du coach — un canal RÉEL, jamais un lien de groupe
 * inventé. Le bouton bascule automatiquement sur le groupe dès que
 * le lien est collé dans site.ts. */
const PRELAUNCH_WHATSAPP_MSG =
  "Bonjour Coach Stevens, je viens de compléter mon inscription à l'offre « Pre-launch • De COMPRENDRE à PARLER™ » (première cohorte — 02 mois). Merci de m'indiquer la communauté WhatsApp de la cohorte.";

/** Task 69 : le tunnel pre-launch n'a pas de formulaire avant
 * paiement — le client saisit son nom sur cette page pour
 * personnaliser son reçu ; il est persisté (n° de reçu stable au
 * re-téléchargement, date d'inscription = premier retour sur la
 * page). Données JAMAIS réutilisées du formulaire du programme
 * principal (elles ne correspondent pas à cette offre).
 * Task 72 (instruction propriétaire) : le champ unique « Ton nom
 * complet » devient TROIS champs OBLIGATOIRES — Ton nom, Ton
 * prénom, Ton numéro de téléphone (avec préfix sélection de pays,
 * comme dans le formulaire du programme). */
const PRELAUNCH_CLIENT_KEY = "mse_prelaunch_client";
type PrelaunchClient = {
  /** Nom de famille (champ séparé du prénom — Task 72). */
  nom: string;
  /** Prénom (champ séparé — Task 72). */
  prenom: string;
  /** Code ISO du pays du numéro (préfixe téléphonique — Task 72). */
  telPays: string;
  /** Numéro local — chiffres uniquement (Task 72). */
  tel: string;
  date: string;
};

/** Pays du préfixe téléphonique par DÉFAUT : le Bénin — public
 * principal de l'offre (FCFA, indicatif +229). Le client peut le
 * changer dans la dropliste du champ téléphone. */
const TEL_PAYS_DEFAUT = "bj";

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

/** Bouton principal / final — Task 57 : lien DIRECT vers le groupe
 *  WhatsApp du programme (plus de message pré-rempli au coach).
 *  Task 69 : href paramétré — groupe de la COHORTE (lien fourni par
 *  le propriétaire) ou repli contact coach pour le pre-launch. */
function WhatsAppCta({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <a
      href={href}
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
  /* Données d'inscription persistées par le formulaire (client-only :
     lecture au montage pour éviter tout écart d'hydratation). */
  const [inscription, setInscription] = useState<InscriptionData | null>(null);
  const [receiptState, setReceiptState] = useState<
    "idle" | "preparing" | "done" | "error"
  >("idle");
  /** Garde-fou anti double-clic : un seul envoi email par 4 s. */
  const lastClickRef = useRef(0);

  /* Task 69 — variante pre-launch : détectée au montage via le
     paramètre d'URL ?offre=prelaunch (URL de retour Maketou du produit
     de pre-launch configurée par le propriétaire). */
  const [prelaunch, setPrelaunch] = useState(false);
  /* Task 72 — les 03 champs OBLIGATOIRES du Pre-launch. */
  /** Nom de famille saisi par le client prelaunch (reçu + email
   *  coach — champ séparé du prénom). */
  const [nomPrelaunch, setNomPrelaunch] = useState("");
  /** Prénom saisi par le client prelaunch (champ séparé). */
  const [prenomPrelaunch, setPrenomPrelaunch] = useState("");
  /** Téléphone : code ISO du pays (préfixe) + numéro local en
   *  chiffres. Par défaut : Bénin (+229). */
  const [telPays, setTelPays] = useState(TEL_PAYS_DEFAUT);
  const [telLocal, setTelLocal] = useState("");
  /** Champs touchés — les erreurs ne s'affichent qu'après blur
   *  (même convention que le formulaire d'inscription). */
  const [touches, setTouches] = useState<{
    nom: boolean;
    prenom: boolean;
    tel: boolean;
  }>({ nom: false, prenom: false, tel: false });
  /** Date du premier retour sur la page (prelaunch) — ancre le n° de
   *  reçu, stable au re-téléchargement. */
  const prelaunchDateRef = useRef("");

  useEffect(() => {
    setInscription(readInscription());
    if (
      new URLSearchParams(window.location.search).get("offre") !== "prelaunch"
    ) {
      return;
    }
    setPrelaunch(true);
    try {
      const raw = window.localStorage.getItem(PRELAUNCH_CLIENT_KEY);
      const saved = raw ? (JSON.parse(raw) as Partial<PrelaunchClient>) : null;
      const date = saved?.date || new Date().toISOString();
      prelaunchDateRef.current = date;
      /* Task 72 — migration de l'ancien format {nom, date} : le nom
         était saisi D'UN BLOC (« Awa Kponou ») → premier mot =
         PRÉNOM, le reste = NOM (convention francophone). Le nom
         complet reconstitué est identique → le n° de reçu des
         téléchargements précédents reste STABLE. */
      let nom = "";
      let prenom = "";
      if (typeof saved?.nom === "string") {
        nom = saved.nom.trim();
      }
      if (typeof saved?.prenom === "string" && saved.prenom.trim()) {
        prenom = saved.prenom.trim();
      } else if (nom) {
        const parts = nom.split(/\s+/);
        if (parts.length >= 2) {
          prenom = parts[0];
          nom = parts.slice(1).join(" ");
        }
      }
      let telPaysCharge = TEL_PAYS_DEFAUT;
      if (
        typeof saved?.telPays === "string" &&
        PAYS_VILLES.some((p) => p.code === saved.telPays)
      ) {
        telPaysCharge = saved.telPays;
      }
      const tel =
        typeof saved?.tel === "string" ? saved.tel.replace(/\D+/g, "") : "";
      setNomPrelaunch(nom);
      setPrenomPrelaunch(prenom);
      setTelPays(telPaysCharge);
      setTelLocal(tel);
      window.localStorage.setItem(
        PRELAUNCH_CLIENT_KEY,
        JSON.stringify({
          nom,
          prenom,
          telPays: telPaysCharge,
          tel,
          date,
        } satisfies PrelaunchClient),
      );
    } catch {
      prelaunchDateRef.current = new Date().toISOString();
    }
  }, []);

  /** TASK 59 + CONVERSIONS API — META PIXEL : « Purchase » à
   *  l'arrivée sur cette page. Cette page est l'URL de retour du
   *  PAIEMENT RÉUSSI configurée par le propriétaire dans son système
   *  de paiement (mymaketou) : un visiteur ici = un achat confirmé.
   *  Valeur 70 000, devise XOF (franc CFA) — exploitée par Meta pour
   *  l'optimisation des campagnes sur les CLIENTS PAYANTS et le
   *  calcul du ROAS. Copie serveur Conversions API avec le MÊME
   *  event_id (déduplication automatique) + email/téléphone du reçu
   *  (localStorage d'inscription) hachés SHA-256 côté serveur pour
   *  un match d'identité maximal. */
  useEffect(() => {
    /* Lecture DIRECTE du localStorage (l'état inscription est peint
       de façon asynchrone — à la montée il est encore null) : le
       Purchase doit partir immédiatement avec les données client. */
    const data = readInscription();
    /* Task 69 : le Purchase porte l'offre réellement payée —
       pre-launch (15 000 XOF) quand l'URL de retour Maketou
       contient ?offre=prelaunch, programme principal sinon. */
    const estPrelaunch =
      new URLSearchParams(window.location.search).get("offre") === "prelaunch";
    trackPixelWithCAPI(
      "Purchase",
      estPrelaunch
        ? {
            content_name: PRODUIT_PRELAUNCH.content_name,
            content_type: "product",
            value: PRODUIT_PRELAUNCH.value,
            currency: PRODUIT_PRELAUNCH.currency,
          }
        : {
            content_name: "De Comprendre à Parler™",
            content_type: "product",
            value: 70000,
            currency: "XOF",
          },
      {
        eventId: pixelEventId("purchase"),
        pii: {
          email: data?.email,
          phoneE164: data?.whatsapp || undefined,
        },
      },
    );
  }, []);

  /* ============================================================
   * TASK 72 — FORMULAIRE OBLIGATOIRE DU PRE-LAUNCH.
   * Les 03 champs (Nom, Prénom, Numéro de téléphone avec préfix
   * pays) doivent être TOUS valides avant que le bouton
   * « Télécharger mon Reçu (PDF) » ne soit CLIQUABLE (instruction
   * propriétaire : le bouton reste disabled tant que tout n'est pas
   * renseigné). Le tunnel du programme principal n'a AUCUN champ —
   * son bouton est immédiatement actif, strictement comme avant.
   * ============================================================ */
  /** Nom du pays du téléphone (dropliste du préfixe). */
  const nomDuPaysTel = useMemo(
    () => PAYS_VILLES.find((p) => p.code === telPays)?.nom ?? "",
    [telPays],
  );
  /** Validation du numéro — MÊME moteur que le formulaire
   *  d'inscription (validerWhatsApp : longueurs par pays, indicatif
   *  retapé retiré, tronc « 0 »…). */
  const telValide = useMemo(
    () => validerWhatsApp(nomDuPaysTel, telLocal),
    [nomDuPaysTel, telLocal],
  );
  /* Le message d'erreur de validerWhatsApp mentionne le champ
     « Numéro WhatsApp » du formulaire — reformulé pour « Numéro de
     téléphone » (même sens, aucun impact sur le formulaire). */
  const telErreur = telValide.ok
    ? ""
    : telValide.erreur.replace(/numéro WhatsApp/g, "numéro");
  const nomOk = nomPrelaunch.trim().length >= 2;
  const prenomOk = prenomPrelaunch.trim().length >= 2;
  const formulaireValide = !prelaunch || (nomOk && prenomOk && telValide.ok);

  /** Persiste les informations du client prelaunch — n° de reçu et
   *  données stables au re-téléchargement (même mécanique que le
   *  champ nom unique de la Task 69). */
  function sauverPrelaunch(v: Partial<Omit<PrelaunchClient, "date">>) {
    try {
      window.localStorage.setItem(
        PRELAUNCH_CLIENT_KEY,
        JSON.stringify({
          nom: v.nom ?? nomPrelaunch,
          prenom: v.prenom ?? prenomPrelaunch,
          telPays: v.telPays ?? telPays,
          tel: v.tel ?? telLocal,
          date: prelaunchDateRef.current || new Date().toISOString(),
        } satisfies PrelaunchClient),
      );
    } catch {
      /* ignoré */
    }
  }

  /** Téléchargement du reçu + copie email au coach AU MÊME INSTANT
   *  (instruction propriétaire Task 34 : « exactement au même instant
   *  où il le télécharge » ; revue Task 43 : la copie est LE REÇU PDF
   *  LUI-MÊME en pièce jointe — le même blob que le téléchargement,
   *  identique octet pour octet — simplement accompagné d'un court
   *  message d'envoi). */
  async function handleDownloadReceipt() {
    const now = Date.now();
    if (receiptState === "preparing" || now - lastClickRef.current < 4000) {
      return;
    }
    /* Task 72 : double garde — le bouton est déjà disabled tant que
       les 03 champs ne sont pas tous valides. */
    if (prelaunch && !formulaireValide) {
      return;
    }
    lastClickRef.current = now;
    /* Task 69 : l'offre du reçu suit le tunnel réellement emprunté —
       le reçu du programme principal reste IDENTIQUE à l'existant. */
    const offre: OffreId = prelaunch ? "prelaunch" : "programme";
    let data = inscription ?? FALLBACK_INSCRIPTION;
    if (prelaunch) {
      /* Le tunnel prelaunch n'a pas de formulaire avant paiement :
         seules les données saisies sur CETTE page sont utilisées —
         jamais celles d'un ancien formulaire du programme principal
         (elles ne correspondent pas à cette offre).
         Task 72 : nom + PRÉNOM séparés (reçu : « Prénom Nom ») ;
         le PAYS du téléphone remplit la ligne « Ville, Pays » du
         reçu et le bloc « Pays » de l'email au coach ; le numéro
         E.164 sert de contact (ligne contact du reçu + email). */
      data = {
        ...FALLBACK_INSCRIPTION,
        nom: nomPrelaunch.trim(),
        prenom: prenomPrelaunch.trim(),
        pays: nomDuPaysTel,
        whatsapp: telValide.ok ? telValide.e164 : undefined,
        dateInscription: prelaunchDateRef.current,
      };
    }
    const receiptNo = receiptNumberFor(data, offre);
    setReceiptState("preparing");
    try {
      // UN SEUL PDF construit, utilisé pour les DEUX destinations :
      // téléchargement client + copie coach (pièce jointe identique).
      const { blob, filename } = await buildReceiptPdf(data, offre);
      sendReceiptPdfCopy(blob, filename, data, receiptNo, offre);
      saveReceiptBlob(blob, filename);
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

      {/* — HERO : icône de confirmation + label « Inscription
          terminée » en VERT PUR #008000 (Task 38 — ex-rouge Task 34 ;
          Task 63 : ex-« Inscription confirmée »)
          + titre + bouton de reçu PDF — */}
      <section className="pb-8 pt-16 lg:pb-12 lg:pt-24">
        <Container className="text-center">
          <div className="hero-line hero-d1 flex justify-center">
            {/* Task 38 : pastille + label en VERT PUR #008000
                (confirmation = succès) — coche blanche conservée
                pour le contraste sur la pastille verte. */}
            <IconCheck
              className="h-12 w-12 text-[#008000] lg:h-14 lg:w-14"
              fg="#ffffff"
            />
          </div>
          <p className="hero-line hero-d2 mt-6 text-[0.75rem] font-medium uppercase tracking-[0.18em] text-[#008000]">
            Inscription terminée
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
            {prelaunch ? (
              <>
                Tu viens de rejoindre la première cohorte du Pre-launch — deux
                mois pour commencer à pratiquer l&apos;anglais, étape par étape.
              </>
            ) : (
              <>
                Tu viens de faire le premier pas vers un anglais que tu ne te
                contentes plus de comprendre — mais que tu oses réellement
                parler.
              </>
            )}
          </p>

          {/* TASK 72 (instruction propriétaire) : le tunnel pre-launch
              n'a pas de formulaire avant paiement — le client DOIT
              renseigner ici son NOM, son PRÉNOM et son NUMÉRO DE
              TÉLÉPHONE (avec préfix sélection de pays, comme dans le
              formulaire du programme) avant que le bouton du reçu ne
              soit cliquable. Style = formulaire d'inscription
              (.form-label / .form-input / .form-error, astérisque
              rouge). Persisté localement — jamais réutilisé à
              d'autres fins. */}
          {prelaunch ? (
            <div className="mx-auto mt-8 max-w-[26rem] text-left">
              <p className="t-caption text-white/70">
                Renseigne tes informations pour générer ton reçu — les 03 champs
                sont obligatoires :
              </p>
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="prelaunch-nom" className="form-label">
                    Ton nom{" "}
                    <span
                      aria-hidden="true"
                      className="font-semibold text-red-button"
                    >
                      *
                    </span>
                  </label>
                  <input
                    id="prelaunch-nom"
                    type="text"
                    autoComplete="family-name"
                    value={nomPrelaunch}
                    onChange={(e) => {
                      setNomPrelaunch(e.target.value);
                      sauverPrelaunch({ nom: e.target.value });
                    }}
                    onBlur={() => setTouches((t) => ({ ...t, nom: true }))}
                    aria-invalid={touches.nom && !nomOk}
                    aria-describedby={
                      touches.nom && !nomOk ? "err-prelaunch-nom" : undefined
                    }
                    placeholder="Ex. : Kponou"
                    className={cn(
                      "form-input mt-2",
                      touches.nom && !nomOk && "border-red-button",
                    )}
                  />
                  {touches.nom && !nomOk ? (
                    <p
                      id="err-prelaunch-nom"
                      role="alert"
                      className="form-error"
                    >
                      Indique ton nom (nom de famille).
                    </p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="prelaunch-prenom" className="form-label">
                    Ton prénom{" "}
                    <span
                      aria-hidden="true"
                      className="font-semibold text-red-button"
                    >
                      *
                    </span>
                  </label>
                  <input
                    id="prelaunch-prenom"
                    type="text"
                    autoComplete="given-name"
                    value={prenomPrelaunch}
                    onChange={(e) => {
                      setPrenomPrelaunch(e.target.value);
                      sauverPrelaunch({ prenom: e.target.value });
                    }}
                    onBlur={() => setTouches((t) => ({ ...t, prenom: true }))}
                    aria-invalid={touches.prenom && !prenomOk}
                    aria-describedby={
                      touches.prenom && !prenomOk
                        ? "err-prelaunch-prenom"
                        : undefined
                    }
                    placeholder="Ex. : Awa"
                    className={cn(
                      "form-input mt-2",
                      touches.prenom && !prenomOk && "border-red-button",
                    )}
                  />
                  {touches.prenom && !prenomOk ? (
                    <p
                      id="err-prelaunch-prenom"
                      role="alert"
                      className="form-error"
                    >
                      Indique ton prénom.
                    </p>
                  ) : null}
                </div>
                <TelField
                  id="prelaunch-tel"
                  pays={telPays}
                  tel={telLocal}
                  onPaysChange={(codePays) => {
                    setTelPays(codePays);
                    sauverPrelaunch({ telPays: codePays });
                  }}
                  onTelChange={(numero) => {
                    setTelLocal(numero);
                    sauverPrelaunch({ tel: numero });
                  }}
                  onBlur={() => setTouches((t) => ({ ...t, tel: true }))}
                  error={touches.tel && !telValide.ok ? telErreur : undefined}
                />
              </div>
            </div>
          ) : null}

          {/* Task 34 : reçu PDF officiel — cachet PAYÉ vert
              oblique, personnalisé, copie automatique au coach.
              Task 72 (instruction propriétaire) : sur le tunnel
              pre-launch, le bouton reste VERROUILLÉ (disabled) tant
              que les 03 champs obligatoires ne sont pas tous valides. */}
          <div className="hero-line hero-d5 mt-10">
            <button
              type="button"
              onClick={handleDownloadReceipt}
              disabled={
                receiptState === "preparing" || (prelaunch && !formulaireValide)
              }
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
                ? "Téléchargement du reçu en cours…"
                : receiptState === "error"
                  ? "Réessayer le téléchargement"
                  : "Télécharger mon Reçu (PDF)"}
            </button>
            {/* Task 72 : pourquoi le bouton est verrouillé — mention
                courte sous le bouton, tunnel pre-launch uniquement. */}
            {prelaunch && !formulaireValide && receiptState === "idle" ? (
              <p className="t-caption mt-3 text-white/55">
                Complète d&apos;abord les 03 champs ci-dessus pour activer ton
                reçu.
              </p>
            ) : null}
            {/* Task 36 (retour propriétaire) : le texte « Reçu officiel
                personnalisé — cachet PAYÉ… » sous le bouton est
                SUPPRIMÉ. */}
          </div>
        </Container>
      </section>

      {/* — CONFIRMATION — carte VERRE (Task 34 : toutes les cartes de
          la page en verre transparent comme sur le site ; Task 64 :
          « Ta place … est maintenant confirmée » → « Ton inscription …
          est maintenant terminée » — terminologie Task 63) — */}
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
                {prelaunch ? (
                  <>
                    Ton paiement a bien été effectué. Ton inscription à
                    l&apos;offre « Pre-launch • De{" "}
                    <span className="text-red-button">COMPRENDRE</span> à{" "}
                    <span className="text-red-button">PARLER</span>
                    <sup className="top-[-0.6em] text-[0.6em]">™</sup> » —
                    première cohorte — est maintenant terminée.
                  </>
                ) : (
                  <>
                    Ton paiement a bien été effectué. Ton inscription au
                    programme d&apos;accompagnement de 3 mois est maintenant
                    terminée.
                  </>
                )}
              </p>
              <p className="t-body mt-4 text-white/75">
                {prelaunch ? (
                  <>
                    Tu n&apos;as plus rien à acheter ni à refaire. La prochaine
                    étape est simplement de rejoindre la communauté WhatsApp de
                    la cohorte pour préparer le démarrage.
                  </>
                ) : (
                  <>
                    Tu n&apos;as plus rien à acheter ni à refaire. La prochaine
                    étape est simplement de prendre contact avec moi afin de
                    préparer le début de ton accompagnement.
                  </>
                )}
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
                {prelaunch
                  ? "Pendant ces deux mois, nous allons travailler ton anglais de manière progressive, pratique et adaptée à ton niveau, tes difficultés et tes objectifs."
                  : "Pendant ces trois mois, nous allons travailler ton anglais de manière progressive, pratique et adaptée à ton niveau, tes difficultés et tes objectifs."}
              </p>
              <p className="t-body text-black/70">
                L&apos;objectif n&apos;est pas simplement de connaître davantage
                de règles. L&apos;objectif est de te permettre de mieux
                comprendre, de mieux t&apos;exprimer et surtout de prendre la
                parole avec davantage de confiance.
              </p>
            </Prose>
          </Reveal>
          <div className="mx-auto mt-10 grid max-w-[46rem] gap-4 sm:grid-cols-2 lg:mt-12">
            {(prelaunch ? PRELAUNCH_RECAP : PROGRAMME_RECAP).map((item, i) => (
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
            {(prelaunch ? PRELAUNCH_ETAPES : ETAPES).map((e, i) => (
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
                    Tu n&apos;as pas besoin d&apos;avoir un anglais parfait pour
                    commencer.
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
                  progressivement, avec une méthode adaptée à tes besoins et à
                  tes objectifs.
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* — VALORISER LA DÉCISION — Task 34 : la phrase clé en ROUGE
          (retour propriétaire) — Task 58 (retour propriétaire) :
          désormais en VERT PUR #008000. — */}
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
              {/* Task 58 (instruction propriétaire) : VERT PUR
                  #008000 (ex-rouge Task 34). */}
              <p className="t-body mt-6 font-medium text-[#008000]">
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
                  <dt className="t-caption text-white/55">
                    {prelaunch ? "Offre" : "Programme"}
                  </dt>
                  <dd className="t-body font-medium text-white">
                    {prelaunch ? "Pre-launch — " : ""}De{" "}
                    <span className="text-red-button">Comprendre</span> à{" "}
                    <span className="text-red-button">Parler</span>
                    <sup className="top-[-0.6em] text-[0.6em]">™</sup>
                  </dd>
                </div>
                <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <dt className="t-caption text-white/55">Durée</dt>
                  {/* Task 36 (retour propriétaire) : « 3 mois » →
                      « 03 mois ». Task 69 : « 02 mois » en variante
                      pre-launch. */}
                  <dd className="t-body font-medium text-white">
                    {prelaunch ? "02 mois" : "03 mois"}
                  </dd>
                </div>
                <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <dt className="t-caption text-white/55">Format</dt>
                  <dd className="t-body font-medium text-white">
                    {prelaunch
                      ? "Accompagnement intensif 100 % en ligne"
                      : "Coaching en ligne personnalisé"}
                  </dd>
                </div>
                <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <dt className="t-caption text-white/55">Objectif</dt>
                  <dd className="t-body font-medium text-white">
                    {prelaunch
                      ? "Commencer à pratiquer et à prendre la parole en anglais"
                      : "Développer ton expression orale et gagner en aisance en anglais"}
                  </dd>
                </div>
              </dl>
              <div className="mt-6 border-t border-white/15 pt-6">
                <p className="t-caption text-white/55">Statut</p>
                <ul className="mt-3 space-y-2.5">
                  {(prelaunch ? PRELAUNCH_STATUTS : STATUTS).map((s) => (
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
                {/* TASK 60 (instruction propriétaire) : l'ancienne
                    section « Prêt(e) à commencer ? » (entre « Et
                    maintenant ? » et la Rassurance) vit désormais ICI,
                    au BAS de la carte Récapitulatif — titre, texte et
                    bouton ensemble. L'ancien lien texte de reçu est
                    SUPPRIMÉ (le gros bouton de reçu du haut de page
                    reste la seule voie de téléchargement). */}
                <h3 className="t-h3 text-white">Prêt(e) à commencer ?</h3>
                <p className="t-body mt-3 text-white/75">
                  {prelaunch ? (
                    <>
                      Une dernière étape : rejoins la communauté WhatsApp de la
                      première cohorte pour confirmer ton arrivée et préparer le
                      démarrage.
                    </>
                  ) : (
                    <>
                      Une dernière étape : rejoins le groupe WhatsApp du
                      programme pour confirmer ton arrivée et préparer ton
                      accompagnement.
                    </>
                  )}
                </p>
                <div className="mt-6 flex justify-center">
                  {/* Task 57 : lien DIRECT vers le groupe WhatsApp du
                      programme. Task 60 : libellé complet, rendu au
                      bas de la carte. Task 69 : variante prelaunch —
                      groupe de la COHORTE si le lien a été fourni
                      (PRELAUNCH_WHATSAPP_URL), sinon repli contact
                      coach — jamais un lien inventé. */}
                  <WhatsAppCta
                    href={
                      prelaunch
                        ? PRELAUNCH_WHATSAPP_URL ||
                          waLink(PRELAUNCH_WHATSAPP_MSG)
                        : WHATSAPP_GROUP_URL
                    }
                    label={
                      prelaunch
                        ? PRELAUNCH_WHATSAPP_URL
                          ? PRELAUNCH_COMMUNAUTE_LABEL
                          : "Contacter le coach sur WhatsApp"
                        : COMMUNAUTE_LABEL
                    }
                    className="w-full sm:w-auto"
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* — MESSAGE FINAL + emoji d'accueil (Task 60 : l'ancien bouton
          WhatsApp final est remplacé par 👋) — */}
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
          {/* TASK 60 (instruction propriétaire) : l'ancien bouton
              « Rejoindre le Programme » est remplacé par un emoji 👋
              amical — taille moyenne, clairement visible, souligné
              d'une ombre douce pour ressortir du fond noir. Le seul
              bouton WhatsApp de la page est désormais celui de la
              carte Récapitulatif. */}
          <Reveal className="mt-10">
            <div className="flex justify-center">
              <span
                aria-hidden="true"
                className="block select-none text-[64px] leading-none [filter:drop-shadow(0_14px_18px_rgba(0,0,0,0.5))] md:text-[72px]"
              >
                👋
              </span>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Pied minimal (page focalisée — pas de footer global) : la barre
          reste collée en bas de viewport même si le contenu est court. */}
      <div className="mt-auto border-t border-white/10 py-8">
        <Container>
          <p className="t-caption text-center text-white/40">
            © {new Date().getFullYear()} Stevens AKPOVI — Coach d&apos;anglais
            en ligne.
          </p>
        </Container>
      </div>
    </div>
  );
}
