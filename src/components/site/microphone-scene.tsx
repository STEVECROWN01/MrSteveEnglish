"use client";

import dynamic from "next/dynamic";
import { useInViewOnce, usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Panneau 3D « microphone tech » (section Comment se déroule le coaching).
 * Le Canvas (three.js, ~150 Ko gz) n'est JAMAIS dans le bundle initial :
 * import dynamique ssr:false + montage uniquement à l'approche du viewport
 * (rootMargin 500px). Le panneau sombre (fond radial CSS) sert de
 * « fenêtre studio » sur fond blanc — l'asset Spline désigné par le
 * propriétaire vit sur fond noir infini, conservé ici.
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
        "relative aspect-[4/5] w-full overflow-hidden rounded-[12px]",
        "bg-[radial-gradient(120%_85%_at_50%_16%,#1b1b1f_0%,#0c0c0e_52%,#050506_100%)]",
        "shadow-[0_24px_50px_-24px_rgba(2,6,23,0.45)]",
        className,
      )}
    >
      {inView ? <MicrophoneCanvas reduced={reduced} /> : <ScenePlaceholder />}
    </div>
  );
}
