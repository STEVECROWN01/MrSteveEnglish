/**
 * LES 8 INCLUSIONS DU PROGRAMME (Task 34 — source unique partagée).
 *
 * Historique : cette liste vivait dans home-page.tsx (section « Ce qui
 * est inclus », Task 27) et la value stack de la carte « Paiement
 * unique » en dérivait déjà (Task 32 : VALUE_STACK = INCLUS.map).
 * Instruction propriétaire Task 34 : la liste « Voici tout ce que
 * comprend le programme : » de la page Programme doit être EXACTEMENT
 * conforme à celle de la carte « Voici tout ce que tu reçois pour
 * 70 000 FCFA : » — les deux pages dérivent désormais de CETTE source
 * unique, donc la conformité est garantie et auto-synchronisée.
 *
 * Hiérarchie (DA) : accompagnement → pratique orale → correction →
 * outils → travail entre séances → mesure → transformation → bonus.
 * La carte 08 porte un badge BONUS : ressource complémentaire, non
 * équivalente aux séances.
 */
export const INCLUS: {
  num: string;
  titre: string;
  corps: string;
  bonus?: boolean;
}[] = [
  {
    num: "01",
    titre: "Coaching personnalisé",
    corps: "Des séances adaptées à ton niveau, tes difficultés et ton objectif.",
  },
  {
    num: "02",
    titre: "Speaking & Conversation",
    corps:
      "Une pratique intensive centrée sur la prise de parole et les situations de la vie réelle.",
  },
  {
    num: "03",
    titre: "Prononciation",
    corps:
      "Identification et correction de tes erreurs de prononciation pour parler plus clairement.",
  },
  {
    num: "04",
    titre: "Vocabulaire & Expressions",
    corps:
      "Le vocabulaire et les expressions dont tu as réellement besoin pour t'exprimer dans des situations concrètes.",
  },
  {
    num: "05",
    titre: "Exercices personnalisés",
    corps:
      "Des exercices ciblés entre les séances pour renforcer tes acquis et accélérer ta progression.",
  },
  {
    num: "06",
    titre: "Suivi de progression",
    corps:
      "Un accompagnement structuré pour mesurer tes progrès et ajuster le coaching au fil des trois mois.",
  },
  {
    num: "07",
    titre: "Confiance & Fluidité",
    corps:
      "Un travail ciblé pour t'aider à parler avec plus d'aisance, sans constamment chercher tes mots ni avoir peur de faire des erreurs.",
  },
  {
    num: "08",
    titre: "Podcasts & Ressources",
    corps:
      "Des podcasts et ressources sélectionnés pour continuer à pratiquer ton anglais entre les séances, à ton rythme.",
    bonus: true,
  },
];

/** Value stack (Task 32) : les titres des 8 inclusions — utilisée par
 *  la carte « Voici tout ce que tu reçois pour 70 000 FCFA : »
 *  (accueil) et par la liste « Voici tout ce que comprend le
 *  programme : » (page Programme, Task 34). */
export const VALUE_STACK = INCLUS.map((item) => item.titre);
