import { INSCRIPTION_EMAIL, FORMSUBMIT_ENDPOINT } from "./inscription-email";
import { INCLUS } from "./inclusions";

/**
 * REÇU PDF POST-PAIEMENT (Task 34 — instruction propriétaire ;
 * Task 37 : terminologie « Reçu » uniquement — plus jamais « Facture » —
 * identité STEVENS AKPOVI — plus aucune mention « Mr Steve English » —
 * bandes haute/basse NOIRES #000000, cachet dont le texte PENDE dans
 * le MÊME sens que son cadre ;
 * Task 38 : nom de fichier « Reçu {nom du client}.pdf » — cachet
 * MONTANT (gauche-bas → droite-haut « / ») avec PAYÉ + date centrés
 * au point près dans le cadre — en-tête « STEVENS AKPOVI » à la MÊME
 * taille que « REÇU DE PAIEMENT » (15 pt) — ligne de statut verte
 * supprimée — badge vert « Paiement unique » (ex-« Inclus ») ;
 * Task 39 : PAYÉ RAPPROCHÉ de la date (écart d'encre 9,9 → ~4,9 pt,
 * la DATE ne bouge pas d'un point) pour que l'accent du É ne frôle
 * plus le bord du cadre — dégagement accent/bord interne 3,0 → ~5,3 pt
 * (cadre recentré de +2,75 pt, bloc d'encre toujours centré).
 * Task 43 : la copie email au coach n'est plus un tableau de
 * métadonnées — c'est LE REÇU PDF LUI-MÊME, en PIÈCE JOINTE (le même
 * blob que celui téléchargé par le client, donc identique octet pour
 * octet), accompagné d'un message d'envoi.
 * Task 44 : (1) CORRECTIF — l'endpoint AJAX de FormSubmit abandonne
 * les pièces jointes (vérifié : flux réel = message seul) → envoi sur
 * l'endpoint CLASSIQUE multipart (le seul documenté pour les
 * fichiers) en mode no-cors ; (2) le message devient une
 * NOTIFICATION PROFESSIONNELLE du système au Coach : nouveau client,
 * ses coordonnées, les détails du paiement, reçu joint — rédigé avec
 * retours à la ligne, SANS tableau.
 * Task 46 : nom de fichier « Reçu N° {n°} — {nom du client}.pdf »
 * (retour propriétaire : le nom doit comporter « Reçu », le NUMÉRO
 * de reçu et le nom du client). Le même nom sert aux trois usages :
 * téléchargement du client, pièce jointe de l'email au coach, et
 * mention du fichier dans le message.
 * Task 62 : « Certificat de Fin » en DERNIER TIRET du reçu, juste
 * après « Évaluation finale » (instruction propriétaire) — la grille
 * « CE QUE COMPREND LE PROGRAMME » affiche désormais les 12 titres
 * COMPLETS (le reçu ne filtre plus la carte `certificat: true`,
 * contrairement aux listes du site qui présentent le certificat en
 * ligne distincte) ; grille 3×4 PLEINE, aucune position verticale
 * ne bouge (la 4e rangée de la 3e colonne était libre).
 *
 * Le client qui arrive sur #/bienvenue après son paiement peut
 * télécharger un reçu PDF TRÈS haute qualité : A4 vectoriel,
 * typographie soignée (Times + Helvetica), palette sobre (encre,
 * bandes noires), cachet « PAYÉ » OBLIQUE en VERT PUR (rgb(0,128,0)),
 * personnalisé avec ses données (nom, email, profession, ville, pays,
 * date d'inscription, n° de reçu déterministe).
 *
 * AU MÊME INSTANT que le téléchargement, la COPIE EXACTE du reçu
 * (pièce jointe PDF) est envoyée automatiquement à
 * stevensakpovi@gmail.com (FormSubmit endpoint CLASSIQUE en multipart
 * FormData — le seul endpoint qui délivre les pièces jointes, cf.
 * Task 44 ; le champ « file » devient la pièce jointe de l'email,
 * accompagné d'une notification professionnelle système → Coach).
 *
 * PERF : jsPDF (~120 Ko gz) est importé DYNAMIQUEMENT au clic — le
 * bundle initial du site n'est pas alourdi (leçon Task 33).
 */

/* — Données d'inscription persistées par le formulaire d'inscription — */
export type InscriptionData = {
  nom: string;
  age: string;
  profession: string;
  email: string;
  pays: string;
  ville: string;
  /** Numéro WhatsApp E.164 du prospect — stocké par le formulaire
   *  (utilisé par le Purchase Conversions API pour le match
   *  d'identité côté Meta, haché SHA-256 serveur). */
  whatsapp?: string;
  /** ISO — moment de la soumission du formulaire. */
  dateInscription: string;
};

export const INSCRIPTION_KEY = "mse_inscription";

/** Lit les données d'inscription persistées (null si absentes). */
export function readInscription(): InscriptionData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(INSCRIPTION_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<InscriptionData>;
    if (typeof v.nom !== "string") return null;
    return {
      nom: v.nom ?? "",
      age: v.age ?? "",
      profession: v.profession ?? "",
      email: v.email ?? "",
      pays: v.pays ?? "",
      ville: v.ville ?? "",
      dateInscription: v.dateInscription ?? "",
    };
  } catch {
    return null;
  }
}

/* — N° de reçu déterministe : MSE-YYMM-XXXX (programme) ou
     MSE-PL-YYMM-XXXX (pré-lancement) — stable au re-téléchargement. — */
export function receiptNumberFor(
  d: InscriptionData,
  offre: OffreId = "programme",
): string {
  const seed = `${d.nom}|${d.email}|${d.dateInscription}`.toLowerCase();
  let h = 5381;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) + h + seed.charCodeAt(i)) >>> 0;
  }
  const code = h.toString(36).toUpperCase().padStart(4, "0").slice(-4);
  const dt = d.dateInscription ? new Date(d.dateInscription) : new Date();
  const ym = `${String(dt.getFullYear()).slice(2)}${String(
    dt.getMonth() + 1,
  ).padStart(2, "0")}`;
  return `${OFFRES[offre].recuPrefix}-${ym}-${code}`;
}

/* — Constantes du document — */
const M = 46; // marge gauche/droite (pt)
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const X_END = PAGE_W - M; // 549.28
const NBSP = "\u00A0";

/* ============================================================
 * TASK 69 — REÇU PARAMÉTRÉ PAR OFFRE.
 * « programme » : 70 000 FCFA — 03 mois (comportement STRICTEMENT
 * identique à l'existant — aucun octet ne change pour le tunnel
 * principal). « prelaunch » : Pré-lancement • De COMPRENDRE à
 * PARLER™ — 15 000 FCFA — 02 mois — première cohorte de 05.
 * Le reçu de pré-lancement respecte le brief : nom EXACT de
 * l'offre, durée, montant réellement payé — SANS inventer de
 * politique de remboursement ni de données de transaction.
 * ============================================================ */
export type OffreId = "programme" | "prelaunch";

type ConfigOffre = {
  /** Ligne DÉSIGNATION du tableau. */
  titre: string;
  /** Montant affiché (espaces insécables). */
  prix: string;
  /** Montant en toutes lettres. */
  montantLettres: string;
  /** Durée affichée dans la colonne droite. */
  duree: string;
  /** Libellé de la ligne durée. */
  dureeLabel: string;
  /** Deux lignes de description sous la désignation. */
  lignes: [string, string];
  /** Titre du bloc inclusions. */
  inclusTitre: string;
  /** Titres des inclusions — grille 3 colonnes, lecture par colonne
   * (règle propriétaire Task 59/62 conservée pour les deux offres). */
  inclus: string[];
  /** Préfixe du n° de reçu : MSE-YYMM-XXXX (programme) /
   * MSE-PL-YYMM-XXXX (pré-lancement — distinguable au premier regard). */
  recuPrefix: string;
  /** Coches « CE QUE CE REÇU CONFIRME ». */
  confirmations: string[];
};

const OFFRES: Record<OffreId, ConfigOffre> = {
  programme: {
    titre: "Programme « De Comprendre à Parler™ »",
    prix: `70${NBSP}000${NBSP}FCFA`,
    montantLettres: "Soixante-dix mille (70 000) francs CFA",
    duree: "03 mois",
    dureeLabel: "DURÉE DU PROGRAMME",
    lignes: [
      "03 mois de coaching d'anglais personnalisé — accompagnement en ligne",
      "Trois séances de 1h30 par semaine  ·  Suivi personnalisé  ·  Exercices entre les séances",
    ],
    inclusTitre: "CE QUE COMPREND LE PROGRAMME",
    inclus: INCLUS.map((item) => item.titre),
    recuPrefix: "MSE",
    confirmations: [
      /* Task 65 : « confirmée » → « terminée » — terminologie alignée
         sur la page Bienvenue (Tasks 63-64). */
      "Votre inscription au programme est terminée et votre place réservée pour 03 mois.",
      "Le règlement intégral de 70 000 FCFA a bien été reçu — aucun autre montant ne vous est demandé.",
      "Votre coaching démarre dans les 03 jours suivant votre prise de contact sur WhatsApp.",
      "Garantie d'engagement : conditions respectées sans expression à 02 mois — remboursement intégral.",
    ],
  },
  prelaunch: {
    /* Brief pré-lancement §6 : nom exact « Pré-lancement • De
       COMPRENDRE à PARLER™ », 02 mois, 15 000 FCFA, 03 séances de
       1h30/semaine, 100 % en ligne, communauté WhatsApp. Aucune
       promesse de maîtrise, aucune politique de remboursement
       inventée (les conditions de l'offre restent à clarifier par
       le propriétaire avant mise en production). */
    titre: "Pré-lancement • De COMPRENDRE à PARLER™",
    prix: `15${NBSP}000${NBSP}FCFA`,
    montantLettres: "Quinze mille (15 000) francs CFA",
    duree: "02 mois",
    dureeLabel: "DURÉE DE L'ACCOMPAGNEMENT",
    lignes: [
      "02 mois d'accompagnement intensif en ligne — première cohorte de pré-lancement",
      "Trois séances de 1h30 par semaine  ·  Exercices pratiques  ·  Communauté WhatsApp",
    ],
    inclusTitre: "CE QUE COMPREND CETTE OFFRE",
    inclus: [
      "Trois séances par semaine",
      "Pratique orale au centre",
      "Exercices pratiques",
      /* QA Task 69 : « Accompagnement pendant deux mois » mesurait
         exactement 164 pt = largeur de colonne (chevauchement avec la
         colonne suivante sur le PDF) — libellé raccourci, même sens
         (mesuré 134,8 pt). */
      "Accompagnement sur 02 mois",
      "Communauté WhatsApp",
      "Formation 100 % en ligne",
    ],
    recuPrefix: "MSE-PL",
    confirmations: [
      "Votre inscription au pré-lancement est terminée et votre place réservée pour 02 mois.",
      "Le règlement intégral de 15 000 FCFA a bien été reçu — aucun autre montant ne vous est demandé pour cette offre.",
      "Les horaires des séances vous seront communiqués dans la communauté WhatsApp de la cohorte.",
      "Cet accompagnement de 02 mois est réservé à la première cohorte du pré-lancement.",
    ],
  },
};

/* Palette */
const INK: [number, number, number] = [26, 26, 30];
const GRAY: [number, number, number] = [107, 107, 115];
const LIGHT: [number, number, number] = [222, 222, 228];
const BLACK: [number, number, number] = [0, 0, 0]; // bandes haute/basse (Task 37 : noir demandé)
const GREEN: [number, number, number] = [0, 128, 0]; // vert pur (cachet)
const BAND: [number, number, number] = [245, 245, 247];

function dateLong(iso: string): string {
  const d = iso ? new Date(iso) : new Date();
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(d);
}
function dateShort(iso: string): string {
  const d = iso ? new Date(iso) : new Date();
  return new Intl.DateTimeFormat("fr-FR").format(d);
}
function dash(v: string): string {
  return v && v.trim() ? v.trim() : "Non renseigné";
}

/**
 * Construit le PDF du reçu (jsPDF vectoriel). Exportée pour les tests
 * Node (rendu/QA) — la page Bienvenue l'appelle une seule fois puis
 * télécharge ET envoie le MÊME blob (téléchargement + copie coach).
 */
export async function buildReceiptPdf(
  data: InscriptionData,
  offre: OffreId = "programme",
): Promise<{ blob: Blob; filename: string }> {
  const { jsPDF, GState } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4", compress: true });

  /* Task 69 : toute la personnalisation par offre passe par cette
     configuration — les coordonnées du document ne bougent pas. */
  const cfg = OFFRES[offre];

  const noRecu = receiptNumberFor(data, offre);
  const emisLe = dateLong("");
  const emisLeCourt = dateShort("");

  /* — Bande noire haute (Task 37 : rouge → noir #000000) — */
  doc.setFillColor(...BLACK);
  doc.rect(0, 0, PAGE_W, 7, "F");

  /* — En-tête — */
  /* Task 38 : « STEVENS AKPOVI » à la MÊME taille que « REÇU DE
     PAIEMENT » (15 pt) — avant 20 pt. */
  doc.setFont("times", "bold");
  doc.setFontSize(15);
  doc.setTextColor(...INK);
  doc.text("STEVENS AKPOVI", M, 56, { charSpace: 2.2 });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...GRAY);
  doc.text("Coach d'anglais professionnel", M, 76);
  doc.setFontSize(8);
  doc.text("stevensakpovi@gmail.com  ·  mrsteveenglish.vercel.app", M, 90);

  doc.setFont("times", "bold");
  doc.setFontSize(15);
  doc.setTextColor(...INK);
  doc.text("REÇU DE PAIEMENT", X_END, 56, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...INK);
  doc.text(`Reçu N° ${noRecu}`, X_END, 74, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...GRAY);
  doc.text(`Émis le ${emisLe}`, X_END, 90, { align: "right" });

  /* — Filet séparateur — */
  doc.setDrawColor(...INK);
  doc.setLineWidth(1.1);
  doc.line(M, 118, X_END, 118);

  /* Task 38 : la ligne verte « PAYÉ — paiement reçu en totalité ·
     Paiement unique » est SUPPRIMÉE (demande propriétaire) — le
     cachet vert plus bas et le badge « Paiement unique » suffisent. */

  /* — REÇU DE / méta — Task 37 : « FACTURÉ À » devient « REÇU DE ».
     La colonne droite est réalignée — jsPDF N'INCLUT PAS charSpace
     dans le calcul de align:"right" (les étiquettes débordaient de
     ~20 pt dans la marge droite) — et espacée régulièrement :
     label→valeur 15 pt, valeur→label suivant 18 pt (avant : 9 pt
     seulement, d'où l'impression de chevauchement). — */
  const labelRight = (t: string, y: number) => {
    // compense le charSpace que jsPDF n'ajoute pas à la largeur d'alignement
    doc.text(t, X_END - (t.length - 1) * 1.2, y, { align: "right", charSpace: 1.2 });
  };
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...GRAY);
  doc.text("REÇU DE", M, 160, { charSpace: 1.2 });
  labelRight("DATE D'INSCRIPTION", 160);

  doc.setFont("times", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...INK);
  doc.text(dash(data.nom), M, 180);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...INK);
  const identite = [
    data.profession.trim(),
    data.age ? `${data.age} ans` : "",
  ]
    .filter(Boolean)
    .join("  ·  ");
  doc.text(dash(identite), M, 197);
  doc.text(
    dash([data.ville, data.pays].filter(Boolean).join(", ")),
    M,
    212,
  );
  doc.text(dash(data.email), M, 227);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...INK);
  doc.text(dateShort(data.dateInscription), X_END, 175, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...GRAY);
  labelRight("MODE DE PAIEMENT", 193);
  labelRight(cfg.dureeLabel, 226);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...INK);
  doc.text("Paiement en ligne sécurisé", X_END, 208, { align: "right" });
  doc.text(cfg.duree, X_END, 241, { align: "right" });

  /* — Tableau : bandeau d'en-têtes — */
  doc.setFillColor(...BAND);
  doc.roundedRect(M, 250, X_END - M, 22, 4, 4, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...GRAY);
  doc.text("DÉSIGNATION", M + 10, 264, { charSpace: 1 });
  doc.text("MONTANT", X_END - 10 - 6, 264, { align: "right", charSpace: 1 }); // -6 : compensation charSpace (alignement droit)

  /* — Ligne principale — */
  doc.setFont("times", "bold");
  doc.setFontSize(12.5);
  doc.setTextColor(...INK);
  doc.text(cfg.titre, M + 10, 292);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(cfg.prix, X_END - 10, 292, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...GRAY);
  doc.text(cfg.lignes[0], M + 10, 307);
  doc.text(cfg.lignes[1], M + 10, 320);

  /* — Les inclusions du programme (Task 52 : source unique
     inclusions.ts ; Task 62 — INSTRUCTION PROPRIÉTAIRE : « Certificat
     de Fin » AJOUTÉ en DERNIER TIRET après « Évaluation finale » —
     la grille affiche désormais les 12 titres complets (le reçu ne
     filtre plus la carte `certificat: true`) ; 3 colonnes × 4
     rangées (grille PLEINE : 12 items — la 4e rangée de la 3e
     colonne, libérée depuis la Task 53, accueille le certificat),
     mêmes positions verticales que l'ancienne grille → aucun
     décalage des zones situées en dessous).
     Retour propriétaire (conservé) : LECTURE PAR COLONNE — la liste
     se remplit de HAUT EN BAS dans la 1re colonne, puis la suite
     de haut en bas dans la 2e, puis la 3e (et NON de gauche à
     droite par ligne). — */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...GRAY);
  doc.text(cfg.inclusTitre, M + 10, 344, { charSpace: 1 });

  /* Task 62 : les 12 titres COMPLETS de la source unique —
     « Certificat de Fin » (carte 12, `certificat: true`) clôt le
     reçu en dernier tiret, juste après « Évaluation finale »
     (l'évaluation précède toujours le certificat — Task 61) ;
     les listes du site (accueil, page Programme) continuent de
     filtrer le certificat via VALUE_STACK. */
  const inclus = cfg.inclus;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...INK);
  /* Nb de rangées par colonne (12 items / 3 colonnes → 4 rangées ;
     calcul dynamique : reste correct si la liste change). */
  const rows = Math.ceil(inclus.length / 3);
  inclus.forEach((item, i) => {
    const col = Math.floor(i / rows);
    const row = i % rows;
    const x = M + 10 + col * 164;
    const y = 362 + row * 15;
    doc.text(`—  ${item}`, x, y);
  });

  /* — Ligne « aucun autre frais » — */
  doc.setDrawColor(...LIGHT);
  doc.setLineWidth(0.8);
  doc.line(M + 10, 428, X_END - 10, 428);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(...GRAY);
  doc.text(
    "Aucun autre frais — pas d'abonnement, pas de paiement mensuel, pas de frais cachés.",
    M + 10,
    444,
  );
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...GREEN);
  /* Task 38 : « Inclus » devient « Paiement unique » (toujours vert
     pur) — rappelle le régime de paiement au même niveau que la
     mention « aucun autre frais ». */
  doc.text("Paiement unique", X_END - 10, 444, { align: "right" });
  doc.setDrawColor(...LIGHT);
  doc.line(M + 10, 456, X_END - 10, 456);

  /* — Totaux (droite) + montant en lettres (gauche) — */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...GRAY);
  doc.text("MONTANT EN LETTRES", M, 476, { charSpace: 1 });

  doc.setFont("helvetica", "italic");
  doc.setFontSize(9.5);
  doc.setTextColor(...INK);
  doc.text(cfg.montantLettres, M, 492);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...GRAY);
  doc.text("Sous-total", X_END - 120, 476, { align: "right" });
  doc.text("TVA", X_END - 120, 492, { align: "right" });
  doc.setTextColor(...INK);
  doc.text(cfg.prix, X_END, 476, { align: "right" });
  doc.text("Non applicable", X_END, 492, { align: "right" });

  doc.setDrawColor(...INK);
  doc.setLineWidth(1);
  doc.line(X_END - 190, 502, X_END, 502);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...INK);
  doc.text("TOTAL PAYÉ", X_END - 120, 520, { align: "right" });
  doc.setFont("times", "bold");
  doc.setFontSize(15);
  doc.text(cfg.prix, X_END, 520, { align: "right" });

  /* — CACHET « PAYÉ » OBLIQUE EN VERT PUR — double cadre + date,
     légère transparence d'encre. Bande dédiée centrée sous les
     totaux : il ne masque AUCUNE ligne (leçon QA Task 34 : chevaucher
     les totaux « coupe » visuellement la phrase des frais). — */
  /* Task 38 : cachet décalé de 570 → 580 pt — avec l'inclinaison
     MONTANTE, le coin supérieur droit du cadre remonte désormais à
     y≈530 pt ; à 570 il frôlait le texte « TOTAL PAYÉ » (≈8 pt) alors
     qu'avant (Task 37, descendant) le coin haut était côté gauche,
     dans une zone vide. À 580 : ≥10 pt sous « TOTAL PAYÉ », ≥16 pt
     au-dessus du titre « CE QUE CE REÇU CONFIRME », et le cachet
     reste centré dans sa bande dédiée sous les totaux. */
  const stampCx = PAGE_W / 2;
  /* Task 39 : DEUX centres distincts —
     • stampCy (580) : l'AXE D'ANCRAGE DU TEXTE. La date y reste
       EXACTEMENT au même point qu'avant (baseline v=+21,5) : « ne pas
       toucher à la date » (instruction propriétaire) ;
     • stampFrameCy (582,75 = 580+2,75) : le centre du CADRE, descendu
       de δ=Δ/2+0,25 (Δ=5) pour que le bloc d'encre PAYÉ+date reste
       centré dans le cadre après le rapprochement de PAYÉ. */
  const stampCy = 580;
  const stampFrameCy = 582.75;
  const stampW = 150;
  const stampH = 58;
  /* Task 38 : angle NÉGATIF — le cachet monte désormais de la gauche
     (bas) vers la droite (haut) « / » (avant : descendant « \ »).
     Conventions opposées cadre/texte conservées (cf. Task 37) :
     corner() lit l'angle tel quel, jsPDF text() reçoit -angle. */
  const angle = -17;
  const rad = (angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  doc.saveGraphicsState();
  try {
    doc.setGState(new GState({ opacity: 0.92 }));
  } catch {
    /* GState indisponible : cachet plein — acceptable */
  }
  const corner = (dx: number, dy: number): [number, number] => [
    stampCx + dx * cos - dy * sin,
    stampFrameCy + dx * sin + dy * cos,
  ];
  const drawRotRect = (w: number, h: number, lw: number) => {
    const hw = w / 2;
    const hh = h / 2;
    const p1 = corner(-hw, -hh);
    const p2 = corner(hw, -hh);
    const p3 = corner(hw, hh);
    const p4 = corner(-hw, hh);
    doc.setDrawColor(...GREEN);
    doc.setLineWidth(lw);
    doc.line(p1[0], p1[1], p2[0], p2[1]);
    doc.line(p2[0], p2[1], p3[0], p3[1]);
    doc.line(p3[0], p3[1], p4[0], p4[1]);
    doc.line(p4[0], p4[1], p1[0], p1[1]);
  };
  drawRotRect(stampW, stampH, 2.4);
  drawRotRect(stampW - 9, stampH - 9, 0.9);
  doc.setFont("times", "bold");
  doc.setFontSize(38);
  doc.setTextColor(...GREEN);
  /* Task 38 — CENTRAGE RÉEL (bug jsPDF compensé) : l'option
     align:"center" + angle applique le décalage de centrage sur x
     SEULEMENT, dans l'espace NON tourné — le texte incliné atterrit
     donc (w/2)·sin(17°) TROP HAUT (≈16 pt pour PAYÉ, ≈8 pt pour la
     date ; dans la version Task 37 le sens inversé le poussait vers
     le BAS, la date chevauchait le trait inférieur). Preuve : matrices
     Tm du PDF (origine = ancre x − w/2 à la MÊME hauteur y) + mesure
     pixel. On calcule donc l'ancre pour que le CENTRE de chaque texte
     atterrisse exactement au point (u=0, v=cible) du repère du cadre.
     Task 39 — RAPPROCHEMENT : baseline PAYÉ v=+6 → v=+11 (Δ=5 pt vers
     le bas) : écart d'encre PAYÉ→date 9,9 → 4,9 pt et l'accent du É
     cesse de frôler le bord haut (dégagement interne 3,0 → 5,3 pt).
     La date reste à v=+21,5 SUR L'AXE stampCy=580 — INCHANGÉE au
     pixel près ; seul le CADRE descend (stampFrameCy). */
  const tilt = (-angle * Math.PI) / 180; // +17° : pente VISUELLE montante « / »
  const stampAnchor = (vt: number, w: number): [number, number] => [
    stampCx + vt * Math.sin(tilt) + (w / 2) * (1 - Math.cos(tilt)),
    stampCy + vt * Math.cos(tilt) + (w / 2) * Math.sin(tilt),
  ];
  const textePaye = "PAYÉ";
  const [axPaye, ayPaye] = stampAnchor(11, doc.getTextWidth(textePaye));
  doc.text(textePaye, axPaye, ayPaye, { align: "center", angle: -angle });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  const texteDate = `le ${emisLeCourt}`;
  const [axDate, ayDate] = stampAnchor(21.5, doc.getTextWidth(texteDate));
  doc.text(texteDate, axDate, ayDate, {
    align: "center",
    angle: -angle,
  });
  doc.restoreGraphicsState();

  /* — CE QUE CE REÇU CONFIRME (coches vertes dessinées) — */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...GRAY);
  doc.text("CE QUE CE REÇU CONFIRME", M, 646, { charSpace: 1.2 });

  /* Task 69 : confirmations paramétrées par offre (aucune politique
     de remboursement inventée pour le pré-lancement). */
  const confirmations = cfg.confirmations;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...INK);
  confirmations.forEach((line, i) => {
    const y = 664 + i * 17;
    // coche verte (deux traits)
    doc.setDrawColor(...GREEN);
    doc.setLineWidth(1.3);
    doc.line(M, y - 3, M + 3.2, y + 0.5);
    doc.line(M + 3.2, y + 0.5, M + 8.5, y - 6.5);
    doc.text(line, M + 16, y);
  });

  /* — Task 37 : bloc signature SUPPRIMÉ à la demande du propriétaire
     (« Pour Mr Steve English », le trait, « Coach Stevens »,
     « Stevens AKPOVI — Fondateur, Mr Steve English ») — le pied de
     page électronique ci-dessous suffit. — */

  /* — Pied de page — */
  doc.setDrawColor(...LIGHT);
  doc.setLineWidth(0.8);
  doc.line(M, 786, X_END, 786);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...GRAY);
  const genLe = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date());
  doc.text(
    `Document généré électroniquement le ${genLe} — valable sans signature manuscrite.`,
    PAGE_W / 2,
    798,
    { align: "center" },
  );
  doc.text(
    `© ${new Date().getFullYear()} Stevens AKPOVI · mrsteveenglish.vercel.app · ${INSCRIPTION_EMAIL}`,
    PAGE_W / 2,
    809,
    { align: "center" },
  );

  /* — Bande noire basse (symétrie) — */
  doc.setFillColor(...BLACK);
  doc.rect(0, PAGE_H - 6, PAGE_W, 6, "F");

  /* — Nom de fichier (Task 46 — retour propriétaire) : doit contenir
     « Reçu », le NUMÉRO de reçu et le nom du client — ex.
     « Reçu N° MSE-2609-Z3KP — Jean-Baptiste Nkemba.pdf », le même
     libellé que l'en-tête du document (« Reçu N° MSE-… »). Les
     accents sont CONSERVÉS (noms de fichiers UTF-8 gérés par tous
     les navigateurs et OS modernes ; pièce jointe livrée avec ce
     format par l'endpoint classique — TESTS D/E Task 44) ; seuls les
     caractères interdits sur les systèmes de fichiers
     ( / \ : * ? " < > | et contrôles ) sont retirés du nom du client.
     Le n° de reçu (MSE-YYMM-XXXX, déterministe) ne contient que des
     caractères sûrs (lettres, chiffres, tirets). Ce nom unique sert
     aux TROIS usages : téléchargement client, pièce jointe de
     l'email au coach, mention « (fichier « … ») » dans le message. — */
  const nomFichier =
    data.nom
      .replace(/[\u0000-\u001f\\/:*?"<>|]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 60) || "Client";
  const filename = `Reçu N° ${noRecu} — ${nomFichier}.pdf`;

  return { blob: doc.output("blob"), filename };
}

/** Enregistre dans le navigateur du client un blob PDF déjà construit
 *  (le même blob peut être envoyé au coach — Task 43). */
export function saveReceiptBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

/**
 * Copie envoyée au coach AU MÊME INSTANT que le téléchargement
 * (instruction propriétaire Task 34, revue Task 43 puis Task 44) :
 * LE REÇU PDF LUI-MÊME en PIÈCE JOINTE — le MÊME blob que celui
 * téléchargé par le client, donc strictement identique octet pour
 * octet — accompagné d'un MESSAGE PROFESSIONNEL : le système
 * s'adresse au Coach pour l'informer qu'un nouveau client vient de
 * s'inscrire, lui transmet les informations du client (identité,
 * localisation, e-mail) et les détails du paiement, et signale que
 * le reçu de paiement est joint à l'e-mail. Message rédigé avec
 * retours à la ligne et structure nette — SANS tableau (le champ
 * unique « MESSAGE » est rendu par le modèle « basic » de
 * FormSubmit, le plus sobre des trois).
 *
 * Task 44 — CORRECTIF PIÈCE JOINTE : l'endpoint AJAX de FormSubmit
 * ABANDONNE silencieusement les fichiers (doc officielle : l'upload
 * n'est documenté que pour l'endpoint classique en
 * multipart/form-data ; vérifié empiriquement — le flux réel ne
 * livrait que le message, sans PDF). On poste donc sur l'endpoint
 * CLASSIQUE https://formsubmit.co/{email} en mode « no-cors »
 * (requête simple, sans preflight) : la soumission est traitée et
 * l'email part AVEC la pièce jointe ; la réponse (page de
 * remerciement) est simplement illisible côté JS — fire-and-forget
 * assumé, le téléchargement par blob ne quitte jamais la page donc
 * la requête a le temps de partir.
 */
export function sendReceiptPdfCopy(
  blob: Blob,
  filename: string,
  data: InscriptionData,
  receiptNo: string,
  offre: OffreId = "programme",
): void {
  const emisLe = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date());
  const nom = data.nom?.trim() || "Client";
  const renseigne = (v: string, suffixe = "") =>
    v && v.trim() ? `${v.trim()}${suffixe}` : "Non renseigné";

  /* Task 69 : le message au coach identifie clairement l'OFFRE
     concernée — le coach distingue immédiatement un client du
     PROGRAMME principal (70 000 FCFA — 03 mois) d'un participant du
     PRÉ-LANCEMENT (15 000 FCFA — 02 mois — première cohorte). */
  const estPrelaunch = offre === "prelaunch";
  const annonce = estPrelaunch
    ? "Un participant de la PREMIÈRE COHORTE DE PRÉ-LANCEMENT vient de finaliser son inscription au « Pré-lancement • De COMPRENDRE à PARLER™ » (02 mois — 15 000 FCFA). Son paiement a été effectué et validé."
    : "Un nouveau client vient de finaliser son inscription au programme d'accompagnement « De Comprendre à Parler™ » (03 mois). Son paiement a été effectué et validé.";
  const ligneMontant = estPrelaunch
    ? `Montant : 15${NBSP}000${NBSP}FCFA (paiement unique — offre de pré-lancement)`
    : `Montant : 70${NBSP}000${NBSP}FCFA (paiement unique)`;
  const etapeSuivante = estPrelaunch
    ? "Le client a été invité à rejoindre la communauté WhatsApp dédiée à la cohorte de pré-lancement."
    : "Le client a été invité à vous contacter sur WhatsApp pour planifier le démarrage de son accompagnement.";

  /* Message professionnel « système → Coach » : salutation,
     annonce du nouveau client, coordonnées, détails du paiement,
     pièce jointe signalée, prochaine étape, signature. Chaque
     paragraphe est séparé par une ligne vide. */
  const message = [
    "Bonjour Coach Stevens,",
    "",
    annonce,
    "",
    "Voici les informations du client :",
    "",
    `Nom : ${nom}`,
    `Profession : ${renseigne(data.profession)}`,
    `Âge : ${renseigne(data.age, " ans")}`,
    `Pays : ${renseigne(data.pays)}`,
    `Ville : ${renseigne(data.ville)}`,
    `Adresse e-mail : ${renseigne(data.email)}`,
    "",
    "Détails du paiement :",
    "",
    ligneMontant,
    "Mode de paiement : Paiement en ligne sécurisé",
    `Date d'inscription : ${dateLong(data.dateInscription)}`,
    `Reçu N° ${receiptNo} — émis le ${emisLe}`,
    "",
    `Vous trouverez le reçu de paiement du client en pièce jointe de cet e-mail (fichier « ${filename} »).`,
    "",
    etapeSuivante,
    "",
    "Cordialement,",
    "Le système Mr Steve English",
  ].join("\n");

  const fd = new FormData();
  fd.set(
    "_subject",
    estPrelaunch
      ? `Nouveau participant PRÉ-LANCEMENT — ${nom} — Reçu ${receiptNo} en pièce jointe`
      : `Nouveau client — ${nom} — Reçu ${receiptNo} en pièce jointe`,
  );
  fd.set("_template", "basic");
  fd.set("_captcha", "false");
  if (data.email?.trim()) fd.set("_replyto", data.email.trim());
  fd.set("MESSAGE", message);
  fd.set("file", new File([blob], filename, { type: "application/pdf" }));
  try {
    void fetch(FORMSUBMIT_ENDPOINT, {
      method: "POST",
      body: fd,
      mode: "no-cors",
    }).catch(() => {
      /* fire-and-forget : silencieux côté client */
    });
  } catch {
    /* silencieux — le client ne doit jamais voir d'erreur */
  }
}
