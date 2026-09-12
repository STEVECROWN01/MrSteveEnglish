"use client";

import dynamic from "next/dynamic";
import { useInViewOnce, usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Scène 3D « microphone tech » (section Comment se déroule le coaching).
 * Le Canvas (three.js, ~150 Ko gz) n'est JAMAIS dans le bundle initial :
 * import dynamique ssr:false + montage uniquement à l'approche du viewport
 * (rootMargin 500px). Depuis l'instruction propriétaire, la scène vit
 * directement sur le fond sombre de la section (radial commun posé sur
 * le <Section>) : plus de carte — ni angles arrondis, ni ombre, ni fond
 * propre — le micro flotte sur le fond studio étendu à toute la section.
 * prefers-reduced-motion : scène rendue en statique (une frame).
 */

const MicrophoneCanvas = dynamic(() => import("./microphone-canvas"), {
  ssr: false,
  loading: () => <ScenePlaceholder />,
});

function ScenePlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
      <span className="mic-scene-pulse h-2.5 w-2.5 rounded-full bg-[#ff1a1a]" />
    </div>
  );
}

export function MicrophoneScene({ className }: { className?: string }) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>({ rootMargin: "500px" });
  const reduced = usePrefersReducedMotion();

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Microphone studio 3D stylisé tech, accents néon rouges et arcs orbitaux animés — l'outil des séances de coaching en ligne"
      className={cn(
        "relative aspect-[4/5] w-full",
        className,
      )}
    >
      {inView ? <MicrophoneCanvas reduced={reduced} /> : <ScenePlaceholder />}
    </div>
  );
}
