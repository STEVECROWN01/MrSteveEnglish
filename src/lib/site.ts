/**
 * Configuration centrale du site — Coach Stevens (Stevens Akpovi), coach d'anglais.
 * Le numéro WhatsApp n'est JAMAIS affiché sur le site : il sert uniquement
 * à construire le message du formulaire de contact, envoyé automatiquement
 * au coach à la soumission (instruction propriétaire).
 */

/**
 * Numéro WhatsApp officiel, fourni par le propriétaire.
 * Format wa.me : indicatif pays (Bénin, 229) + numéro, sans « + » ni espaces.
 * USAGE INTERNE UNIQUEMENT (formulaire) — jamais rendu visible à l'écran.
 */
export const WHATSAPP_NUMBER = "2290159173098";

/**
 * Page de paiement vers laquelle le prospect est dirigé automatiquement
 * après l'envoi du formulaire (instruction propriétaire).
 */
export const CHECKOUT_URL =
  "https://shefapro.mymaketou.shop/products/cv-premium-optimisation-linkedin-profil-qui-attire-les-recruteurs/checkout";

/** Réseaux sociaux officiels (instruction propriétaire). */
export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/Mr.SteveEnglish",
  youtube: "https://www.youtube.com/@Mr.SteveEnglish",
} as const;

/** Construit un lien WhatsApp avec message pré-rempli (encodé). Usage interne. */
export function waLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Libellés des CTA — tous mènent au formulaire de la page Contact. */
export const CTA_LABELS = {
  hero: "Parler au Coach Stevens →",
  decouvrir: "Découvrir comment ça marche →",
  reserverFormat: "Réserver mon format →",
  voirMethode: "Voir si cette méthode te correspond →",
  parlerDirect: "Parler directement au Coach Stevens →",
  voirResultats: "Voir les résultats obtenus avec cette méthode →",
  cas: "Ça te parle ? Parlons-en →",
  voirObjectif: "Voir si ton objectif est atteignable en 2-3 mois →",
  reserver3mois: "Réserver le coaching 3 mois →",
  reserver2mois: "Réserver le coaching 2 mois →",
  reserverPlace: "Réserver ma place →",
  faq: "Pose ta question au Coach Stevens →",
  contact: "Envoyer mes informations au Coach Stevens →",
} as const;

/** Pages internes (navigation hash) — cible de tous les CTA principaux. */
export const PAGES = {
  contact: "#/contact",
  contactOffre3mois: "#/contact?offre=3mois",
  contactOffre2mois: "#/contact?offre=2mois",
} as const;
