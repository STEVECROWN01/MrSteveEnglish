import { PAYS_VILLES } from "./pays-villes";

/**
 * INDICATIFS TÉLÉPHONIQUES & VALIDATION DU NUMÉRO WHATSAPP DU PROSPECT
 * (Task 49 — instruction propriétaire).
 *
 * Le formulaire demande désormais le numéro WhatsApp du prospect juste
 * après le pays et la ville. Comme le prospect a DÉJÀ sélectionné son
 * pays, l'indicatif international (+229, +225, +237…) est déduit
 * automatiquement et affiché comme PRÉFIXE du champ — le prospect ne
 * tape que son numéro local, et la saisie est validée selon les
 * longueurs usuelles du pays.
 *
 * • INDICATIFS : code ISO 3166-1 alpha-2 → indicatif ITU E.164 (sans
 *   le « + ») pour les ~196 pays de PAYS_VILLES.
 * • LONGUEURS : nombre de chiffres attendus pour le numéro LOCAL
 *   (sans l'indicatif) — cartographie fine de l'Afrique de l'Ouest,
 *   d'Afrique centrale, du Maghreb et de la France (public du site),
 *   grandes destinations du reste du monde ; repli [6, 12] ailleurs.
 *   Certains pays vivent une transition de numérotation (ex. Bénin :
 *   8 chiffres historiques, 10 chiffres depuis 2021) → plages.
 */

export const INDICATIFS: Record<string, string> = {
  af: "93", za: "27", al: "355", dz: "213", de: "49", ad: "376",
  ao: "244", ag: "1268", sa: "966", ar: "54", am: "374", au: "61",
  at: "43", az: "994", bs: "1242", bh: "973", bd: "880", bb: "1246",
  be: "32", bz: "501", bj: "229", bt: "975", by: "375", mm: "95",
  bo: "591", ba: "387", bw: "267", br: "55", bn: "673", bg: "359",
  bf: "226", bi: "257", kh: "855", cm: "237", ca: "1", cv: "238",
  cl: "56", cn: "86", cy: "357", co: "57", km: "269", cg: "242",
  cd: "243", kp: "850", kr: "82", cr: "506", ci: "225", hr: "385",
  cu: "53", dk: "45", dj: "253", dm: "1767", eg: "20", ae: "971",
  ec: "593", er: "291", es: "34", ee: "372", sz: "268", us: "1",
  et: "251", fj: "679", fi: "358", fr: "33", ga: "241", gm: "220",
  ge: "995", gh: "233", gr: "30", gd: "1473", gn: "224", gw: "245",
  gq: "240", gy: "592", ht: "509", hn: "504", hu: "36", mh: "692",
  sb: "677", in: "91", id: "62", iq: "964", ir: "98", ie: "353",
  is: "354", il: "972", it: "39", jm: "1876", jp: "81", jo: "962",
  kz: "7", ke: "254", kg: "996", ki: "686", kw: "965", la: "856",
  ls: "266", lv: "371", lb: "961", lr: "231", ly: "218", li: "423",
  lt: "370", lu: "352", mk: "389", mg: "261", my: "60", mw: "265",
  mv: "960", ml: "223", mt: "356", ma: "212", mu: "230", mr: "222",
  mx: "52", fm: "691", md: "373", mc: "377", mn: "976", me: "382",
  mz: "258", na: "264", nr: "674", np: "977", ni: "505", ne: "227",
  ng: "234", no: "47", nz: "64", om: "968", ug: "256", uz: "998",
  pk: "92", pw: "680", ps: "970", pa: "507", pg: "675", py: "595",
  nl: "31", pe: "51", ph: "63", pl: "48", pt: "351", qa: "974",
  cf: "236", do: "1809", cz: "420", ro: "40", gb: "44", ru: "7",
  rw: "250", kn: "1869", sm: "378", vc: "1784", lc: "1758", sv: "503",
  ws: "685", st: "239", sn: "221", rs: "381", sc: "248", sl: "232",
  sg: "65", sk: "421", si: "386", so: "252", sd: "249", ss: "211",
  lk: "94", se: "46", ch: "41", sr: "597", sy: "963", tj: "992",
  tz: "255", td: "235", th: "66", tl: "670", tg: "228", to: "676",
  tt: "1868", tn: "216", tm: "993", tr: "90", tv: "688", ua: "380",
  uy: "598", vu: "678", va: "379", ve: "58", vn: "84", ye: "967",
  zm: "260", zw: "263",
};

/**
 * Longueurs usuelles du numéro LOCAL (chiffres, hors indicatif) :
 * [min, max]. Les pays non listés utilisent le repli [6, 12].
 * Focus : Afrique de l'Ouest / centrale (public du site), Maghreb,
 * océan Indien, France, Belgique, Amérique du Nord, grandes
 * destinations internationales.
 */
export const LONGUEURS: Record<string, [number, number]> = {
  // Afrique de l'Ouest
  bj: [8, 10], // Bénin — 8 chiffres historiques, 10 depuis 2021 (le 0 initial fait partie du numéro)
  tg: [8, 8], ci: [8, 10], sn: [7, 9], bf: [8, 8], ml: [8, 8],
  ne: [8, 8], gn: [8, 9], gw: [7, 7], gm: [7, 7], sl: [8, 8],
  lr: [7, 8], gh: [9, 9], ng: [10, 10],
  // Afrique centrale
  cm: [9, 9], ga: [7, 8], cg: [9, 9], cd: [9, 9], td: [8, 8],
  cf: [8, 8], gq: [9, 9], st: [7, 7],
  // Maghreb & Égypte
  ma: [9, 9], dz: [9, 9], tn: [8, 8], ly: [9, 10], mr: [8, 8],
  eg: [10, 10],
  // Afrique de l'Est & australe (public diaspora)
  rw: [9, 9], mu: [7, 8], mg: [9, 9], km: [7, 7], sc: [7, 7],
  dj: [8, 8], na: [9, 9], ao: [9, 9], zm: [9, 9], zw: [9, 9],
  mz: [9, 9], sd: [9, 9], ss: [9, 9],
  // Amériques (diaspora)
  fr: [9, 9], be: [8, 9], ca: [10, 10], us: [10, 10], ht: [8, 8],
  // Grandes destinations internationales
  gb: [10, 10], es: [9, 9], it: [9, 10], pt: [9, 9], nl: [9, 9],
  ch: [9, 9], cn: [11, 11], in: [10, 10], ru: [10, 10],
  ua: [9, 9], tr: [10, 10], sa: [9, 9], ae: [9, 9], qa: [8, 8],
  kw: [8, 8], il: [9, 9], pk: [10, 10], bd: [10, 10], jp: [10, 10],
  kr: [9, 10], br: [10, 11], mx: [10, 10], ar: [10, 10],
  co: [10, 10], pe: [9, 9], ve: [10, 10], cl: [9, 9], do: [10, 10],
  cu: [8, 8],
};

/** Longueur de repli quand le pays n'est pas dans LONGUEURS. */
const REPLI: [number, number] = [6, 12];

/**
 * Pays dont le numéro NATIONAL commence par un « 0 » INTÉGRÉ (le « 0 »
 * fait partie du numéro E.164) : Bénin et Côte d'Ivoire (passage à 10
 * chiffres en 2021), Congo-Brazzaville, Gabon. Pour TOUS les autres
 * pays, un « 0 » initial saisi est un préfixe tronc (numérotation
 * nationale) à RETIRER : France « 06… » → « 6… », Nigeria « 0803… » →
 * « 803… », Maroc « 0661… » → « 661… » (E.164 n'inclut jamais le tronc).
 * (Task 49-ter)
 */
const ZERO_NATIONAL = new Set(["bj", "ci", "cg", "ga"]);

/**
 * FORMAT DU NUMÉRO PAR PAYS (Task 49-ter — instruction propriétaire :
 * le placeholder ET le numéro affiché s'adaptent au format du pays).
 * • groupes : découpage du numéro local pour l'affichage espacé,
 *   progressif pendant la frappe (ex. Sénégal [2,3,2,2] →
 *   « 77 123 45 67 », Bénin [2,2,2,2,2] → « 01 96 12 34 56 ») ;
 * • exemple : numéro d'exemple RÉALISTE pour le placeholder du champ.
 * Les pays non listés utilisent le repli par paires.
 */
export const FORMATS: Record<string, { groupes: number[]; exemple: string }> = {
  // Afrique de l'Ouest (public principal)
  bj: { groupes: [2, 2, 2, 2, 2], exemple: "01 96 12 34 56" },
  tg: { groupes: [2, 2, 2, 2], exemple: "90 12 34 56" },
  ci: { groupes: [2, 2, 2, 2, 2], exemple: "01 02 34 56 78" },
  sn: { groupes: [2, 3, 2, 2], exemple: "77 123 45 67" },
  bf: { groupes: [2, 2, 2, 2], exemple: "70 12 34 56" },
  ml: { groupes: [2, 2, 2, 2], exemple: "76 12 34 56" },
  ne: { groupes: [2, 2, 2, 2], exemple: "90 12 34 56" },
  gn: { groupes: [3, 2, 2, 2], exemple: "620 12 34 56" },
  gw: { groupes: [3, 2, 2], exemple: "955 12 34" },
  gm: { groupes: [3, 2, 2], exemple: "776 12 34" },
  sl: { groupes: [2, 2, 2, 2], exemple: "76 12 34 56" },
  lr: { groupes: [3, 2, 2], exemple: "776 12 34" },
  gh: { groupes: [2, 3, 4], exemple: "24 123 4567" },
  ng: { groupes: [3, 3, 4], exemple: "803 123 4567" },
  // Afrique centrale
  cm: { groupes: [3, 2, 2, 2], exemple: "690 12 34 56" },
  ga: { groupes: [2, 2, 2, 2], exemple: "06 12 34 56" },
  cg: { groupes: [2, 3, 2, 2], exemple: "06 123 45 67" },
  cd: { groupes: [2, 3, 4], exemple: "81 234 5678" },
  td: { groupes: [2, 2, 2, 2], exemple: "66 12 34 56" },
  cf: { groupes: [2, 2, 2, 2], exemple: "70 12 34 56" },
  gq: { groupes: [3, 2, 2, 2], exemple: "222 12 34 56" },
  st: { groupes: [3, 2, 2], exemple: "981 23 45" },
  // Maghreb & Égypte
  ma: { groupes: [3, 2, 2, 2], exemple: "661 12 34 56" },
  dz: { groupes: [3, 2, 2, 2], exemple: "661 12 34 56" },
  tn: { groupes: [2, 3, 3], exemple: "98 123 456" },
  ly: { groupes: [2, 4, 4], exemple: "91 1234 5678" },
  mr: { groupes: [2, 2, 2, 2], exemple: "22 12 34 56" },
  eg: { groupes: [3, 3, 4], exemple: "100 123 4567" },
  // Afrique de l'Est & australe (diaspora)
  rw: { groupes: [3, 3, 3], exemple: "788 123 456" },
  mu: { groupes: [4, 4], exemple: "5123 4567" },
  mg: { groupes: [2, 3, 2, 2], exemple: "34 123 45 67" },
  km: { groupes: [3, 2, 2], exemple: "321 23 45" },
  sc: { groupes: [1, 3, 3], exemple: "4 123 456" },
  dj: { groupes: [2, 2, 2, 2], exemple: "77 12 34 56" },
  na: { groupes: [2, 3, 4], exemple: "81 123 4567" },
  ao: { groupes: [3, 2, 2, 2], exemple: "923 12 34 56" },
  zm: { groupes: [2, 3, 4], exemple: "97 123 4567" },
  zw: { groupes: [2, 3, 4], exemple: "77 123 4567" },
  mz: { groupes: [2, 3, 4], exemple: "84 123 4567" },
  sd: { groupes: [2, 3, 4], exemple: "91 123 4567" },
  ss: { groupes: [2, 3, 4], exemple: "97 123 4567" },
  // France & Amériques (diaspora)
  fr: { groupes: [1, 2, 2, 2, 2], exemple: "6 12 34 56 78" },
  be: { groupes: [3, 2, 2, 2], exemple: "470 12 34 56" },
  ca: { groupes: [3, 3, 4], exemple: "438 123 4567" },
  us: { groupes: [3, 3, 4], exemple: "415 555 1234" },
  ht: { groupes: [4, 4], exemple: "3491 1234" },
  // Grandes destinations internationales
  gb: { groupes: [4, 6], exemple: "7400 123456" },
  es: { groupes: [3, 3, 3], exemple: "612 345 678" },
  it: { groupes: [3, 3, 4], exemple: "345 123 4567" },
  pt: { groupes: [3, 3, 3], exemple: "912 345 678" },
  nl: { groupes: [1, 4, 4], exemple: "6 1234 5678" },
  ch: { groupes: [2, 3, 2, 2], exemple: "79 123 45 67" },
  cn: { groupes: [3, 4, 4], exemple: "139 1234 5678" },
  in: { groupes: [5, 5], exemple: "98765 43210" },
  ru: { groupes: [3, 3, 2, 2], exemple: "901 234 56 78" },
  ua: { groupes: [2, 3, 2, 2], exemple: "50 123 45 67" },
  tr: { groupes: [3, 3, 2, 2], exemple: "532 123 45 67" },
  sa: { groupes: [2, 3, 4], exemple: "50 123 4567" },
  ae: { groupes: [2, 3, 4], exemple: "50 123 4567" },
  qa: { groupes: [4, 4], exemple: "3312 3456" },
  kw: { groupes: [4, 4], exemple: "9123 4567" },
  il: { groupes: [2, 3, 4], exemple: "50 123 4567" },
  pk: { groupes: [3, 3, 4], exemple: "301 234 5678" },
  bd: { groupes: [4, 3, 3], exemple: "1712 345 678" },
  jp: { groupes: [2, 4, 4], exemple: "90 1234 5678" },
  kr: { groupes: [2, 4, 4], exemple: "10 1234 5678" },
  br: { groupes: [2, 5, 4], exemple: "11 91234 5678" },
  mx: { groupes: [2, 4, 4], exemple: "55 1234 5678" },
  ar: { groupes: [2, 4, 4], exemple: "11 2345 6789" },
  co: { groupes: [3, 3, 4], exemple: "301 234 5678" },
  pe: { groupes: [3, 3, 3], exemple: "987 654 321" },
  ve: { groupes: [3, 3, 4], exemple: "412 123 4567" },
  cl: { groupes: [1, 4, 4], exemple: "9 1234 5678" },
  do: { groupes: [3, 3, 4], exemple: "809 123 4567" },
  cu: { groupes: [4, 4], exemple: "5234 5678" },
};

/** Repli par paires pour les pays sans format dédié. */
const FORMAT_DEFAUT: { groupes: number[]; exemple: string } = {
  groupes: [2, 2, 2, 2, 2, 2],
  exemple: "12 34 56 78",
};

/** Infos d'indicatif d'un pays (par son NOM français, comme dans le formulaire). */
export type IndicatifInfo = {
  /** indicatif E.164 SANS le « + » — ex. "229" */
  indicatif: string;
  /** indicatif affiché — ex. "+229" */
  affiche: string;
  /** code ISO (drapeau flagcdn) */
  code: string;
  /** longueurs locales [min, max] */
  longueurs: [number, number];
  /** découpage d'affichage du numéro local (ex. [2, 3, 2, 2]) */
  groupes: number[];
  /** numéro d'exemple réaliste (placeholder du champ) */
  exemple: string;
};

/** Indicatif & longueurs d'un pays (null si pays inconnu/non sélectionné). */
export function indicatifDuPays(nomPays: string): IndicatifInfo | null {
  const p = PAYS_VILLES.find((x) => x.nom === nomPays.trim());
  if (!p) return null;
  const indicatif = INDICATIFS[p.code];
  if (!indicatif) return null;
  const fmt = FORMATS[p.code] ?? FORMAT_DEFAUT;
  return {
    indicatif,
    affiche: `+${indicatif}`,
    code: p.code,
    longueurs: LONGUEURS[p.code] ?? REPLI,
    groupes: fmt.groupes,
    exemple: fmt.exemple,
  };
}

/** Résultat de la validation du numéro WhatsApp du prospect. */
export type WhatsAppValidation =
  | {
      ok: true;
      /** numéro local normalisé (chiffres uniquement) */
      local: string;
      /** format machine — ex. "+2290159173098" (localStorage) */
      e164: string;
      /** format lisible — ex. "+229 01 59 17 30 98" (email au coach) */
      pretty: string;
      indicatif: string;
    }
  | { ok: false; erreur: string };

/**
 * Découpe les chiffres du numéro local selon les groupes du PAYS,
 * progressivement pendant la frappe (Task 49-ter) : « 0159 » →
 * « 01 59 » (Bénin), « 690123456 » → « 690 12 34 56 » (Cameroun),
 * « 612345678 » → « 6 12 34 56 78 » (France). Les chiffres saisis
 * au-delà du dernier groupe (saisie transitoire trop longue)
 * restent visibles jusqu'au nettoyage.
 */
export function formaterLocal(
  digits: string,
  groupes: readonly number[],
): string {
  const parts: string[] = [];
  let i = 0;
  for (const g of groupes) {
    if (i >= digits.length) break;
    parts.push(digits.slice(i, i + g));
    i += g;
  }
  if (i < digits.length) parts.push(digits.slice(i));
  return parts.join(" ");
}

/**
 * NETTOYAGE EN DIRECT de la saisie (ajustement Task 49 — instruction
 * propriétaire : c'est au SYSTÈME d'empêcher le prospect d'entrer un
 * indicatif de pays).
 *
 * Appelé à CHAQUE frappe dans le champ :
 * • la saisie ne peut contenir QUE des chiffres — « + », espaces,
 *   points, tirets, parenthèses et lettres disparaissent au fil de
 *   la frappe (l'indicatif « +229 » est déjà affiché à gauche du
 *   champ : le retaper ne sert à rien) ;
 * • un « 00 » international initial est retiré (« 00229… ») ;
 * • un indicatif retapé par erreur (ex. « 2290159173098 ») est
 *   retiré DÈS QUE la saisie ne peut plus être un numéro local
 *   valide : soit le reste (sans l'indicatif) a une longueur valide
 *   pour le pays, soit la saisie dépasse la longueur maximale.
 *
 * Tant qu'une ambiguïté reste possible, la saisie est PRÉSERVÉE :
 * ex. au Bénin, un fixe « 22912345 » (8 chiffres) commence aussi par
 * « 229 » — on ne retire JAMAIS un préfixe qui pourrait être le
 * début légitime d'un numéro local. La validation finale
 * (validerWhatsApp) tranche au moment de l'envoi.
 */
export function sanitiserWhatsApp(
  info: IndicatifInfo,
  saisie: string,
): string {
  // Chiffres uniquement — tout le reste disparaît au fil de la frappe
  let digits = saisie.replace(/\D+/g, "");
  // Préfixe international « 00 » retapé (ex. « 00229… »)
  if (digits.startsWith("00")) digits = digits.slice(2);
  // Indicatif retapé — retiré seulement si la saisie ne peut plus
  // être un numéro local valide pour le pays choisi.
  if (digits.startsWith(info.indicatif)) {
    const rest = digits.slice(info.indicatif.length);
    const [min, max] = info.longueurs;
    if (
      (rest.length >= min && rest.length <= max) ||
      digits.length > max
    ) {
      digits = rest;
    }
  }
  // Préfixe tronc « 0 » (Task 49-ter) : dans la plupart des pays, le
  // « 0 » initial ne fait PAS partie du numéro E.164 (France « 06… »,
  // Nigeria « 0803… », Maroc « 0661… ») → retiré dès que le reste est
  // un numéro local valide. Bénin, Côte d'Ivoire, Congo et Gabon
  // (ZERO_NATIONAL) : le « 0 » fait partie du numéro → conservé.
  if (!ZERO_NATIONAL.has(info.code) && digits.startsWith("0")) {
    const sans0 = digits.slice(1);
    const [min, max] = info.longueurs;
    if (sans0.length >= min && sans0.length <= max) digits = sans0;
  }
  return digits;
}

/**
 * Valide la saisie du numéro WhatsApp du prospect pour le pays choisi.
 *
 * La saisie est nettoyée des séparateurs usuels (espaces, points,
 * tirets, parenthèses) ; un éventuel « + » ou « 00 » initial est
 * retiré, de même qu'un indicatif pays retapé par erreur (accepté
 * seulement si le RESTE du numéro a la bonne longueur — jamais au
 * détriment d'une saisie locale déjà valide).
 */
export function validerWhatsApp(
  nomPays: string,
  saisie: string,
): WhatsAppValidation {
  const info = indicatifDuPays(nomPays);
  if (!info) {
    return { ok: false, erreur: "Sélectionne d'abord ton pays." };
  }
  const [min, max] = info.longueurs;

  // Nettoyage des séparateurs usuels
  let digits = saisie.replace(/[\s.\-()/]/g, "").trim();
  if (!digits) {
    return {
      ok: false,
      erreur: `Indique ton numéro WhatsApp sans l'indicatif ${info.affiche} (déjà affiché).`,
    };
  }
  if (digits.startsWith("+")) digits = digits.slice(1);
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (!/^\d+$/.test(digits)) {
    return {
      ok: false,
      erreur: "Saisis uniquement des chiffres (sans l'indicatif).",
    };
  }

  // 1) saisie locale telle quelle si elle a déjà la bonne longueur ;
  // 2) sinon, indicatif retapé par le prospect → on le retire si le
  //    reste a la bonne longueur.
  let local = digits;
  if (
    (local.length < min || local.length > max) &&
    digits.startsWith(info.indicatif)
  ) {
    const rest = digits.slice(info.indicatif.length);
    if (rest.length >= min && rest.length <= max) local = rest;
  }
  // Préfixe tronc « 0 » (Task 49-ter) — même règle que
  // sanitiserWhatsApp (hors pays où le 0 est intégré au numéro).
  if (!ZERO_NATIONAL.has(info.code) && local.startsWith("0")) {
    const sans0 = local.slice(1);
    if (sans0.length >= min && sans0.length <= max) local = sans0;
  }

  if (local.length < min || local.length > max) {
    const attendu =
      min === max
        ? `${min} chiffres`
        : `${min} à ${max} chiffres`;
    return {
      ok: false,
      erreur: `Pour le ${nomPays.trim()}, un numéro WhatsApp compte en général ${attendu} (sans l'indicatif ${info.affiche}) — vérifie ta saisie.`,
    };
  }

  return {
    ok: true,
    local,
    e164: `+${info.indicatif}${local}`,
    pretty: `${info.affiche} ${formaterLocal(local, info.groupes)}`,
    indicatif: info.indicatif,
  };
}
