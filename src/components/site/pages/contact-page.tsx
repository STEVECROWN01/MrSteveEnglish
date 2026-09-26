"use client";

import { useEffect, useRef, useState } from "react";
import { CHECKOUT_URL, CTA_LABELS, OFFRE, waLink } from "@/lib/site";
import { sendContactEmail, type ContactFormData } from "@/lib/contact-email";
import { INSCRIPTION_KEY } from "@/lib/receipt";
import {
  OBJECTIFS,
  SITUATIONS,
  labelObjectif,
  labelSituation,
  lireUtm,
  objectifValide,
  situationValide,
  type UtmParams,
} from "@/lib/profil-prospect";
import { Container, PageHero } from "../layout-primitives";
import { Reveal } from "../reveal";
import { StickyCTA } from "../sticky-cta";
import { SelectPaysField, SelectVilleField, ListboxField } from "../pays-ville-fields";
import { WhatsAppField } from "../whatsapp-field";
import { validerWhatsApp } from "@/lib/indicateurs-tel";
import { IconCheck } from "../icons";

/**
 * PAGE 7 — CONTACT / INSCRIPTION (instructions propriétaire)
 * Fonction : conversion finale — le formulaire qualifie le prospect
 * pour L'OFFRE UNIQUE (Programme « De Comprendre à Parler™ » —
 * 03 mois — 70 000 FCFA — paiement unique), puis — à la soumission —
 * les données sont envoyées DIRECTEMENT PAR EMAIL à
 * stevensakpovi@gmail.com (fiche professionnelle structurée, avec le
 * texte original du prospect) et le prospect est dirigé vers la page
 * de paiement. Si l'email échoue, un lien de secours WhatsApp
 * contenant la même fiche est proposé — aucune donnée n'est perdue.
 *
 * TASK 57 (instruction propriétaire) — PROFIL PAR MENUS DÉROULANTS :
 * l'ancienne évaluation par rédaction libre en anglais (Task 27) est
 * SUPPRIMÉE. Deux menus déroulants OBLIGATOIRES la remplacent (aucune
 * option présélectionnée, placeholder non sélectionnable) :
 * « Laquelle de ces situations te décrit le mieux aujourd'hui ? »
 * (beginner_absolute / understands_but_blocked / speaks_with_errors /
 * unknown_level) et « Quel est ton objectif principal avec l'anglais ? »
 * (job_interview / career_business / travel_abroad / clients_colleagues /
 * exam_training / daily_confidence / other) — les libellés COMPLETS
 * sont transmis au coach (valeurs courtes en base/localStorage).
 *
 * TASK 57 — UX DE SOUMISSION « grande plateforme » :
 * • validation AVANT redirection (erreurs claires, focus premier champ
 *   en erreur, données conservées — aucune perte) ;
 * • état de chargement (bouton désactivé) contre les soumissions
 *   multiples ;
 * • TOAST DE SUCCÈS « fond vert pur » dès la soumission valide,
 *   durée 3 s puis disparition ;
 * • redirection AUTOMATIQUE vers le paiement à la fin du toast —
 *   l'email au coach part en fire-and-forget avec keepalive (il
 *   survit à la navigation) : plus aucune attente serveur ;
 * • champs UTM (utm_source…utm_term) transmis au coach pour
 *   l'attribution publicitaire ;
 * • la saisie du numéro WhatsApp est PLAFONNÉE à la longueur maximale
 *   du pays (impossible de taper des chiffres sans fin) ;
 * • l'autoremplissage du navigateur ne casse plus le style sombre
 *   (règle :-webkit-autofill dans globals.css).
 *
 * Le numéro WhatsApp du COACH n'est JAMAIS affiché (instruction
 * propriétaire). TASK 49 (instruction propriétaire) : le formulaire
 * demande en revanche le NUMÉRO WHATSAPP DU PROSPECT, juste après le
 * pays et la ville — l'indicatif international est déduit du pays
 * sélectionné et affiché comme préfixe du champ, et la saisie est
 * validée selon les longueurs usuelles du pays (le coach pourra
 * recontacter le prospect directement sur WhatsApp).
 */

/* — Le programme (offre unique) — plus de choix de formule
     (instruction propriétaire : la conversion tourne autour d'UNE
     SEULE offre). — */
const PROGRAMME_LABEL =
  "Programme « De Comprendre à Parler™ » — 03 mois — 70 000 FCFA — paiement unique";

/* Task 57 (instruction propriétaire) : libellés des deux menus
   déroulants obligatoires qui remplacent la rédaction libre en
   anglais (Task 27, supprimée). */
const SITUATION_LABEL =
  "Laquelle de ces situations te décrit le mieux aujourd'hui ?";
const SITUATION_PLACEHOLDER = "Sélectionne ta situation actuelle";
const OBJECTIF_LABEL = "Quel est ton objectif principal avec l'anglais ?";
const OBJECTIF_PLACEHOLDER = "Sélectionne ton objectif principal";

/* Astérisque obligatoire — ROUGE dans tout le formulaire (instruction
   propriétaire Task 28). */
function Req() {
  return (
    <span aria-hidden="true" className="font-semibold text-red-button">
      *
    </span>
  );
}

type FormState = {
  nom: string;
  age: string;
  profession: string;
  email: string;
  pays: string;
  ville: string;
  /** numéro WhatsApp LOCAL (sans indicatif) tel que saisi */
  whatsapp: string;
  /** valeur technique de la situation (ex. "beginner_absolute") — Task 57 */
  situation: string;
  /** valeur technique de l'objectif (ex. "job_interview") — Task 57 */
  objectif: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const INITIAL_FORM: FormState = {
  nom: "",
  age: "",
  profession: "",
  email: "",
  pays: "",
  ville: "",
  whatsapp: "",
  situation: "",
  objectif: "",
};

const FIELD_ORDER: (keyof FormState)[] = [
  "nom",
  "age",
  "profession",
  "email",
  "pays",
  "ville",
  "whatsapp",
  "situation",
  "objectif",
];

function validate(f: FormState): FormErrors {
  const e: FormErrors = {};
  if (f.nom.trim().length < 3) {
    e.nom = "Indique ton nom complet (nom et prénom).";
  }
  const age = Number(f.age);
  if (!f.age || !Number.isInteger(age) || age < 10 || age > 99) {
    e.age = "Indique ton âge en années (entre 10 et 99).";
  }
  if (f.profession.trim().length < 2) {
    e.profession = "Indique ta profession (ou ton statut : étudiant…).";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) {
    e.email = "Indique une adresse email valide.";
  }
  if (f.pays.trim().length < 2) {
    e.pays = "Sélectionne ton pays de résidence.";
  }
  if (f.ville.trim().length < 2) {
    e.ville = "Sélectionne ta ville (choisis d'abord ton pays).";
  }
  // Task 49 : le numéro WhatsApp n'est validé QUE si le pays est
  // déjà choisi (le champ est désactivé sinon — l'erreur « pays »
  // est montrée en premier).
  if (f.pays.trim().length >= 2) {
    const wa = validerWhatsApp(f.pays, f.whatsapp);
    if (!wa.ok) e.whatsapp = wa.erreur;
  }
  // Task 57 : menus déroulants obligatoires — la valeur doit faire
  // partie de la liste (aucune option présélectionnée par défaut).
  if (!situationValide(f.situation)) {
    e.situation =
      "Veuillez sélectionner la situation qui correspond le mieux à votre cas.";
  }
  if (!objectifValide(f.objectif)) {
    e.objectif =
      "Veuillez sélectionner l'option qui correspond le mieux à votre situation.";
  }
  return e;
}

/** Fiche de secours (WhatsApp) si l'email échoue — mêmes
 *  informations (situation, objectif, UTM — Task 57), pour que le
 *  coach ne perde rien. */
function buildFallbackMessage(f: ContactFormData, utm: UtmParams): string {
  const lignesUtm = Object.keys(utm).length
    ? Object.entries(utm).map(([k, v]) => `• utm_${k} : ${v}`)
    : ["• Aucun paramètre de campagne (accès direct)"];
  return [
    "NOUVEAU PROSPECT — MR STEVE ENGLISH",
    "(envoi de secours : l'email n'est pas passé)",
    "",
    "IDENTITÉ",
    `• Nom complet : ${f.nom.trim()}`,
    `• Âge : ${f.age} ans`,
    `• Profession : ${f.profession.trim()}`,
    "",
    "LOCALISATION & CONTACT",
    `• Pays : ${f.pays.trim()}`,
    `• Ville : ${f.ville.trim()}`,
    `• Numéro WhatsApp : ${f.whatsapp}`,
    "",
    "EMAIL",
    `• ${f.email.trim()}`,
    "",
    "SITUATION ACTUELLE",
    `• ${labelSituation(f.situation) || f.situation}`,
    "",
    "OBJECTIF PRINCIPAL",
    `• ${labelObjectif(f.objectif) || f.objectif}`,
    "",
    "SOURCE DE L'INSCRIPTION",
    ...lignesUtm,
    "",
    "PROGRAMME (offre unique)",
    `• ${PROGRAMME_LABEL}`,
    "",
    "— Message envoyé depuis le formulaire du site Stevens AKPOVI",
  ].join("\n");
}

export function ContactPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [sending, setSending] = useState(false);
  /** null = pas envoyé ; "ok" = toast vert affiché ; "fail" = email
   *  en échec (secours WhatsApp) — Task 57 : le succès ne dépend plus
   *  de la réponse du serveur email (redirection immédiate). */
  const [result, setResult] = useState<"ok" | "fail" | null>(null);
  const [fallbackMessage, setFallbackMessage] = useState("");
  /** Timers (toast 3 s / redirection) — nettoyés au démontage. */
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const set = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    // L'erreur disparaît dès que le champ redevient valide en saisie
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    const errs = validate(form);
    // Task 57 (instruction propriétaire) : validation AVANT toute
    // redirection — message d'erreur clair par champ, focus sur le
    // premier champ en erreur, et les données déjà saisies sont
    // CONSERVÉES (rien n'est effacé, aucune perte).
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const first = FIELD_ORDER.find((k) => errs[k]);
      if (first) {
        document.getElementById(`f-${first}`)?.focus();
      }
      return;
    }
    setErrors({});
    // État de chargement immédiat — empêche toute soumission multiple
    // (le bouton reste désactivé jusqu'à la redirection).
    setSending(true);
    // Task 49 : validation garantie OK ici (validate() a déjà passé) —
    // on en déduit les deux formats du numéro WhatsApp du prospect :
    // « pretty » pour l'email au coach / le secours WhatsApp, « e164 »
    // (format machine) pour le localStorage.
    const wa = validerWhatsApp(form.pays, form.whatsapp);
    const whatsappPretty = wa.ok ? wa.pretty : "";
    const whatsappE164 = wa.ok ? wa.e164 : "";
    // Task 57 : UTM capturés (URL courante, sinon copie persistée par
    // le script du layout à l'arrivée sur le site).
    const utm = lireUtm();
    // Task 34 (reçu post-paiement) : persister les données
    // d'inscription dans le navigateur — la page #/bienvenue s'en sert
    // pour PERSONNALISER le reçu PDF du client (nom, email,
    // profession, ville, pays, date). Repli silencieux si localStorage
    // indisponible (le reçu affichera « Non renseigné »). Les UTM et
    // la situation/objectif sont conservés au passage (Task 57).
    try {
      window.localStorage.setItem(
        INSCRIPTION_KEY,
        JSON.stringify({
          nom: form.nom.trim(),
          age: form.age,
          profession: form.profession.trim(),
          email: form.email.trim(),
          pays: form.pays.trim(),
          ville: form.ville.trim(),
          whatsapp: whatsappE164,
          situation: form.situation,
          objectif: form.objectif,
          utm,
          dateInscription: new Date().toISOString(),
        }),
      );
    } catch {
      /* localStorage indisponible — ignoré */
    }
    // Envoi direct par email (FormSubmit AJAX depuis le navigateur) —
    // Task 57 : fire-and-forget avec keepalive (la requête SURVIT à la
    // navigation) : la redirection vers le paiement n'attend PLUS la
    // réponse du serveur email (autrefois jusqu'à 12 s + 1,8 s —
    // ressenti comme beaucoup trop lent par le propriétaire).
    const payload: ContactFormData = {
      nom: form.nom.trim(),
      age: form.age,
      profession: form.profession.trim(),
      email: form.email.trim(),
      pays: form.pays.trim(),
      ville: form.ville.trim(),
      whatsapp: whatsappPretty,
      situation: form.situation,
      objectif: form.objectif,
      utm,
    };
    sendContactEmail(payload).then(({ ok }) => {
      // Échec connu AVANT la redirection → on annule la redirection,
      // on masque le toast et on propose le secours WhatsApp (aucune
      // donnée perdue). Échec après redirection : couvert par keepalive.
      if (!ok && redirectTimer.current) {
        clearTimeout(redirectTimer.current);
        redirectTimer.current = null;
        if (toastTimer.current) clearTimeout(toastTimer.current);
        toastTimer.current = null;
        setResult("fail");
        setFallbackMessage(buildFallbackMessage(payload, utm));
        setSending(false);
      }
    });
    // Task 57 (instruction propriétaire) : TOAST VERT PUR qui confirme
    // automatiquement que tout est bien réussi — durée 3 s, puis
    // disparition ; la redirection vers la page de paiement est
    // AUTOMATIQUE et se déclenche à la fin du toast (plus aucune
    // attente serveur).
    setResult("ok");
    toastTimer.current = setTimeout(() => setResult(null), 3000);
    redirectTimer.current = setTimeout(() => {
      window.location.href = CHECKOUT_URL;
    }, 3000);
  }

  return (
    <div className="on-dark min-h-[calc(100svh-72px)] bg-black text-white">
      <PageHero
        dark
        title="Prêt à parler anglais avec confiance ?"
        subtitle="Un formulaire. Et ton programme de 03 mois peut démarrer cette semaine."
      />

      <section
        id="contact"
        className="relative scroll-mt-20 overflow-hidden pb-12 pt-8 lg:pb-24 lg:pt-12"
      >
        {/* Task 29 (instruction propriétaire) : la carte « Bienvenue à
            toi. » passe en VERRE TRANSPARENT sombre — nappes de couleur
            derrière elle pour rendre la translucidité lisible. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[8rem] top-[2rem] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(255,26,26,0.30)_0%,transparent_62%)] blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[8rem] top-[8rem] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(96,110,190,0.30)_0%,transparent_62%)] blur-2xl"
        />
        <Container className="relative">
          <div className="mx-auto max-w-[42rem]">
            {/* — Message d'accueil chaleureux (instruction propriétaire :
                    juste après le titre, « gravé » au-dessus du formulaire) —
                    Task 29 : VERRE TRANSPARENT sombre (style Pour qui ?). — */}
            <Reveal>
              <div
                className="glass-card glass-dark p-6 md:p-8"
                role="note"
                aria-label="Message d'accueil"
              >
                <p className="font-display text-[1.25rem] leading-snug text-white md:text-[1.375rem]">
                  Bienvenue à toi.
                </p>
                <p className="t-body mt-3 text-white/80">
                  Pour rejoindre le programme, remplis l&apos;intégralité du
                  formulaire ci-dessous avec tes informations exactes — cela
                  permettra de savoir exactement ce dont tu as besoin pour
                  décoller.
                </p>
                {/* Rappel du programme (offre unique — instruction
                    propriétaire) au moment exact de la décision.
                    « Comprendre » et « Parler » en rouge (instruction
                    propriétaire — plus de guillemets imbriqués).
                    Task 50 : PRIX DE LANCEMENT + première cohorte (10
                    places) — recommandation expert marketing. */}
                <p className="t-caption mt-4 border-t border-white/15 pt-4 text-white/75">
                  Programme « De <span className="text-red-button">Comprendre</span> à{" "}
                  <span className="text-red-button">Parler</span>
                  <sup className="top-[-0.6em] text-[0.6em]">™</sup> » — 03 mois
                  de coaching d&apos;anglais personnalisé — prix de lancement :
                  70 000 FCFA (au lieu de 120 000 FCFA), réservé uniquement à
                  cette cohorte ({OFFRE.places} places seulement) — paiement
                  unique.
                </p>
              </div>
            </Reveal>

            {/* — Formulaire de qualification — */}
            <Reveal delay={120}>
              <form onSubmit={handleSubmit} noValidate className="mt-10">
                <div>
                  <label htmlFor="f-nom" className="form-label">
                    Nom complet <Req />
                  </label>
                  <input
                    id="f-nom"
                    type="text"
                    autoComplete="name"
                    value={form.nom}
                    onChange={set("nom")}
                    aria-invalid={Boolean(errors.nom)}
                    aria-describedby={errors.nom ? "err-nom" : undefined}
                    placeholder="Ex. : Kossi Adjovi"
                    className="form-input mt-2"
                  />
                  {errors.nom ? (
                    <p id="err-nom" role="alert" className="form-error">
                      {errors.nom}
                    </p>
                  ) : null}
                </div>

                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="f-age" className="form-label">
                      Âge <Req />
                    </label>
                    <input
                      id="f-age"
                      type="number"
                      inputMode="numeric"
                      min={10}
                      max={99}
                      autoComplete="none"
                      value={form.age}
                      onChange={set("age")}
                      aria-invalid={Boolean(errors.age)}
                      aria-describedby={errors.age ? "err-age" : undefined}
                      placeholder="Ex. : 28"
                      className="form-input mt-2"
                    />
                    {errors.age ? (
                      <p id="err-age" role="alert" className="form-error">
                        {errors.age}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <label htmlFor="f-profession" className="form-label">
                      Profession <Req />
                    </label>
                    <input
                      id="f-profession"
                      type="text"
                      autoComplete="organization-title"
                      value={form.profession}
                      onChange={set("profession")}
                      aria-invalid={Boolean(errors.profession)}
                      aria-describedby={
                        errors.profession ? "err-profession" : undefined
                      }
                      placeholder="Ex. : comptable, étudiant…"
                      className="form-input mt-2"
                    />
                    {errors.profession ? (
                      <p id="err-profession" role="alert" className="form-error">
                        {errors.profession}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="f-email" className="form-label">
                    Adresse email <Req />
                  </label>
                  <input
                    id="f-email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={set("email")}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "err-email" : undefined}
                    placeholder="Ex. : ton.email@exemple.com"
                    className="form-input mt-2"
                  />
                  {errors.email ? (
                    <p id="err-email" role="alert" className="form-error">
                      {errors.email}
                    </p>
                  ) : null}
                </div>

                {/* Task 39 (instruction propriétaire) : « Pays » est
                    désormais un DROPLISTE de TOUS les pays (avec
                    drapeaux + recherche) et « Ville » un dropliste qui
                    ne propose QUE les villes du pays choisi — il faut
                    donc sélectionner le pays AVANT la ville. Changer de
                    pays réinitialise la ville. Les valeurs restent des
                    chaînes simples : email au coach, localStorage et
                    reçu PDF reçoivent les mêmes données qu’avant. */}
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <SelectPaysField
                    id="f-pays"
                    value={form.pays}
                    onChange={(pays) => {
                      // Changer de pays réinitialise la ville ET le
                      // numéro WhatsApp (l'indicatif affiché change).
                      setForm((f) => ({
                        ...f,
                        pays,
                        ville: "",
                        whatsapp: "",
                      }));
                      setErrors((prev) => ({
                        ...prev,
                        pays: undefined,
                        ville: undefined,
                        whatsapp: undefined,
                      }));
                    }}
                    error={errors.pays}
                  />
                  <SelectVilleField
                    id="f-ville"
                    pays={form.pays}
                    value={form.ville}
                    onChange={(ville) => {
                      setForm((f) => ({ ...f, ville }));
                      setErrors((prev) =>
                        prev.ville ? { ...prev, ville: undefined } : prev,
                      );
                    }}
                    error={errors.ville}
                  />
                </div>

                {/* Task 49 (instruction propriétaire) : numéro WhatsApp
                    du prospect, JUSTE APRÈS le pays et la ville —
                    l'indicatif est déduit du pays sélectionné (préfixe
                    affiché dans le champ, ex. +229 Bénin) et la saisie
                    est validée selon les longueurs du pays. Changer de
                    pays réinitialise la saisie (l'indicatif change). */}
                <div className="mt-6">
                  <WhatsAppField
                    id="f-whatsapp"
                    pays={form.pays}
                    value={form.whatsapp}
                    onChange={(whatsapp) => {
                      setForm((f) => ({ ...f, whatsapp }));
                      setErrors((prev) =>
                        prev.whatsapp
                          ? { ...prev, whatsapp: undefined }
                          : prev,
                      );
                    }}
                    error={errors.whatsapp}
                  />
                </div>

                {/* Task 57 (instruction propriétaire) : la rédaction
                    libre en anglais (Task 27) est SUPPRIMÉE — deux
                    menus déroulants OBLIGATOIRES la remplacent.
                    Aucune option présélectionnée : le placeholder
                    n'est pas sélectionnable et la validation bloque
                    l'envoi tant qu'un choix réel n'est pas fait. */}
                <div className="mt-8 grid gap-6">
                  <ListboxField
                    id="f-situation"
                    label={SITUATION_LABEL}
                    required
                    placeholder={SITUATION_PLACEHOLDER}
                    value={form.situation}
                    options={SITUATIONS}
                    onChange={(situation) => {
                      setForm((f) => ({ ...f, situation }));
                      setErrors((prev) =>
                        prev.situation
                          ? { ...prev, situation: undefined }
                          : prev,
                      );
                    }}
                    error={errors.situation}
                    multiline
                  />
                  <ListboxField
                    id="f-objectif"
                    label={OBJECTIF_LABEL}
                    required
                    placeholder={OBJECTIF_PLACEHOLDER}
                    value={form.objectif}
                    options={OBJECTIFS}
                    onChange={(objectif) => {
                      setForm((f) => ({ ...f, objectif }));
                      setErrors((prev) =>
                        prev.objectif
                          ? { ...prev, objectif: undefined }
                          : prev,
                      );
                    }}
                    error={errors.objectif}
                    multiline
                  />
                </div>

                {/* Soumission : email direct + redirection paiement */}
                <div className="mt-10" data-wa-cta>
                  <button
                    type="submit"
                    disabled={sending}
                    className="btn btn-primary t-btn w-full text-[1.0625rem] lg:text-[1.125rem] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {sending ? "Inscription en cours…" : CTA_LABELS.contact}
                  </button>
                  <p className="t-caption mt-4 text-center text-white/70">
                    Paiement sécurisé (prix de lancement : 70 000 FCFA{" "}
                    <span className="text-white/50 line-through">
                      120 000 FCFA
                    </span>{" "}
                    — paiement unique). Cohorte très limitée ({OFFRE.places}{" "}
                    Places seulement).
                  </p>
                  {/* Garantie basée sur l'engagement (instruction
                      propriétaire) — rappel au moment exact de la
                      décision */}
                  <p className="t-caption mt-3 text-center text-white/70">
                    Garantie basée sur ton engagement : conditions respectées
                    sans expression à 02 mois — remboursement intégral.
                  </p>
                </div>

                {/* Échec de l'email : aucune donnée perdue — lien de
                    secours WhatsApp avec la même fiche + paiement
                    manuel */}
                {result === "fail" ? (
                  <div
                    role="alert"
                    className="mt-6 rounded-[12px] border border-white/25 bg-white/[0.06] p-6 text-center"
                  >
                    <p className="t-body text-white">
                      L&apos;envoi par email n&apos;a pas abouti. Pour que ta
                      demande ne se perde pas, envoie-la via WhatsApp en un
                      clic :
                    </p>
                    {fallbackMessage ? (
                      <a
                        href={waLink(fallbackMessage)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary t-btn mt-5 inline-flex"
                      >
                        Envoyer ma demande via WhatsApp →
                      </a>
                    ) : null}
                    <p className="t-caption mt-4 text-white/70">
                      Ou continue directement vers le{" "}
                      <a
                        href={CHECKOUT_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-4 hover:text-white"
                      >
                        paiement sécurisé du programme
                      </a>
                      .
                    </p>
                  </div>
                ) : null}
              </form>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Task 57 (instruction propriétaire) : TOAST DE SUCCÈS « fond
          vert pur » — apparaît automatiquement dès la soumission
          valide, confirme que tout est bien réussi, dure 3 s puis
          disparaît ; la redirection vers le paiement se déclenche à la
          fin du toast. Fixé en haut de l'écran, au-dessus de tout. */}
      {result === "ok" ? (
        <div role="status" aria-live="polite" className="toast-success">
          <IconCheck className="h-5 w-5 shrink-0" />
          <span>
            Inscription réussie ! Redirection vers la page de paiement…
          </span>
        </div>
      ) : null}

      {/* CTA sticky mobile — scrolle vers le formulaire (ancre #contact) */}
      <StickyCTA href="#contact" label="Remplir le formulaire →" />

      {/* Séparateur formulaire / footer (instruction propriétaire
          Task 28) : lumière blanche bien visible qui circule
          horizontalement, de la gauche vers la droite, en continu —
          la ligne sépare le formulaire du footer. */}
      <div className="beam-separator" aria-hidden="true" />
    </div>
  );
}
