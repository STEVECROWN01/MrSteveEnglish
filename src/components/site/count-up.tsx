"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useInView, usePrefersReducedMotion, MOTION } from "@/lib/motion";

/**
 * Comptage des chiffres clés (DA §13 animation 3, signature 3 §14).
 * 0 → valeur finale, 900ms, easing linéaire.
 * Reduced motion : valeur affichée directement.
 *
 * TASK 60 (retour propriétaire — les IA/crawlers et les lecteurs d'écran
 * lisaient « 0 » à tous les chiffres clés : « 0 % » au lieu de « 98 % ») :
 * le HTML statique (rendu serveur, crawlers, visites sans JavaScript)
 * contient désormais la VALEUR FINALE — jamais 0. L'animation de comptage
 * reste une AMÉLIORATION PROGRESSIVE.
 *
 * TASK 79 (instruction propriétaire : « fais pareil aux sections des
 * pages du programme — tout doit être dynamique ») : l'observateur est
 * PERSISTANT — le comptage se REJOUE à CHAQUE entrée dans le viewport
 * (0 → valeur), en descendant comme en remontant, et la VALEUR FINALE est
 * restaurée à la sortie (l'état statique reste toujours cohérent avec le
 * HTML serveur : un chiffre quitté à mi-comptage se fige sur sa valeur
 * finale, jamais sur un intermédiaire).
 */

/* useLayoutEffect n'existe pas côté serveur (warning React en SSR) —
   repli sur useEffect pendant le prérendu. */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function CountUp({
  value,
  duration = MOTION.count,
  className,
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const [ref, inView] = useInView<HTMLSpanElement>({ threshold: 0.4 });
  const reduced = usePrefersReducedMotion();
  /* TASK 60 : état initial = VALEUR FINALE (identique au HTML serveur —
     aucun écart d'hydratation ; crawleurs/IA lisent le chiffre réel). */
  const [counted, setCounted] = useState(value);

  /* TASK 79 — transitions d'état AVANT le repaint (layout effect) :
     — (ré-)entrée dans le viewport : reset à 0 (l'utilisateur ne voit
       que le comptage 0 → value, jamais un flash de la valeur finale) ;
     — sortie du viewport : retour immédiat à la valeur finale (état
       statique = HTML serveur, y compris si le comptage a été coupé
       en cours de route par la sortie de l'écran). */
  useIsomorphicLayoutEffect(() => {
    if (reduced) return;
    setCounted(inView ? 0 : value);
  }, [inView, reduced, value]);

  /* Comptage 0 → value à CHAQUE entrée dans le viewport (TASK 79 —
     rejouable). Annulé si l'élément ressort de l'écran en cours de
     comptage (le layout effect ci-dessus a déjà restauré la valeur
     finale). */
  useEffect(() => {
    if (!inView || reduced) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setCounted(Math.round(value * t)); // linéaire, pas d'easing décoratif
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, value, duration]);

  // Reduced motion : valeur finale directe. Sinon : état du compteur
  // (valeur finale avant l'entrée en viewport — SSR, hydratation, puis
  // comptage à chaque passage dans le viewport).
  const display = reduced ? value : counted;

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
