/**
 * PROFIL DU PROSPECT — SITUATION ACTUELLE & OBJECTIF (Task 57 —
 * instruction propriétaire).
 *
 * Le formulaire d'inscription ne demande PLUS de rédaction libre en
 * anglais (ancienne évaluation Task 27, supprimée) : le prospect
 * choisit désormais sa situation et son objectif dans deux menus
 * déroulants OBLIGATOIRES (aucune option présélectionnée, placeholder
 * non sélectionnable).
 *
 * Les VALEURS sont courtes et propres techniquement (stockage,
 * exports) ; les LIBELLÉS visibles restent complets et naturels.
 */

export type OptionProfil = {
  /** valeur technique stockée (ex. "beginner_absolute") */
  value: string;
  /** libellé complet visible par l'utilisateur */
  label: string;
};

/** « Laquelle de ces situations te décrit le mieux aujourd'hui ? » */
export const SITUATIONS: OptionProfil[] = [
  {
    value: "beginner_absolute",
    label:
      "Je suis débutant absolu : je comprends très peu l'anglais et je n'arrive pas encore à parler.",
  },
  {
    value: "understands_but_blocked",
    label:
      "Je comprends déjà l'anglais, mais je suis bloqué dès que je dois parler.",
  },
  {
    value: "speaks_with_errors",
    label:
      "Je comprends et je parle déjà anglais, mais je fais encore beaucoup d'erreurs et je manque de fluidité.",
  },
  {
    value: "unknown_level",
    label: "Je ne sais pas encore évaluer mon niveau.",
  },
];

/** « Quel est ton objectif principal avec l'anglais ? » */
export const OBJECTIFS: OptionProfil[] = [
  {
    value: "job_interview",
    label: "Trouver un emploi ou réussir un entretien",
  },
  {
    value: "career_business",
    label: "Progresser dans mon travail ou mon activité",
  },
  { value: "travel_abroad", label: "Voyager ou vivre à l'étranger" },
  {
    value: "clients_colleagues",
    label:
      "Mieux communiquer avec des clients ou collègues anglophones",
  },
  {
    value: "exam_training",
    label: "Réussir un examen ou une formation",
  },
  {
    value: "daily_confidence",
    label: "Parler anglais avec plus de confiance au quotidien",
  },
  { value: "other", label: "Autre" },
];

/** Libellé complet d'une valeur de situation ("" si inconnue). */
export function labelSituation(value: string): string {
  return SITUATIONS.find((o) => o.value === value)?.label ?? "";
}

/** Libellé complet d'une valeur d'objectif ("" si inconnue). */
export function labelObjectif(value: string): string {
  return OBJECTIFS.find((o) => o.value === value)?.label ?? "";
}

/** Une valeur de situation est-elle valide (fait partie de la liste) ? */
export function situationValide(value: string): boolean {
  return SITUATIONS.some((o) => o.value === value);
}

/** Une valeur d'objectif est-elle valide (fait partie de la liste) ? */
export function objectifValide(value: string): boolean {
  return OBJECTIFS.some((o) => o.value === value);
}

/**
 * Paramètres UTM d'attribution publicitaire (Task 57 — instruction
 * propriétaire) : utm_source / utm_medium / utm_campaign /
 * utm_content / utm_term, capturés par le script inline du layout à
 * l'arrivée sur N'IMPORTE QUELLE page du site (persistés dans
 * localStorage « mse_utm ») — le formulaire les relève à la
 * soumission pour identifier la campagne et la créative à l'origine
 * de chaque inscription.
 */
export type UtmParams = Partial<
  Record<
    "source" | "medium" | "campaign" | "content" | "term",
    string
  >
>;

const UTM_KEYS = ["source", "medium", "campaign", "content", "term"] as const;
export const UTM_STORAGE_KEY = "mse_utm";

/** Lit les UTM : priorité à l'URL courante, sinon copie persistée. */
export function lireUtm(): UtmParams {
  try {
    const fromUrl: UtmParams = {};
    const sp = new URLSearchParams(window.location.search);
    for (const k of UTM_KEYS) {
      const v = sp.get(`utm_${k}`);
      if (v) fromUrl[k] = v.slice(0, 150);
    }
    if (Object.keys(fromUrl).length > 0) return fromUrl;
    const raw = window.localStorage.getItem(UTM_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as UtmParams;
      const clean: UtmParams = {};
      for (const k of UTM_KEYS) {
        const v = parsed[k];
        if (typeof v === "string" && v) clean[k] = v.slice(0, 150);
      }
      return clean;
    }
  } catch {
    /* localStorage indisponible ou JSON invalide — ignoré */
  }
  return {};
}
