/**
 * LES 12 INCLUSIONS DU PROGRAMME (Task 34 — source unique partagée ;
 * Task 52 : liste étendue de 8 à 12 ; Task 52-bis : carte « Conseils
 * pratiques » ; Task 53 — INSTRUCTION PROPRIÉTAIRE : ordre et libellés
 * EXACTS ci-dessous, « Coaching personnalisé » RETIRÉ, nouvelle carte
 * « Certificat de Fin » en position 11, « Exercices personnalisés »
 * renommé « Exercices pratiques »). Le programme « De Comprendre à
 * Parler™ » contient : 3 séances de 1h30/semaine (affiché ailleurs :
 * hero programme, marquee, FAQ, metas), puis les 12 cartes de cette
 * liste. L'accompagnement personnalisé reste communiqué hors liste
 * (hero, marquee, FAQ, metas — c'est le cadre du programme).
 *
 * CERTIFICAT DE FIN (Task 53) : c'est une CARTE de la section « Ce qui
 * est inclus » (position 11, avec description) mais elle reste HORS
 * des LISTES SIMPLES — value stack de l'accueil, liste de la page
 * Programme, grille du REÇU PDF — où le certificat apparaît déjà en
 * ligne DISTINCTE après la liste (instruction propriétaire :
 * « puisqu'on a mis ça comme à leur suite avec description, il faut
 * pas le mettre dans la liste — pour maintenir l'organisation »).
 * → VALUE_STACK (et le reçu) filtrent la carte `certificat: true`.
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
 * Hiérarchie (DA, Task 53) : pratique orale → outils → travail entre
 * séances → correction → pratique collective → conseils & astuces →
 * mesure (continue + finale + confiance) → CERTIFICAT → bonus.
 * La carte 12 porte un badge BONUS : ressource complémentaire, non
 * équivalente aux séances.
 */
export const INCLUS: {
  num: string;
  titre: string;
  corps: string;
  bonus?: boolean;
  /** Task 53 : carte « Certificat de Fin » — exclue des listes simples
   *  (value stack, page Programme, reçu) qui présentent le certificat
   *  en ligne distincte après la liste. */
  certificat?: boolean;
}[] = [
  {
    num: "01",
    titre: "Speaking & Conversation",
    corps:
      "Des conversations guidées pour une pratique intensive de la prise de parole, dans des situations de la vie réelle.",
  },
  {
    num: "02",
    titre: "Prononciation",
    corps:
      "Identification et correction de tes erreurs de prononciation pour parler plus clairement.",
  },
  {
    num: "03",
    titre: "Vocabulaire & Expressions",
    corps:
      "Le vocabulaire et les expressions dont tu as réellement besoin pour t'exprimer dans des situations concrètes.",
  },
  {
    num: "04",
    titre: "Exercices pratiques",
    corps:
      "Des exercices ciblés entre les séances pour renforcer tes acquis et accélérer ta progression.",
  },
  {
    num: "05",
    titre: "Correction personnalisée",
    corps:
      "Chaque erreur relevée et corrigée avec toi — grammaire, structures, expressions — pour parler de plus en plus juste.",
  },
  {
    num: "06",
    titre: "Communauté de pratique",
    corps:
      "Pratiquer et échanger avec les autres apprenants de la cohorte — une dynamique collective qui soutient ta progression.",
  },
  {
    num: "07",
    titre: "Conseils pratiques",
    corps:
      "Des conseils concrets et des astuces pour accélérer ta maîtrise de l'anglais — partagés avec toi tout au long de l'accompagnement.",
  },
  {
    num: "08",
    titre: "Suivi de progression",
    corps:
      "Un accompagnement structuré pour mesurer tes progrès et ajuster le coaching au fil des trois mois.",
  },
  {
    num: "09",
    titre: "Confiance & Fluidité",
    corps:
      "Un travail ciblé pour t'aider à parler avec plus d'aisance, sans constamment chercher tes mots ni avoir peur de faire des erreurs.",
  },
  {
    num: "10",
    titre: "Évaluation finale",
    corps:
      "Un bilan complet à la fin des 03 mois pour mesurer concrètement le chemin parcouru, de ton niveau de départ à ton niveau d'arrivée.",
  },
  {
    num: "11",
    titre: "Certificat de Fin",
    corps:
      "Un certificat de fin de programme délivré par Mr Steve English, à l'issue des 03 mois, une fois le parcours complété.",
    certificat: true,
  },
  {
    num: "12",
    titre: "Podcasts & Ressources",
    corps:
      "Des podcasts et ressources pédagogiques sélectionnés pour continuer à pratiquer ton anglais entre les séances, à ton rythme.",
    bonus: true,
  },
];

/** Value stack (Task 32) : les titres des inclusions SANS le certificat
 *  (Task 53) — utilisée par la carte « Voici tout ce que tu reçois
 *  pour 70 000 FCFA : » (accueil), par la liste « Voici tout ce que
 *  comprend le programme : » (page Programme, Task 34) et par la grille
 *  du reçu PDF (Task 52) — le certificat y est présenté en ligne
 *  distincte après la liste, organisation inchangée. */
export const VALUE_STACK = INCLUS.filter((item) => !item.certificat).map(
  (item) => item.titre,
);
