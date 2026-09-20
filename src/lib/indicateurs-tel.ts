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
  fr: [9, 10], be: [8, 9], ca: [10, 10], us: [10, 10], ht: [8, 8],
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
};

/** Indicatif & longueurs d'un pays (null si pays inconnu/non sélectionné). */
export function indicatifDuPays(nomPays: string): IndicatifInfo | null {
  const p = PAYS_VILLES.find((x) => x.nom === nomPays.trim());
  if (!p) return null;
  const indicatif = INDICATIFS[p.code];
  if (!indicatif) return null;
  return {
    indicatif,
    affiche: `+${indicatif}`,
    code: p.code,
    longueurs: LONGUEURS[p.code] ?? REPLI,
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
    pretty: `${info.affiche} ${grouper(local)}`,
    indicatif: info.indicatif,
  };
}

/** Regroupe les chiffres par 2 (longueur paire) pour la lisibilité :
 *  "0159173098" → "01 59 17 30 98" ; longueur impaire → tel quel. */
function grouper(local: string): string {
  if (local.length % 2 !== 0) return local;
  return (local.match(/.{2}/g) ?? [local]).join(" ");
}
