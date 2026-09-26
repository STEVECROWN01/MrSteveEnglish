/**
 * CONSTRUCTION DE L'EMAIL « NOUVEAU PROSPECT » (Task 27 — instructions
 * propriétaire ; Task 45 — retour propriétaire ; Task 57 —
 * restructuration) : les données du formulaire sont envoyées
 * directement par email à stevensakpovi@gmail.com via FormSubmit
 * (appel AJAX depuis le NAVIGATEUR — l'endpoint est protégé
 * Cloudflare côté serveur).
 *
 * Task 45 : le corps de l'email est un MESSAGE PROFESSIONNEL
 * multi-lignes « système → Coach » (style notification de reçu,
 * Task 44, approuvé par le propriétaire) : salutation, annonce du
 * prospect, coordonnées complètes, programme, invitation à répondre
 * directement au prospect, date de soumission, signature « Le système
 * Mr Steve English ». SANS emoji, SANS tableau.
 *
 * Task 57 (instruction propriétaire) :
 * — l'ancienne évaluation automatique du niveau (rédaction libre en
 *   anglais, Task 27) est SUPPRIMÉE — remplacée par deux menus
 *   déroulants obligatoires : « Situation actuelle » (beginner_absolute,
 *   understands_but_blocked, speaks_with_errors, unknown_level) et
 *   « Objectif principal » (job_interview, career_business,
 *   travel_abroad, clients_colleagues, exam_training, daily_confidence,
 *   other) — les libellés COMPLETS sont transmis au coach ;
 * — les paramètres UTM de la visite (utm_source / utm_medium /
 *   utm_campaign / utm_content / utm_term, capturés par le script du
 *   layout) sont transmis dans un bloc « Source de l'inscription » :
 *   le coach sait quelle campagne publicitaire et quelle créative ont
 *   généré chaque inscription ;
 * — l'envoi est fire-and-forget avec keepalive : la redirection vers
 *   le paiement n'attend PLUS la réponse du serveur email (elle était
 *   ressentie comme trop lente par le propriétaire) — keepalive
 *   maintient la requête après la navigation.
 *
 * L'envoi se fait en multipart FormData : les retours à la ligne du
 * champ MESSAGE sont préservés dans l'email rendu. L'endpoint AJAX
 * répond en JSON (success) — l'UI garde sa logique succès / secours
 * WhatsApp (si l'échec est connu AVANT la redirection).
 *
 * _replyto = email du prospect → le coach répond directement.
 * _honey = pot de miel anti-bots (champ caché, jamais rempli par un
 * humain ; toute valeur → soumission ignorée par FormSubmit).
 */

import {
  labelObjectif,
  labelSituation,
  type UtmParams,
} from "./profil-prospect";

export const CONTACT_EMAIL = "stevensakpovi@gmail.com";
export const FORMSUBMIT_AJAX = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

/**
 * Endpoint CLASSIQUE de FormSubmit (non-AJAX) — LE SEUL qui délivre
 * les PIÈCES JOINTES (Task 44) : la doc officielle documente l'upload
 * de fichiers uniquement pour cet endpoint avec
 * enctype="multipart/form-data" ; l'endpoint /ajax/ abandonne
 * silencieusement le champ « file » (vérifié empiriquement : emails
 * TEST B et flux réel → message seul, SANS pièce jointe ; TEST C
 * endpoint classique → reçu PDF bien attaché).
 *
 * L'appel se fait en mode « no-cors » (requête simple multipart,
 * sans preflight) : FormSubmit traite la soumission et envoie
 * l'email, la réponse (page de remerciement) étant simplement
 * illisible côté JS — fire-and-forget assumé.
 */
export const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/${CONTACT_EMAIL}`;

const PROGRAMME_LABEL =
  "Programme « De Comprendre à Parler™ » — 03 mois — 70 000 FCFA — paiement unique";

export type ContactFormData = {
  nom: string;
  age: string;
  profession: string;
  email: string;
  pays: string;
  ville: string;
  /** numéro WhatsApp du prospect (format lisible, ex. "+229 01 59 17 30 98" — Task 49) */
  whatsapp: string;
  /** valeur technique de la situation (ex. "beginner_absolute" — Task 57) */
  situation: string;
  /** valeur technique de l'objectif (ex. "job_interview" — Task 57) */
  objectif: string;
  /** paramètres UTM capturés (peuvent être absents — Task 57) */
  utm?: UtmParams;
};

/** Bloc « Source de l'inscription » : UTM présents, ou accès direct. */
function blocUtm(utm: UtmParams | undefined): string[] {
  if (!utm || Object.keys(utm).length === 0) {
    return [
      "Source de l'inscription (paramètres de campagne) :",
      "",
      "Aucun paramètre de campagne détecté (accès direct).",
      "",
    ];
  }
  const noms: Record<string, string> = {
    source: "utm_source",
    medium: "utm_medium",
    campaign: "utm_campaign",
    content: "utm_content",
    term: "utm_term",
  };
  const lignes = (["source", "medium", "campaign", "content", "term"] as const)
    .filter((k) => utm[k])
    .map((k) => `${noms[k]} : ${utm[k]}`);
  return [
    "Source de l'inscription (paramètres de campagne) :",
    "",
    ...lignes,
    "",
  ];
}

/**
 * Champs de l'email (Task 45/57) : l'intégralité de la fiche prospect
 * tient dans UN SEUL champ MESSAGE, rédigé comme une notification
 * professionnelle du système au Coach — paragraphes séparés par des
 * lignes vides, coordonnées une par ligne, AUCUN tableau. Le template
 * « basic » de FormSubmit rend ce champ tel quel, retours à la ligne
 * compris.
 */
export function buildEmailFields(
  p: ContactFormData,
): Record<string, string> {
  const date = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date());

  const message = [
    "Bonjour Coach Stevens,",
    "",
    "Un nouveau prospect vient de soumettre le formulaire d'inscription sur le site Mr Steve English. Vous trouverez ci-dessous l'ensemble de ses informations.",
    "",
    "Informations du prospect :",
    "",
    `Nom : ${p.nom}`,
    `Âge : ${p.age} ans`,
    `Profession : ${p.profession}`,
    `Pays : ${p.pays}`,
    `Ville : ${p.ville}`,
    `Numéro WhatsApp : ${p.whatsapp}`,
    `Adresse e-mail : ${p.email}`,
    "",
    "Situation actuelle en anglais :",
    "",
    labelSituation(p.situation) || p.situation,
    "",
    "Objectif principal avec l'anglais :",
    "",
    labelObjectif(p.objectif) || p.objectif,
    "",
    ...blocUtm(p.utm),
    "Programme choisi :",
    "",
    PROGRAMME_LABEL,
    "",
    "Le champ « Répondre » de cet e-mail pointe directement vers l'adresse du prospect : vous pouvez lui répondre immédiatement.",
    "",
    `Soumis le ${date} — formulaire d'inscription du site Stevens AKPOVI (envoi automatique).`,
    "",
    "Cordialement,",
    "Le système Mr Steve English",
  ].join("\n");

  return {
    _subject: `Nouveau prospect — Mr Steve English — ${p.nom}`,
    _template: "basic",
    _captcha: "false",
    _replyto: p.email,
    MESSAGE: message,
  };
}

/**
 * Envoi de l'email depuis le navigateur (FormSubmit AJAX — usage
 * documenté côté client). Retourne true si parti, false sinon
 * (l'appelant propose alors le secours WhatsApp si l'échec est
 * connu avant la redirection).
 *
 * Task 57 : fetch en keepalive — la requête SURVIT à la navigation
 * vers la page de paiement (redirection désormais immédiate, sans
 * attendre la réponse). Le timeout reste un filet de sécurité
 * (l'appel est fire-and-forget côté UI).
 */
export async function sendContactEmail(
  form: ContactFormData,
): Promise<{ ok: boolean }> {
  const fields = buildEmailFields(form);

  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(FORMSUBMIT_AJAX, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: fd,
      signal: controller.signal,
      keepalive: true,
    });
    const data = (await res.json().catch(() => null)) as
      | { success?: string }
      | null;
    return { ok: res.ok && data?.success === "true" };
  } catch {
    return { ok: false };
  } finally {
    clearTimeout(timeout);
  }
}
