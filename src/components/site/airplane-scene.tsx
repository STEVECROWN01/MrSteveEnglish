"use client";

import dynamic from "next/dynamic";
import { useCallback } from "react";
import { useInView, useInViewOnce, usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Scène 3D « avion de ligne stylisé » (page Résultats — à droite de
 * « Un parcours réel », instruction propriétaire Task 27).
 * Même discipline de chargement que la scène micro : import dynamique
 * ssr:false + montage à l'approche du viewport (rootMargin 900px pour
 * que le chunk three.js soit déjà résolu à l'arrivée) + frameloop coupé
 * dès que la scène sort de l'écran. prefers-reduced-motion : statique.
 */

const AirplaneCanvas = dynamic(() => import("./airplane-canvas"), {
  ssr: false,
  loading: () => <ScenePlaceholder />,
});

function ScenePlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
      <span className="mic-scene-pulse h-2.5 w-2.5 rounded-full bg-[#4ECDC4]" />
    </div>
  );
}

export function AirplaneScene({ className }: { className?: string }) {
  const [mountRef, shouldMount] = useInViewOnce<HTMLDivElement>({ rootMargin: "900px" });
  const [activeRef, active] = useInView<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();

  // Un seul node observé par les deux hooks (montage différé + pause).
  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      (mountRef as { current: HTMLDivElement | null }).current = node;
      (activeRef as { current: HTMLDivElement | null }).current = node;
    },
    [mountRef, activeRef],
  );

  return (
    <div
      ref={setRef}
      role="img"
      aria-label="Avion de ligne 3D stylisé, fuselage mint et noir à liseré rouge, dérive tricolore — l'envol vers le poste international"
      className={cn("relative aspect-[4/3] w-full", className)}
    >
      {shouldMount ? (
        <AirplaneCanvas reduced={reduced} active={active} />
      ) : (
        <ScenePlaceholder />
      )}
    </div>
  );
}
