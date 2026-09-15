import { CONTACT_EMAIL, FORMSUBMIT_AJAX } from "./contact-email";

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
 * supprimée — badge vert « Paiement unique » (ex-« Inclus »)).
 *
 * Le client qui arrive sur #/bienvenue après son paiement peut
 * télécharger un reçu PDF TRÈS haute qualité : A4 vectoriel,
 * typographie soignée (Times + Helvetica), palette sobre (encre,
 * bandes noires), cachet « PAYÉ » OBLIQUE en VERT PUR (rgb(0,128,0)),
 * personnalisé avec ses données (nom, email, profession, ville, pays,
 * date d'inscription, n° de reçu déterministe).
 *
 * AU MÊME INSTANT que le téléchargement, une COPIE du reçu est envoyée
 * automatiquement à stevensakpovi@gmail.com (FormSubmit AJAX — même
 * mécanisme éprouvé que le formulaire de contact, fire-and-forget avec
 * keepalive pour survivre au dialogue de téléchargement).
 *
 * PERF : jsPDF (~120 Ko gz) est importé DYNAMIQUEMENT au clic — le
 * bundle initial du site n'est pas alourdi (leçon Task 33).
 */

/* — Données d'inscription persistées par le formulaire de contact — */
export type InscriptionData = {
  nom: string;
  age: string;
  profession: string;
  email: string;
  pays: string;
  ville: string;
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

/* — N° de reçu déterministe : MSE-YYMM-XXXX (stable au re-téléchargement) — */
export function receiptNumberFor(d: InscriptionData): string {
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
  return `MSE-${ym}-${code}`;
}

/* — Constantes du document — */
const M = 46; // marge gauche/droite (pt)
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const X_END = PAGE_W - M; // 549.28
const NBSP = "\u00A0";
const PRIX = `70${NBSP}000${NBSP}FCFA`;
const PROGRAMME_TITRE = "Programme « De Comprendre à Parler »";
const MONTANT_LETTRES = "Soixante-dix mille (70 000) francs CFA";

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
 * Node (rendu/QA) — le navigateur passe par downloadReceipt().
 */
export async function buildReceiptPdf(
  data: InscriptionData,
): Promise<{ blob: Blob; filename: string }> {
  const { jsPDF, GState } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4", compress: true });

  const noRecu = receiptNumberFor(data);
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
  labelRight("DURÉE DU PROGRAMME", 226);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...INK);
  doc.text("Paiement en ligne sécurisé", X_END, 208, { align: "right" });
  doc.text("03 mois", X_END, 241, { align: "right" });

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
  doc.text(PROGRAMME_TITRE, M + 10, 292);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(PRIX, X_END - 10, 292, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...GRAY);
  doc.text(
    "03 mois de coaching d'anglais personnalisé — accompagnement en ligne",
    M + 10,
    307,
  );
  doc.text(
    "Trois séances de 1h30 par semaine  ·  Suivi personnalisé  ·  Exercices entre les séances",
    M + 10,
    320,
  );

  /* — Les 8 inclusions (2 colonnes × 4) — */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...GRAY);
  doc.text("CE QUE COMPREND LE PROGRAMME", M + 10, 344, { charSpace: 1 });

  const inclus = [
    "Coaching personnalisé",
    "Speaking & Conversation",
    "Prononciation",
    "Vocabulaire & Expressions",
    "Exercices personnalisés",
    "Suivi de progression",
    "Confiance & Fluidité",
    "Podcasts & Ressources",
  ];
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...INK);
  inclus.forEach((item, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = col === 0 ? M + 10 : M + 262;
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
  doc.text(MONTANT_LETTRES, M, 492);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...GRAY);
  doc.text("Sous-total", X_END - 120, 476, { align: "right" });
  doc.text("TVA", X_END - 120, 492, { align: "right" });
  doc.setTextColor(...INK);
  doc.text(PRIX, X_END, 476, { align: "right" });
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
  doc.text(PRIX, X_END, 520, { align: "right" });

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
  const stampCy = 580;
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
    stampCy + dx * sin + dy * cos,
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
     atterrisse exactement au point (u=0, v=cible) du repère du cadre :
     baselines v=+6 (PAYÉ) et v=+21,5 (date) → bloc d'encre
     [−21,9 ; +21,5] centré à −0,2 pt, marges internes ≈2,6/3 pt,
     écart PAYÉ→date 9 pt. */
  const tilt = (-angle * Math.PI) / 180; // +17° : pente VISUELLE montante « / »
  const stampAnchor = (vt: number, w: number): [number, number] => [
    stampCx + vt * Math.sin(tilt) + (w / 2) * (1 - Math.cos(tilt)),
    stampCy + vt * Math.cos(tilt) + (w / 2) * Math.sin(tilt),
  ];
  const textePaye = "PAYÉ";
  const [axPaye, ayPaye] = stampAnchor(6, doc.getTextWidth(textePaye));
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

  const confirmations = [
    "Votre inscription au programme est confirmée et votre place réservée pour 03 mois.",
    "Le règlement intégral de 70 000 FCFA a bien été reçu — aucun autre montant ne vous est demandé.",
    "Votre coaching démarre dans les 03 jours suivant votre prise de contact sur WhatsApp.",
    "Garantie d'engagement : conditions respectées sans expression à 02 mois — remboursement intégral.",
  ];
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
    `© ${new Date().getFullYear()} Stevens AKPOVI · mrsteveenglish.vercel.app · ${CONTACT_EMAIL}`,
    PAGE_W / 2,
    809,
    { align: "center" },
  );

  /* — Bande noire basse (symétrie) — */
  doc.setFillColor(...BLACK);
  doc.rect(0, PAGE_H - 6, PAGE_W, 6, "F");

  /* — Nom de fichier (Task 38) : doit contenir « Reçu » et le nom du
     client — ex. « Reçu Jean-Baptiste Nkemba.pdf ». Les accents sont
     CONSERVÉS (noms de fichiers UTF-8 gérés par tous les navigateurs
     et OS modernes) ; seuls les caractères interdits sur les systèmes
     de fichiers ( / \ : * ? " < > | et contrôles ) sont retirés. — */
  const nomFichier =
    data.nom
      .replace(/[\u0000-\u001f\\/:*?"<>|]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 60) || "Client";
  const filename = `Reçu ${nomFichier}.pdf`;

  return { blob: doc.output("blob"), filename };
}

/** Télécharge le reçu PDF dans le navigateur. */
export async function downloadReceipt(data: InscriptionData): Promise<string> {
  const { blob, filename } = await buildReceiptPdf(data);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
  return filename;
}

/**
 * Copie automatique envoyée au coach AU MÊME INSTANT que le
 * téléchargement (instruction propriétaire Task 34) — fire-and-forget
 * avec keepalive : la requête survit même si le dialogue
 * d'enregistrement interrompt la page.
 */
export function sendReceiptCopyEmail(
  data: InscriptionData,
  receiptNo: string,
): void {
  const now = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date());
  const fields: Record<string, string> = {
    _subject: `Reçu PDF téléchargé — ${data.nom || "Client"} — ${receiptNo}`,
    _template: "table",
    _captcha: "false",
    "REÇU · Numéro": receiptNo,
    "CLIENT · Nom complet": dash(data.nom),
    "CLIENT · Email": dash(data.email),
    "CLIENT · Identité": dash(
      [data.profession, data.age ? `${data.age} ans` : ""]
        .filter(Boolean)
        .join(" · "),
    ),
    "CLIENT · Localisation": dash(
      [data.ville, data.pays].filter(Boolean).join(", "),
    ),
    "PROGRAMME · Offre": "« De Comprendre à Parler » — 03 mois",
    "MONTANT": "70 000 FCFA — paiement unique",
    "TÉLÉCHARGEMENT · Date et heure": now,
    "PROVENANCE":
      "Page post-paiement (bienvenue) — le client vient de télécharger son reçu PDF",
  };
  try {
    void fetch(FORMSUBMIT_AJAX, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(fields),
      keepalive: true,
    }).catch(() => {
      /* fire-and-forget : silencieux côté client */
    });
  } catch {
    /* silencieux — le client ne doit jamais voir d'erreur */
  }
}
