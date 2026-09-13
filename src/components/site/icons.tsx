import { cn } from "@/lib/utils";

/**
 * Icônes de liste professionnelles (instruction propriétaire : remplacer
 * les coches/croix simplistes par de vraies icônes web pro — pastille
 * circulaire pleine + glyphe contrasté, style « check-circle » des
 * bibliothèques d'icônes web).
 * — IconCheck : pastille (currentColor) + coche contrastée.
 *     Fond clair  : <IconCheck className="text-black" />
 *     Fond sombre : <IconCheck className="text-white" fg="#000000" />
 * — IconCross : pastille ROUGE (#ff0000 — rouge CTA du site) + croix
 *     blanche. Usage sémantique d'exclusion (« pas pour toi »).
 */

export function IconCheck({
  className,
  fg = "#ffffff",
}: {
  className?: string;
  fg?: string;
}) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={cn("h-5 w-5 shrink-0", className)}
    >
      <circle cx="10" cy="10" r="9" fill="currentColor" />
      <path
        d="M6.3 10.4 L8.9 13 L13.8 7.4"
        stroke={fg}
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function IconCross({
  className,
  fg = "#ffffff",
}: {
  className?: string;
  fg?: string;
}) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={cn("h-5 w-5 shrink-0", className)}
    >
      <circle cx="10" cy="10" r="9" fill="#ff0000" />
      <path
        d="M7 7 L13 13 M13 7 L7 13"
        stroke={fg}
        strokeWidth="1.9"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
