"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Barre CTA sticky mobile (DA §15) : présente sur Accueil (hero), Offres
 * et Contact. Apparaît uniquement quand AUCUN CTA principal in-page
 * n'est visible à l'écran — ainsi un seul CTA reste visible à tout
 * moment (DA §18 DO). Depuis l'instruction propriétaire, les CTA mènent
 * au formulaire de contact (liens internes, plus de WhatsApp direct).
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
    const ctas = Array.from(
      document.querySelectorAll<HTMLElement>("[data-wa-cta]"),
    );

    // Aucun CTA principal in-page visible → la barre prend le relais,
    // pour qu'un seul CTA reste visible à tout instant (DA §18 DO).
    const check = () => {
      if (ctas.length === 0) {
        setShown(true);
        return;
      }
      const anyVisible = ctas.some((c) => {
        const r = c.getBoundingClientRect();
        return r.top < window.innerHeight && r.bottom > 0;
      });
      setShown(!anyVisible);
    };

    const raf = requestAnimationFrame(check);
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  // Liens internes (formulaires, ancres) : pas de nouvel onglet.
  const isInternal = href.startsWith("#");

  return (
    <div
      className={cn(
        "sticky-cta on-dark fixed inset-x-0 bottom-0 z-40 md:hidden",
        shown && "is-shown",
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="border-t border-grey-line bg-white/95 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-[12px]">
        <a
          href={href}
          {...(isInternal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
          className="btn btn-primary t-btn w-full"
        >
          {label}
        </a>
      </div>
    </div>
  );
}
