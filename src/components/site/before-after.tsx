"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Signature 2 (DA §14) — Toggle « Avant → Après » sur les témoignages.
 * Au clic : le texte « Avant » (gris neutre) se fond vers le texte
 * « Après » (Bleu Profond) en 350ms, avec une légère waveform bleue
 * qui se redresse entre les deux états. Reduced motion : bascule instantanée.
 */

const WAVE_D =
  "M 0.0 75.9 C 7.1 70.7, 28.6 45.2, 42.9 44.7 C 57.1 44.3, 71.4 73.4, 85.7 73.3 C 100.0 73.3, 114.3 43.9, 128.6 44.5 C 142.9 45.1, 157.1 76.3, 171.4 76.9 C 185.7 77.4, 200.0 48.0, 214.3 48.0 C 228.6 48.0, 242.9 77.5, 257.1 76.8 C 271.4 76.1, 285.7 44.3, 300.0 43.8 C 314.3 43.3, 328.6 73.5, 342.9 74.0 C 357.1 74.6, 371.4 46.5, 385.7 47.1 C 400.0 47.7, 414.3 77.9, 428.6 77.7 C 442.9 77.6, 457.1 46.8, 471.4 46.0 C 485.7 45.1, 500.0 72.3, 514.3 72.6 C 528.6 72.8, 542.9 46.7, 557.1 47.4 C 571.4 48.2, 592.9 72.1, 600.0 77.1";

const FLAT_D =
  "M 0.0 62.5 C 7.1 61.7, 28.6 57.5, 42.9 57.5 C 57.1 57.5, 71.4 62.5, 85.7 62.5 C 100.0 62.5, 114.3 57.5, 128.6 57.5 C 142.9 57.5, 157.1 62.5, 171.4 62.5 C 185.7 62.5, 200.0 57.5, 214.3 57.5 C 228.6 57.5, 242.9 62.5, 257.1 62.5 C 271.4 62.5, 285.7 57.5, 300.0 57.5 C 314.3 57.5, 328.6 62.5, 342.9 62.5 C 357.1 62.5, 371.4 57.5, 385.7 57.5 C 400.0 57.5, 414.3 62.5, 428.6 62.5 C 442.9 62.5, 457.1 57.5, 471.4 57.5 C 485.7 57.5, 500.0 62.5, 514.3 62.5 C 528.6 62.5, 542.9 57.5, 557.1 57.5 C 571.4 57.5, 592.9 61.7, 600.0 62.5";

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
            ? "border-blue-deep bg-blue-deep text-white"
            : "border-blue-deep bg-transparent text-black hover:bg-[rgba(24,0,172,0.06)]",
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

      {/* Waveform qui se redresse entre les deux états (350ms) */}
      <svg
        viewBox="0 0 600 120"
        fill="none"
        aria-hidden="true"
        className="mt-3 block h-6 w-full"
      >
        <path
          className="ba-wave"
          d={WAVE_D}
          stroke="#1800AC"
          strokeWidth={2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ opacity: isAfter ? 0 : 1 }}
        />
        <path
          className="ba-wave"
          d={FLAT_D}
          stroke="#1800AC"
          strokeWidth={2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ opacity: isAfter ? 1 : 0 }}
        />
      </svg>
    </div>
  );
}
