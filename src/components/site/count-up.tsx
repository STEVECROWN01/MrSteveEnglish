"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useInViewOnce, usePrefersReducedMotion, MOTION } from "@/lib/motion";

/**
 * Comptage des chiffres clés (DA §13 animation 3, signature 3 §14).
 * 0 → valeur finale, 900ms, easing linéaire, une seule fois à l'entrée
 * dans le viewport. Reduced motion : valeur affichée directement.
 *
 * TASK 60 (retour propriétaire — les IA/crawlers et les lecteurs d'écran
 * lisaient « 0 » à tous les chiffres clés : « 0 % » au lieu de « 98 % ») :
 * le HTML statique (rendu serveur, crawlers, visites sans JavaScript)
 * contient désormais la VALEUR FINALE — jamais 0. L'animation de comptage
 * reste une AMÉLIORATION PROGRESSIVE : au moment où l'élément entre dans
 * le viewport, le compteur repart de 0 et remonte jusqu'à `value`. Le
 * reset s'effectue dans un layout effect (avant le repaint) : la valeur
 * finale ne clignote jamais avant l'animation.
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
  const [ref, inView] = useInViewOnce<HTMLSpanElement>({ threshold: 0.4 });
  const reduced = usePrefersReducedMotion();
  /* TASK 60 : état initial = VALEUR FINALE (identique au HTML serveur —
     aucun écart d'hydratation ; crawleurs/IA lisent le chiffre réel). */
  const [counted, setCounted] = useState(value);
  const [started, setStarted] = useState(false);

  /* Entrée dans le viewport : reset à 0 AVANT le repaint (layout effect),
     puis l'animation démarre à la frame suivante — l'utilisateur ne voit
     que le comptage 0 → value, jamais un flash de la valeur finale. */
  useIsomorphicLayoutEffect(() => {
    if (!inView || reduced || started) return;
    setStarted(true);
    setCounted(0);
  }, [inView, reduced, started]);

  useEffect(() => {
    if (!started || reduced) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setCounted(Math.round(value * t)); // linéaire, pas d'easing décoratif
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, reduced, value, duration]);

  // Reduced motion : valeur finale directe. Sinon : état du compteur
  // (valeur finale avant l'entrée en viewport — SSR, hydratation, puis
  // comptage une fois visible).
  const display = reduced ? value : counted;

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
