"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect } from "react";
import { useInView, useInViewOnce, usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Scène 3D « avion de ligne stylisé » (page Résultats — à droite de
 * « Un parcours réel », instruction propriétaire Task 27).
 * Même discipline de chargement que la scène micro : import dynamique
 * ssr:false + montage à l'approche du viewport (rootMargin 900px pour
 * que le chunk three.js soit déjà résolu à l'arrivée) + frameloop coupé
 * dès que la scène sort de l'écran. prefers-reduced-motion : statique.
 * Task 33 (perf) : préchauffage du chunk AU PREMIER SIGNAL D'INTENTION
 * (scroll/clic/toucher/clavier), jamais au simple idle — un visiteur
 * sans interaction ne télécharge pas three.js.
 */

const loadAirplaneCanvas = () => import("./airplane-canvas");

const AirplaneCanvas = dynamic(loadAirplaneCanvas, {
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

  // Préchauffage du chunk three.js AU PREMIER SIGNAL D'INTENTION
  // (Task 33 — même logique que la scène micro) : scroll, toucher,
  // clic ou clavier. Data Saver actif → aucun préchauffage.
  useEffect(() => {
    const conn = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (conn?.saveData) return;
    let done = false;
    const warm = () => {
      if (done) return;
      done = true;
      remove();
      const w = window as Window & {
        requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      };
      if (typeof w.requestIdleCallback === "function") {
        w.requestIdleCallback(() => {
          void loadAirplaneCanvas();
        }, { timeout: 3000 });
      } else {
        window.setTimeout(() => {
          void loadAirplaneCanvas();
        }, 400);
      }
    };
    const events: (keyof WindowEventMap)[] = [
      "scroll",
      "pointerdown",
      "keydown",
      "touchstart",
    ];
    const opts: AddEventListenerOptions = { passive: true };
    const remove = () =>
      events.forEach((e) => window.removeEventListener(e, warm, opts));
    events.forEach((e) => window.addEventListener(e, warm, opts));
    return remove;
  }, []);

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
