"use client";

import { useEffect, useState } from "react";
import { useInViewOnce, usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * CTA-WAVEFORM — élément signature du site (DA §10 prompt #10, §14).
 * Waveform continue, fluide, sans rupture — SVG vectoriel animable.
 * Trait 2px, Bleu Profond sur fond clair ou Blanc sur Bleu Profond.
 */

const WAVE_D =
  "M 0.0 23.6 C 7.1 34.0, 28.6 84.9, 42.9 85.9 C 57.1 87.0, 71.4 29.3, 85.7 29.8 C 100.0 30.4, 114.3 90.6, 128.6 89.3 C 142.9 88.0, 157.1 20.7, 171.4 22.0 C 185.7 23.3, 200.0 97.4, 214.3 97.0 C 228.6 96.6, 242.9 21.0, 257.1 19.3 C 271.4 17.7, 285.7 85.6, 300.0 87.0 C 314.3 88.3, 328.6 27.5, 342.9 27.3 C 357.1 27.2, 371.4 85.4, 385.7 86.0 C 400.0 86.6, 414.3 29.4, 428.6 30.8 C 442.9 32.1, 457.1 93.5, 471.4 94.1 C 485.7 94.6, 500.0 34.9, 514.3 34.0 C 528.6 33.2, 542.9 83.1, 557.1 88.9 C 571.4 94.6, 592.9 72.0, 600.0 68.7";

type WaveformProps = {
  /** Couleur du trait : bleu sur fond clair, blanc sur fond Bleu Profond. */
  color?: "blue" | "white";
  /** draw = se dessine une fois (hero) · breathe = respire (contact) · static */
  animate?: "draw" | "breathe" | "static";
  className?: string;
  /** Délai avant dessin (ms) — orchestration du hero (DA §13). */
  drawDelay?: number;
  /** Accessibilité : décoratif par défaut (DA §16 — Registre B marqué aria-hidden). */
  label?: string;
};

export function Waveform({
  color = "blue",
  animate = "static",
  className,
  drawDelay = 150,
  label,
}: WaveformProps) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();
  const [drawn, setDrawn] = useState(false);

  // Le dessin démarre après le délai d'orchestration (DA §13)
  useEffect(() => {
    if (animate !== "draw") return;
    if (!inView) return;
    const t = setTimeout(() => setDrawn(true), drawDelay);
    return () => clearTimeout(t);
  }, [inView, animate, drawDelay]);

  const stroke = color === "blue" ? "#1800AC" : "#FFFFFF";

  return (
    <div
      ref={ref}
      className={cn("w-full select-none", className)}
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
    >
      <svg
        viewBox="0 0 600 120"
        fill="none"
        className={cn(
          "block h-auto w-full",
          animate === "draw" && "wave-draw",
          animate === "draw" && (drawn || reduced) && "is-drawn",
          animate === "breathe" && !reduced && "wave-breathe",
        )}
      >
        <path
          className="wave-path"
          d={WAVE_D}
          stroke={stroke}
          strokeWidth={2}
          strokeLinecap="round"
          pathLength={1000}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
