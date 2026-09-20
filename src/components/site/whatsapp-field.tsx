"use client";

import { cn } from "@/lib/utils";
import {
  formaterLocal,
  indicatifDuPays,
  sanitiserWhatsApp,
} from "@/lib/indicateurs-tel";
import { WhatsAppGlyph } from "./icons";

/**
 * CHAMP « NUMÉRO WHATSAPP » DU FORMULAIRE (Task 49 — instruction
 * propriétaire) : placé juste après les champs « Pays » et « Ville ».
 *
 * Le prospect ayant DÉJÀ sélectionné son pays, l'indicatif
 * international (ex. +229, +225, +237) est déduit AUTOMATIQUEMENT
 * et affiché comme préfixe dans le champ — le prospect ne saisit que
 * son numéro local, validé selon les longueurs usuelles du pays
 * (src/lib/indicateurs-tel.ts).
 *
 * AJUSTEMENTS PROPRIÉTAIRES :
 * • Task 49-bis — le long texte d'aide est remplacé par la seule
 *   mention « SANS Indicatif » en italique SOUS le champ, et c'est le
 *   SYSTÈME qui empêche la saisie d'un indicatif (chiffres uniquement,
 *   « + »/« 00 »/indicatif retapés retirés en direct par
 *   sanitiserWhatsApp) ;
 * • Task 49-ter — PLUS DE DRAPEAU dans le préfixe (le drapeau est
 *   déjà visible dans le champ « Pays » juste au-dessus), et le
 *   placeholder COMME le numéro affiché S'ADAPTENT AU FORMAT du pays
 *   choisi : placeholder « Ex. : 01 96 12 34 56 » (Bénin), « Ex. :
 *   690 12 34 56 » (Cameroun)… et espacement progressif du numéro
 *   pendant la frappe (formaterLocal + FORMATS du pays). Le « 0 »
 *   tronc initial est retiré pour les pays où il ne fait pas partie
 *   du numéro E.164 (France, Nigeria, Maroc…).
 *
 * Tant qu'aucun pays n'est choisi, le champ reste DÉSACTIVÉ («
 * Sélectionne d'abord ton pays ») — même logique que le champ Ville.
 * Le style reproduit EXACTEMENT celui des champs du formulaire
 * (.form-label / .form-input / .form-error), avec l'icône WhatsApp à
 * droite pour une reconnaissance immédiate.
 */
export function WhatsAppField({
  id,
  pays,
  value,
  onChange,
  error,
}: {
  id: string;
  /** nom du pays sélectionné ("" si aucun) — détermine le préfixe */
  pays: string;
  /** numéro local SANITISÉ (chiffres uniquement) — l'affichage est formaté */
  value: string;
  onChange: (numero: string) => void;
  error?: string;
}) {
  const info = indicatifDuPays(pays);
  const paysPret = pays.trim().length > 0;
  const errId = `err-${id}`;
  // Affichage adapté au format du pays (Task 49-ter) : l'état reste
  // au format machine (chiffres), le champ AFFICHE le numéro espacé.
  const affiche =
    paysPret && info ? formaterLocal(value, info.groupes) : "";

  return (
    <div>
      <label htmlFor={id} className="form-label">
        Numéro WhatsApp{" "}
        <span aria-hidden="true" className="font-semibold text-red-button">
          *
        </span>
      </label>
      <div className="relative mt-2">
        {/* Préfixe indicatif — SANS drapeau (Task 49-ter : le drapeau
            est déjà visible dans le champ « Pays » juste au-dessus) */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 flex items-center border-r border-white/15 pl-3.5 pr-3",
            !paysPret && "opacity-50",
          )}
        >
          {info ? (
            <span className="font-[550] tabular-nums tracking-wide text-white/80">
              {info.affiche}
            </span>
          ) : (
            <span className="w-12 text-white/40">…</span>
          )}
        </span>
        <input
          id={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          disabled={!paysPret}
          value={paysPret ? affiche : ""}
          onChange={(e) =>
            onChange(
              // Task 49-bis/ter : le SYSTÈME empêche la saisie de
              // l'indicatif (chiffres uniquement, indicatif retapé et
              // tronc « 0 » retirés automatiquement) — l'état reste
              // au format machine, l'affichage est formaté par pays.
              info
                ? sanitiserWhatsApp(info, e.target.value)
                : e.target.value,
            )
          }
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errId : undefined}
          placeholder={
            // Task 49-ter : placeholder ADAPTÉ AU PAYS — exemple
            // réaliste du format local attendu.
            paysPret && info
              ? `Ex. : ${info.exemple}`
              : "Sélectionne d'abord ton pays"
          }
          className={cn(
            "form-input pl-24 pr-12 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-button",
          )}
        />
        <WhatsAppGlyph className="pointer-events-none absolute right-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-white/35" />
      </div>
      {/* Ajustement propriétaire (Task 49-bis) : mention courte en
          italique SOUS le champ, à la place du long texte d'aide. */}
      <p className="t-caption mt-2 italic text-white/60">SANS Indicatif</p>
      {error ? (
        <p id={errId} role="alert" className="form-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
