"use client";

import { useEffect, useState } from "react";
import { useInViewOnce, usePrefersReducedMotion, MOTION } from "@/lib/motion";

/**
 * Comptage des chiffres clés (DA §13 animation 3, signature 3 §14).
 * 0 → valeur finale, 900ms, easing linéaire, une seule fois à l'entrée
 * dans le viewport. Reduced motion : valeur affichée directement.
 */
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
  const [counted, setCounted] = useState(0);

  const shouldCount = inView && !reduced;

  useEffect(() => {
    if (!shouldCount) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setCounted(Math.round(value * t)); // linéaire, pas d'easing décoratif
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [shouldCount, value, duration]);

  // Avant l'entrée : 0. Reduced motion : valeur finale directe.
  const display = reduced ? value : shouldCount ? counted : 0;

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
