/**
 * Configuration centrale du site — Stevens AKPOVI, coach d'anglais.
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

/**
 * OFFRE UNIQUE (instruction propriétaire — la conversion tourne autour
 * d'UNE SEULE offre, plus aucun multi-format / multi-durée / multi-prix) :
 * Programme « De Comprendre à Parler » — 03 mois de coaching d'anglais
 * personnalisé — 70 000 FCFA — paiement unique.
 */
export const OFFRE = {
  programme: "Programme « De Comprendre à Parler »",
  duree: "03 mois",
  rythme: "Trois séances de 1h30 par semaine",
  prix: "70 000",
  devise: "FCFA",
  paiement: "Paiement unique",
  resumeSousCta:
    "03 mois • Coaching en ligne • Accompagnement personnalisé • 70 000 FCFA",
  sousCtaPrix: "Paiement unique • Accès au programme pendant 03 mois",
} as const;

/** Libellés des CTA (instruction propriétaire : ne pas multiplier les CTA
 *  différents — principalement « Je veux parler anglais avec confiance »,
 *  secondairement « Découvrir le programme »). Le CTA principal mène au
 *  formulaire d'inscription, le secondaire à la page Programme. */
export const CTA_LABELS = {
  hero: "Je veux parler anglais avec confiance",
  decouvrir: "Découvrir le programme →",
  decouvrirCourt: "Découvrir le programme",
  rejoindre: "Rejoindre le programme — 70 000 FCFA",
  pourquoiMoi: "Découvrir mon parcours →",
  voirResultats: "Voir les résultats obtenus avec cette méthode →",
  faq: "Pose-moi ta question →",
  contact: "Envoie-moi tes informations →",
} as const;

/** Pages internes (navigation hash) — cible des CTA. */
export const PAGES = {
  contact: "#/contact",
  programme: "#/programme",
  aPropos: "#/a-propos",
  resultats: "#/resultats",
} as const;
