/**
 * Configuration centrale du site — Stevens Akpovi, coach d'anglais.
 * Tous les textes de CTA et messages pré-remplis proviennent
 * EXACTEMENT de COPYWRITING.md (fidélité absolue, §7 du prompt maître).
 */

/**
 * Numéro WhatsApp officiel de Stevens Akpovi, fourni par le propriétaire.
 * Format wa.me : indicatif pays (Bénin, 229) + numéro, sans « + » ni espaces.
 * Affichage lisible : +229 01 59 17 30 98.
 */
export const WHATSAPP_NUMBER = "2290159173098";

/** Numéro au format lisible, pour affichage sur la page Contact. */
export const WHATSAPP_DISPLAY = "+229 01 59 17 30 98";

/** Construit un lien WhatsApp avec message pré-rempli (encodé). */
export function waLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Messages pré-remplis définis mot pour mot dans COPYWRITING.md. */
export const WA_MESSAGES = {
  hero: "Bonjour Stevens, je veux enfin parler anglais avec aisance.",
  format: "Bonjour Stevens, je veux réserver mon format de coaching.",
  parcours: "Bonjour Stevens, ton parcours me parle, j'aimerais en savoir plus.",
  cas: "Bonjour Stevens, mon objectif ressemble à celui-ci, parlons-en.",
  reservation: "Bonjour Stevens, je veux réserver mon coaching.",
  contact:
    "Bonjour Stevens, je veux parler anglais avec aisance. Voici mon objectif : ___",
} as const;

/** Libellés des CTA — copiés exactement depuis COPYWRITING.md. */
export const CTA_LABELS = {
  hero: "Parler à Stevens sur WhatsApp →",
  decouvrir: "Découvrir comment ça marche →",
  reserverFormat: "Réserver mon format sur WhatsApp →",
  voirMethode: "Voir si cette méthode te correspond →",
  parlerDirect: "Parler directement à Stevens sur WhatsApp →",
  voirResultats: "Voir les résultats obtenus avec cette méthode →",
  cas: "Ça te parle ? Écris à Stevens sur WhatsApp →",
  voirObjectif: "Voir si ton objectif est atteignable en 2-3 mois →",
  reserver3mois: "Réserver le coaching 3 mois sur WhatsApp →",
  reserver2mois: "Réserver le coaching 2 mois sur WhatsApp →",
  reserverPlace: "Réserver ma place sur WhatsApp →",
  faq: "Demande directement à Stevens sur WhatsApp →",
  contact: "Écrire à Stevens sur WhatsApp →",
} as const;
