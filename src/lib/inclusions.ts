/**
 * LES 12 INCLUSIONS DU PROGRAMME (Task 34 — source unique partagée ;
 * Task 52 : liste EXTENDUE de 8 à 12 sur instruction propriétaire — le
 * programme « De Comprendre à Parler » contient : 3 séances de 1h30/
 * semaine (affiché ailleurs : hero programme, marquee, FAQ, metas),
 * conversation guidée, correction personnalisée, travail de
 * prononciation, répétition, exercices pratiques, podcasts, ressources
 * pédagogiques, communauté de pratique, accompagnement personnalisé,
 * suivi de progression, évaluation finale, certification (communiquée
 * sous la formulation « Certificat de fin de programme » — Task 50,
 * lignes distinctes sur l'accueil et la page Programme).
 *
 * Historique : cette liste vivait dans home-page.tsx (section « Ce qui
 * est inclus », Task 27) et la value stack de la carte « Paiement
 * unique » en dérivait déjà (Task 32 : VALUE_STACK = INCLUS.map).
 * Instruction propriétaire Task 34 : la liste « Voici tout ce que
 * comprend le programme : » doit être EXACTEMENT conforme à celle de la
 * carte « Voici tout ce que tu reçois pour 70 000 FCFA : » — les deux
 * pages dérivent de CETTE source unique, la conformité est garantie et
 * auto-synchronisée. Task 52 : le REÇU PDF (receipt.ts) dérive
 * désormais aussi de cette source.
 *
 * Hiérarchie (DA) : accompagnement → pratique orale → correction →
 * outils → ancrage/répétition → travail entre séances → mesure
 * (continue + finale) → transformation → pratique collective → bonus.
 * La carte 12 porte un badge BONUS : ressource complémentaire, non
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
      "Des conversations guidées pour une pratique intensive de la prise de parole, dans des situations de la vie réelle.",
  },
  {
    num: "03",
    titre: "Prononciation",
    corps:
      "Identification et correction de tes erreurs de prononciation pour parler plus clairement.",
  },
  {
    num: "04",
    titre: "Correction personnalisée",
    corps:
      "Chaque erreur relevée et corrigée avec toi — grammaire, structures, expressions — pour parler de plus en plus juste.",
  },
  {
    num: "05",
    titre: "Vocabulaire & Expressions",
    corps:
      "Le vocabulaire et les expressions dont tu as réellement besoin pour t'exprimer dans des situations concrètes.",
  },
  {
    num: "06",
    titre: "Répétition",
    corps:
      "Répéter les structures clés jusqu'à ce qu'elles sortent naturellement — sans chercher tes mots, sans traduire dans ta tête.",
  },
  {
    num: "07",
    titre: "Exercices personnalisés",
    corps:
      "Des exercices ciblés entre les séances pour renforcer tes acquis et accélérer ta progression.",
  },
  {
    num: "08",
    titre: "Suivi de progression",
    corps:
      "Un accompagnement structuré pour mesurer tes progrès et ajuster le coaching au fil des trois mois.",
  },
  {
    num: "09",
    titre: "Évaluation finale",
    corps:
      "Un bilan complet à la fin des 03 mois pour mesurer concrètement le chemin parcouru, de ton niveau de départ à ton niveau d'arrivée.",
  },
  {
    num: "10",
    titre: "Confiance & Fluidité",
    corps:
      "Un travail ciblé pour t'aider à parler avec plus d'aisance, sans constamment chercher tes mots ni avoir peur de faire des erreurs.",
  },
  {
    num: "11",
    titre: "Communauté de pratique",
    corps:
      "Pratiquer et échanger avec les autres apprenants de la cohorte — une dynamique collective qui soutient ta progression.",
  },
  {
    num: "12",
    titre: "Podcasts & Ressources",
    corps:
      "Des podcasts et ressources pédagogiques sélectionnés pour continuer à pratiquer ton anglais entre les séances, à ton rythme.",
    bonus: true,
  },
];

/** Value stack (Task 32) : les titres des 12 inclusions — utilisée par
 *  la carte « Voici tout ce que tu reçois pour 70 000 FCFA : »
 *  (accueil), par la liste « Voici tout ce que comprend le
 *  programme : » (page Programme, Task 34) et par le reçu PDF
 *  (Task 52). */
export const VALUE_STACK = INCLUS.map((item) => item.titre);
