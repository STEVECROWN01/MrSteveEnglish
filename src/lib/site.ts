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
 * après l'envoi du formulaire (instruction propriétaire Task 28 — VRAI
 * lien du programme, fourni par le propriétaire).
 */
export const CHECKOUT_URL =
  "https://mrsteveenglish.mymaketou.shop/products/coaching-danglais-de-comprendre-a-parler-en-03-mois/checkout";

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
 * Programme « De Comprendre à Parler™ » — 03 mois de coaching d'anglais
 * personnalisé — 70 000 FCFA — paiement unique.
 *
 * Task 50 (instruction propriétaire — recommandation expert marketing) :
 * le tarif de 70 000 FCFA est un PRIX DE LANCEMENT réel, réservé à la
 * PREMIÈRE cohorte ; à sa clôture, le programme passera à son tarif
 * normal de 120 000 FCFA. La cohorte est par ailleurs volontairement
 * limitée à 10 apprenants — contrainte opérationnelle RÉELLE (3 séances
 * live de 1h30 par semaine + suivi personnalisé), pas une urgence
 * artificielle. Ces éléments alimentent le bloc de conversion final.
 */
export const OFFRE = {
  programme: "Programme « De Comprendre à Parler™ »",
  duree: "03 mois",
  rythme: "Trois séances de 1h30 par semaine",
  prix: "70 000",
  /** Tarif normal après la période de lancement (prix de référence
   *  réel annoncé par le propriétaire — Task 50). */
  prixNormal: "120 000",
  devise: "FCFA",
  paiement: "Paiement unique",
  /** Capacité RÉELLE par cohorte (Task 50) — contrainte opérationnelle. */
  places: "10",
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
  /** Task 50 (recommandation expert marketing) : libellé du CTA FINAL
   *  de l'accueil, après le bloc de conversion « première cohorte ». */
  rejoindreCohorte: "Rejoindre la cohorte — 70 000 FCFA →",
  pourquoiMoi: "Découvrir mon parcours →",
  voirResultats: "Voir les résultats obtenus avec cette méthode →",
  faq: "Pose-moi ta question →",
  /** Task 28 (instruction propriétaire) : libellé exact demandé pour le
   * bouton de soumission du formulaire d'inscription. */
  contact: "Rejoindre le Programme",
} as const;

/** Pages internes (Task 48 — vraies pages SEO : chemins réels indexables)
 * — cible des CTA. La page « bienvenue » (post-paiement) n'apparaît
 * volontairement dans AUCUNE navigation : elle reçoit les clients après
 * leur paiement (URL de redirection configurée par le propriétaire dans
 * son système de paiement — l'ancienne URL …/#/bienvenue est traduite
 * automatiquement vers /bienvenue par le script inline de layout.tsx). */
export const PAGES = {
  contact: "/contact",
  programme: "/programme",
  aPropos: "/a-propos",
  resultats: "/resultats",
  bienvenue: "/bienvenue",
} as const;
