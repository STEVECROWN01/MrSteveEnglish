"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { PAYS_VILLES, flagUrl, normaliser, villesDe } from "@/lib/pays-villes";

/**
 * DROPDOWNS « PAYS » & « VILLE » DU FORMULAIRE (Task 39 — instruction
 * propriétaire).
 *
 * « Pays » : dropliste de TOUS les pays (~196), CHACUN AVEC SON
 * DRAPEAU (flagcdn — CDN public), plus un champ de recherche
 * (insensible aux accents) car la liste est longue.
 *
 * « Ville » : dropliste qui ne propose QUE les villes du pays
 * sélectionné. Elle reste DÉSACTIVÉE (« Sélectionne d'abord ton
 * pays ») tant qu'aucun pays n'a été choisi, et la ville est
 * réinitialisée si le pays change — le prospect choisit donc
 * forcément son pays AVANT sa ville.
 *
 * Les <select> natifs ne peuvent pas afficher d'images dans leurs
 * options : ces droplistes personnalisées reproduisent le style
 * EXACT des champs du formulaire (.form-label / .form-input /
 * .form-error) avec un panneau accessible (rôle listbox/option,
 * aria-expanded, fermeture au clic extérieur et à Échap). Les valeurs
 * restent de simples chaînes (nom du pays, nom de la ville) : le
 * reçu PDF, l'email au coach et le localStorage reçoivent exactement
 * les mêmes données qu'avant.
 */

type Option = {
  value: string;
  label: string;
  /** code ISO du pays — affiche le drapeau (villes : undefined) */
  flagCode?: string;
};

function Chevron({ open }: { open: boolean }) {
  return (
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
  );
}

function Flag({ code, alt }: { code: string; alt: string }) {
  return (
    /* Drapeaux distaux (flagcdn, ~100-800 o) : <img> simple, pas de
       next/image — aucune optimisation nécessaire, chargement paresseux. */
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={flagUrl(code)}
      srcSet={`${flagUrl(code, 80)} 2x`}
      alt={alt}
      loading="lazy"
      decoding="async"
      width={24}
      height={16}
      className="h-4 w-6 shrink-0 rounded-[2px] object-cover ring-1 ring-white/25"
    />
  );
}

function ListboxField({
  id,
  label,
  required,
  placeholder,
  value,
  options,
  onChange,
  error,
  disabled,
  disabledPlaceholder,
  searchPlaceholder,
  emptyText,
}: {
  id: string;
  label: string;
  required?: boolean;
  placeholder: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  disabledPlaceholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  /* Recherche dès que la liste est longue (pays, grandes villes) */
  const searchable = options.length > 12;
  const filtered = useMemo(() => {
    const q = normaliser(query);
    if (!q) return options;
    return options.filter((o) => normaliser(o.label).includes(q));
  }, [options, query]);

  const selected = options.find((o) => o.value === value) ?? null;

  /* Ouverture : fermeture au clic extérieur + Échap ; la barre CTA
     sticky mobile se range (data-listbox-open sur <body>) pour ne
     JAMAIS passer au-dessus du panneau. */
  useEffect(() => {
    if (!open) return;
    document.body.setAttribute("data-listbox-open", "");
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.removeAttribute("data-listbox-open");
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  /* Focus sur la recherche à l'ouverture ; réinitialisée à la fermeture */
  useEffect(() => {
    if (open && searchable) {
      const t = setTimeout(() => searchRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
    if (!open) setQuery("");
    return undefined;
  }, [open, searchable]);

  /* L'option choisie reste visible à l'ouverture du panneau */
  useEffect(() => {
    if (open) {
      rootRef.current
        ?.querySelector('[data-selected="true"]')
        ?.scrollIntoView({ block: "center" });
    }
  }, [open]);

  /* Si le panneau dépasse en bas de l'écran, faire défiler la page
     juste ce qu'il faut pour le voir entier. */
  useEffect(() => {
    if (!open) return;
    const panel = rootRef.current?.querySelector<HTMLElement>("[data-panel]");
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    if (r.bottom > window.innerHeight) {
      window.scrollBy({
        top: r.bottom - window.innerHeight + 8,
        behavior: "smooth",
      });
    }
  }, [open]);

  const errId = `err-${id}`;

  return (
    <div ref={rootRef} className="relative">
      <label
        htmlFor={id}
        className="form-label"
        onClick={disabled ? undefined : () => setOpen((o) => !o)}
      >
        {label}
        {required ? (
          <span aria-hidden="true" className="font-semibold text-red-button">
            {" "}
            *
          </span>
        ) : null}
      </label>
      <button
        type="button"
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? `${id}-listbox` : undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errId : undefined}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "form-input mt-2 flex items-center justify-between gap-3 text-left",
          open && "border-white bg-white/10",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <span className="flex min-w-0 items-center gap-3">
          {selected?.flagCode ? <Flag code={selected.flagCode} alt="" /> : null}
          <span className={cn("truncate", value ? "" : "text-white/40")}>
            {disabled && !value ? (disabledPlaceholder ?? placeholder) : (value || placeholder)}
          </span>
        </span>
        <Chevron open={open} />
      </button>
      {open && !disabled ? (
        <div
          data-panel=""
          className="absolute inset-x-0 top-full z-[60] mt-2 overflow-hidden rounded-[8px] border border-white/25 bg-[#15151a] shadow-[0_18px_50px_rgba(0,0,0,0.6)]"
        >
          {searchable ? (
            <div className="border-b border-white/15 p-2">
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="w-full rounded-[6px] border border-white/20 bg-white/[0.07] px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-white focus:outline-none"
              />
            </div>
          ) : null}
          <div
            id={`${id}-listbox`}
            role="listbox"
            aria-label={label}
            className="max-h-64 overflow-y-auto overscroll-contain py-1"
          >
            {filtered.length === 0 ? (
              <p className="px-3 py-3 text-sm text-white/50">{emptyText}</p>
            ) : (
              filtered.map((o) => {
                const isSel = o.value === value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    role="option"
                    aria-selected={isSel}
                    data-selected={isSel || undefined}
                    onClick={() => {
                      onChange(o.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-2.5 text-left text-[0.95rem] transition-colors",
                      isSel
                        ? "bg-white/[0.14] text-white"
                        : "text-white/85 hover:bg-white/[0.08] hover:text-white",
                    )}
                  >
                    {o.flagCode ? <Flag code={o.flagCode} alt={o.label} /> : null}
                    <span className="truncate">{o.label}</span>
                    {isSel ? (
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 16 16"
                        className="ml-auto h-4 w-4 shrink-0 text-red-button"
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
      {error ? (
        <p id={errId} role="alert" className="form-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Champ « Pays » — TOUS les pays, avec drapeaux + recherche. */
export function SelectPaysField({
  id,
  value,
  onChange,
  error,
}: {
  id: string;
  value: string;
  onChange: (pays: string) => void;
  error?: string;
}) {
  return (
    <ListboxField
      id={id}
      label="Pays"
      required
      placeholder="Sélectionne ton pays"
      searchPlaceholder="Rechercher un pays…"
      emptyText="Aucun pays ne correspond à ta recherche."
      value={value}
      onChange={onChange}
      error={error}
      options={PAYS_VILLES.map((p) => ({
        value: p.nom,
        label: p.nom,
        flagCode: p.code,
      }))}
    />
  );
}

/** Champ « Ville » — villes du pays sélectionné UNIQUEMENT ;
 *  désactivé tant qu'aucun pays n'est choisi. */
export function SelectVilleField({
  id,
  pays,
  value,
  onChange,
  error,
}: {
  id: string;
  pays: string;
  value: string;
  onChange: (ville: string) => void;
  error?: string;
}) {
  const villes = useMemo(() => villesDe(pays), [pays]);
  const paysPret = pays.trim().length > 0;
  return (
    <ListboxField
      id={id}
      label="Ville"
      required
      placeholder="Sélectionne ta ville"
      disabledPlaceholder="Sélectionne d'abord ton pays"
      searchPlaceholder="Rechercher une ville…"
      emptyText="Aucune ville ne correspond à ta recherche."
      value={paysPret ? value : ""}
      onChange={onChange}
      error={error}
      disabled={!paysPret}
      options={villes.map((v) => ({ value: v, label: v }))}
    />
  );
}
