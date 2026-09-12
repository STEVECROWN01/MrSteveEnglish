"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/** Constantes motion — langage verrouillé DA §13. */
export const MOTION = {
  ease: [0.22, 1, 0.36, 1] as const,
  micro: 240, // ms — micro-interactions
  reveal: 600, // ms — révélations de section
  heroStagger: 80, // ms — stagger entre lignes du H1 (60ms mobile)
  heroStaggerMobile: 60,
  heroDelay: 150, // ms — délai avant démarrage
  count: 900, // ms — comptage des chiffres clés (linéaire)
  accordion: 280, // ms — ouverture accordéon FAQ
  toggle: 350, // ms — bascule Avant → Après
  cardHover: 200, // ms — hover cards
} as const;

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/** Respect de prefers-reduced-motion (DA §16) pour toute animation JS. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

/**
 * Détection d'entrée dans le viewport — une seule fois (DA §13 :
 * révélations déclenchées une fois à l'entrée dans le viewport).
 */
export function useInViewOnce<T extends HTMLElement>(
  options?: IntersectionObserverInit,
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      const raf = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(raf);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px", ...options },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, inView];
}

/**
 * Visibilité PERSISTANTE (entrée ET sortie du viewport) — perf :
 * pilotage du frameloop 3D (rendu coupé dès que la scène quitte
 * l'écran, repris à son retour). Zéro coût au scroll (IntersectionObserver,
 * jamais de getBoundingClientRect par événement).
 */
export function useInView<T extends HTMLElement>(
  options?: IntersectionObserverInit,
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => setInView(entries.some((e) => e.isIntersecting)),
      { threshold: 0.05, ...options },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, inView];
}

/** Position de scroll (pour la navigation translucide au scroll, DA §7). */
export function useScrolled(threshold = 8): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [threshold]);

  return scrolled;
}
