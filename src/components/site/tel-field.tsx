"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  formaterLocal,
  indicatifDuPays,
  sanitiserWhatsApp,
} from "@/lib/indicateurs-tel";
import { PAYS_VILLES, flagUrl, normaliser } from "@/lib/pays-villes";

/**
 * CHAMP « NUMÉRO DE TÉLÉPHONE » AVEC SÉLECTION DU PAYS EN PRÉFIXE
 * (Task 72 — instruction propriétaire : « un troisième champ pour le
 * numéro de téléphone avec pour préfix sélection de pays comme dans
 * le formulaire du programme » — page Bienvenue du Pre-launch).
 *
 * MÊME mécanique que le formulaire d'inscription (Tasks 39/49) :
 * • le pays se choisit dans une dropliste de TOUS les pays, chaque
 *   entrée avec son DRAPEAU (flagcdn) et une RECHERCHE (liste longue,
 *   insensible aux accents) — ici la dropliste est COMPACTE (elle
 *   occupe la zone de préfixe du champ, à gauche du numéro) ;
 * • l'indicatif international (+229, +225, +237…) est déduit du pays
 *   choisi et affiché comme PRÉFIXE — le client ne saisit que son
 *   numéro local ;
 * • le SYSTÈME empêche la saisie d'un indicatif (chiffres uniquement,
 *   « + »/« 00 »/indicatif retapés retirés en direct par
 *   sanitiserWhatsApp — ajustement Task 49-bis) ;
 * • le placeholder COMME le numéro affiché S'ADAPTENT au format du
 *   pays choisi (Task 49-ter) : « Ex. : 01 96 12 34 56 » (Bénin),
 *   « Ex. : 690 12 34 56 » (Cameroun)…, espacement progressif du
 *   numéro pendant la frappe ;
 * • mention courte « SANS Indicatif » en italique SOUS le champ
 *   (ajustement propriétaire Task 49-bis, même convention que le
 *   formulaire) ;
 * • le DRAPEAU figure dans le bouton de préfixe : contrairement au
 *   formulaire (où le champ « Pays » juste au-dessus montre déjà le
 *   drapeau, Task 49-ter l'y avait retiré du champ WhatsApp), la
 *   sélection du pays se fait ICI, dans ce champ lui-même — le
 *   drapeau y est donc nécessaire à la reconnaissance.
 *
 * Le style reproduit EXACTEMENT celui des champs du formulaire
 * (.form-label / .form-input / .form-error) et du panneau dropliste
 * de ListboxField (pays-ville-fields.tsx) — fermeture au clic
 * extérieur et à Échap, panneau accessible (role listbox/option,
 * aria-expanded).
 */
export function TelField({
  id,
  /** code ISO du pays sélectionné (ex. "bj") */
  pays,
  /** numéro local SANITISÉ (chiffres uniquement) — l'affichage est formaté */
  tel,
  onPaysChange,
  onTelChange,
  onBlur,
  error,
}: {
  id: string;
  pays: string;
  tel: string;
  onPaysChange: (codePays: string) => void;
  onTelChange: (numero: string) => void;
  /** notifie le parent que le champ a été touché (affichage de
   *  l'erreur après blur uniquement — même convention que le
   *  formulaire d'inscription) */
  onBlur?: () => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  /* Infos d'indicatif du pays sélectionné (null si code inconnu). */
  const paysObj = useMemo(
    () => PAYS_VILLES.find((p) => p.code === pays.trim()),
    [pays],
  );
  const info = useMemo(
    () => (paysObj ? indicatifDuPays(paysObj.nom) : null),
    [paysObj],
  );

  /* Recherche insensible aux accents (même mécanique que le
     formulaire — ~196 pays à filtrer). */
  const filtered = useMemo(() => {
    const q = normaliser(query);
    if (!q) return PAYS_VILLES;
    return PAYS_VILLES.filter((p) => normaliser(p.nom).includes(q));
  }, [query]);

  /* Fermeture : clic extérieur + Échap (même mécanique que
     ListboxField) — la recherche est réinitialisée à la fermeture
     (pas dans un effet : pas de rendu en cascade). */
  const fermer = () => {
    setOpen(false);
    setQuery("");
  };
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        fermer();
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") fermer();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  /* Focus sur la recherche à l'ouverture. */
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => searchRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [open]);

  /* L'option choisie reste visible à l'ouverture du panneau. */
  useEffect(() => {
    if (open) {
      rootRef.current
        ?.querySelector('[data-selected="true"]')
        ?.scrollIntoView({ block: "center" });
    }
  }, [open]);

  /* Affichage adapté au format du pays (l'état reste au format
     machine — chiffres —, le champ AFFICHE le numéro espacé). */
  const affiche = info ? formaterLocal(tel, info.groupes) : tel;
  const errId = `err-${id}`;
  const buttonId = `${id}-pays`;

  return (
    <div ref={rootRef} className="relative">
      <label htmlFor={id} className="form-label">
        Numéro de téléphone{" "}
        <span aria-hidden="true" className="font-semibold text-red-button">
          *
        </span>
      </label>
      <div className="mt-2 flex items-stretch gap-2">
        {/* — Sélecteur du pays (préfixe) : drapeau + indicatif — */}
        <button
          type="button"
          id={buttonId}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={open ? `${id}-listbox` : undefined}
          aria-label="Pays de ton numéro"
          onClick={() => {
            if (open) {
              fermer();
            } else {
              setOpen(true);
            }
          }}
          className={cn(
            "form-input flex w-[7rem] shrink-0 items-center justify-between gap-1.5 px-3",
            open && "border-white bg-white/10",
          )}
        >
          {paysObj ? (
            <img
              src={flagUrl(paysObj.code)}
              srcSet={`${flagUrl(paysObj.code, 80)} 2x`}
              alt=""
              loading="lazy"
              decoding="async"
              width={24}
              height={16}
              className="h-4 w-6 shrink-0 rounded-[2px] object-cover ring-1 ring-white/25"
            />
          ) : null}
          <span className="min-w-0 flex-1 truncate text-left font-[550] tabular-nums tracking-wide text-white/85">
            {info ? info.affiche : "…"}
          </span>
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className={cn(
              "h-4 w-4 shrink-0 text-white/60 transition-transform duration-200",
              open && "rotate-180",
            )}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3.5 6l4.5 4.5L12.5 6" />
          </svg>
        </button>

        {/* — Numéro local (chiffres, formaté pour le pays) — */}
        <div className="relative min-w-0 flex-1">
          <input
            id={id}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            value={affiche}
            onChange={(e) =>
              onTelChange(
                info
                  ? sanitiserWhatsApp(info, e.target.value)
                  : e.target.value.replace(/\D+/g, ""),
              )
            }
            onBlur={onBlur}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errId : undefined}
            placeholder={info ? `Ex. : ${info.exemple}` : "Ton numéro"}
            className={cn(
              "form-input min-w-0",
              error && "border-red-button",
            )}
          />
        </div>
      </div>

      {/* Panneau dropliste des pays — MÊME style que le formulaire
          (ListboxField) : recherche, drapeaux, option sélectionnée
          cochée en rouge. Positionné sous le bouton de préfixe. */}
      {open ? (
        <div
          data-panel=""
          className="absolute left-0 top-full z-[70] mt-2 w-[18rem] max-w-[calc(100vw-3rem)] overflow-hidden rounded-[8px] border border-white/25 bg-[#15151a] shadow-[0_18px_50px_rgba(0,0,0,0.6)]"
        >
          <div className="border-b border-white/15 p-2">
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tape le nom de ton pays…"
              aria-label="Tape le nom de ton pays"
              /* Task 60 (retour propriétaire — tracking) : le
                 libellé ne contient PAS le mot « Rechercher » — le
                 pixel Meta infère un événement « Search » sur les
                 champs dont l'id/placeholder/label matche un motif
                 de recherche. */
              className="w-full rounded-[6px] border border-white/20 bg-white/[0.07] px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-white focus:outline-none"
            />
          </div>
          <div
            id={`${id}-listbox`}
            role="listbox"
            aria-label="Pays de ton numéro"
            className="max-h-64 overflow-y-auto overscroll-contain py-1"
          >
            {filtered.length === 0 ? (
              <p className="px-3 py-3 text-sm text-white/50">
                Aucun pays ne correspond à ta saisie.
              </p>
            ) : (
              filtered.map((p) => {
                const isSel = p.code === pays.trim();
                const ind = indicatifDuPays(p.nom);
                return (
                  <button
                    key={p.code}
                    type="button"
                    role="option"
                    aria-selected={isSel}
                    data-selected={isSel || undefined}
                    onClick={() => {
                      /* Changer de pays RÉINITIALISE la saisie du
                         numéro — MÊME convention que le formulaire
                         d'inscription (l'indicatif change : le numéro
                         local d'un autre format n'a plus de sens). */
                      onPaysChange(p.code);
                      onTelChange("");
                      fermer();
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-2.5 text-left text-[0.95rem] transition-colors",
                      isSel
                        ? "bg-white/[0.14] text-white"
                        : "text-white/85 hover:bg-white/[0.08] hover:text-white",
                    )}
                  >
                    <img
                      src={flagUrl(p.code)}
                      srcSet={`${flagUrl(p.code, 80)} 2x`}
                      alt={p.nom}
                      loading="lazy"
                      decoding="async"
                      width={24}
                      height={16}
                      className="h-4 w-6 shrink-0 rounded-[2px] object-cover ring-1 ring-white/25"
                    />
                    <span className="min-w-0 flex-1 truncate">{p.nom}</span>
                    {ind ? (
                      <span className="shrink-0 tabular-nums text-white/50">
                        {ind.affiche}
                      </span>
                    ) : null}
                    {isSel ? (
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 16 16"
                        className="ml-1 h-4 w-4 shrink-0 text-red-button"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 8.5l3.5 3.5L13 5" />
                      </svg>
                    ) : null}
                  </button>
                );
              })
            )}
          </div>
        </div>
      ) : null}

      {/* Ajustement propriétaire (Task 49-bis, même convention que le
          formulaire) : mention courte en italique SOUS le champ. */}
      <p className="t-caption mt-2 italic text-white/60">SANS Indicatif</p>
      {error ? (
        <p id={errId} role="alert" className="form-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
