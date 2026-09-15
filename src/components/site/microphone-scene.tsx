"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect } from "react";
import { useInView, useInViewOnce, usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Scène 3D « microphone tech » (section Comment se déroule le coaching).
 * Le Canvas (three.js, ~150 Ko gz) n'est JAMAIS dans le bundle initial :
 * import dynamique ssr:false + montage uniquement à l'approche du viewport
 * (rootMargin 500px). Depuis l'instruction propriétaire, la scène vit
 * directement sur le fond sombre de la section (radial commun posé sur le
 * <Section>) : plus de carte — ni angles arrondis, ni ombre, ni fond
 * propre — le micro flotte sur le fond studio étendu à toute la section.
 * prefers-reduced-motion : scène rendue en statique (une frame).
 *
 * PERF (instruction propriétaire Task 27 : « le micro 3D met du temps
 * à s'afficher — accélère ») : deux leviers combinés —
 *   1. PRÉCHAUFFAGE IDLE : dès que le navigateur respire (requestIdle-
 *      Callback, fallback timeout 2,5 s), le chunk three.js est mis en
 *      cache — le montage ultérieur est INSTANTANÉ (webpack sert le
 *      module déjà résolu, plus aucun téléchargement à l'approche).
 *   2. MONTAGE ANTICIPÉ : rootMargin 500px → 1200px — la scène se
 *      construit bien avant d'arriver à l'écran, le temps d'init WebGL
 *      est absorbé pendant le scroll (jamais vu par l'utilisateur).
 *
 * PERF (instruction propriétaire : réactivité) : le frameloop est COUPÉ
 * dès que la scène sort du viewport (useInView persistant) — le GPU ne
 * rend plus rien quand le micro n'est pas visible, puis reprend
 * automatiquement à son retour. Un seul node observé par deux hooks
 * (montage à 1200px d'approche, pause à la sortie réelle).
 */

const loadMicrophoneCanvas = () => import("./microphone-canvas");

const MicrophoneCanvas = dynamic(loadMicrophoneCanvas, {
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
  const [mountRef, shouldMount] = useInViewOnce<HTMLDivElement>({ rootMargin: "1200px" });
  const [activeRef, active] = useInView<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();

  // Préchauffage du chunk three.js AU PREMIER SIGNAL D'INTENTION
  // (Task 33 — perf) : scroll, toucher, clic ou clavier — plus jamais
  // au simple idle de la page. Un visiteur qui rebondit sans interagir
  // ne télécharge JAMAIS three.js (237 Ko gz de donnée mobile
  // économisés) ; dès la première interaction, le chunk se met en
  // cache pendant l'inactivité qui suit — prêt bien avant l'arrivée
  // à 1200px de la section (qu'on ne peut atteindre qu'en scrollant).
  // Data Saver actif → aucun préchauffage (respect du forfait).
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
          void loadMicrophoneCanvas();
        }, { timeout: 3000 });
      } else {
        window.setTimeout(() => {
          void loadMicrophoneCanvas();
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
      aria-label="Microphone studio 3D stylisé tech, accents néon rouges et arcs orbitaux animés — l'outil des séances de coaching en ligne"
      className={cn(
        "relative aspect-[4/5] w-full",
        className,
      )}
    >
      {shouldMount ? (
        <MicrophoneCanvas reduced={reduced} active={active} />
      ) : (
        <ScenePlaceholder />
      )}
    </div>
  );
}
