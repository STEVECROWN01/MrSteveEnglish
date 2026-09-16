"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Barre CTA sticky mobile (DA §15) : présente sur Accueil (hero), Offres
 * et Contact. Apparaît uniquement quand AUCUN CTA principal in-page
 * n'est visible à l'écran — ainsi un seul CTA reste visible à tout
 * moment (DA §18 DO). Depuis l'instruction propriétaire, les CTA mènent
 * au formulaire de contact (liens internes, plus de WhatsApp direct).
 *
 * PERF (instruction propriétaire : réactivité) : visibilité pilotée par
 * IntersectionObserver — plus AUCUN getBoundingClientRect par événement
 * de scroll (l'ancienne version thrashait le layout à chaque frame).
 * Rescan après un court délai (CTA montés tardivement, ex. accordéon
 * FAQ). Task 48 (vraies pages) : le composant est remonté à chaque
 * navigation — le rescan initial suffit.
 *
 * Task 48 : href peut être un CHEMIN de page ("/contact" — navigation
 * douce via <Link>) ou une ANCRE interne ("#contact" sur la page
 * Inscription, défilement natif vers le formulaire).
 */
export function StickyCTA({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let io: IntersectionObserver | null = null;
    let rescanTimer: ReturnType<typeof setTimeout> | null = null;
    const visible = new Set<HTMLElement>();

    const apply = () => setShown(visible.size === 0);

    const rescan = () => {
      io?.disconnect();
      visible.clear();

      const ctas = Array.from(
        document.querySelectorAll<HTMLElement>("[data-wa-cta]"),
      );

      // Aucun CTA principal in-page → la barre prend le relais,
      // pour qu'un seul CTA reste visible à tout instant (DA §18 DO).
      if (ctas.length === 0) {
        setShown(true);
        return;
      }

      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            const el = e.target as HTMLElement;
            if (e.isIntersecting) visible.add(el);
            else visible.delete(el);
          }
          apply();
        },
        { rootMargin: "0px 0px -8% 0px" },
      );
      for (const c of ctas) io.observe(c);

      // État initial correct sans attendre le premier callback IO
      // (une seule passe synchrone, à l'installation — jamais au scroll).
      for (const c of ctas) {
        const r = c.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) visible.add(c);
      }
      apply();
    };

    const raf = requestAnimationFrame(rescan);
    window.addEventListener("hashchange", rescan);
    // Les CTA peuvent apparaître après le rendu initial (accordéon,
    // confirmations) : une re-passe différrée les couvre aussi.
    rescanTimer = setTimeout(rescan, 1200);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("hashchange", rescan);
      if (rescanTimer) clearTimeout(rescanTimer);
      io?.disconnect();
    };
  }, []);

  // Liens internes (pages "/…" ou ancres "#…") : pas de nouvel onglet.
  const isPath = href.startsWith("/");
  const isAnchor = href.startsWith("#");

  return (
    <div
      className={cn(
        "sticky-cta on-dark fixed inset-x-0 bottom-0 z-40 md:hidden",
        shown && "is-shown",
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="border-t border-grey-line bg-white/95 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-[12px]">
        {isPath ? (
          <Link href={href} className="btn btn-primary t-btn w-full">
            {label}
          </Link>
        ) : (
          <a
            href={href}
            {...(isAnchor ? {} : { target: "_blank", rel: "noopener noreferrer" })}
            className="btn btn-primary t-btn w-full"
          >
            {label}
          </a>
        )}
      </div>
    </div>
  );
}
