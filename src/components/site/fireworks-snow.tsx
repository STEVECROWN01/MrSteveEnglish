"use client";

import { useEffect, useRef } from "react";

/**
 * FEUX D'ARTICE TOMBEURS « COMME NEIGE » (Task 34 — instruction
 * propriétaire : illustrer le succès de la confirmation
 * d'inscription sur la page post-paiement).
 *
 * Canvas fixe plein viewport, pointer-events-none (aucune interaction
 * bloquée). Au chargement : 4 gerbes de feu d'artifice éclatent dans
 * le tiers haut de l'écran (étincelles radiales qui retombent), puis
 * un tombé continu de particules scintillantes rouge / or / blanc
 * (palette du site) pendant ~14 s — comme une neige de fête. Ensuite
 * plus aucune particule n'apparaît ; les dernières s'éteignent et
 * l'animation s'arrête proprement (boucle rAF libérée).
 *
 * Perf & accessibilité :
 * — prefers-reduced-motion : composant inactif (aucune particule) ;
 * — onglet caché : boucle suspendue (visibilitychange) ;
 * — plafond de ~220 particules, halo double-cercle (pas de
 *   shadowBlur, coûteux), devicePixelRatio plafonné à 2 ;
 * — canvas détruit au démontage (zéro fuite).
 */

const PALETTE = ["255,26,26", "255,199,44", "255,255,255", "255,120,90"];

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  /** durée de vie restante en s */
  life: number;
  maxLife: number;
  /** phase de scintillement */
  twinkle: number;
  /** balancement horizontal */
  sway: number;
  swaySpeed: number;
};

const MAX_PARTICLES = 220;
const FALL_DURATION_MS = 14_000;

export function FireworksSnow() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let visible = true;
    const particles: Particle[] = [];
    const startAt = performance.now();
    let last = startAt;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    /** Une particule générique (tombe comme un flocon scintillant). */
    const spawnSnowflake = (fromTop: boolean) => ({
      x: rand(0, window.innerWidth),
      y: fromTop ? rand(-40, -4) : rand(0, window.innerHeight * 0.6),
      vx: rand(-0.18, 0.18),
      vy: rand(0.35, 0.95),
      size: rand(1, 2.6),
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      life: rand(6, 11),
      maxLife: 11,
      twinkle: rand(0, Math.PI * 2),
      sway: rand(0.4, 1.4),
      swaySpeed: rand(0.6, 1.6),
    });

    /** Une gerbe de feu d'artifice : étincelles radiales qui retombent. */
    const burst = (cx: number, cy: number, count: number) => {
      for (let i = 0; i < count; i++) {
        if (particles.length >= MAX_PARTICLES) return;
        const angle = (Math.PI * 2 * i) / count + rand(-0.12, 0.12);
        const speed = rand(1.1, 3.4);
        const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.3,
          size: rand(1.1, 2.4),
          color,
          life: rand(2.4, 4.2),
          maxLife: 4.2,
          twinkle: rand(0, Math.PI * 2),
          sway: 0,
          swaySpeed: 0,
        });
      }
    };

    /* — Ouverture : 4 gerbes échelonnées dans le tiers haut — */
    const bursts: { t: number; cx: number; cy: number }[] = [
      { t: 150, cx: window.innerWidth * 0.22, cy: window.innerHeight * 0.16 },
      { t: 420, cx: window.innerWidth * 0.78, cy: window.innerHeight * 0.12 },
      { t: 720, cx: window.innerWidth * 0.5, cy: window.innerHeight * 0.2 },
      { t: 1050, cx: window.innerWidth * 0.62, cy: window.innerHeight * 0.08 },
    ];
    // + une pluie initiale déjà en route (l'effet « neige » immédiat)
    for (let i = 0; i < 46; i++) {
      if (particles.length < MAX_PARTICLES) {
        particles.push(spawnSnowflake(false));
      }
    }

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
      if (visible && running) {
        last = performance.now();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    let spawnAcc = 0;

    const frame = (now: number) => {
      if (!running) return;
      raf = visible ? requestAnimationFrame(frame) : 0;
      if (!visible) return;

      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const elapsed = now - startAt;

      /* Gerbes d'ouverture */
      for (let i = bursts.length - 1; i >= 0; i--) {
        if (elapsed >= bursts[i].t) {
          burst(bursts[i].cx, bursts[i].cy, 34);
          bursts.splice(i, 1);
        }
      }

      /* Neige continue pendant FALL_DURATION_MS puis arrêt des naissances */
      if (elapsed < FALL_DURATION_MS) {
        spawnAcc += dt * 26; // ~26 particules/s
        while (spawnAcc >= 1 && particles.length < MAX_PARTICLES) {
          particles.push(spawnSnowflake(true));
          spawnAcc -= 1;
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= dt;
        if (p.life <= 0 || p.y > window.innerHeight + 30) {
          particles.splice(i, 1);
          continue;
        }
        /* physique : gravité douce + frottement pour les gerbes,
           balancement sinusoïdal pour les flocons */
        p.vy += 0.55 * dt;
        p.vx *= 1 - 0.5 * dt;
        p.vy *= 1 - 0.12 * dt;
        p.twinkle += dt * 5;
        const swayV = p.sway ? Math.sin(p.twinkle * p.swaySpeed * 0.35) * p.sway : 0;
        p.x += (p.vx + swayV) * dt * 60;
        p.y += p.vy * dt * 60;

        const lifeRatio = Math.max(0, Math.min(1, p.life / p.maxLife));
        const alpha = lifeRatio * (0.55 + 0.45 * Math.abs(Math.sin(p.twinkle)));
        const s = p.size * dpr;

        /* halo doux (double cercle — pas de shadowBlur) + cœur */
        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.color},${(alpha * 0.22).toFixed(3)})`;
        ctx.arc(p.x * dpr, p.y * dpr, s * 2.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.color},${alpha.toFixed(3)})`;
        ctx.arc(p.x * dpr, p.y * dpr, s, 0, Math.PI * 2);
        ctx.fill();
      }

      /* Fin propre : plus de particules → on libère la boucle */
      if (particles.length === 0 && elapsed >= FALL_DURATION_MS) {
        running = false;
        return;
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40"
    />
  );
}
