import { assessEnglish, type EnglishAssessment } from "./english-assessment";

/**
 * CONSTRUCTION DE L'EMAIL « NOUVEAU PROSPECT » (Task 27 — instructions
 * propriétaire) : les données du formulaire sont envoyées directement
 * par email à stevensakpovi@gmail.com via FormSubmit (appel AJAX depuis
 * le NAVIGATEUR — l'endpoint est protégé Cloudflare côté serveur).
 *
 * Structure professionnelle SANS emoji (instruction propriétaire) :
 * sections IDENTITÉ / LOCALISATION / EMAIL / ENGLISH LEVEL ASSESSMENT
 * (niveau estimé + score /100 + détail des 5 critères /20 + confiance
 * + explication) / ÉCHANTILLON D'ANGLAIS (texte ORIGINAL du prospect,
 * jamais modifié) / PROGRAMME / métadonnées.
 *
 * _replyto = email du prospect → le coach répond directement.
 * _honey = pot de miel anti-bots (champ caché, jamais rempli par un
 * humain ; toute valeur → soumission ignorée par FormSubmit).
 */

export const CONTACT_EMAIL = "stevensakpovi@gmail.com";
export const FORMSUBMIT_AJAX = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

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

/** Champs de l'email — ordre préservé, libellés professionnels. */
export function buildEmailFields(
  p: ContactFormData,
  a: EnglishAssessment,
): Record<string, string> {
  const date = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date());

  return {
    _subject: `Nouveau prospect — Mr Steve English — ${p.nom}`,
    _template: "table",
    _captcha: "false",
    _replyto: p.email,

    "IDENTITÉ · Nom complet": p.nom,
    "IDENTITÉ · Âge": `${p.age} ans`,
    "IDENTITÉ · Profession": p.profession,

    "LOCALISATION · Pays": p.pays,
    "LOCALISATION · Ville": p.ville,

    "EMAIL · Adresse du prospect": p.email,

    "ENGLISH LEVEL ASSESSMENT · Estimated English Level": a.level,
    "ENGLISH LEVEL ASSESSMENT · Note":
      "Niveau estimé automatiquement — pas un niveau CEFR officiel.",
    "ENGLISH LEVEL ASSESSMENT · Score global": `${a.total}/100`,
    "ENGLISH LEVEL ASSESSMENT · Détail des 5 critères":
      `Vocabulaire ${a.scores.vocabulaire}/20 — Construction de phrases ${a.scores.construction}/20 — ` +
      `Grammaire ${a.scores.grammaire}/20 — Développement des idées ${a.scores.developpement}/20 — ` +
      `Cohérence ${a.scores.coherence}/20`,
    "ENGLISH LEVEL ASSESSMENT · Assessment confidence": a.confidence,
    "ENGLISH LEVEL ASSESSMENT · Explication": a.explanation,

    "ÉCHANTILLON D'ANGLAIS · Texte original du prospect (non modifié)":
      `« ${p.anglais} »`,

    "PROGRAMME · Offre unique": PROGRAMME_LABEL,

    "SOUMIS LE": date,
    PROVENANCE:
      "Formulaire d'inscription du site Stevens AKPOVI (envoi automatique)",
  };
}

/**
 * Envoi de l'email depuis le navigateur (FormSubmit AJAX — usage
 * documenté côté client). Retourne true si parti, false sinon
 * (l'appelant propose alors le secours WhatsApp).
 */
export async function sendContactEmail(
  form: ContactFormData,
): Promise<{ ok: boolean; assessment: EnglishAssessment }> {
  const assessment = assessEnglish(form.anglais);
  const fields = buildEmailFields(form, assessment);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    const res = await fetch(FORMSUBMIT_AJAX, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(fields),
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
