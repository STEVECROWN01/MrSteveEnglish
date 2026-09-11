"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Toggle « Avant → Après » sur les témoignages.
 * Au clic : le texte « Avant » (gris neutre) se fond vers le texte
 * « Après » (noir pur) en 350ms. Reduced motion : bascule instantanée.
 * (Waveform supprimée — instruction propriétaire.)
 */

export function BeforeAfter({
  before,
  after,
}: {
  before: string;
  after: string;
}) {
  const [isAfter, setIsAfter] = useState(false);

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setIsAfter((v) => !v)}
        aria-pressed={isAfter}
        className={cn(
          "inline-flex min-h-[44px] items-center gap-2 rounded-full border-[1.5px] px-4 py-2 text-[0.9375rem] font-semibold transition-colors duration-[350ms]",
          isAfter
            ? "border-black bg-black text-white"
            : "border-black bg-transparent text-black hover:bg-[rgba(0,0,0,0.05)]",
        )}
      >
        Avant → Après
      </button>

      <div className="relative mt-3 min-h-[3.5rem]">
        {/* Texte Avant — gris neutre (inactif : masqué aussi pour les lecteurs d'écran) */}
        <p
          className={cn(
            "ba-text t-body text-grey-mid",
            isAfter
              ? "pointer-events-none absolute inset-0 translate-y-1 opacity-0 invisible"
              : "relative visible opacity-100",
          )}
        >
          <strong className="font-semibold">Avant :</strong> {before}
        </p>
        {/* Texte Après — noir pur sur fond blanc (instruction propriétaire) */}
        <p
          className={cn(
            "ba-text font-semibold text-black",
            isAfter
              ? "relative visible opacity-100"
              : "pointer-events-none absolute inset-0 translate-y-1 opacity-0 invisible",
          )}
        >
          <strong className="font-semibold">Après :</strong> {after}
        </p>
      </div>
    </div>
  );
}
