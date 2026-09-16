import { assessEnglish, type EnglishAssessment } from "./english-assessment";

/**
 * CONSTRUCTION DE L'EMAIL « NOUVEAU PROSPECT » (Task 27 — instructions
 * propriétaire ; Task 45 — retour propriétaire) : les données du
 * formulaire sont envoyées directement par email à
 * stevensakpovi@gmail.com via FormSubmit (appel AJAX depuis le
 * NAVIGATEUR — l'endpoint est protégé Cloudflare côté serveur).
 *
 * Task 45 : le corps de l'email n'est plus un TABLEAU de champs
 * (_template « table ») mais un MESSAGE PROFESSIONNEL multi-lignes
 * « système → Coach », dans le MÊME STYLE que la notification de
 * reçu (Task 44, approuvée par le propriétaire) : salutation, annonce
 * du prospect, coordonnées complètes, niveau d'anglais estimé
 * (niveau + score /100 + détail des 5 critères /20 + fiabilité +
 * explication), échantillon d'anglais ORIGINAL du prospect (jamais
 * modifié), programme, invitation à répondre directement au prospect,
 * date de soumission, signature « Le système Mr Steve English ».
 * SANS emoji, SANS tableau.
 *
 * L'envoi se fait en multipart FormData (et plus en JSON) : comme la
 * copie du reçu, les retours à la ligne du champ MESSAGE sont
 * préservés dans l'email rendu. L'endpoint AJAX répond toujours en
 * JSON (success) — l'UI garde sa logique succès / secours WhatsApp.
 *
 * _replyto = email du prospect → le coach répond directement.
 * _honey = pot de miel anti-bots (champ caché, jamais rempli par un
 * humain ; toute valeur → soumission ignorée par FormSubmit).
 */

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
  "Programme « De Comprendre à Parler » — 03 mois — 70 000 FCFA — paiement unique";

export type ContactFormData = {
  nom: string;
  age: string;
  profession: string;
  email: string;
  pays: string;
  ville: string;
  anglais: string;
};

/**
 * Champs de l'email (Task 45) : l'intégralité de la fiche prospect
 * tient dans UN SEUL champ MESSAGE, rédigé comme une notification
 * professionnelle du système au Coach — paragraphes séparés par des
 * lignes vides, coordonnées une par ligne, AUCUN tableau. Le template
 * « basic » de FormSubmit (le plus sobre des trois) rend ce champ tel
 * quel, retours à la ligne compris.
 */
export function buildEmailFields(
  p: ContactFormData,
  a: EnglishAssessment,
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
    `Adresse e-mail : ${p.email}`,
    "",
    "Niveau d'anglais estimé (English Level Assessment) :",
    "",
    `Niveau : ${a.level} — estimation automatique, pas un niveau CEFR officiel`,
    `Score global : ${a.total}/100`,
    `Détail des 5 critères : Vocabulaire ${a.scores.vocabulaire}/20 — Construction de phrases ${a.scores.construction}/20 — Grammaire ${a.scores.grammaire}/20 — Développement des idées ${a.scores.developpement}/20 — Cohérence ${a.scores.coherence}/20`,
    `Fiabilité de l'évaluation : ${a.confidence}`,
    `Explication : ${a.explanation}`,
    "",
    "Échantillon d'anglais — texte original du prospect (non modifié) :",
    "",
    `« ${p.anglais} »`,
    "",
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
 * (l'appelant propose alors le secours WhatsApp).
 *
 * Task 45 : le corps est envoyé en MULTIPART FormData (et plus en
 * JSON) — même mécanisme que la copie du reçu (Task 44) — pour que
 * les retours à la ligne du champ MESSAGE soient préservés dans
 * l'email rendu. Sans Content-Type explicite, le navigateur pose
 * lui-même multipart/form-data avec boundary (requête simple, sans
 * preflight) ; l'endpoint /ajax/ répond en JSON (success) — la
 * lecture de la réponse est inchangée.
 */
export async function sendContactEmail(
  form: ContactFormData,
): Promise<{ ok: boolean; assessment: EnglishAssessment }> {
  const assessment = assessEnglish(form.anglais);
  const fields = buildEmailFields(form, assessment);

  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    const res = await fetch(FORMSUBMIT_AJAX, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: fd,
      signal: controller.signal,
    });
    const data = (await res.json().catch(() => null)) as
      | { success?: string }
      | null;
    return { ok: res.ok && data?.success === "true", assessment };
  } catch {
    return { ok: false, assessment };
  } finally {
    clearTimeout(timeout);
  }
}
