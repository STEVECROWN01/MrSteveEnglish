"use client";

import { cn } from "@/lib/utils";
import { flagUrl } from "@/lib/pays-villes";
import { indicatifDuPays, sanitiserWhatsApp } from "@/lib/indicateurs-tel";
import { WhatsAppGlyph } from "./icons";

/**
 * CHAMP « NUMÉRO WHATSAPP » DU FORMULAIRE (Task 49 — instruction
 * propriétaire) : placé juste après les champs « Pays » et « Ville ».
 *
 * Le prospect ayant DÉJÀ sélectionné son pays, l'indicatif
 * international (ex. +229, +225, +237) et le drapeau du pays sont
 * déduits AUTOMATIQUEMENT et affichés comme préfixe dans le champ —
 * le prospect ne saisit que son numéro local, validé selon les
 * longueurs usuelles du pays (src/lib/indicateurs-tel.ts).
 *
 * AJUSTEMENT PROPRIÉTAIRE (Task 49-bis) : le long texte d'aide
 * au-dessus du champ est remplacé par la seule mention « SANS
 * Indicatif » en italique SOUS le champ — et c'est le SYSTÈME qui
 * empêche la saisie d'un indicatif : à chaque frappe,
 * sanitiserWhatsApp() ne garde que les chiffres et retire
 * automatiquement un indicatif retapé (ex. « +229… », « 00229… »,
 * « 229… ») dès que la saisie ne peut plus être un numéro local
 * valide.
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
  value: string;
  onChange: (numero: string) => void;
  error?: string;
}) {
  const info = indicatifDuPays(pays);
  const paysPret = pays.trim().length > 0;
  const errId = `err-${id}`;

  return (
    <div>
      <label htmlFor={id} className="form-label">
        Numéro WhatsApp{" "}
        <span aria-hidden="true" className="font-semibold text-red-button">
          *
        </span>
      </label>
      <div className="relative mt-2">
        {/* Préfixe indicatif + drapeau du pays sélectionné */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 flex items-center gap-2 border-r border-white/15 pl-3.5 pr-3",
            !paysPret && "opacity-50",
          )}
        >
          {info ? (
            <>
              <img
                src={flagUrl(info.code)}
                srcSet={`${flagUrl(info.code, 80)} 2x`}
                alt=""
                loading="lazy"
                decoding="async"
                width={24}
                height={16}
                className="h-4 w-6 shrink-0 rounded-[2px] object-cover ring-1 ring-white/25"
              />
              <span className="font-[550] tabular-nums tracking-wide text-white/80">
                {info.affiche}
              </span>
            </>
          ) : (
            <span className="w-[4.5rem] text-white/40">…</span>
          )}
        </span>
        <input
          id={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          disabled={!paysPret}
          value={paysPret ? value : ""}
          onChange={(e) =>
            onChange(
              // Task 49-bis : le SYSTÈME empêche la saisie de
              // l'indicatif — nettoyage en direct (chiffres uniquement,
              // indicatif retapé retiré automatiquement).
              info
                ? sanitiserWhatsApp(info, e.target.value)
                : e.target.value,
            )
          }
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errId : undefined}
          placeholder={
            paysPret ? "Ex. : 01 96 12 34 56" : "Sélectionne d'abord ton pays"
          }
          className={cn(
            "form-input pl-28 pr-12 disabled:cursor-not-allowed disabled:opacity-50",
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
